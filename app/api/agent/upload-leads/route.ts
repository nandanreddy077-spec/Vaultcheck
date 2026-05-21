import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/agent/supabase'
import { verifyCronAuthorization } from '@/lib/cron-auth'

// POST /api/agent/upload-leads
// Saves leads to DB as status='new'. qualify-leads cron scores and schedules emails.
// Keeping this fast (no Claude calls) so 100+ lead uploads don't timeout.
export async function POST(req: Request) {
  const cronAuth = verifyCronAuthorization(req)
  if (cronAuth !== 'ok') {
    const status = cronAuth === 'misconfigured' ? 503 : 401
    const error = cronAuth === 'misconfigured' ? 'Server misconfigured' : 'Unauthorized'
    return NextResponse.json({ error }, { status })
  }

  const body = await req.json()
  const leads: Array<{
    first_name: string
    last_name?: string
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
  let saved = 0
  let skipped = 0

  for (const lead of leads) {
    if (!lead.email || !lead.first_name) { skipped++; continue }

    const email = lead.email.toLowerCase().trim()

    // Check unsubscribes
    const { data: unsub } = await db
      .from('outreach_unsubscribes')
      .select('id')
      .eq('email', email)
      .single()
    if (unsub) { skipped++; continue }

    // Check if already exists
    const { data: existing } = await db
      .from('outreach_leads')
      .select('id')
      .eq('email', email)
      .single()
    if (existing) { skipped++; continue }

    const { error } = await db.from('outreach_leads').insert({
      first_name: lead.first_name.trim(),
      last_name: lead.last_name?.trim() ?? '',
      email,
      title: lead.title?.trim() ?? '',
      company_name: lead.company_name?.trim() ?? '',
      company_domain: lead.company_domain?.trim() ?? '',
      city: lead.city?.trim() ?? '',
      state: lead.state?.trim() ?? '',
      industry: lead.industry?.trim() ?? 'Accounting',
      employee_count: lead.employee_count ?? 0,
      linkedin_url: lead.linkedin_url?.trim() ?? '',
      phone: lead.phone?.trim() ?? '',
      source: 'manual_upload',
      status: 'new',
      funnel_stage: 'cold',
    })

    if (error) { skipped++; continue }
    saved++
  }

  return NextResponse.json({ ok: true, total: leads.length, saved, skipped })
}
