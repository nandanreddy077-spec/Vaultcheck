import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { dbUser, error } = await requireAuth()
  if (error || !dbUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = req.nextUrl
  const status = searchParams.get('status') || 'open'
  const severity = searchParams.get('severity')
  const clientId = searchParams.get('clientId')

  // Build client ID filter scoped to this firm
  const firmClients = await prisma.client.findMany({
    where: { firmId: dbUser.firmId },
    select: { id: true },
  })
  const firmClientIds = firmClients.map(c => c.id)

  const alerts = await prisma.alert.findMany({
    where: {
      clientId: clientId
        ? (firmClientIds.includes(clientId) ? clientId : undefined)
        : { in: firmClientIds },
      ...(status !== 'all' && { status }),
      ...(severity && { severity }),
    },
    include: {
      invoice: { include: { vendor: true } },
      client: { select: { id: true, name: true } },
    },
    orderBy: [{ severity: 'asc' }, { createdAt: 'desc' }],
    take: 100,
  })

  return NextResponse.json(alerts)
}
