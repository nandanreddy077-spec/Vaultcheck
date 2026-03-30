'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, Shield, Clock } from 'lucide-react'

interface RiskFactor {
  factor: string
  weight: number
  detail: string
}

interface Alert {
  id: string
  severity: string
  type: string
  title: string
  description: string
  status: string
  expectedValue: string | null
  actualValue: string | null
  createdAt: string
}

interface Invoice {
  id: string
  invoiceNumber: string | null
  amount: number
  currency: string
  dueDate: string | null
  senderEmail: string | null
  status: string
  riskScore: number
  riskFactors: RiskFactor[] | null
  scanResult: { classification: string; recommendation: string } | null
  scannedAt: string | null
  decidedAt: string | null
  createdAt: string
  vendor: { id: string; displayName: string; email: string | null } | null
  client: { id: string; name: string }
  alerts: Alert[]
}

function riskBadgeClass(score: number): string {
  if (score <= 15) return 'risk-badge-low'
  if (score <= 35) return 'risk-badge-moderate'
  if (score <= 65) return 'risk-badge-high'
  return 'risk-badge-critical'
}

function riskLabel(score: number): string {
  if (score <= 15) return 'Low'
  if (score <= 35) return 'Moderate'
  if (score <= 65) return 'High'
  return 'Critical'
}

function factorLabel(factor: string): string {
  const labels: Record<string, string> = {
    bank_account_changed: 'Bank Account Changed',
    email_domain_mismatch: 'Email Domain Mismatch',
    amount_extreme_high: 'Amount Anomaly (Extreme)',
    amount_moderate_high: 'Amount Anomaly (Moderate)',
    new_vendor_no_history: 'New Vendor — No History',
    invoice_pattern_mismatch: 'Invoice Number Pattern Mismatch',
    frequency_anomaly: 'Billing Frequency Anomaly',
    confidence_penalty: 'Low Data Confidence',
  }
  return labels[factor] ?? factor
}

