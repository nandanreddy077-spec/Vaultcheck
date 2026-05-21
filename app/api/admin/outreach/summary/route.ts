import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { getServiceClient } from '@/lib/agent/supabase'

export async function GET() {
  try {
    const { authorized, error } = await requireRole(['admin'])
    if (!authorized) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 })
    }

    const db: any = getServiceClient()
    const todayStart = new Date()
    todayStart.setUTCHours(0, 0, 0, 0)

    const [leadsRes, emailsRes, runsRes, todayEmailsRes, repliesRes] = await Promise.all([
      db.from('outreach_leads').select('status'),
      db
        .from('outreach_emails')
        .select('*, outreach_leads(first_name, last_name, company_name, email)')
        .order('created_at', { ascending: false })
        .limit(20),
      db.from('agent_runs').select('*').order('started_at', { ascending: false }).limit(10),
      db.from('outreach_emails').select('id').eq('status', 'sent').gte('sent_at', todayStart.toISOString()),
      db
        .from('outreach_conversations')
        .select('*, outreach_leads(first_name, last_name, company_name, email, state, funnel_stage, notes)')
        .eq('direction', 'inbound')
        .order('created_at', { ascending: false })
        .limit(50),
    ])

    const leads = leadsRes.data ?? []
    const emails = emailsRes.data ?? []
    const runs = runsRes.data ?? []
    const replies = repliesRes.data ?? []
    const scheduledCount = emails.filter((e: { status: string }) => e.status === 'scheduled').length
    const qualifiedCount = leads.filter((l: { status: string }) => ['active', 'replied'].includes(l.status)).length

    return NextResponse.json({
      stats: {
        total_leads: leads.length,
        active_leads: leads.filter((l: { status: string }) => l.status === 'active').length,
        replied_leads: leads.filter((l: { status: string }) => l.status === 'replied').length,
        emails_sent_today: todayEmailsRes.data?.length ?? 0,
        emails_scheduled: scheduledCount,
        qualified_rate: leads.length > 0 ? Math.round((qualifiedCount / leads.length) * 100) : 0,
      },
      runs,
      emails,
      replies,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load outreach summary'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
