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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>
        <p className="text-sm text-gray-500 mt-1">{vendors.length} vendors tracked across all clients</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoices</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Payment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {vendors.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">
                  No vendors yet. Connect a client&apos;s QuickBooks to import vendors.
                </td>
              </tr>
            ) : (
              vendors.map(vendor => (
                <tr key={vendor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{vendor.displayName}</p>
                      {vendor.email && <p className="text-xs text-gray-400">{vendor.email}</p>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/clients/${vendor.client.id}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {vendor.client.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{vendor._count.invoices}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {vendor.fingerprint
                      ? `$${vendor.fingerprint.avgAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                      : '—'}
                  </td>
                  <td className="px-6 py-4">
                    {vendor.fingerprint ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-100 rounded-full h-1.5">
                          <div
                            className="bg-blue-500 h-1.5 rounded-full"
                            style={{ width: `${(vendor.fingerprint.confidenceScore * 100).toFixed(0)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {(vendor.fingerprint.confidenceScore * 100).toFixed(0)}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">No data</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
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
