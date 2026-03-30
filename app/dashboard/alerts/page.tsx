'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, MinusCircle } from 'lucide-react'

interface Alert {
  id: string
  severity: string
  type: string
  title: string
  description: string
  status: string
  createdAt: string
  invoice: { amount: number; vendor?: { displayName: string } }
  client: { id: string; name: string }
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('open')
  const [resolving, setResolving] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/alerts?status=${filter}`)
      const text = await res.text()
      const data = text ? JSON.parse(text) : null

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to load alerts')
      }
      setAlerts(Array.isArray(data) ? data : [])
    } catch (e) {
      setAlerts([])
      setError(e instanceof Error ? e.message : 'Failed to load alerts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [filter]) // eslint-disable-line react-hooks/exhaustive-deps

  async function resolve(alertId: string, resolution: string) {
    setResolving(alertId)
    setError(null)
    try {
      const res = await fetch(`/api/alerts/${alertId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolution }),
      })
      if (!res.ok) {
        const text = await res.text()
        const data = text ? JSON.parse(text) : null
        throw new Error(data?.error || 'Failed to resolve alert')
      }
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to resolve alert')
    } finally {
      setResolving(null)
    }
  }

  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
  const sorted = [...alerts].sort((a, b) =>
    (severityOrder[a.severity as keyof typeof severityOrder] ?? 4) -
    (severityOrder[b.severity as keyof typeof severityOrder] ?? 4)
  )

  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-semibold text-[#0b1c30]">Active High-Risk Alerts</h1>
          <p className="mt-2 text-sm text-slate-500">Investigate and resolve anomalies before money leaves the account.</p>
        </div>
        <div className="flex gap-2">
          {['open', 'resolved', 'all'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                filter === s
                  ? 'bg-gradient-to-br from-[#003ec7] to-[#0052ff] text-white shadow-lg shadow-blue-500/20'
                  : 'bg-white text-slate-600 hover:bg-[#eff4ff]'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-white rounded-xl animate-pulse shadow-[0_4px_20px_rgba(11,28,48,0.06)]" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="surface-panel p-12 text-center">
          <p className="text-slate-400">No {filter} alerts</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(alert => (
            <div
              key={alert.id}
              className={`surface-panel p-5 ${
                alert.severity === 'critical'
                  ? 'bg-red-50'
                  : alert.severity === 'high'
                  ? 'bg-orange-50'
                  : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`mt-1 severity-dot-${alert.severity}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`risk-badge-${alert.severity === 'critical' ? 'critical' : alert.severity === 'high' ? 'high' : alert.severity === 'medium' ? 'moderate' : 'low'}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                    <h3 className="text-sm font-semibold text-[#0b1c30]">{alert.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{alert.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    <span>{alert.client.name}</span>
                    <span>{alert.invoice.vendor?.displayName || 'Unknown vendor'}</span>
                    <span>${alert.invoice.amount.toLocaleString()}</span>
                    <span>{new Date(alert.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {alert.status === 'open' && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => resolve(alert.id, 'approved_safe')}
                      disabled={resolving === alert.id}
                      className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 disabled:opacity-50"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Approve
                    </button>
                    <button
                      onClick={() => resolve(alert.id, 'confirmed_fraud')}
                      disabled={resolving === alert.id}
                      className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Reject
                    </button>
                    <button
                      onClick={() => resolve(alert.id, 'false_positive')}
                      disabled={resolving === alert.id}
                      className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50"
                    >
                      <MinusCircle className="w-3.5 h-3.5" />
                      Dismiss
                    </button>
                  </div>
                )}

                {alert.status === 'resolved' && (
                  <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                    Resolved
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
