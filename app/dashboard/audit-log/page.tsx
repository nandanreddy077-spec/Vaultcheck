'use client'

import { useState, useEffect, useCallback } from 'react'
import { Download, Filter } from 'lucide-react'

interface AuditEntry {
  id: string
  createdAt: string
  action: string
  actionLabel: string
  clientName: string | null
  actorEmail: string
  entityType: string
  entityId: string
  details: Record<string, unknown> | null
}

const ACTION_OPTIONS = [
  { value: '', label: 'All actions' },
  { value: 'invoice_scanned', label: 'Invoice Scanned' },
  { value: 'invoice_approved', label: 'Invoice Approved' },
  { value: 'invoice_rejected', label: 'Invoice Rejected' },
  { value: 'alert_created', label: 'Alert Created' },
  { value: 'alert_resolved', label: 'Alert Resolved' },
  { value: 'client_created', label: 'Client Added' },
  { value: 'paddle_subscription_updated', label: 'Plan Updated' },
  { value: 'paddle_subscription_canceled', label: 'Plan Canceled' },
  { value: 'plan.outreach_coupon_redeemed', label: 'Partner Code Redeemed' },
]

const ACTION_COLORS: Record<string, string> = {
  invoice_approved: 'bg-emerald-100 text-emerald-800',
  invoice_rejected: 'bg-red-100 text-red-800',
  alert_created: 'bg-orange-100 text-orange-800',
  alert_resolved: 'bg-slate-100 text-slate-700',
  invoice_scanned: 'bg-blue-100 text-blue-800',
  client_created: 'bg-purple-100 text-purple-800',
  paddle_subscription_updated: 'bg-indigo-100 text-indigo-800',
  paddle_subscription_canceled: 'bg-rose-100 text-rose-800',
  'plan.outreach_coupon_redeemed': 'bg-teal-100 text-teal-800',
}

function defaultFrom() {
  const d = new Date()
  d.setDate(d.getDate() - 30)
  return d.toISOString().slice(0, 10)
}

function defaultTo() {
  return new Date().toISOString().slice(0, 10)
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([])
  const [total, setTotal] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [clientId, setClientId] = useState('')
  const [action, setAction] = useState('')
  const [from, setFrom] = useState(defaultFrom())
  const [to, setTo] = useState(defaultTo())
  const [clients, setClients] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    fetch('/api/clients')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setClients(data) })
      .catch(() => {})
  }, [])

  const buildParams = useCallback(
    (overridePage?: number) => {
      const p = new URLSearchParams()
      if (clientId) p.set('clientId', clientId)
      if (action) p.set('action', action)
      if (from) p.set('from', from)
      if (to) p.set('to', to)
      p.set('page', String(overridePage ?? page))
      return p.toString()
    },
    [clientId, action, from, to, page]
  )

  const load = useCallback(
    async (overridePage?: number) => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/audit-log?${buildParams(overridePage)}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'Failed to load audit log')
        setLogs(data.logs)
        setTotal(data.total)
        setPageCount(data.pageCount)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load audit log')
      } finally {
        setLoading(false)
      }
    },
    [buildParams]
  )

  useEffect(() => {
    load()
  }, [load]) // eslint-disable-line react-hooks/exhaustive-deps

  function applyFilters() {
    setPage(1)
    load(1)
  }

  function exportCsv() {
    const p = new URLSearchParams()
    if (clientId) p.set('clientId', clientId)
    if (action) p.set('action', action)
    if (from) p.set('from', from)
    if (to) p.set('to', to)
    p.set('format', 'csv')
    window.location.href = `/api/audit-log?${p.toString()}`
  }

  function formatDetails(details: Record<string, unknown> | null) {
    if (!details) return '—'
    const keys = Object.keys(details)
    if (keys.length === 0) return '—'
    return keys
      .slice(0, 3)
      .map(k => `${k}: ${String(details[k]).slice(0, 30)}`)
      .join(' · ')
  }

  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-semibold text-[#0b1c30]">Audit Log</h1>
          <p className="text-sm text-slate-500 mt-2">
            Complete timestamped record of all payment decisions and fraud alerts.
          </p>
        </div>
        <button
          onClick={exportCsv}
          className="btn-primary-gradient gap-2 text-sm"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="surface-panel p-4 mb-5">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5" />
            Filter
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-wider">Client</label>
            <select
              value={clientId}
              onChange={e => setClientId(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#003ec7]/30"
            >
              <option value="">All clients</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-wider">Action</label>
            <select
              value={action}
              onChange={e => setAction(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#003ec7]/30"
            >
              {ACTION_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-wider">From</label>
            <input
              type="date"
              value={from}
              onChange={e => setFrom(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#003ec7]/30"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-wider">To</label>
            <input
              type="date"
              value={to}
              onChange={e => setTo(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#003ec7]/30"
            />
          </div>

          <button
            onClick={applyFilters}
            className="px-4 py-2 text-sm font-medium text-white bg-[#003ec7] rounded-lg hover:bg-[#0032a3] transition-colors"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-slate-400 mb-3">
        {loading ? 'Loading…' : `${total.toLocaleString()} record${total === 1 ? '' : 's'}`}
      </p>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Table */}
      <div className="surface-panel overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-[#eff4ff]">
            <tr>
              <th className="px-6 py-4 text-left text-[11px] font-medium text-slate-500 uppercase tracking-[0.08em]">Timestamp</th>
              <th className="px-6 py-4 text-left text-[11px] font-medium text-slate-500 uppercase tracking-[0.08em]">Action</th>
              <th className="px-6 py-4 text-left text-[11px] font-medium text-slate-500 uppercase tracking-[0.08em]">Client</th>
              <th className="px-6 py-4 text-left text-[11px] font-medium text-slate-500 uppercase tracking-[0.08em]">Actor</th>
              <th className="px-6 py-4 text-left text-[11px] font-medium text-slate-500 uppercase tracking-[0.08em]">Details</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1, 2, 3, 4, 5].map(i => (
                <tr key={i}>
                  <td colSpan={5} className="px-6 py-3">
                    <div className="h-5 bg-slate-100 rounded animate-pulse" />
                  </td>
                </tr>
              ))
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-400">
                  No audit records found for the selected filters.
                </td>
              </tr>
            ) : (
              logs.map(log => (
                <tr key={log.id} className="odd:bg-white even:bg-[#f8f9ff] hover:bg-[#eff4ff] transition-colors">
                  <td className="px-6 py-3 text-xs text-slate-500 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${ACTION_COLORS[log.action] ?? 'bg-slate-100 text-slate-700'}`}>
                      {log.actionLabel}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-600">
                    {log.clientName ?? <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-6 py-3 text-xs text-slate-500">{log.actorEmail}</td>
                  <td className="px-6 py-3 text-xs text-slate-400 max-w-xs truncate">
                    {formatDetails(log.details)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-slate-400">
            Page {page} of {pageCount}
          </p>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => { setPage(p => p - 1); load(page - 1) }}
              className="px-3 py-1.5 text-sm rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-[#eff4ff] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>
            <button
              disabled={page >= pageCount}
              onClick={() => { setPage(p => p + 1); load(page + 1) }}
              className="px-3 py-1.5 text-sm rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-[#eff4ff] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
