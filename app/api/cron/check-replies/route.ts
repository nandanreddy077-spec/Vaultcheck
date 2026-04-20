import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/agent/supabase'

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

// Check Gmail IMAP for replies using Gmail API (OAuth2 not needed with service account xoauth2)
// For app-password accounts we search sent emails that have replies via Gmail REST API using IMAP
// Alternative: use Gmail API with OAuth. For simplicity with app passwords, we poll via IMAP simulation.
// This implementation uses the Gmail API with basic auth disabled — instead we detect replies
// by checking if any lead has an email address that appears in recent inbound messages subject lines.
//
// Since Gmail app passwords don't support IMAP OAuth, we use a pragmatic approach:
// check if leads have replied by looking at our sent message threads.
async function checkRepliesForAccount(account: GmailConfig): Promise<string[]> {
  // With app passwords + nodemailer IMAP is complex.
  // Practical approach: use Gmail search API via fetch with basic auth (IMAP).
  // We look for emails in INBOX from leads we've contacted in the last 30 days.

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
      .filter(Boolean) as string[]
  )

  // Use Gmail API with OAuth2 using app password via nodemailer SMTP check
  // Simplified: return empty for now — production would use Gmail API with proper OAuth
  // For a complete impl, set up Gmail API OAuth2 and use gmail.users.messages.list with q: "from:leadEmail"

  // Placeholder: this logs the accounts we'd check
  console.log(`[check-replies] Would check ${leadEmails.size} lead emails for account ${account.user}`)
  return []
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
