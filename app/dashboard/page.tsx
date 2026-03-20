import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, AlertTriangle, FileText, TrendingUp, Plus } from 'lucide-react'

export default async function DashboardPage() {
  const { dbUser, error } = await requireAuth()
  if (error || !dbUser) redirect('/login')

  const [clients, openAlerts, scannedThisMonth, criticalAlerts] = await Promise.all([
    prisma.client.findMany({
      where: { firmId: dbUser.firmId, isActive: true },
      include: { _count: { select: { invoices: true, alerts: true } } },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.alert.count({
      where: { client: { firmId: dbUser.firmId }, status: 'open' },
    }),
    prisma.invoice.count({
      where: {
        client: { firmId: dbUser.firmId },
        createdAt: { gte: new Date(new Date().setDate(1)) },
      },
    }),
    prisma.alert.findMany({
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
    }),
  ])

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
          <p className="text-sm text-gray-500 mt-1">{dbUser.firm.name}</p>
        </div>
        <Link
          href="/dashboard/clients/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Client
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard title="Active Clients" value={clients.length} icon={<Users className="w-5 h-5 text-blue-600" />} />
        <StatCard title="Invoices This Month" value={scannedThisMonth} icon={<FileText className="w-5 h-5 text-gray-500" />} />
        <StatCard
          title="Open Alerts"
          value={openAlerts}
          icon={<AlertTriangle className="w-5 h-5 text-orange-500" />}
          highlight={openAlerts > 0}
        />
        <StatCard title="Clients on Trial" value={clients.length} icon={<TrendingUp className="w-5 h-5 text-green-500" />} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Critical Alerts */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Critical & High Alerts</h2>
            <Link href="/dashboard/alerts" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {criticalAlerts.length === 0 ? (
              <p className="px-6 py-8 text-sm text-gray-400 text-center">No open critical alerts</p>
            ) : (
              criticalAlerts.map(alert => (
                <div key={alert.id} className="px-6 py-3 flex items-start gap-3">
                  <div className={`mt-1 severity-dot-${alert.severity}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{alert.title}</p>
                    <p className="text-xs text-gray-500">
                      {alert.client.name} · {alert.invoice.vendor?.displayName || 'Unknown vendor'}
                      {' · '}${alert.invoice.amount.toLocaleString()}
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
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Client Health</h2>
            <Link href="/dashboard/clients" className="text-sm text-blue-600 hover:underline">Manage</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {clients.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <p className="text-sm text-gray-400 mb-3">No clients yet</p>
                <Link href="/dashboard/clients/new" className="text-sm text-blue-600 hover:underline">
                  Add your first client →
                </Link>
              </div>
            ) : (
              clients.map(client => (
                <Link
                  key={client.id}
                  href={`/dashboard/clients/${client.id}`}
                  className="px-6 py-3 flex items-center justify-between hover:bg-gray-50"
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
    <div className={`bg-white rounded-lg border p-6 ${highlight ? 'border-orange-200 bg-orange-50' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-500">{title}</p>
        {icon}
      </div>
      <p className={`text-3xl font-bold ${highlight ? 'text-orange-700' : 'text-gray-900'}`}>
        {value}
      </p>
    </div>
  )
}
