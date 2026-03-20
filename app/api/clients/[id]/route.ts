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

  const client = await prisma.client.findFirst({
    where: { id: params.id, firmId: dbUser.firmId },
    include: {
      vendors: {
        include: { fingerprint: true },
        orderBy: { displayName: 'asc' },
        take: 10,
      },
      invoices: {
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: { vendor: true, alerts: true },
      },
      alerts: {
        where: { status: 'open' },
        orderBy: [{ severity: 'asc' }, { createdAt: 'desc' }],
        take: 20,
        include: { invoice: true },
      },
      _count: { select: { vendors: true, invoices: true } },
    },
  })

  if (!client) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Summary stats
  const openAlerts = await prisma.alert.count({
    where: { clientId: params.id, status: 'open' },
  })

  const highRiskInvoices = await prisma.invoice.count({
    where: { clientId: params.id, riskScore: { gte: 36 } },
  })

  return NextResponse.json({ ...client, stats: { openAlerts, highRiskInvoices } })
}
