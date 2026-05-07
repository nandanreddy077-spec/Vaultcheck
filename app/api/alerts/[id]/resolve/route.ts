import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createThreatFlag } from '@/lib/threat-intel/flag'

export async function POST(
  req: NextRequest,
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

  const { resolution } = await req.json()
  const validResolutions = ['approved_safe', 'confirmed_fraud', 'false_positive']
  if (!validResolutions.includes(resolution)) {
    return NextResponse.json({ error: 'Invalid resolution' }, { status: 400 })
  }

  // Verify alert belongs to user's firm
  const alert = await prisma.alert.findFirst({
    where: {
      id: id,
      client: { firmId: dbUser.firmId },
    },
  })

  if (!alert) {
    return NextResponse.json({ error: 'Alert not found' }, { status: 404 })
  }

  const updated = await prisma.alert.update({
    where: { id: id },
    data: {
      status: 'resolved',
      resolution,
      resolvedBy: dbUser.id,
      resolvedAt: new Date(),
    },
  })

  // Alert decisions may be split across multiple risk factors for the same invoice.
  // We only set the invoice decision when all alerts for that invoice are resolved.
  const remainingOpenAlerts = await prisma.alert.count({
    where: {
      invoiceId: updated.invoiceId,
      status: 'open',
    },
  })

  if (remainingOpenAlerts === 0) {
    const resolvedAlerts = await prisma.alert.findMany({
      where: { invoiceId: updated.invoiceId },
      select: { resolution: true },
    })

    const shouldReject = resolvedAlerts.some(a => a.resolution === 'confirmed_fraud')
    const invoiceStatus = shouldReject ? 'rejected' : 'approved'

    const invoice = await prisma.invoice.findFirst({
      where: {
        id: updated.invoiceId,
        client: { firmId: dbUser.firmId },
      },
      select: {
        id: true,
        bankAccountHash: true,
        senderEmail: true,
        vendor: { select: { displayName: true, emailDomain: true } },
      },
    })

    if (invoice) {
      // If confirmed fraud, share the signal with the global threat intelligence layer
      // so other Vantirs clients with the same vendor are warned automatically.
      if (shouldReject) {
        await createThreatFlag({
          firmId: dbUser.firmId,
          vendorName: invoice.vendor?.displayName,
          emailDomain: invoice.vendor?.emailDomain,
          bankHash: invoice.bankAccountHash,
          reason: 'bank_fraud',
          notes: `Confirmed fraud — alert ${id}`,
        })
      }

      await prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          status: invoiceStatus,
          decidedAt: new Date(),
          decidedBy: dbUser.id,
        },
      })

      await prisma.auditLog.create({
        data: {
          firmId: dbUser.firmId,
          clientId: updated.clientId,
          userId: dbUser.id,
          action: 'invoice_decided',
          entityType: 'invoice',
          entityId: updated.invoiceId,
          details: { status: invoiceStatus },
        },
      })
    }
  }

  await prisma.auditLog.create({
    data: {
      firmId: dbUser.firmId,
      clientId: alert.clientId,
      userId: dbUser.id,
      action: 'alert_resolved',
      entityType: 'alert',
      entityId: id,
      details: { resolution },
    },
  })

  return NextResponse.json(updated)
}
