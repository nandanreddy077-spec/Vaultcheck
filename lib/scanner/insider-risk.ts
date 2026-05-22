import { prisma } from '@/lib/prisma'
import { createDirectAlert } from '@/lib/alerts/create'

// Detects internal AP fraud patterns — employee embezzlement, duplicate payments,
// suspicious new-vendor payments. Runs against existing invoice/vendor data.

export interface InsiderRiskResult {
  clientId: string
  clientName: string
  flagsCreated: number
  patterns: string[]
}

export async function scanClientInsiderRisk(clientId: string): Promise<InsiderRiskResult> {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: { id: true, name: true, firmId: true },
  })
  if (!client) throw new Error('Client not found')

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)

  const invoices = await prisma.invoice.findMany({
    where: { clientId, createdAt: { gte: sixtyDaysAgo } },
    include: {
      vendor: { include: { fingerprint: true } },
      alerts: { select: { type: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  let flagsCreated = 0
  const patterns: string[] = []

  // ── 1. Duplicate invoice detection ────────────────────────────────────────
  // Same vendor + amount within 5% tolerance within 45 days = likely duplicate
  const seen = new Map<string, { amount: number; invoiceId: string; date: Date }>()

  for (const inv of invoices) {
    if (!inv.vendorId || !inv.amount) continue
    const alreadyFlagged = inv.alerts.some(a => a.type === 'duplicate_invoice')
    if (alreadyFlagged) continue

    const key = inv.vendorId
    const prev = seen.get(key)

    if (prev) {
      const daysDiff = Math.abs(inv.createdAt.getTime() - prev.date.getTime()) / 86400000
      const amountDiff = Math.abs(inv.amount - prev.amount) / Math.max(prev.amount, 1)

      if (daysDiff <= 45 && amountDiff <= 0.05) {
        await createDirectAlert({
          clientId,
          invoiceId: inv.id,
          severity: 'high',
          type: 'duplicate_invoice',
          title: 'Possible duplicate invoice',
          description: `This invoice ($${inv.amount.toLocaleString()}) matches another payment to the same vendor within ${Math.round(daysDiff)} days. Verify this is not a double-payment.`,
          expectedValue: `One payment of ~$${prev.amount.toLocaleString()}`,
          actualValue: `Two payments of ~$${inv.amount.toLocaleString()} within ${Math.round(daysDiff)} days`,
        }).catch(() => null)
        flagsCreated++
        if (!patterns.includes('Duplicate invoices')) patterns.push('Duplicate invoices')
      }
    }

    seen.set(key, { amount: inv.amount, invoiceId: inv.id, date: inv.createdAt })
  }

  // ── 2. New vendor + large payment ─────────────────────────────────────────
  // Vendor added < 60 days ago AND invoice > $5,000 — common embezzlement vector
  for (const inv of invoices) {
    if (!inv.vendor || !inv.amount || inv.amount < 5000) continue
    const alreadyFlagged = inv.alerts.some(a => a.type === 'new_vendor_large_payment')
    if (alreadyFlagged) continue

    const vendorAge = Date.now() - inv.vendor.firstSeenAt.getTime()
    const vendorAgeDays = vendorAge / 86400000

    if (vendorAgeDays < 60 && inv.vendor.fingerprint && inv.vendor.fingerprint.totalInvoices <= 3) {
      await createDirectAlert({
        clientId,
        invoiceId: inv.id,
        severity: 'high',
        type: 'new_vendor_large_payment',
        title: 'Large payment to new vendor',
        description: `${inv.vendor.displayName} was added ${Math.round(vendorAgeDays)} days ago and has only ${inv.vendor.fingerprint.totalInvoices} invoice(s) on record. A payment of $${inv.amount.toLocaleString()} to a new vendor requires manual verification.`,
        expectedValue: 'Vendor with established payment history',
        actualValue: `New vendor (${Math.round(vendorAgeDays)} days old), $${inv.amount.toLocaleString()} payment`,
      }).catch(() => null)
      flagsCreated++
      if (!patterns.includes('New vendor large payments')) patterns.push('New vendor large payments')
    }
  }

  // ── 3. Round-dollar anomaly ────────────────────────────────────────────────
  // Exact round amounts ($5,000, $10,000) from vendors whose typical payment is not round
  // — classic embezzlement signal (skimming fixed amounts)
  for (const inv of invoices.filter(i => i.createdAt >= thirtyDaysAgo)) {
    if (!inv.vendor?.fingerprint || !inv.amount) continue
    const alreadyFlagged = inv.alerts.some(a => a.type === 'round_dollar_anomaly')
    if (alreadyFlagged) continue

    const isRound = inv.amount >= 1000 && inv.amount % 500 === 0
    const fp = inv.vendor.fingerprint
    const avgIsNotRound = fp.avgAmount % 500 !== 0 && fp.totalInvoices >= 5

    if (isRound && avgIsNotRound && Math.abs(inv.amount - fp.avgAmount) > fp.stdDevAmount * 2) {
      await createDirectAlert({
        clientId,
        invoiceId: inv.id,
        severity: 'medium',
        type: 'round_dollar_anomaly',
        title: 'Unusual round-dollar amount',
        description: `This vendor typically bills $${fp.avgAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })} (avg). This invoice is an exact $${inv.amount.toLocaleString()} — a round number significantly outside their normal range. Round-dollar payments outside vendor norms can indicate manual override.`,
        expectedValue: `~$${fp.avgAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })} (historical avg)`,
        actualValue: `$${inv.amount.toLocaleString()} (exact round amount)`,
      }).catch(() => null)
      flagsCreated++
      if (!patterns.includes('Round-dollar anomalies')) patterns.push('Round-dollar anomalies')
    }
  }

  // ── 4. Payment velocity spike ──────────────────────────────────────────────
  // Vendor being paid far more frequently than their historical average
  for (const inv of invoices.filter(i => i.createdAt >= thirtyDaysAgo)) {
    if (!inv.vendor?.fingerprint || !inv.vendorId) continue
    const fp = inv.vendor.fingerprint
    if (!fp.avgFreqDays || fp.avgFreqDays < 14 || fp.totalInvoices < 6) continue

    const alreadyFlagged = inv.alerts.some(a => a.type === 'velocity_spike')
    if (alreadyFlagged) continue

    const recentCount = invoices.filter(
      i => i.vendorId === inv.vendorId && i.createdAt >= thirtyDaysAgo
    ).length

    const expectedInPeriod = 30 / fp.avgFreqDays
    if (recentCount > expectedInPeriod * 2.5) {
      await createDirectAlert({
        clientId,
        invoiceId: inv.id,
        severity: 'medium',
        type: 'velocity_spike',
        title: 'Payment frequency spike',
        description: `${inv.vendor.displayName} has been invoiced ${recentCount}x in the last 30 days, but historically averages every ${Math.round(fp.avgFreqDays)} days. This spike may indicate unauthorized invoices being added.`,
        expectedValue: `~${expectedInPeriod.toFixed(1)} invoices per month`,
        actualValue: `${recentCount} invoices in last 30 days`,
      }).catch(() => null)
      flagsCreated++
      if (!patterns.includes('Payment velocity spikes')) patterns.push('Payment velocity spikes')
    }
  }

  return { clientId, clientName: client.name, flagsCreated, patterns }
}

export async function scanFirmInsiderRisk(firmId: string): Promise<InsiderRiskResult[]> {
  const clients = await prisma.client.findMany({
    where: { firmId, isActive: true },
    select: { id: true },
  })
  return Promise.all(clients.map(c => scanClientInsiderRisk(c.id)))
}
