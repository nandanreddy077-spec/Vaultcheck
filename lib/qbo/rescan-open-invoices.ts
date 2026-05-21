import { prisma } from '@/lib/prisma'
import { runConcurrently } from '@/lib/concurrency'
import { scanInvoice } from '@/lib/scanner/scan'

const TERMINAL_STATUSES = ['approved', 'rejected', 'paid']

/** Re-score open invoices when vendor payment profile changes. */
export async function rescanOpenInvoicesForVendors(vendorIds: string[]) {
  const unique = Array.from(new Set(vendorIds.filter(Boolean)))
  if (!unique.length) return { rescanned: 0 }

  const invoices = await prisma.invoice.findMany({
    where: {
      vendorId: { in: unique },
      status: { notIn: TERMINAL_STATUSES },
    },
    select: { id: true },
  })

  let rescanned = 0
  await runConcurrently(
    invoices.map(inv => async () => {
      await scanInvoice(inv.id)
      rescanned += 1
    }),
    5
  )

  return { rescanned }
}
