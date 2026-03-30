import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function VendorsPage() {
  const { dbUser, error } = await requireAuth()
  if (error || !dbUser) redirect('/login')

  const vendors = await prisma.vendor.findMany({
    where: { client: { firmId: dbUser.firmId }, isActive: true },
    include: {
      fingerprint: true,
      client: { select: { id: true, name: true } },
      _count: { select: { invoices: true } },
    },
    orderBy: { displayName: 'asc' },
  })

  return (
    <div className="p-10">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold text-[#0b1c30]">Vendors</h1>
        <p className="text-sm text-slate-500 mt-2">{vendors.length} vendors tracked across all clients</p>
      </div>

      <div className="surface-panel overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-[#eff4ff]">
            <tr>
              <th className="px-6 py-4 text-left text-[11px] font-medium text-slate-500 uppercase tracking-[0.08em]">Vendor</th>
              <th className="px-6 py-4 text-left text-[11px] font-medium text-slate-500 uppercase tracking-[0.08em]">Client</th>
              <th className="px-6 py-4 text-left text-[11px] font-medium text-slate-500 uppercase tracking-[0.08em]">Invoices</th>
              <th className="px-6 py-4 text-left text-[11px] font-medium text-slate-500 uppercase tracking-[0.08em]">Avg Amount</th>
              <th className="px-6 py-4 text-left text-[11px] font-medium text-slate-500 uppercase tracking-[0.08em]">Confidence</th>
              <th className="px-6 py-4 text-left text-[11px] font-medium text-slate-500 uppercase tracking-[0.08em]">Last Payment</th>
            </tr>
          </thead>
          <tbody>
            {vendors.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                  No vendors yet. Connect a client&apos;s QuickBooks to import vendors.
                </td>
              </tr>
            ) : (
              vendors.map(vendor => (
                <tr key={vendor.id} className="odd:bg-white even:bg-[#f8f9ff] hover:bg-[#eff4ff] transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <Link
                        href={`/dashboard/vendors/${vendor.id}`}
                        className="text-sm font-medium text-[#0b1c30] hover:text-[#003ec7]"
                      >
                        {vendor.displayName}
                      </Link>
                      {vendor.email && <p className="text-xs text-slate-400">{vendor.email}</p>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/clients/${vendor.client.id}`}
                      className="text-sm text-[#003ec7] hover:text-[#0052ff]"
                    >
                      {vendor.client.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{vendor._count.invoices}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {vendor.fingerprint
                      ? `$${vendor.fingerprint.avgAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                      : '—'}
                  </td>
                  <td className="px-6 py-4">
                    {vendor.fingerprint ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 rounded-full h-1.5">
                          <div
                            className="bg-[#003ec7] h-1.5 rounded-full"
                            style={{ width: `${(vendor.fingerprint.confidenceScore * 100).toFixed(0)}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">
                          {(vendor.fingerprint.confidenceScore * 100).toFixed(0)}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">No data</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {vendor.lastPaymentAt
                      ? new Date(vendor.lastPaymentAt).toLocaleDateString()
                      : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
