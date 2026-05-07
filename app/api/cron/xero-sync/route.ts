import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { incrementalSync } from '@/lib/xero/sync'
import { runConcurrently } from '@/lib/concurrency'

// Called every 4 hours via GitHub Actions cron.
// Runs incremental Xero sync for every active client that has Xero connected.
export const maxDuration = 300

export async function POST(req: Request) {
  const auth = req.headers.get('Authorization') ?? ''
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const clients = await prisma.client.findMany({
    where: { isActive: true, xeroTenantId: { not: null } },
    select: { id: true },
  })

  if (clients.length === 0) {
    return NextResponse.json({ synced: 0, errors: 0, message: 'No Xero clients' })
  }

  const results = { synced: 0, errors: 0 }

  await runConcurrently(
    clients.map(c => async () => {
      try {
        await incrementalSync(c.id)
        results.synced++
      } catch (err) {
        console.error(`xero-sync cron failed for client ${c.id}`, err)
        results.errors++
      }
    }),
    3
  )

  return NextResponse.json({ ok: true, ...results })
}
