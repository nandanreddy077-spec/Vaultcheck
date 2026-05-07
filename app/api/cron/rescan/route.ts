import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { scanInvoice } from '@/lib/scanner/scan'
import { runConcurrently } from '@/lib/concurrency'

// Re-scans all pending/scanned invoices across all active clients.
// Catches bank account changes and new threat intel flags that arrived
// after the initial sync — continuous validation, not just point-in-time.
//
// Called nightly via GitHub Actions cron.

const TERMINAL_STATUSES = ['approved', 'rejected', 'paid']
const RESCAN_WINDOW_DAYS = 60 // only re-scan invoices from last 60 days

export async function POST(req: Request) {
  const auth = req.headers.get('Authorization') ?? ''
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const since = new Date()
  since.setDate(since.getDate() - RESCAN_WINDOW_DAYS)

  // Find all non-terminal invoices across all active clients within the window
  const invoices = await prisma.invoice.findMany({
    where: {
      status: { notIn: TERMINAL_STATUSES },
      createdAt: { gte: since },
      client: {
        isActive: true,
        // Only rescan clients whose sync is working
        syncStatus: { in: ['synced', 'pending'] },
      },
    },
    select: { id: true, clientId: true },
  })

  if (invoices.length === 0) {
    return NextResponse.json({ rescanned: 0, message: 'No invoices to rescan' })
  }

  const results = { rescanned: 0, errors: 0 }

  await runConcurrently(
    invoices.map(inv => async () => {
      try {
        await scanInvoice(inv.id)
        results.rescanned++
      } catch {
        results.errors++
      }
    }),
    5 // conservative concurrency for a background job
  )

  await prisma.auditLog.create({
    data: {
      firmId: 'system',
      action: 'cron_rescan',
      entityType: 'system',
      entityId: 'rescan',
      details: {
        rescanned: results.rescanned,
        errors: results.errors,
        windowDays: RESCAN_WINDOW_DAYS,
        ranAt: new Date().toISOString(),
      },
    },
  })

  return NextResponse.json(results)
}
