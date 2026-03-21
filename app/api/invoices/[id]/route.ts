import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { dbUser, error } = await requireAuth()
  if (error || !dbUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const invoice = await prisma.invoice.findFirst({
    where: { id: params.id, client: { firmId: dbUser.firmId } },
    include: {
      vendor: {
        include: { fingerprint: true },
      },
      client: { select: { id: true, name: true } },
      alerts: {
        orderBy: [{ severity: 'asc' }, { createdAt: 'desc' }],
      },
    },
  })

  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
  }

  return NextResponse.json(invoice)
}
