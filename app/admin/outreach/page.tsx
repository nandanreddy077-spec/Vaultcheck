'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Stats {
  total_leads: number
  active_leads: number
  replied_leads: number
  emails_sent_today: number
  emails_scheduled: number
  qualified_rate: number
}

interface RunLog {
  id: string
  run_type: string
  status: string
  leads_fetched: number
  leads_qualified: number
  emails_sent: number
  replies_found: number
  error: string | null
  started_at: string
  finished_at: string | null
}

interface RecentEmail {
  id: string
  step: number
  subject: string
  status: string
  psychology_angle: string
  sent_at: string | null
  scheduled_at: string
  gmail_account: string | null
  outreach_leads: { first_name: string; last_name: string; company_name: string; email: string } | null
}

export default function OutreachDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [runs, setRuns] = useState<RunLog[]>([])
  const [emails, setEmails] = useState<RecentEmail[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [leadsRes, emailsRes, runsRes, todayEmailsRes] = await Promise.all([
        db.from('outreach_leads').select('status'),
        db.from('outreach_emails')
          .select('*, outreach_leads(first_name, last_name, company_name, email)')
          .order('created_at', { ascending: false })
          .limit(20),
        db.from('agent_runs').select('*').order('started_at', { ascending: false }).limit(10),
        db.from('outreach_emails').select('id').eq('status', 'sent').gte('sent_at', new Date().toISOString().split('T')[0]),
      ])

      const leads = leadsRes.data ?? []
      const scheduled = (emailsRes.data ?? []).filter((e: RecentEmail) => e.status === 'scheduled').length

      setStats({
        total_leads: leads.length,
        active_leads: leads.filter((l: { status: string }) => l.status === 'active').length,
        replied_leads: leads.filter((l: { status: string }) => l.status === 'replied').length,
        emails_sent_today: todayEmailsRes.data?.length ?? 0,
        emails_scheduled: scheduled,
        qualified_rate: leads.length > 0
          ? Math.round((leads.filter((l: { status: string }) => ['active', 'replied'].includes(l.status)).length / leads.length) * 100)
          : 0,
      })

      setRuns(runsRes.data ?? [])
      setEmails(emailsRes.data ?? [])
      setLoading(false)
    }

    load()
    const interval = setInterval(load, 30_000) // refresh every 30s
    return () => clearInterval(interval)
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-gray-400">Loading outreach data...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Outreach Agent</h1>
          <p className="text-gray-400 text-sm mt-1">Vantirs 24/7 automated prospecting</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats && [
            { label: 'Total Leads', value: stats.total_leads, color: 'text-white' },
            { label: 'Active Sequences', value: stats.active_leads, color: 'text-blue-400' },
            { label: 'Replied', value: stats.replied_leads, color: 'text-green-400' },
            { label: 'Sent Today', value: stats.emails_sent_today, color: 'text-yellow-400' },
            { label: 'Scheduled', value: stats.emails_scheduled, color: 'text-purple-400' },
            { label: 'Qualify Rate', value: `${stats.qualified_rate}%`, color: 'text-cyan-400' },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-gray-400 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Agent run logs */}
        <div className="bg-gray-900 rounded-lg border border-gray-800">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-sm font-semibold text-gray-200">Recent Agent Runs</h2>
          </div>
          <div className="divide-y divide-gray-800">
            {runs.length === 0 && (
              <div className="px-6 py-4 text-gray-500 text-sm">No runs yet.</div>
            )}
            {runs.map((run) => (
              <div key={run.id} className="px-6 py-3 flex items-center gap-4 text-sm">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  run.status === 'success' ? 'bg-green-900 text-green-300' :
                  run.status === 'error' ? 'bg-red-900 text-red-300' :
                  'bg-yellow-900 text-yellow-300'
                }`}>
                  {run.status}
                </span>
                <span className="text-gray-300 font-mono text-xs">{run.run_type}</span>
                <span className="text-gray-500 text-xs">
                  {new Date(run.started_at).toLocaleString()}
                </span>
                <div className="flex gap-3 ml-auto text-gray-400 text-xs">
                  {run.leads_fetched > 0 && <span>↓ {run.leads_fetched} fetched</span>}
                  {run.leads_qualified > 0 && <span>✓ {run.leads_qualified} qualified</span>}
                  {run.emails_sent > 0 && <span>✉ {run.emails_sent} sent</span>}
                  {run.replies_found > 0 && <span>↩ {run.replies_found} replied</span>}
                  {run.error && <span className="text-red-400 truncate max-w-xs">{run.error}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent emails */}
        <div className="bg-gray-900 rounded-lg border border-gray-800">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-sm font-semibold text-gray-200">Recent Emails</h2>
          </div>
          <div className="divide-y divide-gray-800">
            {emails.length === 0 && (
              <div className="px-6 py-4 text-gray-500 text-sm">No emails yet.</div>
            )}
            {emails.map((email) => (
              <div key={email.id} className="px-6 py-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    email.status === 'sent' ? 'bg-green-900 text-green-300' :
                    email.status === 'scheduled' ? 'bg-blue-900 text-blue-300' :
                    email.status === 'cancelled' ? 'bg-gray-800 text-gray-500' :
                    'bg-red-900 text-red-300'
                  }`}>
                    {email.status}
                  </span>
                  <span className="text-gray-300 text-xs">Step {email.step}</span>
                  <span className="text-gray-500 text-xs">{email.psychology_angle}</span>
                  <span className="text-gray-500 text-xs ml-auto">
                    {email.sent_at
                      ? new Date(email.sent_at).toLocaleString()
                      : `Scheduled: ${new Date(email.scheduled_at).toLocaleString()}`}
                  </span>
                </div>
                <div className="mt-1 text-gray-200 font-medium">{email.subject}</div>
                {email.outreach_leads && (
                  <div className="text-gray-500 text-xs mt-0.5">
                    {email.outreach_leads.first_name} {email.outreach_leads.last_name} · {email.outreach_leads.company_name} · {email.outreach_leads.email}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
