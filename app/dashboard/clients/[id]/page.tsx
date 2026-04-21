import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ConnectQBOButton from '@/components/ConnectQBOButton'
import ConnectXeroButton from '@/components/ConnectXeroButton'
import SyncButton from '@/components/SyncButton'
import XeroSyncButton from '@/components/XeroSyncButton'

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

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { dbUser, error } = await requireAuth()
  if (error || !dbUser) redirect('/login')

  const client = await prisma.client.findFirst({
    where: { id: id, firmId: dbUser.firmId },
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
  const isXeroConnected = !!client.xeroTenantId && !!client.xeroAccessToken
  const qboConnectUrl = `/api/qbo/connect?clientId=${client.id}`
  const xeroConnectUrl = `/api/xero/connect?clientId=${client.id}`

  return (
    <div className="p-10">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/clients" className="text-slate-400 hover:text-slate-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-4xl font-semibold text-[#0b1c30]">{client.name}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
            <p className="text-sm text-slate-500">
              {isQBOConnected ? (
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  QuickBooks connected · Realm {client.qboRealmId}
                </span>
              ) : (
                'QuickBooks not connected'
              )}
            </p>
            <p className="text-sm text-slate-500">
              {isXeroConnected ? (
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  Xero connected · Tenant {client.xeroTenantId?.slice(0, 8)}…
                </span>
              ) : (
                'Xero not connected'
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isQBOConnected ? (
            <SyncButton clientId={client.id} />
          ) : (
            <ConnectQBOButton href={qboConnectUrl} />
          )}
          {isXeroConnected ? (
            <XeroSyncButton clientId={client.id} />
          ) : (
            <ConnectXeroButton href={xeroConnectUrl} />
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <div className="surface-panel p-5">
          <p className="text-[11px] text-slate-500 uppercase tracking-[0.08em]">Vendors Tracked</p>
          <p className="text-3xl font-semibold text-[#0b1c30] mt-1">{client.vendors.length}</p>
        </div>
        <div className="surface-panel p-5">
          <p className="text-[11px] text-slate-500 uppercase tracking-[0.08em]">Invoices</p>
          <p className="text-3xl font-semibold text-[#0b1c30] mt-1">{client.invoices.length}</p>
        </div>
        <div className="surface-panel p-5">
          <p className="text-[11px] text-slate-500 uppercase tracking-[0.08em]">Open Alerts</p>
          <p className={`text-3xl font-semibold mt-1 ${client.alerts.length > 0 ? 'text-orange-600' : 'text-[#0b1c30]'}`}>
            {client.alerts.length}
          </p>
        </div>
        <div className="surface-panel p-5">
          <p className="text-[11px] text-slate-500 uppercase tracking-[0.08em]">Sync Status</p>
          <div className="mt-1 space-y-1">
            {isQBOConnected && (
              <p className="text-sm font-medium text-[#0b1c30] capitalize">QBO: {client.syncStatus}</p>
            )}
            {isXeroConnected && (
              <p className="text-sm font-medium text-[#0b1c30] capitalize">Xero: {client.xeroSyncStatus}</p>
            )}
            {!isQBOConnected && !isXeroConnected && (
              <p className="text-3xl font-semibold text-[#0b1c30] capitalize">{client.syncStatus}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <div className="surface-panel">
          <div className="px-6 py-5">
            <h2 className="font-semibold text-[#0b1c30] text-xl">Recent Invoices</h2>
          </div>
          <div className="space-y-3 px-4 pb-4 max-h-96 overflow-y-auto">
            {client.invoices.length === 0 ? (
              <p className="px-6 py-8 text-sm text-slate-400 text-center">
                {isQBOConnected || isXeroConnected
                  ? 'No invoices synced yet. Run a sync.'
                  : 'Connect QuickBooks or Xero to import invoices.'}
              </p>
            ) : (
              client.invoices.map(inv => (
                <Link key={inv.id} href={`/dashboard/invoices/${inv.id}`} className="px-4 py-4 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] flex items-center gap-3 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0b1c30] truncate">
                      {inv.vendor?.displayName || 'Unknown vendor'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {inv.invoiceNumber && `#${inv.invoiceNumber} · `}
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-[#0b1c30]">${inv.amount.toLocaleString()}</p>
                  {inv.scannedAt ? (
                    <span className={riskBadgeClass(inv.riskScore)}>
                      {riskLabel(inv.riskScore)}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                      Pending
                    </span>
                  )}
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Open Alerts */}
        <div className="surface-panel">
          <div className="flex items-center justify-between px-6 py-5">
            <h2 className="font-semibold text-[#0b1c30] text-xl">Open Alerts</h2>
            <Link href={`/dashboard/alerts?clientId=${client.id}`} className="text-sm text-[#003ec7] hover:text-[#0052ff]">
              View all
            </Link>
          </div>
          <div className="space-y-3 px-4 pb-4 max-h-96 overflow-y-auto">
            {client.alerts.length === 0 ? (
              <p className="px-6 py-8 text-sm text-slate-400 text-center">No open alerts</p>
            ) : (
              client.alerts.map(alert => (
                <div key={alert.id} className="px-4 py-4 rounded-xl bg-[#eff4ff]">
                  <div className="flex items-start gap-2">
                    <div className={`mt-1.5 severity-dot-${alert.severity}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#0b1c30]">{alert.title}</p>
                      <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{alert.description}</p>
                      <p className="text-xs text-slate-500 mt-1">
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
      <div className="surface-panel mt-6">
        <div className="px-6 py-5">
          <h2 className="font-semibold text-[#0b1c30] text-xl">Vendors ({client.vendors.length})</h2>
        </div>
        <div className="space-y-3 px-4 pb-4">
          {client.vendors.length === 0 ? (
            <p className="px-6 py-8 text-sm text-slate-400 text-center">No vendors synced yet.</p>
          ) : (
            client.vendors.slice(0, 10).map(vendor => (
              <Link key={vendor.id} href={`/dashboard/vendors/${vendor.id}`} className="px-4 py-4 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] flex items-center gap-4 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[#0b1c30]">{vendor.displayName}</p>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                      vendor.platform === 'xero'
                        ? 'bg-[#13B5EA]/10 text-[#13B5EA]'
                        : 'bg-[#2CA01C]/10 text-[#2CA01C]'
                    }`}>
                      {vendor.platform === 'xero' ? 'Xero' : 'QBO'}
                    </span>
                  </div>
                  {vendor.email && (
                    <p className="text-xs text-slate-500">{vendor.email}</p>
                  )}
                </div>
                {vendor.fingerprint ? (
                  <div className="text-right">
                    <p className="text-xs text-slate-600">
                      Avg ${vendor.fingerprint.avgAmount.toLocaleString()} · {vendor.fingerprint.totalInvoices} invoices
                    </p>
                    <p className="text-xs text-slate-500">
                      Confidence: {(vendor.fingerprint.confidenceScore * 100).toFixed(0)}%
                    </p>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">No fingerprint</span>
                )}
              </Link>
            ))
          )}
          {client.vendors.length > 10 && (
            <p className="px-6 py-3 text-sm text-slate-400 text-center">
              +{client.vendors.length - 10} more vendors
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
