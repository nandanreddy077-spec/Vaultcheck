import { NextResponse } from 'next/server'
import { fetchLeadsFromApollo, saveLeadsToDb } from '@/lib/agent/apollo'
import { detectPainSignals } from '@/lib/agent/pain-detector'
import { generateEmail, SEQUENCE_DELAYS_DAYS } from '@/lib/agent/email-generator'
import { getServiceClient } from '@/lib/agent/supabase'
import { addDays } from 'date-fns'

const DAILY_LIMIT = parseInt(process.env.DAILY_LEAD_LIMIT ?? '20')

function verifyCron(req: Request) {
  const auth = req.headers.get('authorization')
  return auth === `Bearer ${process.env.CRON_SECRET}`
}

export async function GET(req: Request) {
  if (!verifyCron(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db: any = getServiceClient()

  // Log run start
  const { data: run } = await db
    .from('agent_runs')
    .insert({ run_type: 'source-leads', status: 'running' })
    .select()
    .single()

  const runId = run?.id

  try {
    // 1. Fetch leads from Apollo
    const rawLeads = await fetchLeadsFromApollo(DAILY_LIMIT)

    // 2. Save new leads (deduplicates internally)
    const { saved, skipped } = await saveLeadsToDb(rawLeads)

    // 3. Fetch the newly saved leads for qualification
    const { data: newLeads } = await db
      .from('outreach_leads')
      .select('*')
      .eq('status', 'new')
      .order('created_at', { ascending: false })
      .limit(DAILY_LIMIT)

    let qualified = 0

    for (const lead of newLeads ?? []) {
      // 4. Run pain detection via Claude
      const painSignals = await detectPainSignals({
        first_name: lead.first_name,
        title: lead.title,
        company_name: lead.company_name,
        company_domain: lead.company_domain ?? '',
        industry: lead.industry ?? '',
        city: lead.city ?? '',
        state: lead.state ?? '',
      })

      // Only queue leads with score >= 50
      if (painSignals.score < 50) {
        await db
          .from('outreach_leads')
          .update({ pain_signals: painSignals, pain_score: painSignals.score, status: 'finished' })
          .eq('id', lead.id)
        continue
      }

      // 5. Generate step-1 email
      const email = await generateEmail(
        { first_name: lead.first_name, title: lead.title, company_name: lead.company_name, city: lead.city ?? '', state: lead.state ?? '' },
        1,
        painSignals
      )

      const sendAt = addDays(new Date(), SEQUENCE_DELAYS_DAYS[1])
      // Schedule during business hours (10am local-ish)
      sendAt.setHours(10, 0, 0, 0)

      await db.from('outreach_emails').insert({
        lead_id: lead.id,
        step: 1,
        subject: email.subject,
        body: email.body,
        psychology_angle: email.psychology_angle,
        status: 'scheduled',
        scheduled_at: sendAt.toISOString(),
      })

      // Pre-generate remaining steps (day 4, 9, 16)
      for (const step of [2, 3, 4]) {
        const stepEmail = await generateEmail(
          { first_name: lead.first_name, title: lead.title, company_name: lead.company_name, city: lead.city ?? '', state: lead.state ?? '' },
          step,
          painSignals
        )
        const stepDate = addDays(new Date(), SEQUENCE_DELAYS_DAYS[step])
        stepDate.setHours(10, 0, 0, 0)

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

      // Update lead status
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
    }

    // Mark run complete
    await db
      .from('agent_runs')
      .update({
        status: 'success',
        leads_fetched: rawLeads.length,
        leads_qualified: qualified,
        details: { saved, skipped },
        finished_at: new Date().toISOString(),
      })
      .eq('id', runId)

    return NextResponse.json({ ok: true, fetched: rawLeads.length, saved, qualified })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    await db
      .from('agent_runs')
      .update({ status: 'error', error: message, finished_at: new Date().toISOString() })
      .eq('id', runId)

    console.error('[source-leads]', message)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
