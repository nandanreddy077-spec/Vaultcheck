import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { dbUser, error } = await requireAuth()
  if (error || !dbUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!['admin', 'staff'].includes(dbUser.role)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  const invoice = await prisma.invoice.findFirst({
    where: { id: id, client: { firmId: dbUser.firmId } },
    select: { id: true, clientId: true, status: true },
  })

  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
  }

  if (invoice.status === 'approved') {
    return NextResponse.json({ error: 'Invoice already approved' }, { status: 409 })
  }

  const [updated] = await prisma.$transaction([
    prisma.invoice.update({
      where: { id: id },
      data: { status: 'approved', decidedAt: new Date(), decidedBy: dbUser.id },
    }),
    prisma.alert.updateMany({
      where: { invoiceId: id, status: 'open' },
      data: { status: 'resolved', resolution: 'approved_safe', resolvedBy: dbUser.id, resolvedAt: new Date() },
    }),
    prisma.auditLog.create({
      data: {
        firmId: dbUser.firmId,
        clientId: invoice.clientId,
        userId: dbUser.id,
        action: 'invoice_approved',
        entityType: 'invoice',
        entityId: id,
        details: { previousStatus: invoice.status },
      },
    }),
  ])

  return NextResponse.json(updated)
}
