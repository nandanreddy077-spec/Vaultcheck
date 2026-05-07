import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const ACTION_LABELS: Record<string, string> = {
  invoice_scanned: 'Invoice Scanned',
  alert_created: 'Alert Created',
  alert_resolved: 'Alert Resolved',
  invoice_approved: 'Invoice Approved',
  invoice_rejected: 'Invoice Rejected',
  client_created: 'Client Added',
  paddle_subscription_updated: 'Plan Updated',
  paddle_subscription_canceled: 'Plan Canceled',
  'plan.outreach_coupon_redeemed': 'Partner Code Redeemed',
}

export async function GET(req: NextRequest) {
  const { dbUser, error } = await requireAuth()
  if (error || !dbUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = req.nextUrl
  const clientId = searchParams.get('clientId') || undefined
  const action = searchParams.get('action') || undefined
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const format = searchParams.get('format')
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const pageSize = 50

  const where = {
    firmId: dbUser.firmId,
    ...(clientId ? { clientId } : {}),
    ...(action ? { action } : {}),
    ...(from || to
      ? {
          createdAt: {
            ...(from ? { gte: new Date(from) } : {}),
            ...(to ? { lte: new Date(new Date(to).setHours(23, 59, 59, 999)) } : {}),
          },
        }
      : {}),
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: format === 'csv' ? 0 : (page - 1) * pageSize,
      take: format === 'csv' ? 5000 : pageSize,
    }),
    prisma.auditLog.count({ where }),
  ])

  // Resolve client names and user emails in batch
  const clientIds = [...new Set(logs.map(l => l.clientId).filter(Boolean) as string[])]
  const userIds = [...new Set(logs.map(l => l.userId).filter(Boolean) as string[])]

  const [clients, users] = await Promise.all([
    clientIds.length
      ? prisma.client.findMany({ where: { id: { in: clientIds } }, select: { id: true, name: true } })
      : [],
    userIds.length
      ? prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, email: true, name: true } })
      : [],
  ])

  const clientMap = Object.fromEntries(clients.map(c => [c.id, c.name]))
  const userMap = Object.fromEntries(users.map(u => [u.id, u.email]))

  const enriched = logs.map(log => ({
    id: log.id,
    createdAt: log.createdAt.toISOString(),
    action: log.action,
    actionLabel: ACTION_LABELS[log.action] ?? log.action,
    clientName: log.clientId ? (clientMap[log.clientId] ?? log.clientId) : null,
    actorEmail: log.userId ? (userMap[log.userId] ?? 'System') : 'System',
    entityType: log.entityType,
    entityId: log.entityId,
    details: log.details,
  }))

  if (format === 'csv') {
    const header = 'Timestamp,Action,Client,Actor,Entity Type,Entity ID,Details\n'
    const rows = enriched
      .map(r =>
        [
          new Date(r.createdAt).toLocaleString(),
          r.actionLabel,
          r.clientName ?? '',
          r.actorEmail,
          r.entityType,
          r.entityId,
          JSON.stringify(r.details ?? '').replace(/"/g, '""'),
        ]
          .map(v => `"${v}"`)
          .join(',')
      )
      .join('\n')

    return new NextResponse(header + rows, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="vantirs-audit-log-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    })
  }

  return NextResponse.json({
    logs: enriched,
    total,
    page,
    pageSize,
    pageCount: Math.ceil(total / pageSize),
  })
}
