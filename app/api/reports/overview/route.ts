import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const { dbUser, error } = await requireAuth()
  if (error || !dbUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }


  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

  const [
    totalClients,
    activeClients,
    totalVendors,
    invoicesThisMonth,
    invoicesLastMonth,
    openAlerts,
    resolvedThisMonth,
    criticalOpenAlerts,
    highRiskInvoicesThisMonth,
    clientSyncErrors,
    recentAlerts,
  ] = await Promise.all([
    prisma.client.count({ where: { firmId: dbUser.firmId } }),
    prisma.client.count({ where: { firmId: dbUser.firmId, isActive: true } }),
    prisma.vendor.count({ where: { client: { firmId: dbUser.firmId }, isActive: true } }),
    prisma.invoice.count({
      where: { client: { firmId: dbUser.firmId }, createdAt: { gte: startOfMonth } },
    }),
    prisma.invoice.count({
      where: {
        client: { firmId: dbUser.firmId },
        createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
      },
    }),
    prisma.alert.count({
      where: { client: { firmId: dbUser.firmId }, status: 'open' },
    }),
    prisma.alert.count({
      where: {
        client: { firmId: dbUser.firmId },
        status: 'resolved',
        resolvedAt: { gte: startOfMonth },
      },
    }),
    prisma.alert.count({
      where: { client: { firmId: dbUser.firmId }, status: 'open', severity: 'critical' },
    }),
    prisma.invoice.count({
      where: {
        client: { firmId: dbUser.firmId },
        riskScore: { gte: 36 },
        createdAt: { gte: startOfMonth },
      },
    }),
    prisma.client.count({
      where: { firmId: dbUser.firmId, syncStatus: 'error' },
    }),
    prisma.alert.findMany({
      where: { client: { firmId: dbUser.firmId }, status: 'open' },
      include: {
        invoice: { include: { vendor: { select: { displayName: true } } } },
        client: { select: { id: true, name: true } },
      },
      orderBy: [{ severity: 'asc' }, { createdAt: 'desc' }],
      take: 5,
    }),
  ])

  const invoicesTrend =
    invoicesLastMonth > 0
      ? Math.round(((invoicesThisMonth - invoicesLastMonth) / invoicesLastMonth) * 100)
      : null

  return NextResponse.json({
    clients: { total: totalClients, active: activeClients, syncErrors: clientSyncErrors },
    vendors: { total: totalVendors },
    invoices: {
      thisMonth: invoicesThisMonth,
      lastMonth: invoicesLastMonth,
      trendPercent: invoicesTrend,
      highRiskThisMonth: highRiskInvoicesThisMonth,
    },
    alerts: {
      open: openAlerts,
      critical: criticalOpenAlerts,
      resolvedThisMonth,
    },
    recentAlerts,
  })
}
