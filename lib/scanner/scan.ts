import { prisma } from '@/lib/prisma'
import { createAlert } from '@/lib/alerts/create'
import type { Prisma } from '@prisma/client'

export interface RiskFactor {
  factor: string
  weight: number
  detail: string
}

export interface ScanResult {
  riskScore: number
  classification: 'low' | 'moderate' | 'high' | 'critical'
  recommendation: string
  riskFactors: RiskFactor[]
}

function extractDomain(email: string): string {
  return email.split('@')[1]?.toLowerCase() || ''
}

function classifyScore(score: number): ScanResult['classification'] {
  if (score <= 15) return 'low'
  if (score <= 35) return 'moderate'
  if (score <= 65) return 'high'
  return 'critical'
}

function getRecommendation(score: number): string {
  if (score <= 15) return 'Low risk. No action required.'
  if (score <= 35) return 'Moderate risk. Review before payment.'
  if (score <= 65) return 'High risk. Verify with vendor directly before payment.'
  return 'CRITICAL: Hold payment immediately. Call vendor on known phone number to verify.'
}

export async function scanInvoice(invoiceId: string): Promise<ScanResult> {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      vendor: { include: { fingerprint: true } },
      client: true,
    },
  })

  if (!invoice) throw new Error('Invoice not found')

  const terminalStatuses = ['approved', 'rejected', 'paid']
  const nextStatus = terminalStatuses.includes(invoice.status) ? invoice.status : 'scanned'

  // If we can't link the invoice to a known vendor, don't fabricate a score.
  // This keeps rescans safe and avoids generating misleading alerts from incomplete ingestion.
  if (!invoice.vendorId) {
    const result: ScanResult = {
      riskScore: 0,
      classification: classifyScore(0),
      recommendation: 'Insufficient vendor linkage to reliably score this invoice.',
      riskFactors: [],
    }

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        riskScore: 0,
        riskFactors: [] as unknown as Prisma.InputJsonValue,
        scanResult: result as unknown as Prisma.InputJsonValue,
        status: nextStatus,
        scannedAt: new Date(),
      },
    })

    await prisma.auditLog.create({
      data: {
        firmId: invoice.client.firmId,
        clientId: invoice.clientId,
        action: 'invoice_scanned',
        entityType: 'invoice',
        entityId: invoiceId,
        details: { riskScore: 0, classification: result.classification, reason: 'missing_vendorId' },
      },
    })

    return result
  }

  const fingerprint = invoice.vendor?.fingerprint
  const riskFactors: RiskFactor[] = []
  let totalScore = 0

  // ── Check 1: Bank account changed (weight: 45) ──────────────────────────────
  if (fingerprint && invoice.bankAccountHash && fingerprint.knownBankHashes.length > 0) {
    if (!fingerprint.knownBankHashes.includes(invoice.bankAccountHash)) {
      riskFactors.push({
        factor: 'bank_account_changed',
        weight: 45,
        detail: `Bank account does not match any of ${fingerprint.knownBankHashes.length} known account(s) for this vendor.`,
      })
      totalScore += 45
    }
  }

  // ── Check 2: Email domain mismatch (weight: 25) ──────────────────────────────
  if (fingerprint && invoice.senderEmail && fingerprint.knownEmails.length > 0) {
    const domain = extractDomain(invoice.senderEmail)
    const knownDomains = fingerprint.knownEmails.map(extractDomain)
    if (domain && !knownDomains.includes(domain)) {
      riskFactors.push({
        factor: 'email_domain_mismatch',
        weight: 25,
        detail: `Sender domain "${domain}" not in known domains: ${knownDomains.join(', ')}.`,
      })
      totalScore += 25
    }
  }

  // ── Check 3: Amount anomaly (weights: 20 / 10) ───────────────────────────────
  if (fingerprint && fingerprint.totalInvoices >= 3 && fingerprint.stdDevAmount > 0) {
    const zScore = (invoice.amount - fingerprint.avgAmount) / fingerprint.stdDevAmount
    if (zScore > 3) {
      riskFactors.push({
        factor: 'amount_extreme_high',
        weight: 20,
        detail: `Amount $${invoice.amount.toFixed(2)} is ${zScore.toFixed(1)} std deviations above mean $${fingerprint.avgAmount.toFixed(2)}.`,
      })
      totalScore += 20
    } else if (zScore > 2) {
      riskFactors.push({
        factor: 'amount_moderate_high',
        weight: 10,
        detail: `Amount $${invoice.amount.toFixed(2)} is ${zScore.toFixed(1)} std deviations above mean $${fingerprint.avgAmount.toFixed(2)}.`,
      })
      totalScore += 10
    }
  }

  // ── Check 4: New vendor (weight: 15) ─────────────────────────────────────────
  if (!fingerprint || fingerprint.totalInvoices === 0) {
    riskFactors.push({
      factor: 'new_vendor_no_history',
      weight: 15,
      detail: 'First invoice from this vendor. No payment history to compare against.',
    })
    totalScore += 15
  }

  // ── Check 5: Invoice number pattern mismatch (weight: 8) ─────────────────────
  if (fingerprint && invoice.invoiceNumber && fingerprint.invoicePatterns.length > 0) {
    const matchesPattern = fingerprint.invoicePatterns.some(p =>
      invoice.invoiceNumber!.startsWith(p)
    )
    if (!matchesPattern) {
      riskFactors.push({
        factor: 'invoice_pattern_mismatch',
        weight: 8,
        detail: `Invoice number "${invoice.invoiceNumber}" doesn't match known patterns: ${fingerprint.invoicePatterns.join(', ')}.`,
      })
      totalScore += 8
    }
  }

  // ── Check 6: Frequency anomaly (weight: 7) ───────────────────────────────────
  if (fingerprint?.avgFreqDays) {
    const lastInvoice = await prisma.invoice.findFirst({
      where: { vendorId: invoice.vendorId, id: { not: invoiceId } },
      orderBy: { createdAt: 'desc' },
    })
    if (lastInvoice) {
      const daysSinceLast = Math.abs(
        (invoice.createdAt.getTime() - lastInvoice.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      )
      if (daysSinceLast < fingerprint.avgFreqDays / 3) {
        riskFactors.push({
          factor: 'frequency_anomaly',
          weight: 7,
          detail: `Invoice arrived ${daysSinceLast.toFixed(0)} days after last one (expected ~${fingerprint.avgFreqDays.toFixed(0)} days).`,
        })
        totalScore += 7
      }
    }
  }

  // ── Check 7: Low confidence penalty (weight: 0-10) ───────────────────────────
  if (fingerprint && fingerprint.confidenceScore < 0.5) {
    const penalty = Math.round((1 - fingerprint.confidenceScore) * 10)
    riskFactors.push({
      factor: 'confidence_penalty',
      weight: penalty,
      detail: `Low data confidence (${(fingerprint.confidenceScore * 100).toFixed(0)}%). Results less reliable.`,
    })
    totalScore += penalty
  }

  const finalScore = Math.min(100, totalScore)
  const result: ScanResult = {
    riskScore: finalScore,
    classification: classifyScore(finalScore),
    recommendation: getRecommendation(finalScore),
    riskFactors,
  }

  // Persist scan result
  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      riskScore: finalScore,
      riskFactors: riskFactors as unknown as Prisma.InputJsonValue,
      scanResult: result as unknown as Prisma.InputJsonValue,
      status: nextStatus,
      scannedAt: new Date(),
    },
  })

  // Create alerts for high/critical risk
  if (finalScore > 15 && !terminalStatuses.includes(invoice.status)) {
    await createAlert(invoice.clientId, invoiceId, result, riskFactors)
  }

  // Audit log
  await prisma.auditLog.create({
    data: {
      firmId: invoice.client.firmId,
      clientId: invoice.clientId,
      action: 'invoice_scanned',
      entityType: 'invoice',
      entityId: invoiceId,
      details: { riskScore: finalScore, classification: result.classification },
    },
  })

  return result
}
