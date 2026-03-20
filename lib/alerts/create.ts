import { prisma } from '@/lib/prisma'
import type { RiskFactor, ScanResult } from '@/lib/scanner/scan'
import { sendAlertEmail } from '@/lib/notifications/resend'
import { getSlackWebhookUrl, sendSlackAlert } from '@/lib/notifications/slack'

const FACTOR_SEVERITY: Record<string, string> = {
  bank_account_changed: 'critical',
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
  email_domain_mismatch: 'Email Domain Mismatch',
  amount_extreme_high: 'Unusually High Amount',
  amount_moderate_high: 'Elevated Invoice Amount',
  new_vendor_no_history: 'First Invoice from Vendor',
  invoice_pattern_mismatch: 'Invoice Number Pattern Mismatch',
  frequency_anomaly: 'Unexpected Invoice Frequency',
  confidence_penalty: 'Limited Payment History',
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

    const firmName = invoice?.client?.firm?.name || 'Unknown firm'
    const clientName = invoice?.client?.name || 'Unknown client'
    const vendorName = invoice?.vendor?.displayName || 'Unknown vendor'
    const amountText = invoice ? `$${invoice.amount.toLocaleString()}` : 'Unknown amount'

    await sendAlertEmail({
      to: firmEmail,
      subject: `[VaultCheck] ${severity.toUpperCase()}: ${title}`,
      text:
        `VaultCheck flagged a suspicious invoice.\n\n` +
        `Firm: ${firmName}\n` +
        `Client: ${clientName}\n` +
        `Vendor: ${vendorName}\n` +
        `Invoice: ${invoice?.invoiceNumber ? `#${invoice.invoiceNumber}` : '(no invoice number)'}\n` +
        `Amount: ${amountText}\n` +
        `Risk score: ${scanResult.riskScore}/100 (${scanResult.classification})\n` +
        `Alert: ${title}\n` +
        `Details: ${factor.detail}\n\n` +
        `VaultCheck provides payment verification assistance and does not guarantee fraud detection.\n` +
        `Always verify suspicious payments through direct phone contact with known vendor numbers.`,
    })

    if (slackWebhookUrl) {
      await sendSlackAlert({
        webhookUrl: slackWebhookUrl,
        text:
          `VaultCheck *${severity.toUpperCase()}* alert: ${title}\n` +
          `Firm: ${firmName}\n` +
          `Client: ${clientName}\n` +
          `Vendor: ${vendorName}\n` +
          `Amount: ${amountText}\n` +
          `Risk: ${scanResult.riskScore}/100 (${scanResult.classification})`,
      })
    }
  }
}
