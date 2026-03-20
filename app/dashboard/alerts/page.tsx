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

  async function load() {
    setLoading(true)
    const res = await fetch(`/api/alerts?status=${filter}`)
    const data = await res.json()
    setAlerts(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [filter])

  async function resolve(alertId: string, resolution: string) {
    setResolving(alertId)
    await fetch(`/api/alerts/${alertId}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resolution }),
    })
    await load()
    setResolving(null)
  }

  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
  const sorted = [...alerts].sort((a, b) =>
    (severityOrder[a.severity as keyof typeof severityOrder] ?? 4) -
    (severityOrder[b.severity as keyof typeof severityOrder] ?? 4)
  )

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Alert Queue</h1>
        <div className="flex gap-2">
          {['open', 'resolved', 'all'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 text-sm rounded-md font-medium ${
                filter === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-white rounded-lg border border-gray-200 animate-pulse" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-400">No {filter} alerts</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(alert => (
            <div
              key={alert.id}
              className={`bg-white rounded-lg border p-5 ${
                alert.severity === 'critical'
                  ? 'border-red-200 bg-red-50'
                  : alert.severity === 'high'
                  ? 'border-orange-200'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`mt-1 severity-dot-${alert.severity}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`risk-badge-${alert.severity === 'critical' ? 'critical' : alert.severity === 'high' ? 'high' : alert.severity === 'medium' ? 'moderate' : 'low'}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                    <h3 className="text-sm font-semibold text-gray-900">{alert.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
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
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 disabled:opacity-50"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Approve
                    </button>
                    <button
                      onClick={() => resolve(alert.id, 'confirmed_fraud')}
                      disabled={resolving === alert.id}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Reject
                    </button>
                    <button
                      onClick={() => resolve(alert.id, 'false_positive')}
                      disabled={resolving === alert.id}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                    >
                      <MinusCircle className="w-3.5 h-3.5" />
                      Dismiss
                    </button>
                  </div>
                )}

                {alert.status === 'resolved' && (
                  <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
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
