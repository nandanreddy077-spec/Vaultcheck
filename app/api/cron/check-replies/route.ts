import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/agent/supabase'
import { analyzeReply } from '@/lib/agent/reply-handler'
import { sendAutoResponse } from '@/lib/agent/auto-responder'
import { getAccounts } from '@/lib/agent/email-sender'
import imaps from 'imap-simple'

function verifyCron(req: Request) {
  const auth = req.headers.get('authorization')
  return auth === `Bearer ${process.env.CRON_SECRET}`
}

interface GmailConfig {
  user: string
  password: string
  label: 'A' | 'B'
}

function getGmailAccounts(): GmailConfig[] {
  return getAccounts() as GmailConfig[]
}

function formatImapDate(date: Date): string {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${String(date.getDate()).padStart(2,'0')}-${months[date.getMonth()]}-${date.getFullYear()}`
}

function extractEmailAddress(fromHeader: string): string | null {
  const match = fromHeader.match(/<([^>]+)>/)
  if (match?.[1]) return match[1].trim().toLowerCase()
  const plain = fromHeader.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)
  return plain?.[0]?.toLowerCase() ?? null
}

interface InboundMessage {
  fromEmail: string
  subject: string
  body: string
  messageId: string
}

async function fetchInboundReplies(account: GmailConfig, leadEmails: Set<string>): Promise<InboundMessage[]> {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  let connection: imaps.ImapSimple | null = null
  const results: InboundMessage[] = []

  try {
    connection = await imaps.connect({
      imap: { user: account.user, password: account.password, host: 'imap.gmail.com', port: 993, tls: true, authTimeout: 15000 },
    })
    await connection.openBox('INBOX')

    const messages = await connection.search(
      [['SINCE', formatImapDate(thirtyDaysAgo)]],
      { bodies: ['HEADER.FIELDS (FROM SUBJECT MESSAGE-ID)', 'TEXT'], markSeen: false }
    )

    for (const message of messages) {
      const headerPart = message.parts.find(p => p.which?.toUpperCase().includes('HEADER'))
      const bodyPart = message.parts.find(p => p.which === 'TEXT')
      if (!headerPart?.body) continue

      const headers = headerPart.body as Record<string, string[] | string>
      const fromRaw = Array.isArray(headers.from) ? headers.from[0] : headers.from
      if (!fromRaw) continue

      const fromEmail = extractEmailAddress(fromRaw)
      if (!fromEmail || !leadEmails.has(fromEmail)) continue

      const subject = Array.isArray(headers.subject) ? headers.subject[0] : headers.subject ?? ''
      const messageId = Array.isArray(headers['message-id']) ? headers['message-id'][0] : headers['message-id'] ?? ''
      const bodyText = typeof bodyPart?.body === 'string' ? bodyPart.body.slice(0, 2000) : ''

      results.push({ fromEmail, subject, body: bodyText, messageId })
    }
  } finally {
    if (connection) await connection.end()
  }

  return results
}

export async function GET(req: Request) {
  if (!verifyCron(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = getServiceClient() as ReturnType<typeof getServiceClient>
  const { data: run } = await db.from('agent_runs').insert({ run_type: 'check-replies', status: 'running' }).select().single()
  const runId = run?.id
  let repliesFound = 0

  try {
    const accounts = getGmailAccounts()

    for (const account of accounts) {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      // Get leads we've emailed from this account
      const { data: sentEmails } = await db
        .from('outreach_emails')
        .select('outreach_leads(id, email, first_name, last_name, company_name, city, state, sequence_step, status, funnel_stage)')
        .eq('status', 'sent')
        .eq('gmail_account', account.user)
        .gte('sent_at', thirtyDaysAgo.toISOString())

      const leadMap = new Map<string, { id: string; first_name: string; last_name: string; company_name: string; city: string; state: string; sequence_step: number; status: string; funnel_stage: string }>()
      for (const row of sentEmails ?? []) {
        const l = row.outreach_leads as { id: string; email: string; first_name: string; last_name: string; company_name: string; city: string; state: string; sequence_step: number; status: string; funnel_stage: string } | null
        if (l?.email) leadMap.set(l.email.toLowerCase(), l)
      }

      if (leadMap.size === 0) continue

      const inbound = await fetchInboundReplies(account, new Set(leadMap.keys()))

      for (const msg of inbound) {
        const lead = leadMap.get(msg.fromEmail)
        if (!lead || lead.status === 'replied' || lead.funnel_stage === 'lost') continue

        // Check if already processed this message
        const { data: existing } = await db
          .from('outreach_conversations')
          .select('id')
          .eq('lead_id', lead.id)
          .eq('gmail_message_id', msg.messageId)
          .single()
        if (existing) continue

        // Analyze the reply with Claude
        const analysis = await analyzeReply(msg.body, {
          first_name: lead.first_name,
          company_name: lead.company_name,
          sequence_step: lead.sequence_step,
        })

        // Save inbound conversation
        const { data: conv } = await db.from('outreach_conversations').insert({
          lead_id: lead.id,
          direction: 'inbound',
          subject: msg.subject,
          body: msg.body,
          intent: analysis.intent,
          intent_confidence: analysis.confidence,
          gmail_message_id: msg.messageId,
          gmail_account: account.user,
          auto_replied: false,
        }).select().single()

        // Stop the sequence regardless of intent
        await db.from('outreach_emails').update({ status: 'cancelled' }).eq('lead_id', lead.id).eq('status', 'scheduled')
        await db.from('outreach_leads').update({ status: 'replied', replied_at: new Date().toISOString() }).eq('id', lead.id)

        // Act on intent
        if (analysis.suggested_action === 'mark_lost') {
          await db.from('outreach_leads').update({ funnel_stage: 'lost', lost_reason: analysis.summary }).eq('id', lead.id)

        } else if (analysis.suggested_action === 'reschedule') {
          // OOO — do nothing, sequence already stopped, human follows up
          await db.from('outreach_leads').update({ funnel_stage: 'cold', notes: 'OOO — reschedule' }).eq('id', lead.id)

        } else if (['auto_reply', 'send_calendly'].includes(analysis.suggested_action) && conv?.id) {
          // AI auto-responds
          await sendAutoResponse({
            leadId: lead.id,
            toEmail: msg.fromEmail,
            toFirstName: lead.first_name,
            subject: msg.subject,
            replyBody: msg.body,
            analysis,
            lead: { first_name: lead.first_name, company_name: lead.company_name, city: lead.city, state: lead.state },
            gmailAccount: account,
            conversationId: conv.id,
          })
          await db.from('outreach_leads').update({ funnel_stage: 'engaged' }).eq('id', lead.id)

        } else {
          // notify_human — flag for manual review
          await db.from('outreach_leads').update({ funnel_stage: 'replied', notes: `Needs human review: ${analysis.summary}` }).eq('id', lead.id)
        }

        repliesFound++
        console.log(`[check-replies] ${msg.fromEmail} → ${analysis.intent} → ${analysis.suggested_action}`)
      }
    }

    await db.from('agent_runs').update({ status: 'success', replies_found: repliesFound, finished_at: new Date().toISOString() }).eq('id', runId)
    return NextResponse.json({ ok: true, repliesFound })

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    await db.from('agent_runs').update({ status: 'error', error: message, finished_at: new Date().toISOString() }).eq('id', runId)
    console.error('[check-replies]', message)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}

// Manual webhook — mark lead replied (from Zapier/n8n Gmail filter)
export async function POST(req: Request) {
  const body = await req.json()
  if (body.secret !== process.env.CRON_SECRET) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!body.email) return NextResponse.json({ error: 'email required' }, { status: 400 })

  const db = getServiceClient()
  const { data: lead } = await db.from('outreach_leads').select('id').eq('email', body.email).single()
  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })

  await db.from('outreach_leads').update({ status: 'replied', replied_at: new Date().toISOString(), funnel_stage: 'replied' }).eq('id', lead.id)
  await db.from('outreach_emails').update({ status: 'cancelled' }).eq('lead_id', lead.id).eq('status', 'scheduled')

  return NextResponse.json({ ok: true })
}
