import { prisma } from '@/lib/prisma'

export function getWeekRange(now = new Date()) {
  // Week starts on Monday.
  const day = now.getDay() // 0=Sun..6=Sat
  const diffToMonday = (day + 6) % 7
  const start = new Date(now)
  start.setDate(now.getDate() - diffToMonday)
  start.setHours(0, 0, 0, 0)

  const end = new Date(start)
  end.setDate(start.getDate() + 7)

  const prevStart = new Date(start)
  prevStart.setDate(start.getDate() - 7)
  const prevEnd = new Date(start)

  return { start, end, prevStart, prevEnd }
}

export async function getWeeklyReportData(params: {
  firmId: string
  clientId: string
}) {
  const { firmId, clientId } = params
  const { start, end, prevStart, prevEnd } = getWeekRange()

  // Verify client belongs to firm (authorization belongs in API layer too,
  // but this keeps report generation safe if called directly).
  const client = await prisma.client.findFirst({
    where: { id: clientId, firmId },
    select: { id: true, name: true },
  })
  if (!client) throw new Error('Client not found')

  const [invoicesThisWeek, invoicesPrevWeek, alertsThisWeek, alertsResolvedPrev] =
    await Promise.all([
      prisma.invoice.findMany({
        where: {
          clientId,
          scannedAt: { gte: start, lt: end },
        },
        select: { id: true, riskScore: true },
      }),
      prisma.invoice.findMany({
        where: {
          clientId,
          scannedAt: { gte: prevStart, lt: prevEnd },
        },
        select: { id: true, riskScore: true },
      }),
      prisma.alert.findMany({
        where: {
          clientId,
          createdAt: { gte: start, lt: end },
        },
        select: {
          id: true,
          severity: true,
          type: true,
          title: true,
          description: true,
          invoice: { select: { amount: true, vendor: { select: { displayName: true } } } },
        },
        orderBy: [{ severity: 'asc' }, { createdAt: 'desc' }],
        take: 5,
      }),
      prisma.alert.count({
        where: {
          clientId,
          status: 'resolved',
          resolvedAt: { gte: prevStart, lt: prevEnd },
        },
      }),
    ])

  const invoiceCountThisWeek = invoicesThisWeek.length
  const avgRiskThisWeek =
    invoiceCountThisWeek === 0
      ? 0
      : invoicesThisWeek.reduce((a, b) => a + b.riskScore, 0) / invoiceCountThisWeek

  const invoiceCountPrevWeek = invoicesPrevWeek.length
  const avgRiskPrevWeek =
    invoiceCountPrevWeek === 0
      ? 0
      : invoicesPrevWeek.reduce((a, b) => a + b.riskScore, 0) / invoiceCountPrevWeek

  const riskTrend =
    avgRiskPrevWeek === 0
      ? 'up'
      : avgRiskThisWeek >= avgRiskPrevWeek
        ? 'up'
        : 'down'

  const alertsResolvedThisWeek = await prisma.alert.count({
    where: {
      clientId,
      status: 'resolved',
      resolvedAt: { gte: start, lt: end },
    },
  })

  const openAlertsAtEnd = await prisma.alert.count({
    where: {
      clientId,
      status: 'open',
    },
  })

  const fingerprintUpdates = await prisma.vendorFingerprint.count({
    where: {
      vendor: { clientId },
      lastUpdated: { gte: start, lt: end },
    },
  })

  return {
    clientId: client.id,
    clientName: client.name,
    range: { start, end },
    summary: {
      invoicesScanned: invoiceCountThisWeek,
      avgRiskThisWeek,
      avgRiskPrevWeek,
      riskTrend,
      alertsGenerated: alertsThisWeek.length,
      alertsResolvedThisWeek,
      openAlertsAtEnd,
      fingerprintUpdates,
    },
    highlights: alertsThisWeek.map(a => ({
      severity: a.severity,
      type: a.type,
      title: a.title,
      description: a.description,
      amount: a.invoice.amount,
      vendorName: a.invoice.vendor?.displayName ?? 'Unknown vendor',
    })),
    // for future charts
    _debug_prevResolvedCount: alertsResolvedPrev,
  }
}