function factorSeverityColor(weight: number): string {
  if (weight >= 40) return 'border-l-red-500 bg-red-50'
  if (weight >= 20) return 'border-l-orange-500 bg-orange-50'
  if (weight >= 10) return 'border-l-yellow-500 bg-yellow-50'
  return 'border-l-gray-300 bg-gray-50'
}

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<'approve' | 'reject' | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/invoices/${params.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error)
        else setInvoice(data)
      })
      .catch(() => setError('Failed to load invoice'))
      .finally(() => setLoading(false))
  }, [params.id])

  async function approve() {
    if (!invoice) return
    setActing('approve')
    const res = await fetch(`/api/invoices/${invoice.id}/approve`, { method: 'POST' })
    if (res.ok) {
      setInvoice(prev => prev ? { ...prev, status: 'approved' } : prev)
    }
    setActing(null)
  }

  async function reject() {
    if (!invoice) return
    setActing('reject')
    const res = await fetch(`/api/invoices/${invoice.id}/reject`, { method: 'POST' })
    if (res.ok) {
      setInvoice(prev => prev ? { ...prev, status: 'rejected' } : prev)
    }
    setActing(null)
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64" />
          <div className="h-48 bg-gray-200 rounded" />
          <div className="h-48 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  if (error || !invoice) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700">{error ?? 'Invoice not found'}</p>
          <Link href="/dashboard/alerts" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
            Back to alerts
          </Link>
        </div>
      </div>
    )
  }

  const isDecided = ['approved', 'rejected', 'paid'].includes(invoice.status)
  const riskFactors = invoice.riskFactors ?? []

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              Invoice {invoice.invoiceNumber ? `#${invoice.invoiceNumber}` : '(No number)'}
            </h1>
            {invoice.scannedAt && (
              <span className={riskBadgeClass(invoice.riskScore)}>
                {riskLabel(invoice.riskScore)} Risk
              </span>
            )}
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
              invoice.status === 'approved' ? 'bg-green-100 text-green-700' :
              invoice.status === 'rejected' ? 'bg-red-100 text-red-700' :
              invoice.status === 'paid' ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-600'
            }`}>
              {invoice.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            <Link href={`/dashboard/clients/${invoice.client.id}`} className="hover:text-blue-600">
              {invoice.client.name}
            </Link>
            {invoice.vendor && (
              <> · <Link href={`/dashboard/vendors/${invoice.vendor.id}`} className="hover:text-blue-600">
                {invoice.vendor.displayName}
              </Link></>
            )}
          </p>
        </div>

        {/* Action buttons */}
        {!isDecided && (
          <div className="flex items-center gap-2">
            <button
              onClick={reject}
              disabled={acting !== null}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              {acting === 'reject' ? 'Rejecting…' : 'Reject'}
            </button>
            <button
              onClick={approve}
              disabled={acting !== null}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              {acting === 'approve' ? 'Approving…' : 'Approve'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Invoice details */}
        <div className="col-span-1 bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Invoice Details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Amount</span>
              <span className="font-semibold text-gray-900">
                ${invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {invoice.currency}
              </span>
            </div>
            {invoice.dueDate && (
              <div className="flex justify-between">
                <span className="text-gray-500">Due Date</span>
                <span className="text-gray-700">{new Date(invoice.dueDate).toLocaleDateString()}</span>
              </div>
            )}
            {invoice.senderEmail && (
              <div className="flex justify-between gap-4">
                <span className="text-gray-500 shrink-0">Sender Email</span>
                <span className="text-gray-700 text-right break-all">{invoice.senderEmail}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Created</span>
              <span className="text-gray-700">{new Date(invoice.createdAt).toLocaleDateString()}</span>
            </div>
            {invoice.scannedAt && (
              <div className="flex justify-between">
                <span className="text-gray-500">Scanned</span>
                <span className="text-gray-700">{new Date(invoice.scannedAt).toLocaleDateString()}</span>
              </div>
            )}
            {invoice.decidedAt && (
              <div className="flex justify-between">
                <span className="text-gray-500">Decided</span>
                <span className="text-gray-700">{new Date(invoice.decidedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Risk score */}
        <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-500" />
            Scan Result
          </h2>
          {invoice.scannedAt ? (
            <>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl font-bold text-gray-900">{invoice.riskScore}</div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{riskLabel(invoice.riskScore)} Risk</p>
                  <p className="text-xs text-gray-500 mt-0.5 max-w-sm">
                    {invoice.scanResult?.recommendation}
                  </p>
                </div>
              </div>
              {/* Score bar */}
              <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                <div
                  className={`h-2 rounded-full ${
                    invoice.riskScore <= 15 ? 'bg-green-500' :
                    invoice.riskScore <= 35 ? 'bg-yellow-500' :
                    invoice.riskScore <= 65 ? 'bg-orange-500' : 'bg-red-600'
                  }`}
                  style={{ width: `${invoice.riskScore}%` }}
                />
              </div>
              {riskFactors.length > 0 ? (
                <div className="space-y-2">
                  {riskFactors.map((rf, i) => (
                    <div key={i} className={`border-l-4 rounded-r-md px-3 py-2 ${factorSeverityColor(rf.weight)}`}>
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-gray-700">{factorLabel(rf.factor)}</p>
                        <span className="text-xs font-bold text-gray-500">+{rf.weight} pts</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">{rf.detail}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No risk factors detected.</p>
              )}
            </>
          ) : (
            <div className="flex items-center gap-3 text-gray-400">
              <Clock className="w-5 h-5" />
              <p className="text-sm">This invoice has not been scanned yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Open alerts */}
      {invoice.alerts.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <h2 className="font-semibold text-gray-900">Alerts ({invoice.alerts.length})</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {invoice.alerts.map(alert => (
              <div key={alert.id} className="px-6 py-4">
                <div className="flex items-start gap-3">
                  <div className={`mt-1 severity-dot-${alert.severity}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">{alert.title}</p>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium capitalize ${
                        alert.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {alert.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                    {(alert.expectedValue || alert.actualValue) && (
                      <div className="flex gap-6 mt-2 text-xs">
                        {alert.expectedValue && (
                          <div>
                            <span className="text-gray-400">Expected: </span>
                            <span className="text-gray-700 font-mono">{alert.expectedValue}</span>
                          </div>
                        )}
                        {alert.actualValue && (
                          <div>
                            <span className="text-gray-400">Actual: </span>
                            <span className="text-gray-700 font-mono">{alert.actualValue}</span>
                          </div>
                        )}
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{new Date(alert.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 mt-6 border-t border-gray-100 pt-4">
        Vantirs provides payment verification assistance. It does not guarantee fraud detection.
        Always verify suspicious payments through direct phone contact with known vendor numbers.
      </p>
    </div>
  )
}
