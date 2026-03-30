import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, CheckCircle, Clock, XCircle } from 'lucide-react'

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
    <div className="p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-semibold text-[#0b1c30]">Clients</h1>
          <p className="text-sm text-slate-500 mt-2">
            {clients.length} of {dbUser.firm.maxClients} clients used
          </p>
        </div>
        {dbUser.role === 'admin' && (
          <Link
            href="/dashboard/clients/new"
            className="btn-primary-gradient gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Client
          </Link>
        )}
      </div>

      <div className="surface-panel overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-[#eff4ff]">
            <tr>
              <th className="px-6 py-4 text-left text-[11px] font-medium text-slate-500 uppercase tracking-[0.08em]">Client</th>
              <th className="px-6 py-4 text-left text-[11px] font-medium text-slate-500 uppercase tracking-[0.08em]">QBO Status</th>
              <th className="px-6 py-4 text-left text-[11px] font-medium text-slate-500 uppercase tracking-[0.08em]">Vendors</th>
              <th className="px-6 py-4 text-left text-[11px] font-medium text-slate-500 uppercase tracking-[0.08em]">Invoices</th>
              <th className="px-6 py-4 text-left text-[11px] font-medium text-slate-500 uppercase tracking-[0.08em]">Open Alerts</th>
              <th className="px-6 py-4 text-left text-[11px] font-medium text-slate-500 uppercase tracking-[0.08em]">Last Sync</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-400">
                  No clients yet.{' '}
                  <Link href="/dashboard/clients/new" className="text-[#003ec7] hover:text-[#0052ff]">
                    Add your first client
                  </Link>
                </td>
              </tr>
            ) : (
              clients.map(client => {
                const openAlerts = alertMap[client.id] || 0
                return (
                  <tr key={client.id} className="odd:bg-white even:bg-[#f8f9ff] hover:bg-[#eff4ff] transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-[#0b1c30]">{client.name}</p>
                        {client.qboRealmId && (
                          <p className="text-xs text-slate-400">QBO: {client.qboRealmId}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {syncIcons[client.syncStatus] || syncIcons.pending}
                        <span className="text-sm text-slate-600 capitalize">{client.syncStatus}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{client._count.vendors}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{client._count.invoices}</td>
                    <td className="px-6 py-4">
                      {openAlerts > 0 ? (
                        <span className="risk-badge-high">{openAlerts} open</span>
                      ) : (
                        <span className="text-sm text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {client.lastSyncAt
                        ? new Date(client.lastSyncAt).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/dashboard/clients/${client.id}`}
                        className="text-sm text-[#003ec7] hover:text-[#0052ff]"
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
