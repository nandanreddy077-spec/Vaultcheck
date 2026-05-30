import { prisma } from '@/lib/prisma'
import type { RiskFactor, ScanResult } from '@/lib/scanner/scan'
import { sendAlertEmail } from '@/lib/notifications/resend'
import { requireResendForAlerts } from '@/lib/production-guard'
import { getSlackWebhookUrl, sendSlackAlert } from '@/lib/notifications/slack'

const FACTOR_SEVERITY: Record<string, string> = {
  bank_account_changed: 'critical',
  global_threat_flag: 'critical',
  email_domain_mismatch: 'high',
  amount_extreme_high: 'high',
  amount_moderate_high: 'medium',
  new_vendor_no_history: 'medium',
  invoice_pattern_mismatch: 'low',
  frequency_anomaly: 'low',
  confidence_penalty: 'low',
}

const FACTOR_TYPE: Record<string, string> = {
  bank_account_changed: 'bank_change',
  global_threat_flag: 'bank_change',
  email_domain_mismatch: 'email_mismatch',
  amount_extreme_high: 'amount_anomaly',
  amount_moderate_high: 'amount_anomaly',
  new_vendor_no_history: 'new_vendor',
  invoice_pattern_mismatch: 'pattern_mismatch',
  frequency_anomaly: 'pattern_mismatch',
  confidence_penalty: 'amount_anomaly',
}

const FACTOR_TITLE: Record<string, string> = {
  bank_account_changed: 'Bank Account Changed',
  global_threat_flag: 'Known Fraud Signal (Network Intel)',
  email_domain_mismatch: 'Email Domain Mismatch',
  amount_extreme_high: 'Unusually High Amount',
  amount_moderate_high: 'Elevated Invoice Amount',
  new_vendor_no_history: 'First Invoice from Vendor',
  invoice_pattern_mismatch: 'Invoice Number Pattern Mismatch',
  frequency_anomaly: 'Unexpected Invoice Frequency',
  confidence_penalty: 'Limited Payment History',
}

// Used by insider-risk scanner and other direct callers that build alerts without a full scan result
export async function createDirectAlert(opts: {
  clientId: string
  invoiceId?: string
  vendorId?: string
  severity: string
  type: string
  title: string
  description: string
  expectedValue?: string
  actualValue?: string
}) {
  if (!opts.invoiceId && !opts.vendorId) {
    throw new Error('createDirectAlert: must provide invoiceId or vendorId')
  }

  // CRITICAL: Never pass undefined into a Prisma where clause — it silently drops the
  // filter and matches ALL rows of that type globally (cross-client data corruption).
  // Always use explicit conditional branches.
  let existing
  if (opts.invoiceId) {
    existing = await prisma.alert.findFirst({
      where: { invoiceId: opts.invoiceId, type: opts.type },
    })
  } else {
    existing = await prisma.alert.findFirst({
      where: { vendorId: opts.vendorId, type: opts.type, clientId: opts.clientId },
    })
  }
  if (existing) return

  await prisma.alert.create({
    data: {
      clientId: opts.clientId,
      invoiceId: opts.invoiceId,
      vendorId: opts.vendorId,
      severity: opts.severity,
      type: opts.type,
      title: opts.title,
      description: opts.description,
      status: 'open',
    },
  })

  if (opts.severity === 'critical' || opts.severity === 'high') {
    let firmEmail: string | undefined
    let firmName: string | undefined
    let clientName: string | undefined
    let vendorName: string | undefined
    let amountText: string | undefined

    if (opts.invoiceId) {
      const invoice = await prisma.invoice.findUnique({
        where: { id: opts.invoiceId },
        include: { vendor: true, client: { include: { firm: true } } },
      })
      firmEmail = invoice?.client?.firm?.email ?? undefined
      firmName = invoice?.client?.firm?.name ?? undefined
      clientName = invoice?.client?.name ?? 'Unknown client'
      vendorName = invoice?.vendor?.displayName ?? 'Unknown vendor'
      amountText = invoice?.amount != null ? `$${invoice.amount.toLocaleString()}` : undefined
    } else {
      const client = await prisma.client.findUnique({
        where: { id: opts.clientId },
        include: { firm: true },
      })
      firmEmail = client?.firm?.email ?? undefined
      firmName = client?.firm?.name ?? undefined
      clientName = client?.name ?? 'Unknown client'
    }

    if (firmEmail) {
      const bodyLines = [
        `Vantirs flagged an insider risk pattern.`,
        ``,
        `Client: ${clientName}`,
        ...(vendorName ? [`Vendor: ${vendorName}`] : []),
        ...(amountText ? [`Amount: ${amountText}`] : []),
        `Alert: ${opts.title}`,
        `Details: ${opts.description}`,
        ``,
        `Log in to review: https://www.vantirs.com/dashboard/insider-risk`,
        ``,
        `Vantirs does not guarantee fraud detection. Always verify with direct vendor contact.`,
      ]
      await sendAlertEmail({
        to: firmEmail,
        firmName,
        subject: `${opts.severity.toUpperCase()}: ${opts.title}`,
        text: bodyLines.join('\n'),
      })
    }
  }
}

