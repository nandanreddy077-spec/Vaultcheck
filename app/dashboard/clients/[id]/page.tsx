import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ConnectQBOButton from '@/components/ConnectQBOButton'
import SyncButton from '@/components/SyncButton'

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

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const { dbUser, error } = await requireAuth()
  if (error || !dbUser) redirect('/login')

  const client = await prisma.client.findFirst({
    where: { id: params.id, firmId: dbUser.firmId },
    include: {
      vendors: {
        include: { fingerprint: true },
        orderBy: { displayName: 'asc' },
      },
      invoices: {
        include: { vendor: true, alerts: { where: { status: 'open' } } },
        orderBy: { createdAt: 'desc' },
        take: 30,
      },
      alerts: {
        where: { status: 'open' },
        include: { invoice: true },
        orderBy: [{ severity: 'asc' }, { createdAt: 'desc' }],
      },
    },
  })

  if (!client) notFound()

  const isQBOConnected = !!client.qboRealmId && !!client.qboAccessToken
  const qboConnectUrl = `/api/qbo/connect?clientId=${client.id}`

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/clients" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isQBOConnected ? `QuickBooks connected · Realm ${client.qboRealmId}` : 'QuickBooks not connected'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isQBOConnected ? (
            <SyncButton clientId={client.id} />
          ) : (
            <ConnectQBOButton href={qboConnectUrl} />
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Vendors Tracked</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{client.vendors.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Invoices</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{client.invoices.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Open Alerts</p>
          <p className={`text-2xl font-bold mt-1 ${client.alerts.length > 0 ? 'text-orange-600' : 'text-gray-900'}`}>
            {client.alerts.length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Sync Status</p>
          <p className="text-2xl font-bold text-gray-900 mt-1 capitalize">{client.syncStatus}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Invoices</h2>
          </div>
          <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
            {client.invoices.length === 0 ? (
              <p className="px-6 py-8 text-sm text-gray-400 text-center">
                {isQBOConnected ? 'No invoices synced yet. Run a sync.' : 'Connect QuickBooks to import invoices.'}
              </p>
            ) : (
              client.invoices.map(inv => (
                <Link key={inv.id} href={`/dashboard/invoices/${inv.id}`} className="px-6 py-3 flex items-center gap-3 hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {inv.vendor?.displayName || 'Unknown vendor'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {inv.invoiceNumber && `#${inv.invoiceNumber} · `}
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">${inv.amount.toLocaleString()}</p>
                  {inv.scannedAt ? (
                    <span className={riskBadgeClass(inv.riskScore)}>
                      {riskLabel(inv.riskScore)}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                      Pending
                    </span>
                  )}
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Open Alerts */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Open Alerts</h2>
            <Link href={`/dashboard/alerts?clientId=${client.id}`} className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
            {client.alerts.length === 0 ? (
              <p className="px-6 py-8 text-sm text-gray-400 text-center">No open alerts</p>
            ) : (
              client.alerts.map(alert => (
                <div key={alert.id} className="px-6 py-3">
                  <div className="flex items-start gap-2">
                    <div className={`mt-1.5 severity-dot-${alert.severity}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{alert.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        ${alert.invoice.amount.toLocaleString()} · {new Date(alert.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`risk-badge-${alert.severity === 'critical' ? 'critical' : alert.severity === 'high' ? 'high' : 'moderate'}`}>
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Vendor List */}
      <div className="bg-white rounded-lg border border-gray-200 mt-6">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Vendors ({client.vendors.length})</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {client.vendors.length === 0 ? (
            <p className="px-6 py-8 text-sm text-gray-400 text-center">No vendors synced yet.</p>
          ) : (
            client.vendors.slice(0, 10).map(vendor => (
              <Link key={vendor.id} href={`/dashboard/vendors/${vendor.id}`} className="px-6 py-3 flex items-center gap-4 hover:bg-gray-50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{vendor.displayName}</p>
                  {vendor.email && (
                    <p className="text-xs text-gray-400">{vendor.email}</p>
                  )}
                </div>
                {vendor.fingerprint ? (
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      Avg ${vendor.fingerprint.avgAmount.toLocaleString()} · {vendor.fingerprint.totalInvoices} invoices
                    </p>
                    <p className="text-xs text-gray-400">
                      Confidence: {(vendor.fingerprint.confidenceScore * 100).toFixed(0)}%
                    </p>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">No fingerprint</span>
                )}
              </Link>
            ))
          )}
          {client.vendors.length > 10 && (
            <p className="px-6 py-3 text-sm text-gray-400 text-center">
              +{client.vendors.length - 10} more vendors
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
