import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/agent/supabase'
import { detectPainSignals } from '@/lib/agent/pain-detector'
import { generateEmail, SEQUENCE_DELAYS_DAYS } from '@/lib/agent/email-generator'
import { addDays } from 'date-fns'

// POST /api/agent/upload-leads
// Body: JSON array of leads
// Auth: Authorization: Bearer CRON_SECRET
export async function POST(req: Request) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const leads: Array<{
    first_name: string
    last_name: string
    email: string
    title?: string
    company_name?: string
    company_domain?: string
    city?: string
    state?: string
    industry?: string
    employee_count?: number
    linkedin_url?: string
    phone?: string
  }> = body.leads ?? body

  if (!Array.isArray(leads) || leads.length === 0) {
    return NextResponse.json({ error: 'leads array required' }, { status: 400 })
  }

  const db = getServiceClient()
  let saved = 0, skipped = 0, qualified = 0

  for (const lead of leads) {
    if (!lead.email || !lead.first_name) { skipped++; continue }

    // Check unsubscribes
    const { data: unsub } = await db.from('outreach_unsubscribes').select('id').eq('email', lead.email.toLowerCase()).single()
    if (unsub) { skipped++; continue }

    // Upsert lead
    const { data: saved_lead, error } = await db
      .from('outreach_leads')
      .upsert({
        first_name: lead.first_name,
        last_name: lead.last_name ?? '',
        email: lead.email.toLowerCase(),
        title: lead.title ?? '',
        company_name: lead.company_name ?? '',
        company_domain: lead.company_domain ?? '',
        city: lead.city ?? '',
        state: lead.state ?? '',
        industry: lead.industry ?? '',
        employee_count: lead.employee_count ?? 0,
        linkedin_url: lead.linkedin_url ?? '',
        phone: lead.phone ?? '',
        source: 'manual_upload',
        status: 'new',
        funnel_stage: 'cold',
      }, { onConflict: 'email', ignoreDuplicates: true })
      .select()
      .single()

    if (error || !saved_lead) { skipped++; continue }
    saved++

    // Score with Claude
    const painSignals = await detectPainSignals({
      first_name: lead.first_name,
      title: lead.title ?? '',
      company_name: lead.company_name ?? '',
      company_domain: lead.company_domain ?? '',
      industry: lead.industry ?? '',
      city: lead.city ?? '',
      state: lead.state ?? '',
    })

    if (painSignals.score < 40) {
      await db.from('outreach_leads').update({ pain_signals: painSignals, pain_score: painSignals.score, status: 'finished', funnel_stage: 'lost', lost_reason: 'Low pain score' }).eq('id', saved_lead.id)
      continue
    }

    // Generate all 4 emails
    for (const step of [1, 2, 3, 4]) {
      const email = await generateEmail(
        { first_name: lead.first_name, title: lead.title ?? '', company_name: lead.company_name ?? '', city: lead.city ?? '', state: lead.state ?? '' },
        step,
        painSignals
      )
      const sendAt = addDays(new Date(), SEQUENCE_DELAYS_DAYS[step])
      sendAt.setHours(10, 0, 0, 0)
      await db.from('outreach_emails').insert({
        lead_id: saved_lead.id, step, subject: email.subject, body: email.body,
        psychology_angle: email.psychology_angle, status: 'scheduled', scheduled_at: sendAt.toISOString(),
      })
    }

    await db.from('outreach_leads').update({
      pain_signals: painSignals, pain_score: painSignals.score,
      status: 'active', funnel_stage: 'sequence',
      next_email_at: addDays(new Date(), 0).toISOString(),
    }).eq('id', saved_lead.id)

    qualified++
  }

  return NextResponse.json({ ok: true, total: leads.length, saved, skipped, qualified })
}
