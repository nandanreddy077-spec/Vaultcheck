import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react'

const syncIcons: Record<string, React.ReactNode> = {
  synced: <CheckCircle className="w-4 h-4 text-green-500" />,
  syncing: <Clock className="w-4 h-4 text-blue-500 animate-spin" />,
  error: <XCircle className="w-4 h-4 text-red-500" />,
  pending: <Clock className="w-4 h-4 text-gray-400" />,
}

export default async function ClientsPage() {
  const { dbUser, error } = await requireAuth()
  if (error || !dbUser) redirect('/login')

  const clients = await prisma.client.findMany({
    where: { firmId: dbUser.firmId, isActive: true },
    include: {
      _count: { select: { vendors: true, invoices: true, alerts: true } },
    },
    orderBy: { name: 'asc' },
  })

  const openAlertsByClient = await prisma.alert.groupBy({
    by: ['clientId'],
    where: { client: { firmId: dbUser.firmId }, status: 'open' },
    _count: { _all: true },
  })
  const alertMap = Object.fromEntries(openAlertsByClient.map(a => [a.clientId, a._count._all]))

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-sm text-gray-500 mt-1">
            {clients.length} of {dbUser.firm.maxClients} clients used
          </p>
        </div>
        {dbUser.role === 'admin' && (
          <Link
            href="/dashboard/clients/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Client
          </Link>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QBO Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendors</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoices</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Open Alerts</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Sync</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {clients.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-400">
                  No clients yet.{' '}
                  <Link href="/dashboard/clients/new" className="text-blue-600 hover:underline">
                    Add your first client
                  </Link>
                </td>
              </tr>
            ) : (
              clients.map(client => {
                const openAlerts = alertMap[client.id] || 0
                return (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{client.name}</p>
                        {client.qboRealmId && (
                          <p className="text-xs text-gray-400">QBO: {client.qboRealmId}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {syncIcons[client.syncStatus] || syncIcons.pending}
                        <span className="text-sm text-gray-600 capitalize">{client.syncStatus}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{client._count.vendors}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{client._count.invoices}</td>
                    <td className="px-6 py-4">
                      {openAlerts > 0 ? (
                        <span className="risk-badge-high">{openAlerts} open</span>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {client.lastSyncAt
                        ? new Date(client.lastSyncAt).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/dashboard/clients/${client.id}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
