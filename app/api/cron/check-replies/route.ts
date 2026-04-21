import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/agent/supabase'
import imaps from 'imap-simple'

function verifyCron(req: Request) {
  const auth = req.headers.get('authorization')
  return auth === `Bearer ${process.env.CRON_SECRET}`
}

interface GmailConfig {
  user: string
  password: string
}

function getGmailAccounts(): GmailConfig[] {
  const accounts: GmailConfig[] = []
  if (process.env.GMAIL_A_USER) accounts.push({ user: process.env.GMAIL_A_USER, password: process.env.GMAIL_A_APP_PASSWORD! })
  if (process.env.GMAIL_B_USER) accounts.push({ user: process.env.GMAIL_B_USER, password: process.env.GMAIL_B_APP_PASSWORD! })
  return accounts
}

function formatImapDate(date: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const day = String(date.getDate()).padStart(2, '0')
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}

function extractEmailAddress(fromHeader: string): string | null {
  const match = fromHeader.match(/<([^>]+)>/)
  if (match?.[1]) return match[1].trim().toLowerCase()

  const plainEmail = fromHeader.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)
  return plainEmail?.[0]?.toLowerCase() ?? null
}

async function checkRepliesForAccount(account: GmailConfig): Promise<string[]> {
  const db = getServiceClient()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  // Get all active leads we've emailed from this account
  const { data: sentEmails } = await db
    .from('outreach_emails')
    .select('outreach_leads(id, email, first_name)')
    .eq('status', 'sent')
    .eq('gmail_account', account.user)
    .gte('sent_at', thirtyDaysAgo.toISOString())

  if (!sentEmails?.length) return []

  // Build list of lead emails we've contacted
  const leadEmails = new Set(
    sentEmails
      .map((r) => (r.outreach_leads as { email: string } | null)?.email)
      .filter(Boolean)
      .map((email) => email!.toLowerCase())
  )

  let connection: imaps.ImapSimple | null = null

  try {
    connection = await imaps.connect({
      imap: {
        user: account.user,
        password: account.password,
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        authTimeout: 15000,
      },
    })

    await connection.openBox('INBOX')

    const messages = await connection.search(
      [['SINCE', formatImapDate(thirtyDaysAgo)]],
      {
        bodies: ['HEADER.FIELDS (FROM)'],
        markSeen: false,
      }
    )

    const replied = new Set<string>()

    for (const message of messages) {
      const headerPart = message.parts.find((part) =>
        part.which?.toUpperCase().includes('HEADER.FIELDS (FROM)')
      )
      if (!headerPart || !headerPart.body) continue

      const body = headerPart.body as { from?: string[] | string }
      const fromRaw = Array.isArray(body.from) ? body.from[0] : body.from
      if (!fromRaw) continue

      const fromEmail = extractEmailAddress(fromRaw)
      if (!fromEmail) continue

      if (leadEmails.has(fromEmail)) replied.add(fromEmail)
    }

    console.log(
      `[check-replies] Account ${account.user}: checked ${messages.length} inbound messages, found ${replied.size} replies`
    )
    return Array.from(replied)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

export async function GET(req: Request) {
  if (!verifyCron(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getServiceClient()

  const { data: run } = await db
    .from('agent_runs')
    .insert({ run_type: 'check-replies', status: 'running' })
    .select()
    .single()

  const runId = run?.id
  let repliesFound = 0

  try {
    const accounts = getGmailAccounts()

    for (const account of accounts) {
      const repliedEmails = await checkRepliesForAccount(account)

      for (const email of repliedEmails) {
        const { data: lead } = await db
          .from('outreach_leads')
          .select('id, status')
          .eq('email', email)
          .single()

        if (lead && lead.status !== 'replied') {
          // Mark lead as replied
          await db
            .from('outreach_leads')
            .update({ status: 'replied', replied_at: new Date().toISOString() })
            .eq('id', lead.id)

          // Cancel all future scheduled emails for this lead
          await db
            .from('outreach_emails')
            .update({ status: 'cancelled' })
            .eq('lead_id', lead.id)
            .eq('status', 'scheduled')

          repliesFound++
        }
      }
    }

    // Also mark as replied any leads that emailed us back (manual fallback)
    // Check outreach_leads where status='active' and replied_at is set
    await db
      .from('agent_runs')
      .update({ status: 'success', replies_found: repliesFound, finished_at: new Date().toISOString() })
      .eq('id', runId)

    return NextResponse.json({ ok: true, repliesFound })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    await db
      .from('agent_runs')
      .update({ status: 'error', error: message, finished_at: new Date().toISOString() })
      .eq('id', runId)

    console.error('[check-replies]', message)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}

// Webhook endpoint to manually mark a lead as replied (call this from Gmail filter → Zapier/n8n)
export async function POST(req: Request) {
  const body = await req.json()
  const { email, secret } = body

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

  const db = getServiceClient()

  const { data: lead } = await db
    .from('outreach_leads')
    .select('id')
    .eq('email', email)
    .single()

  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })

  await db
    .from('outreach_leads')
    .update({ status: 'replied', replied_at: new Date().toISOString() })
    .eq('id', lead.id)

  await db
    .from('outreach_emails')
    .update({ status: 'cancelled' })
    .eq('lead_id', lead.id)
    .eq('status', 'scheduled')

  return NextResponse.json({ ok: true })
}
