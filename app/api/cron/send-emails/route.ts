import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/agent/supabase'
import {
  getSendCounts,
  pickAvailableAccount,
  sendEmail,
  isUnsubscribed,
  delay,
} from '@/lib/agent/email-sender'

function verifyCron(req: Request) {
  const auth = req.headers.get('authorization')
  return auth === `Bearer ${process.env.CRON_SECRET}`
}

export async function GET(req: Request) {
  if (!verifyCron(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db: any = getServiceClient()

  const { data: run } = await db
    .from('agent_runs')
    .insert({ run_type: 'send-emails', status: 'running' })
    .select()
    .single()

  const runId = run?.id
  let emailsSent = 0

  try {
    // Get today's send counts per account
    const counts = await getSendCounts()

    // Fetch emails due to send (scheduled_at <= now, status = scheduled)
    const { data: dueEmails } = await db
      .from('outreach_emails')
      .select(`
        *,
        outreach_leads (
          id, email, first_name, last_name, status, replied_at
        )
      `)
      .eq('status', 'scheduled')
      .lte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(70) // Max total per run

    for (const emailRow of dueEmails ?? []) {
      const lead = emailRow.outreach_leads as {
        id: string
        email: string
        first_name: string
        last_name: string
        status: string
        replied_at: string | null
      }

      // Skip if lead replied or unsubscribed
      if (lead.status === 'replied' || lead.status === 'unsubscribed') {
        await db.from('outreach_emails').update({ status: 'cancelled' }).eq('id', emailRow.id)
        continue
      }

      if (await isUnsubscribed(lead.email)) {
        await db.from('outreach_emails').update({ status: 'cancelled' }).eq('id', emailRow.id)
        await db.from('outreach_leads').update({ status: 'unsubscribed' }).eq('id', lead.id)
        continue
      }

      // Pick available sender account
      const account = await pickAvailableAccount(counts)
      if (!account) {
        console.log('[send-emails] Daily limit reached for all accounts, stopping')
        break
      }

      // Send
      const result = await sendEmail({
        to: lead.email,
        subject: emailRow.subject,
        body: emailRow.body,
        account,
      })

      if (result.success) {
        await db.from('outreach_emails').update({
          status: 'sent',
          sent_at: new Date().toISOString(),
          gmail_account: account.user,
          gmail_message_id: result.messageId,
        }).eq('id', emailRow.id)

        await db.from('outreach_leads').update({
          last_emailed_at: new Date().toISOString(),
          sequence_step: emailRow.step,
        }).eq('id', lead.id)

        counts[account.user] = (counts[account.user] ?? 0) + 1
        emailsSent++
      } else {
        await db.from('outreach_emails').update({
          status: 'failed',
          error: result.error,
        }).eq('id', emailRow.id)
      }

      // Rate limit: 2s between sends
      await delay(2000)
    }

    await db
      .from('agent_runs')
      .update({ status: 'success', emails_sent: emailsSent, finished_at: new Date().toISOString() })
      .eq('id', runId)

    return NextResponse.json({ ok: true, emailsSent })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    await db
      .from('agent_runs')
      .update({ status: 'error', error: message, finished_at: new Date().toISOString() })
      .eq('id', runId)

    console.error('[send-emails]', message)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
