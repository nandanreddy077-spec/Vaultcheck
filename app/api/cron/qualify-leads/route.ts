import { NextResponse } from 'next/server'
import { detectPainSignals } from '@/lib/agent/pain-detector'
import { generateEmail, SEQUENCE_DELAYS_DAYS } from '@/lib/agent/email-generator'
import { getServiceClient } from '@/lib/agent/supabase'
import { verifyCronAuthorization } from '@/lib/cron-auth'
import { addDays } from 'date-fns'

// qualify-leads: picks up 'new' leads saved by source-leads, scores them via Claude,
// generates email sequences, and marks them active. Runs 1 hour after source-leads.
// Kept separate so each job stays well within Vercel's 300s maxDuration.
export const maxDuration = 300

const DAILY_LIMIT = parseInt(process.env.DAILY_LEAD_LIMIT ?? '10')

export async function GET(req: Request) {
  const cronAuth = verifyCronAuthorization(req)
  if (cronAuth !== 'ok') {
    const status = cronAuth === 'misconfigured' ? 503 : 401
    const error = cronAuth === 'misconfigured' ? 'Server misconfigured' : 'Unauthorized'
    return NextResponse.json({ error }, { status })
  }

  const db: any = getServiceClient()

  const { data: run } = await db
    .from('agent_runs')
    .insert({ run_type: 'qualify-leads', status: 'running' })
    .select()
    .single()

  const runId = run?.id

  try {
    // Pick up leads saved by source-leads that haven't been qualified yet
    const { data: newLeads } = await db
      .from('outreach_leads')
      .select('*')
      .eq('status', 'new')
      .order('created_at', { ascending: true })
      .limit(DAILY_LIMIT)

    let qualified = 0
    let disqualified = 0

    for (const lead of newLeads ?? []) {
      // Pain detection via Claude
      const painSignals = await detectPainSignals({
        first_name: lead.first_name,
        title: lead.title,
        company_name: lead.company_name,
        company_domain: lead.company_domain ?? '',
        industry: lead.industry ?? '',
        city: lead.city ?? '',
        state: lead.state ?? '',
      })

      // Disqualify low-fit leads
      if (painSignals.score < 50) {
        await db
          .from('outreach_leads')
          .update({ pain_signals: painSignals, pain_score: painSignals.score, status: 'finished' })
          .eq('id', lead.id)
        disqualified++
        continue
      }

      // Generate step-1 email (sends today at 10am EDT)
      const email = await generateEmail(
        {
          first_name: lead.first_name,
          title: lead.title,
          company_name: lead.company_name,
          city: lead.city ?? '',
          state: lead.state ?? '',
        },
        1,
        painSignals
      )

      const sendAt = addDays(new Date(), SEQUENCE_DELAYS_DAYS[1])
      sendAt.setUTCHours(14, 0, 0, 0) // 10am EDT (UTC-4)

      await db.from('outreach_emails').insert({
        lead_id: lead.id,
        step: 1,
        subject: email.subject,
        body: email.body,
        psychology_angle: email.psychology_angle,
        status: 'scheduled',
        scheduled_at: sendAt.toISOString(),
      })

      // Pre-generate steps 2–4 (day 4, 9, 16)
      for (const step of [2, 3, 4]) {
        const stepEmail = await generateEmail(
          {
            first_name: lead.first_name,
            title: lead.title,
            company_name: lead.company_name,
            city: lead.city ?? '',
            state: lead.state ?? '',
          },
          step,
          painSignals
        )
        const stepDate = addDays(new Date(), SEQUENCE_DELAYS_DAYS[step])
        stepDate.setUTCHours(14, 0, 0, 0)

        await db.from('outreach_emails').insert({
          lead_id: lead.id,
          step,
          subject: stepEmail.subject,
          body: stepEmail.body,
          psychology_angle: stepEmail.psychology_angle,
          status: 'scheduled',
          scheduled_at: stepDate.toISOString(),
        })
      }

      // Mark lead active
      await db
        .from('outreach_leads')
        .update({
          pain_signals: painSignals,
          pain_score: painSignals.score,
          status: 'active',
          next_email_at: sendAt.toISOString(),
        })
        .eq('id', lead.id)

      qualified++
      console.log(`[qualify-leads] ${lead.first_name} @ ${lead.company_name} — score ${painSignals.score} → active`)
    }

    await db
      .from('agent_runs')
      .update({
        status: 'success',
        leads_qualified: qualified,
        details: { qualified, disqualified, total: (newLeads ?? []).length },
        finished_at: new Date().toISOString(),
      })
      .eq('id', runId)

    return NextResponse.json({ ok: true, qualified, disqualified, total: (newLeads ?? []).length })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    await db
      .from('agent_runs')
      .update({ status: 'error', error: message, finished_at: new Date().toISOString() })
      .eq('id', runId)
    console.error('[qualify-leads]', message)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
