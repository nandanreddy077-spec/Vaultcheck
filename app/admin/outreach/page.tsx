'use client'

import { useEffect, useState } from 'react'

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

interface Reply {
  id: string
  lead_id: string
  direction: string
  subject: string
  body: string
  intent: 'positive' | 'objection' | 'question' | 'not_interested' | 'out_of_office' | 'other'
  intent_confidence: number
  auto_replied: boolean
  created_at: string
  outreach_leads: {
    first_name: string
    last_name: string
    company_name: string
    email: string
    state: string
    funnel_stage: string
    notes: string | null
  } | null
}

const INTENT_CONFIG = {
  positive:       { label: 'Interested',     bg: 'bg-green-900',  text: 'text-green-300',  dot: 'bg-green-400',  emoji: '🟢' },
  question:       { label: 'Has a Question', bg: 'bg-blue-900',   text: 'text-blue-300',   dot: 'bg-blue-400',   emoji: '🔵' },
  objection:      { label: 'Objection',      bg: 'bg-yellow-900', text: 'text-yellow-300', dot: 'bg-yellow-400', emoji: '🟡' },
  not_interested: { label: 'Not Interested', bg: 'bg-red-900',    text: 'text-red-300',    dot: 'bg-red-500',    emoji: '🔴' },
  out_of_office:  { label: 'Out of Office',  bg: 'bg-gray-800',   text: 'text-gray-400',   dot: 'bg-gray-500',   emoji: '⚪' },
  other:          { label: 'Other',          bg: 'bg-gray-800',   text: 'text-gray-400',   dot: 'bg-gray-500',   emoji: '❓' },
}

