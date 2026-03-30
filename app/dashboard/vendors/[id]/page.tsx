import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, Building2, Calendar, TrendingUp, Shield, AlertTriangle } from 'lucide-react'

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

function severityColor(severity: string): string {
  switch (severity) {
    case 'critical': return 'bg-red-100 text-red-700 border-red-200'
    case 'high': return 'bg-orange-100 text-orange-700 border-orange-200'
    case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    default: return 'bg-gray-100 text-gray-600 border-gray-200'
  }
}

export default async function VendorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { dbUser, error } = await requireAuth()
  if (error || !dbUser) redirect('/login')

  const vendor = await prisma.vendor.findFirst({
    where: { id: id, client: { firmId: dbUser.firmId } },
    include: {
      fingerprint: true,
      client: { select: { id: true, name: true } },
      invoices: {
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: { alerts: { where: { status: 'open' }, select: { id: true, severity: true } } },
      },
    },
  })

  if (!vendor) notFound()

  const alertHistory = await prisma.alert.findMany({
    where: { invoice: { vendorId: vendor.id } },
    include: { invoice: { select: { amount: true, invoiceNumber: true } } },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  const fp = vendor.fingerprint
  const paidInvoices = vendor.invoices.filter(i => i.status === 'paid')
  const totalPaid = paidInvoices.reduce((sum, i) => sum + i.amount, 0)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/vendors" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{vendor.displayName}</h1>
            {!vendor.isActive && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                Inactive
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            <Link href={`/dashboard/clients/${vendor.client.id}`} className="hover:text-blue-600">
              {vendor.client.name}
            </Link>
            {vendor.companyName && vendor.companyName !== vendor.displayName && (
              <> · {vendor.companyName}</>
            )}
          </p>
        </div>
      </div>

      {/* Vendor info + fingerprint */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Contact info */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Contact Info</h2>
          <div className="space-y-3">
            {vendor.email ? (
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-700 break-all">{vendor.email}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span className="text-sm">No email on record</span>
              </div>
            )}
            {vendor.phone ? (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="text-sm text-gray-700">{vendor.phone}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-400">
                <Phone className="w-4 h-4" />
                <span className="text-sm">No phone on record</span>
              </div>
            )}
            {vendor.companyName && (
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="text-sm text-gray-700">{vendor.companyName}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-sm text-gray-500">
                First seen {new Date(vendor.firstSeenAt).toLocaleDateString()}
              </span>
            </div>
            {vendor.lastPaymentAt && (
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="text-sm text-gray-500">
                  Last paid {new Date(vendor.lastPaymentAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Payment summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Payment Summary</h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900 mt-0.5">{vendor.invoices.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Total Paid</p>
              <p className="text-2xl font-bold text-gray-900 mt-0.5">
                ${totalPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
            {fp && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Avg Invoice</p>
                <p className="text-lg font-semibold text-gray-900 mt-0.5">
                  ${fp.avgAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  <span className="text-sm font-normal text-gray-400 ml-1">
                    ±${fp.stdDevAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </p>
              </div>
            )}
            {fp && fp.avgFreqDays && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Billing Frequency</p>
                <p className="text-sm text-gray-700 mt-0.5">~every {Math.round(fp.avgFreqDays)} days</p>
              </div>
            )}
          </div>
        </div>

        {/* Fingerprint confidence */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-500" />
            Fingerprint
          </h2>
          {fp ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-gray-500">Confidence</p>
                  <p className="text-xs font-semibold text-gray-700">{(fp.confidenceScore * 100).toFixed(0)}%</p>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      fp.confidenceScore >= 0.7 ? 'bg-green-500' :
                      fp.confidenceScore >= 0.4 ? 'bg-yellow-500' : 'bg-red-400'
                    }`}
                    style={{ width: `${(fp.confidenceScore * 100).toFixed(0)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Based on {fp.totalInvoices} invoices
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Amount Range</p>
                <p className="text-sm text-gray-700">
                  ${fp.minAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  {' – '}
                  ${fp.maxAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>

              {fp.knownEmails.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Known Emails</p>
                  <div className="space-y-0.5">
                    {fp.knownEmails.slice(0, 3).map((email, i) => (
                      <p key={i} className="text-xs text-gray-600 font-mono truncate">{email}</p>
                    ))}
                    {fp.knownEmails.length > 3 && (
                      <p className="text-xs text-gray-400">+{fp.knownEmails.length - 3} more</p>
                    )}
                  </div>
                </div>
              )}

              {fp.knownBankHashes.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Known Bank Accounts</p>
                  <p className="text-xs text-gray-600">{fp.knownBankHashes.length} account(s) on file</p>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-400">
                  Last updated {new Date(fp.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-24 text-center">
              <p className="text-sm text-gray-400">No fingerprint yet</p>
              <p className="text-xs text-gray-400 mt-1">Requires 3+ paid invoices</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Invoice history */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Invoice History</h2>
          </div>
          <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
            {vendor.invoices.length === 0 ? (
              <p className="px-6 py-8 text-sm text-gray-400 text-center">No invoices yet</p>
            ) : (
              vendor.invoices.map(inv => (
                <Link
                  key={inv.id}
                  href={`/dashboard/invoices/${inv.id}`}
                  className="px-6 py-3 flex items-center gap-3 hover:bg-gray-50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      {inv.invoiceNumber ? `#${inv.invoiceNumber}` : 'No invoice number'}
                    </p>
                    <p className="text-xs text-gray-400">{new Date(inv.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    ${inv.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  {inv.scannedAt ? (
                    <span className={riskBadgeClass(inv.riskScore)}>
                      {riskLabel(inv.riskScore)}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                      {inv.status}
                    </span>
                  )}
                  {inv.alerts.length > 0 && (
                    <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0" />
                  )}
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Alert history */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Alert History</h2>
          </div>
          <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
            {alertHistory.length === 0 ? (
              <p className="px-6 py-8 text-sm text-gray-400 text-center">No alerts for this vendor</p>
            ) : (
              alertHistory.map(alert => (
                <div key={alert.id} className="px-6 py-3">
                  <div className="flex items-start gap-2">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${severityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 leading-tight">{alert.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{alert.description}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        <span>${alert.invoice.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        <span>{new Date(alert.createdAt).toLocaleDateString()}</span>
                        <span className={`${alert.status === 'resolved' ? 'text-green-600' : 'text-orange-600'}`}>
                          {alert.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
