'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, RefreshCw, CheckCircle, XCircle, MinusCircle } from 'lucide-react'

interface InsiderAlert {
  id: string
  severity: string
  type: string
  title: string
  description: string
  status: string
  createdAt: string
  expectedValue?: string
  actualValue?: string
  invoice: { amount: number; invoiceNumber?: string; vendor?: { displayName: string } }
  client: { id: string; name: string }
}

const TYPE_LABELS: Record<string, string> = {
  duplicate_invoice: 'Duplicate Invoice',
  new_vendor_large_payment: 'New Vendor Large Payment',
  round_dollar_anomaly: 'Round-Dollar Anomaly',
  velocity_spike: 'Velocity Spike',
}

export default function InsiderRiskPage() {
  const [alerts, setAlerts] = useState<InsiderAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [scanning, setScanning] = useState(false)
  const [scanResult, setScanResult] = useState<{ totalFlags: number; patterns: string[] } | null>(null)
  const [filter, setFilter] = useState('open')
  const [resolving, setResolving] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const insiderTypes = ['duplicate_invoice', 'new_vendor_large_payment', 'round_dollar_anomaly', 'velocity_spike']

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/alerts?status=${filter}`)
      const data = await res.json()
      const insider = (Array.isArray(data) ? data : []).filter((a: InsiderAlert) =>
        insiderTypes.includes(a.type)
      )
      setAlerts(insider)
    } catch {
      setError('Failed to load alerts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [filter]) // eslint-disable-line react-hooks/exhaustive-deps

  async function runScan() {
    setScanning(true)
    setScanResult(null)
    setError(null)
    try {
      const res = await fetch('/api/insider-risk/scan', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Scan failed')
      setScanResult({ totalFlags: data.totalFlags, patterns: data.patterns })
      load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Scan failed')
    } finally {
      setScanning(false)
    }
  }

  async function resolve(alertId: string, resolution: string) {
    const prev = alerts
    setAlerts(a => a.filter(x => x.id !== alertId))
    setResolving(alertId)
    try {
      const res = await fetch(`/api/alerts/${alertId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolution }),
      })
      if (!res.ok) throw new Error()
    } catch {
      setAlerts(prev)
    } finally {
      setResolving(null)
    }
  }

  const typeColor: Record<string, string> = {
    duplicate_invoice: 'bg-orange-100 text-orange-700',
    new_vendor_large_payment: 'bg-red-100 text-red-700',
    round_dollar_anomaly: 'bg-yellow-100 text-yellow-700',
    velocity_spike: 'bg-purple-100 text-purple-700',
  }

  return (
    <div className="p-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl font-semibold text-[#0b1c30]">Insider Risk</h1>
          <p className="mt-2 text-sm text-slate-500">
            Detects internal AP fraud patterns — duplicate invoices, suspicious new-vendor payments, and payment velocity anomalies.
          </p>
        </div>
        <button
          onClick={runScan}
          disabled={scanning}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-br from-[#003ec7] to-[#0052ff] rounded-xl hover:opacity-90 disabled:opacity-60 shadow-lg shadow-blue-500/20"
        >
          <RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
          {scanning ? 'Scanning...' : 'Run Scan Now'}
        </button>
      </div>

      {scanResult && (
        <div className={`mb-6 rounded-xl px-5 py-4 border ${
          scanResult.totalFlags > 0
            ? 'bg-orange-50 border-orange-200'
            : 'bg-green-50 border-green-200'
        }`}>
          {scanResult.totalFlags > 0 ? (
            <p className="text-sm font-medium text-orange-800">
              Scan complete — {scanResult.totalFlags} new flag{scanResult.totalFlags !== 1 ? 's' : ''} created.
              {scanResult.patterns.length > 0 && (
                <span className="text-orange-600"> Patterns: {scanResult.patterns.join(', ')}.</span>
              )}
            </p>
          ) : (
            <p className="text-sm font-medium text-green-800">Scan complete — no new insider risk patterns detected.</p>
          )}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Pattern legend */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {Object.entries(TYPE_LABELS).map(([type, label]) => (
          <div key={type} className="bg-white rounded-xl border border-gray-200 px-4 py-3">
            <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-1 ${typeColor[type] ?? 'bg-gray-100 text-gray-600'}`}>
              {label}
            </span>
            <p className="text-lg font-bold text-gray-900">
              {alerts.filter(a => a.type === type).length}
            </p>
            <p className="text-xs text-gray-400">{filter} alerts</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5">
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

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 bg-white rounded-xl animate-pulse" />
          ))}
        </div>
      ) : alerts.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <AlertTriangle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No insider risk alerts {filter !== 'all' ? `(${filter})` : ''}</p>
          <p className="text-gray-400 text-xs mt-1">Run a scan to check for patterns across all clients.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map(alert => (
            <div
              key={alert.id}
              className={`bg-white rounded-xl border p-5 ${
                alert.severity === 'high' ? 'border-orange-200' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeColor[alert.type] ?? 'bg-gray-100 text-gray-600'}`}>
                      {TYPE_LABELS[alert.type] ?? alert.type}
                    </span>
                    <span className={`text-xs font-semibold uppercase ${
                      alert.severity === 'high' ? 'text-orange-600' : 'text-yellow-600'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#0b1c30]">{alert.title}</h3>
                  <p className="text-sm text-slate-600 mt-1 leading-snug">{alert.description}</p>

                  {(alert.expectedValue || alert.actualValue) && (
                    <div className="mt-2 grid grid-cols-2 gap-3">
                      {alert.expectedValue && (
                        <div className="bg-green-50 rounded-lg px-3 py-2">
                          <p className="text-xs text-green-600 font-medium mb-0.5">Expected</p>
                          <p className="text-xs text-green-800">{alert.expectedValue}</p>
                        </div>
                      )}
                      {alert.actualValue && (
                        <div className="bg-orange-50 rounded-lg px-3 py-2">
                          <p className="text-xs text-orange-600 font-medium mb-0.5">Actual</p>
                          <p className="text-xs text-orange-800">{alert.actualValue}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                    <span>{alert.client.name}</span>
                    <span>{alert.invoice.vendor?.displayName ?? 'Unknown vendor'}</span>
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
                      Safe
                    </button>
                    <button
                      onClick={() => resolve(alert.id, 'confirmed_fraud')}
                      disabled={resolving === alert.id}
                      className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Flag
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
