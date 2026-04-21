import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { captureException } from '@/lib/monitoring'
import { initialSync, incrementalSync } from '@/lib/qbo/sync'
import { prisma } from '@/lib/prisma'
import { enforceRateLimit } from '@/lib/rate-limit'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params
  const { dbUser, error } = await requireAuth()
  if (error || !dbUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rateLimitResponse = await enforceRateLimit({
    req,
    preset: 'scan',
    scope: 'qbo-sync',
    identifier: dbUser.id,
  })
  if (rateLimitResponse) return rateLimitResponse

  // Verify client belongs to user's firm
  const client = await prisma.client.findFirst({
    where: { id: clientId, firmId: dbUser.firmId },
  })

  if (!client) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 })
  }

  try {
    const { type } = await req.json().catch(() => ({ type: 'incremental' }))
    const result = type === 'initial'
      ? await initialSync(clientId)
      : await incrementalSync(clientId)

    return NextResponse.json(result)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Sync failed'
    captureException(err, {
      tags: { route: 'api/qbo/sync', service: 'qbo' },
      extra: { clientId },
    })
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
