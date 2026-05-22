import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, Download, Shield, ExternalLink } from 'lucide-react'
import InsiderRiskScanButton from './InsiderRiskScanButton'

export default async function ReportsPage() {
  const { dbUser, error } = await requireAuth()
  if (error || !dbUser) redirect('/login')

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthLabel = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const clients = await prisma.client.findMany({
    where: { firmId: dbUser.firmId, isActive: true },
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          alerts: { where: { status: 'open' } },
          invoices: { where: { createdAt: { gte: monthStart } } },
        },
      },
    },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="p-10">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold text-[#0b1c30]">Reports</h1>
        <p className="text-sm text-slate-500 mt-2">
          Client Protection Reports for {monthLabel} · Send to your clients as proof of service.
        </p>
      </div>

      {/* Insider Risk Scan */}
      <div className="bg-gradient-to-br from-[#003ec7]/5 to-[#0052ff]/5 border border-[#003ec7]/20 rounded-2xl px-6 py-5 mb-8 flex items-center justify-between">
        <div className="flex items-start gap-4">
          <Shield className="w-8 h-8 text-[#003ec7] shrink-0 mt-0.5" />
          <div>
            <h2 className="text-sm font-semibold text-[#0b1c30]">Insider Risk Detection</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Scans all clients for duplicate invoices, suspicious new-vendor payments, round-dollar anomalies, and velocity spikes.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-6">
          <Link
            href="/dashboard/insider-risk"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#003ec7] bg-white border border-[#003ec7]/30 rounded-xl hover:bg-[#eff4ff]"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Alerts
          </Link>
          <InsiderRiskScanButton />
        </div>
      </div>

      {/* Client Protection Reports */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Client Protection Reports</h2>
        <span className="text-xs text-gray-400">{monthLabel}</span>
      </div>

      {clients.length === 0 ? (
        <div className="surface-panel p-12 text-center">
          <p className="text-sm text-slate-400">No active clients yet.</p>
        </div>
      ) : (
        <div className="surface-panel overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-[#eff4ff]">
              <tr>
                <th className="px-6 py-4 text-left text-[11px] font-medium text-slate-500 uppercase tracking-[0.08em]">Client</th>
                <th className="px-6 py-4 text-left text-[11px] font-medium text-slate-500 uppercase tracking-[0.08em]">Invoices This Month</th>
                <th className="px-6 py-4 text-left text-[11px] font-medium text-slate-500 uppercase tracking-[0.08em]">Open Alerts</th>
                <th className="px-6 py-4 text-left text-[11px] font-medium text-slate-500 uppercase tracking-[0.08em]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id} className="odd:bg-white even:bg-[#f8f9ff] hover:bg-[#eff4ff] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-[#0b1c30]">{client.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{client._count.invoices}</span>
                  </td>
                  <td className="px-6 py-4">
                    {client._count.alerts > 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                        {client._count.alerts} open
                      </span>
                    ) : (
                      <span className="text-sm text-slate-400">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <a
                        href={`/api/reports/client-protection/${client.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-br from-[#003ec7] to-[#0052ff] rounded-lg hover:opacity-90 shadow shadow-blue-500/20"
                      >
                        <Download className="w-3.5 h-3.5" />
                        View Report
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-4">
        Reports open as HTML — use your browser's Print → Save as PDF to send to clients.
      </p>
    </div>
  )
}
