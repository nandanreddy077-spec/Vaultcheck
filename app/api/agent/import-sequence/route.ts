import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/agent/supabase'
import { verifyCronAuthorization } from '@/lib/cron-auth'
import { addDays } from 'date-fns'

interface EmailStep {
  step: number
  subject: string
  body: string
}

interface SequenceLead {
  first_name: string
  last_name?: string
  email: string
  firm?: string
  state?: string
  city?: string
  firm_type?: string
  emails: EmailStep[]
}

// Schedules leads with their pre-written email sequences (no Claude generation).
// E1 sends today at 10am EDT; E2/E3/E4 are +3/+6/+9 days.
export async function POST(req: Request) {
  const cronAuth = verifyCronAuthorization(req)
  if (cronAuth !== 'ok') {
    const status = cronAuth === 'misconfigured' ? 503 : 401
    const error = cronAuth === 'misconfigured' ? 'Server misconfigured' : 'Unauthorized'
    return NextResponse.json({ error }, { status })
  }

  const body = await req.json()
  const leads: SequenceLead[] = body.leads ?? []

  if (!Array.isArray(leads) || leads.length === 0) {
    return NextResponse.json({ error: 'leads array required' }, { status: 400 })
  }

  const db: any = getServiceClient()
  let saved = 0
  let skipped = 0

  for (const lead of leads) {
    if (!lead.email || !lead.first_name) { skipped++; continue }

    const email = lead.email.toLowerCase().trim()

    const { data: unsub } = await db
      .from('outreach_unsubscribes')
      .select('id')
      .eq('email', email)
      .single()
    if (unsub) { skipped++; continue }

    const { data: existing } = await db
      .from('outreach_leads')
      .select('id')
      .eq('email', email)
      .single()
    if (existing) { skipped++; continue }

    const { data: newLead, error: insertError } = await db
      .from('outreach_leads')
      .insert({
        first_name: lead.first_name.trim(),
        last_name: lead.last_name?.trim() ?? '',
        email,
        company_name: lead.firm?.trim() ?? '',
        city: lead.city?.trim() ?? '',
        state: lead.state?.trim() ?? '',
        industry: 'Accounting',
        source: 'csv_sequence',
        status: 'active',
        funnel_stage: 'cold',
      })
      .select()
      .single()

    if (insertError || !newLead) { skipped++; continue }

    // Schedule emails at 3-day intervals (10am EDT = 14:00 UTC)
    // Cron sends Mon-Fri 13:00-21:00 UTC — if we're inside that window, fire ASAP
    const nowUtcHour = new Date().getUTCHours()
    const isWithinSendWindow = nowUtcHour >= 13 && nowUtcHour < 21
    const isWeekday = [1, 2, 3, 4, 5].includes(new Date().getUTCDay())

    for (const emailStep of lead.emails) {
      let sendAt: Date

      if (emailStep.step === 1) {
        if (isWithinSendWindow && isWeekday) {
          // Inside cron window — schedule 2 minutes from now so next run picks it up
          sendAt = new Date(Date.now() + 2 * 60 * 1000)
        } else {
          // Outside window — next weekday at 14:00 UTC
          sendAt = new Date()
          sendAt.setUTCHours(14, 0, 0, 0)
          // Advance to next weekday if needed
          while (sendAt < new Date() || ![1,2,3,4,5].includes(sendAt.getUTCDay())) {
            sendAt.setDate(sendAt.getDate() + 1)
            sendAt.setUTCHours(14, 0, 0, 0)
          }
        }
      } else {
        // Steps 2-4: 3-day intervals from today at 14:00 UTC
        sendAt = addDays(new Date(), (emailStep.step - 1) * 3)
        sendAt.setUTCHours(14, 0, 0, 0)
      }

      await db.from('outreach_emails').insert({
        lead_id: newLead.id,
        step: emailStep.step,
        subject: emailStep.subject,
        body: emailStep.body,
        status: 'scheduled',
        scheduled_at: sendAt.toISOString(),
      })
    }

    saved++
  }

  return NextResponse.json({ ok: true, total: leads.length, saved, skipped })
}
