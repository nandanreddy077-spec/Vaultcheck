import { prisma } from '@/lib/prisma'
import type { RiskFactor, ScanResult } from '@/lib/scanner/scan'

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

  for (const factor of significantFactors) {
    const existingAlert = await prisma.alert.findFirst({
      where: { invoiceId, type: FACTOR_TYPE[factor.factor] || 'amount_anomaly' },
    })
    if (existingAlert) continue

    await prisma.alert.create({
      data: {
        clientId,
        invoiceId,
        severity: FACTOR_SEVERITY[factor.factor] || 'medium',
        type: FACTOR_TYPE[factor.factor] || 'amount_anomaly',
        title: FACTOR_TITLE[factor.factor] || 'Anomaly Detected',
        description: factor.detail,
        status: 'open',
      },
    })
  }
}
