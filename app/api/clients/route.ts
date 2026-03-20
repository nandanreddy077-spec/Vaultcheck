import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const { dbUser, error } = await requireAuth()
  if (error || !dbUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const clients = await prisma.client.findMany({
    where: { firmId: dbUser.firmId, isActive: true },
    include: {
      _count: { select: { vendors: true, invoices: true, alerts: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(clients)
}

export async function POST(req: NextRequest) {
  const { dbUser, error } = await requireAuth()
  if (error || !dbUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!['admin'].includes(dbUser.role)) {
    return NextResponse.json({ error: 'Admin role required' }, { status: 403 })
  }

  // Check plan limits
  const clientCount = await prisma.client.count({
    where: { firmId: dbUser.firmId, isActive: true },
  })

  if (clientCount >= dbUser.firm.maxClients) {
    return NextResponse.json(
      { error: `Plan limit reached. Upgrade to add more than ${dbUser.firm.maxClients} clients.` },
      { status: 402 }
    )
  }

  const { name } = await req.json()
  if (!name?.trim()) {
    return NextResponse.json({ error: 'Client name required' }, { status: 400 })
  }

  const client = await prisma.client.create({
    data: { name: name.trim(), firmId: dbUser.firmId },
  })

  await prisma.auditLog.create({
    data: {
      firmId: dbUser.firmId,
      userId: dbUser.id,
      action: 'client_created',
      entityType: 'client',
      entityId: client.id,
    },
  })

  return NextResponse.json(client, { status: 201 })
}
