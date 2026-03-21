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

  let reason: string | undefined
  try {
    const body = await req.json()
    reason = body.reason
  } catch {
    // reason is optional
  }

  const invoice = await prisma.invoice.findFirst({
    where: { id: params.id, client: { firmId: dbUser.firmId } },
    select: { id: true, clientId: true, status: true },
  })

  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
  }

  if (invoice.status === 'rejected') {
    return NextResponse.json({ error: 'Invoice already rejected' }, { status: 409 })
  }

  const [updated] = await prisma.$transaction([
    prisma.invoice.update({
      where: { id: params.id },
      data: { status: 'rejected', decidedAt: new Date(), decidedBy: dbUser.id },
    }),
    prisma.alert.updateMany({
      where: { invoiceId: params.id, status: 'open' },
      data: { status: 'resolved', resolution: 'confirmed_fraud', resolvedBy: dbUser.id, resolvedAt: new Date() },
    }),
    prisma.auditLog.create({
      data: {
        firmId: dbUser.firmId,
        clientId: invoice.clientId,
        userId: dbUser.id,
        action: 'invoice_rejected',
        entityType: 'invoice',
        entityId: params.id,
        details: { previousStatus: invoice.status, reason },
      },
    }),
  ])

  return NextResponse.json(updated)
}