function ReplyCard({ reply }: { reply: Reply }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = INTENT_CONFIG[reply.intent] ?? INTENT_CONFIG.other
  const lead = reply.outreach_leads
  const needsAction = ['positive', 'question', 'objection'].includes(reply.intent)

  return (
    <div className={`border rounded-xl p-5 ${needsAction ? 'border-green-700/40 bg-gray-900' : 'border-gray-800 bg-gray-900/50'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 h-2.5 w-2.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                {cfg.emoji} {cfg.label}
              </span>
              {reply.auto_replied && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-purple-900 text-purple-300">
                  ↩ Auto-replied
                </span>
              )}
              {needsAction && !reply.auto_replied && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-orange-900 text-orange-300 font-semibold">
                  ⚡ Needs your reply
                </span>
              )}
            </div>
            <div className="mt-1.5 font-semibold text-white text-sm">
              {lead?.first_name} {lead?.last_name}
              <span className="text-gray-400 font-normal"> · {lead?.company_name}</span>
              {lead?.state && <span className="text-gray-500 font-normal"> · {lead.state}</span>}
            </div>
            <div className="text-gray-500 text-xs mt-0.5">{lead?.email}</div>
          </div>
        </div>
        <div className="text-gray-500 text-xs whitespace-nowrap flex-shrink-0">
          {new Date(reply.created_at).toLocaleString()}
        </div>
      </div>

      <div className="mt-3 ml-5">
        <div className="text-xs text-gray-500 mb-1">Re: {reply.subject}</div>
        <div
          className={`text-sm text-gray-300 whitespace-pre-wrap leading-relaxed ${!expanded ? 'line-clamp-3' : ''}`}
        >
          {reply.body}
        </div>
        {reply.body?.length > 200 && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="mt-1 text-xs text-blue-400 hover:text-blue-300"
          >
            {expanded ? 'Show less' : 'Read full reply'}
          </button>
        )}
        {lead?.notes && (
          <div className="mt-2 px-3 py-2 rounded-lg bg-gray-800 text-xs text-gray-400">
            📝 {lead.notes}
          </div>
        )}
      </div>
    </div>
  )
}

type ReplyFilter = 'all' | 'positive' | 'question' | 'objection' | 'not_interested' | 'out_of_office'

export default function OutreachDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [runs, setRuns] = useState<RunLog[]>([])
  const [emails, setEmails] = useState<RecentEmail[]>([])
  const [replies, setReplies] = useState<Reply[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [replyFilter, setReplyFilter] = useState<ReplyFilter>('all')
  const [activeTab, setActiveTab] = useState<'replies' | 'emails' | 'runs'>('replies')

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/outreach/summary', { cache: 'no-store' })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || `Failed to load outreach summary (${res.status})`)
        setStats(data.stats ?? null)
        setRuns(data.runs ?? [])
        setEmails(data.emails ?? [])
        setReplies(data.replies ?? [])
        setLoadError(null)
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : 'Failed to load outreach summary')
      } finally {
        setLoading(false)
      }
    }

    load()
    const interval = setInterval(load, 30_000)
    return () => clearInterval(interval)
  }, [])

  const filteredReplies = replyFilter === 'all'
    ? replies
    : replies.filter(r => r.intent === replyFilter)

  const needsAction = replies.filter(r => ['positive', 'question', 'objection'].includes(r.intent) && !r.auto_replied)

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-gray-400">Loading outreach data...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Outreach Agent</h1>
            <p className="text-gray-400 text-sm mt-1">Vantirs 24/7 automated prospecting</p>
          </div>
          <a
            href="/admin/outreach/upload"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-medium transition-colors"
          >
            + Upload CSV
          </a>
        </div>

        {loadError && (
          <div className="rounded-lg border border-red-700 bg-red-900/30 px-4 py-3 text-sm text-red-200">
            {loadError}
          </div>
        )}

        {/* Action needed banner */}
        {needsAction.length > 0 && (
          <div className="rounded-xl border border-orange-700/50 bg-orange-900/20 px-5 py-4 flex items-center gap-3">
            <span className="text-xl">⚡</span>
            <div>
              <div className="font-semibold text-orange-300 text-sm">
                {needsAction.length} {needsAction.length === 1 ? 'reply needs' : 'replies need'} your attention
              </div>
              <div className="text-orange-400/70 text-xs mt-0.5">
                {needsAction.filter(r => r.intent === 'positive').length} interested ·{' '}
                {needsAction.filter(r => r.intent === 'question').length} questions ·{' '}
                {needsAction.filter(r => r.intent === 'objection').length} objections
              </div>
            </div>
            <button
              onClick={() => { setActiveTab('replies'); setReplyFilter('all') }}
              className="ml-auto text-xs text-orange-300 hover:text-orange-200 underline"
            >
              View replies →
            </button>
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats && [
            { label: 'Total Leads',       value: stats.total_leads,       color: 'text-white' },
            { label: 'Active Sequences',  value: stats.active_leads,      color: 'text-blue-400' },
            { label: 'Replied',           value: stats.replied_leads,     color: 'text-green-400' },
            { label: 'Sent Today',        value: stats.emails_sent_today, color: 'text-yellow-400' },
            { label: 'Scheduled',         value: stats.emails_scheduled,  color: 'text-purple-400' },
            { label: 'Qualify Rate',      value: `${stats.qualified_rate}%`, color: 'text-cyan-400' },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-gray-400 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tab nav */}
        <div className="flex gap-1 border-b border-gray-800">
          {([
            { key: 'replies', label: `Replies${replies.length > 0 ? ` (${replies.length})` : ''}` },
            { key: 'emails',  label: 'Recent Emails' },
            { key: 'runs',    label: 'Agent Runs' },
          ] as { key: typeof activeTab; label: string }[]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-500 text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.label}
              {tab.key === 'replies' && needsAction.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] font-bold">
                  {needsAction.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Replies tab */}
        {activeTab === 'replies' && (
          <div className="space-y-4">
            {/* Filter pills */}
            <div className="flex gap-2 flex-wrap">
              {([
                { key: 'all',           label: `All (${replies.length})` },
                { key: 'positive',      label: `🟢 Interested (${replies.filter(r => r.intent === 'positive').length})` },
                { key: 'question',      label: `🔵 Questions (${replies.filter(r => r.intent === 'question').length})` },
                { key: 'objection',     label: `🟡 Objections (${replies.filter(r => r.intent === 'objection').length})` },
                { key: 'not_interested',label: `🔴 Not Interested (${replies.filter(r => r.intent === 'not_interested').length})` },
                { key: 'out_of_office', label: `⚪ OOO (${replies.filter(r => r.intent === 'out_of_office').length})` },
              ] as { key: ReplyFilter; label: string }[]).map(f => (
                <button
                  key={f.key}
                  onClick={() => setReplyFilter(f.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    replyFilter === f.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {filteredReplies.length === 0 ? (
              <div className="rounded-xl border border-gray-800 bg-gray-900 px-6 py-12 text-center">
                <div className="text-3xl mb-3">📭</div>
                <div className="text-gray-400 text-sm">
                  {replies.length === 0 ? 'No replies yet — check back soon.' : 'No replies match this filter.'}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredReplies.map(reply => (
                  <ReplyCard key={reply.id} reply={reply} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Recent emails tab */}
        {activeTab === 'emails' && (
          <div className="bg-gray-900 rounded-lg border border-gray-800">
            <div className="divide-y divide-gray-800">
              {emails.length === 0 && (
                <div className="px-6 py-4 text-gray-500 text-sm">No emails yet.</div>
              )}
              {emails.map((email) => (
                <div key={email.id} className="px-6 py-3 text-sm">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      email.status === 'sent'      ? 'bg-green-900 text-green-300' :
                      email.status === 'scheduled' ? 'bg-blue-900 text-blue-300' :
                      email.status === 'cancelled' ? 'bg-gray-800 text-gray-500' :
                      'bg-red-900 text-red-300'
                    }`}>
                      {email.status}
                    </span>
                    <span className="text-gray-300 text-xs">Step {email.step}</span>
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
        )}

        {/* Agent runs tab */}
        {activeTab === 'runs' && (
          <div className="bg-gray-900 rounded-lg border border-gray-800">
            <div className="divide-y divide-gray-800">
              {runs.length === 0 && (
                <div className="px-6 py-4 text-gray-500 text-sm">No runs yet.</div>
              )}
              {runs.map((run) => (
                <div key={run.id} className="px-6 py-3 flex items-center gap-4 text-sm">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    run.status === 'success' ? 'bg-green-900 text-green-300' :
                    run.status === 'error'   ? 'bg-red-900 text-red-300' :
                    'bg-yellow-900 text-yellow-300'
                  }`}>
                    {run.status}
                  </span>
                  <span className="text-gray-300 font-mono text-xs">{run.run_type}</span>
                  <span className="text-gray-500 text-xs">
                    {new Date(run.started_at).toLocaleString()}
                  </span>
                  <div className="flex gap-3 ml-auto text-gray-400 text-xs">
                    {run.leads_fetched > 0   && <span>↓ {run.leads_fetched} fetched</span>}
                    {run.leads_qualified > 0 && <span>✓ {run.leads_qualified} qualified</span>}
                    {run.emails_sent > 0     && <span>✉ {run.emails_sent} sent</span>}
                    {run.replies_found > 0   && <span>↩ {run.replies_found} replied</span>}
                    {run.error && <span className="text-red-400 truncate max-w-xs">{run.error}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
