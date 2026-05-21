import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { scanInvoice } from '@/lib/scanner/scan'
import { runConcurrently } from '@/lib/concurrency'
import { verifyCronAuthorization } from '@/lib/cron-auth'
import { captureException } from '@/lib/monitoring'

export const maxDuration = 300

// Re-scans all pending/scanned invoices across all active clients.
// Catches bank account changes and new threat intel flags that arrived
// after the initial sync — continuous validation, not just point-in-time.
//
// Called nightly via GitHub Actions cron.

const TERMINAL_STATUSES = ['approved', 'rejected', 'paid']
const RESCAN_WINDOW_DAYS = 60 // only re-scan invoices from last 60 days

const MAX_INVOICES_PER_RUN = 500

export async function POST(req: Request) {
  const cronAuth = verifyCronAuthorization(req)
  if (cronAuth !== 'ok') {
    const status = cronAuth === 'misconfigured' ? 503 : 401
    return NextResponse.json({ error: cronAuth === 'misconfigured' ? 'Server misconfigured' : 'Unauthorized' }, { status })
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
    take: MAX_INVOICES_PER_RUN,
    orderBy: { createdAt: 'desc' },
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
      } catch (err) {
        results.errors++
        captureException(err, { tags: { route: 'cron/rescan' }, extra: { invoiceId: inv.id } })
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
