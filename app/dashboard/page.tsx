import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, AlertTriangle, FileText, TrendingUp, Plus } from 'lucide-react'
import * as Sentry from '@sentry/nextjs'

const OVERVIEW_QUERY_TIMEOUT_MS = 4000

function withTimeout<T>(promise: Promise<T>, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Dashboard overview query timed out: ${label}`))
    }, OVERVIEW_QUERY_TIMEOUT_MS)

    promise
      .then(value => {
        clearTimeout(timer)
        resolve(value)
      })
      .catch(error => {
        clearTimeout(timer)
        reject(error)
      })
  })
}

export default async function DashboardPage() {
  const { dbUser, error } = await requireAuth()
  if (error || !dbUser) redirect('/login')

  const firmName = dbUser.firm?.name || 'Your firm'

  // Defensive defaults: if any relation is missing or the DB query fails,
  // we should not crash the whole dashboard (which triggers the error screen).
  let clients: any[] = []
  let openAlerts = 0
  let scannedThisMonth = 0
  let criticalAlerts: any[] = []
  let highRiskCount = 0

  const results = await Promise.allSettled([
    withTimeout(prisma.client.findMany({
        where: { firmId: dbUser.firmId, isActive: true },
        include: { _count: { select: { invoices: true, alerts: true } } },
        orderBy: { updatedAt: 'desc' },
      }), 'clients'),
    withTimeout(prisma.alert.count({
        where: { client: { firmId: dbUser.firmId }, status: 'open' },
      }), 'open-alert-count'),
    withTimeout(prisma.invoice.count({
        where: {
          client: { firmId: dbUser.firmId },
          createdAt: { gte: new Date(new Date().setDate(1)) },
        },
      }), 'monthly-invoice-count'),
    withTimeout(prisma.alert.findMany({
        where: {
          client: { firmId: dbUser.firmId },
          status: 'open',
          severity: { in: ['critical', 'high'] },
        },
        include: {
          invoice: { include: { vendor: true } },
          client: { select: { name: true } },
        },
        orderBy: [{ severity: 'asc' }, { createdAt: 'desc' }],
        take: 10,
      }), 'critical-alerts'),
    withTimeout(prisma.invoice.count({
        where: {
          client: { firmId: dbUser.firmId },
          riskScore: { gte: 36 },
          createdAt: { gte: new Date(new Date().setDate(1)) },
        },
      }), 'high-risk-count'),
  ])

  if (results[0].status === 'fulfilled') {
    clients = results[0].value
  } else {
    Sentry.captureException(results[0].reason)
  }

  if (results[1].status === 'fulfilled') {
    openAlerts = results[1].value
  } else {
    Sentry.captureException(results[1].reason)
  }

  if (results[2].status === 'fulfilled') {
    scannedThisMonth = results[2].value
  } else {
    Sentry.captureException(results[2].reason)
  }

  if (results[3].status === 'fulfilled') {
    criticalAlerts = results[3].value
  } else {
    Sentry.captureException(results[3].reason)
  }

  if (results[4].status === 'fulfilled') {
    highRiskCount = results[4].value
  } else {
    Sentry.captureException(results[4].reason)
  }

  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-semibold text-[#0b1c30]">Security Operations</h1>
          <p className="text-sm text-slate-500 mt-2">{firmName} · Real-time invoice analysis and threat detection</p>
        </div>
        <Link
          href="/dashboard/clients/new"
          className="btn-primary-gradient gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Client
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4 mb-10">
        <StatCard title="Active Clients" value={clients.length} icon={<Users className="w-5 h-5 text-blue-600" />} />
        <StatCard title="Invoices This Month" value={scannedThisMonth} icon={<FileText className="w-5 h-5 text-gray-500" />} />
        <StatCard
          title="Open Alerts"
          value={openAlerts}
          icon={<AlertTriangle className="w-5 h-5 text-orange-500" />}
          highlight={openAlerts > 0}
        />
        <StatCard
          title="High Risk This Month"
          value={highRiskCount}
          icon={<TrendingUp className="w-5 h-5 text-red-500" />}
          highlight={highRiskCount > 0}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Critical Alerts */}
        <div className="surface-panel xl:col-span-2">
          <div className="flex items-center justify-between px-6 py-5">
            <h2 className="font-semibold text-[#0b1c30] text-xl">Critical & High Alerts</h2>
            <Link href="/dashboard/alerts" className="text-sm text-[#003ec7] hover:text-[#0052ff]">View all</Link>
          </div>
          <div className="space-y-3 px-4 pb-4">
            {criticalAlerts.length === 0 ? (
              <p className="px-6 py-8 text-sm text-slate-400 text-center">No open critical alerts</p>
            ) : (
              criticalAlerts.map(alert => (
                <div key={alert.id} className="px-4 py-4 rounded-xl bg-[#eff4ff] flex items-start gap-3">
                  <div className={`mt-1 severity-dot-${alert.severity}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0b1c30] truncate">{alert.title}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {alert.client.name} · {alert.invoice?.vendor?.displayName || 'Unknown vendor'}
                      {' · '}
                      {alert.invoice ? `$${alert.invoice.amount.toLocaleString()}` : 'Invoice unavailable'}
                    </p>
                  </div>
                  <span className={`risk-badge-${alert.severity === 'critical' ? 'critical' : 'high'}`}>
                    {alert.severity}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Client Health */}
        <div className="surface-panel">
          <div className="flex items-center justify-between px-6 py-5">
            <h2 className="font-semibold text-[#0b1c30] text-xl">Client Health</h2>
            <Link href="/dashboard/clients" className="text-sm text-[#003ec7] hover:text-[#0052ff]">Manage</Link>
          </div>
          <div className="space-y-3 px-4 pb-4">
            {clients.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <p className="text-sm text-slate-400 mb-3">No clients yet</p>
                <Link href="/dashboard/clients/new" className="text-sm text-[#003ec7] hover:text-[#0052ff]">
                  Add your first client →
                </Link>
              </div>
            ) : (
              clients.map(client => (
                <Link
                  key={client.id}
                  href={`/dashboard/clients/${client.id}`}
                  className="px-4 py-4 rounded-xl bg-[#eff4ff] flex items-center justify-between hover:bg-[#e5eeff] transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{client.name}</p>
                    <p className="text-xs text-gray-500">
                      {client._count.invoices} invoices · {client._count.alerts} alerts
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    client.syncStatus === 'synced'
                      ? 'bg-green-100 text-green-700'
                      : client.syncStatus === 'error'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {client.syncStatus}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title, value, icon, highlight = false,
}: {
  title: string; value: number; icon: React.ReactNode; highlight?: boolean
}) {
  return (
    <div className={`surface-panel p-6 ${highlight ? 'bg-orange-50' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] uppercase tracking-[0.08em] text-slate-500">{title}</p>
        {icon}
      </div>
      <p className={`text-4xl font-semibold ${highlight ? 'text-orange-700' : 'text-[#0b1c30]'}`}>
        {value}
      </p>
    </div>
  )
}