// Fires a vendor-level bank-change alert directly from syncVendors(), bypassing invoice scan.
// firmId and firmName are hoisted from a single lookup before runConcurrently — not fetched here.
export async function createVendorAlert(opts: {
  vendorId: string
  clientId: string
  firmId: string
  firmName: string
  severity: string
  type: string
  title: string
  description: string
  expectedValue?: string
  actualValue?: string
}): Promise<void> {
  // 24h open-alert dedup: do NOT use @@unique on the schema (permanently blocks re-alerts
  // after resolution). Soft dedup: skip if an open alert for this vendor+type already
  // exists within the last 24 hours.
  const recentAlert = await prisma.alert.findFirst({
    where: {
      vendorId: opts.vendorId,
      type: opts.type,
      clientId: opts.clientId,
      status: 'open',
      createdAt: { gte: new Date(Date.now() - 86_400_000) },
    },
  })
  if (recentAlert) return

  await prisma.alert.create({
    data: {
      clientId: opts.clientId,
      vendorId: opts.vendorId,
      severity: opts.severity,
      type: opts.type,
      title: opts.title,
      description: opts.description,
      status: 'open',
    },
  })

  await prisma.auditLog.create({
    data: {
      firmId: opts.firmId,
      clientId: opts.clientId,
      userId: null,
      action: 'vendor_bank_changed',
      entityType: 'vendor',
      entityId: opts.vendorId,
      details: {
        vendorId: opts.vendorId,
        title: opts.title,
        severity: opts.severity,
        syncType: 'qbo',
        detectedAt: new Date().toISOString(),
      },
    },
  })

  if (opts.severity === 'critical' || opts.severity === 'high') {
    const firm = await prisma.firm.findUnique({
      where: { id: opts.firmId },
      select: { email: true },
    })
    const firmEmail = firm?.email
    if (firmEmail) {
      await sendAlertEmail({
        to: firmEmail,
        firmName: opts.firmName,
        subject: `${opts.severity.toUpperCase()}: ${opts.title}`,
        text:
          `A vendor bank account change was detected during sync.\n\n` +
          `${opts.title}\n` +
          `${opts.description}\n\n` +
          `Log in to review: https://www.vantirs.com/dashboard\n\n` +
          `Vantirs does not guarantee fraud detection. Always verify with direct vendor contact.`,
      })
    }
  }
}

export async function createAlert(
  clientId: string,
  invoiceId: string,
  scanResult: ScanResult,
  riskFactors: RiskFactor[]
) {
  // Create one alert per significant risk factor
  const significantFactors = riskFactors.filter(f => f.weight >= 7)

  // Fetch once so we can notify the firm without extra round-trips.
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      vendor: true,
      client: { include: { firm: true } },
    },
  })

  const firmEmail = invoice?.client?.firm?.email
  const slackWebhookUrl = invoice?.client?.firm?.slackWebhookUrl ?? getSlackWebhookUrl()
  const willNotify =
    !!firmEmail &&
    significantFactors.some(f => {
      const sev = FACTOR_SEVERITY[f.factor] || 'medium'
      return sev === 'critical' || sev === 'high'
    })
  if (willNotify) requireResendForAlerts()

  for (const factor of significantFactors) {
    const existingAlert = await prisma.alert.findFirst({
      where: { invoiceId, type: FACTOR_TYPE[factor.factor] || 'amount_anomaly' },
    })
    if (existingAlert) continue

    const severity = FACTOR_SEVERITY[factor.factor] || 'medium'
    const type = FACTOR_TYPE[factor.factor] || 'amount_anomaly'
    const title = FACTOR_TITLE[factor.factor] || 'Anomaly Detected'

    await prisma.alert.create({
      data: {
        clientId,
        invoiceId,
        severity,
        type,
        title,
        description: factor.detail,
        status: 'open',
      },
    })

    // Audit every alert creation so downstream reports can explain decisions.
    await prisma.auditLog.create({
      data: {
        firmId: invoice?.client?.firm?.id || clientId,
        clientId,
        userId: null,
        action: 'alert_created',
        entityType: 'alert',
        entityId: `${clientId}:${invoiceId}:${type}`,
        details: {
          severity,
          type,
          title,
          riskScore: scanResult.riskScore,
          classification: scanResult.classification,
        },
      },
    })

    // Immediate notifications for high/critical risk.
    if (!firmEmail) continue
    if (severity !== 'critical' && severity !== 'high') continue

    const firmName = invoice?.client?.firm?.name || undefined
    const clientName = invoice?.client?.name || 'Unknown client'
    const vendorName = invoice?.vendor?.displayName || 'Unknown vendor'
    const amountText = invoice ? `$${invoice.amount.toLocaleString()}` : 'Unknown amount'

    await sendAlertEmail({
      to: firmEmail,
      firmName,
      subject: `${severity.toUpperCase()}: ${title}`,
      text:
        `Vantirs flagged a suspicious invoice.\n\n` +
        `Firm: ${firmName ?? 'Unknown firm'}\n` +
        `Client: ${clientName}\n` +
        `Vendor: ${vendorName}\n` +
        `Invoice: ${invoice?.invoiceNumber ? `#${invoice.invoiceNumber}` : '(no invoice number)'}\n` +
        `Amount: ${amountText}\n` +
        `Risk score: ${scanResult.riskScore}/100 (${scanResult.classification})\n` +
        `Alert: ${title}\n` +
        `Details: ${factor.detail}\n\n` +
        `Vantirs provides payment verification assistance and does not guarantee fraud detection.\n` +
        `Always verify suspicious payments through direct phone contact with known vendor numbers.`,
    })

    if (slackWebhookUrl) {
      await sendSlackAlert({
        webhookUrl: slackWebhookUrl,
        text:
          `Vantirs *${severity.toUpperCase()}* alert: ${title}\n` +
          `Firm: ${firmName ?? 'Unknown firm'}\n` +
          `Client: ${clientName}\n` +
          `Vendor: ${vendorName}\n` +
          `Amount: ${amountText}\n` +
          `Risk: ${scanResult.riskScore}/100 (${scanResult.classification})`,
      })
    }
  }
}
