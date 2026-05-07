import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { incrementalSync } from '@/lib/qbo/sync'
import { runConcurrently } from '@/lib/concurrency'

// Called every 4 hours via GitHub Actions cron.
// Runs incremental QBO sync for every active client that has QBO connected.
export const maxDuration = 300

export async function POST(req: Request) {
  const auth = req.headers.get('Authorization') ?? ''
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const clients = await prisma.client.findMany({
    where: { isActive: true, qboRealmId: { not: null } },
    select: { id: true },
  })

  if (clients.length === 0) {
    return NextResponse.json({ synced: 0, errors: 0, message: 'No QBO clients' })
  }

  const results = { synced: 0, errors: 0 }

  await runConcurrently(
    clients.map(c => async () => {
      try {
        await incrementalSync(c.id)
        results.synced++
      } catch (err) {
        console.error(`qbo-sync cron failed for client ${c.id}`, err)
        results.errors++
      }
    }),
    3
  )

  return NextResponse.json({ ok: true, ...results })
}
