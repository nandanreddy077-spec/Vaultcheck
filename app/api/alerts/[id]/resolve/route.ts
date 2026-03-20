import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { dbUser, error } = await requireAuth()
  if (error || !dbUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!['admin', 'staff'].includes(dbUser.role)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  const { resolution } = await req.json()
  const validResolutions = ['approved_safe', 'confirmed_fraud', 'false_positive']
  if (!validResolutions.includes(resolution)) {
    return NextResponse.json({ error: 'Invalid resolution' }, { status: 400 })
  }

  // Verify alert belongs to user's firm
  const alert = await prisma.alert.findFirst({
    where: {
      id: params.id,
      client: { firmId: dbUser.firmId },
    },
  })

  if (!alert) {
    return NextResponse.json({ error: 'Alert not found' }, { status: 404 })
  }

  const updated = await prisma.alert.update({
    where: { id: params.id },
    data: {
      status: 'resolved',
      resolution,
      resolvedBy: dbUser.id,
      resolvedAt: new Date(),
    },
  })

  await prisma.auditLog.create({
    data: {
      firmId: dbUser.firmId,
      clientId: alert.clientId,
      userId: dbUser.id,
      action: 'alert_resolved',
      entityType: 'alert',
      entityId: params.id,
      details: { resolution },
    },
  })

  return NextResponse.json(updated)
}
