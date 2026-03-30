import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ReportsPage() {
  const { dbUser, error } = await requireAuth()
  if (error || !dbUser) redirect('/login')

  const clients = await prisma.client.findMany({
    where: { firmId: dbUser.firmId, isActive: true },
    select: { id: true, name: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-10">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold text-[#0b1c30]">Weekly Reports</h1>
        <p className="text-sm text-slate-500 mt-2">
          Download your latest weekly summary for each client.
        </p>
      </div>

      {clients.length === 0 ? (
        <div className="surface-panel p-12 text-center">
          <p className="text-sm text-slate-400">No clients yet.</p>
        </div>
      ) : (
        <div className="surface-panel overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-[#eff4ff]">
              <tr>
                <th className="px-6 py-4 text-left text-[11px] font-medium text-slate-500 uppercase tracking-[0.08em]">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-medium text-slate-500 uppercase tracking-[0.08em]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id} className="odd:bg-white even:bg-[#f8f9ff] hover:bg-[#eff4ff] transition-colors">
                  <td className="px-6 py-4 text-sm text-[#0b1c30]">{client.name}</td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/api/reports/weekly/${client.id}`}
                      className="btn-primary-gradient text-sm"
                    >
                      Download PDF
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

