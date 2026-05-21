import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { incrementalSync } from '@/lib/qbo/sync'
import { runConcurrently } from '@/lib/concurrency'
import { verifyCronAuthorization } from '@/lib/cron-auth'
import { captureException } from '@/lib/monitoring'

// Called every 4 hours via GitHub Actions cron.
// Runs incremental QBO sync for every active client that has QBO connected.
export const maxDuration = 300

export async function POST(req: Request) {
  const cronAuth = verifyCronAuthorization(req)
  if (cronAuth !== 'ok') {
    const status = cronAuth === 'misconfigured' ? 503 : 401
    return NextResponse.json({ error: cronAuth === 'misconfigured' ? 'Server misconfigured' : 'Unauthorized' }, { status })
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
        captureException(err, { tags: { route: 'cron/qbo-sync' }, extra: { clientId: c.id } })
        results.errors++
      }
    }),
    3
  )

  return NextResponse.json({ ok: true, ...results })
}
