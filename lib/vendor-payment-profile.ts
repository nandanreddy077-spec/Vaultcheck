import { hashBankData } from '@/lib/encryption'

/**
 * Canonical string for vendor remittance / payment instructions.
 * Used for fingerprinting and bank-change detection (not payer AP accounts).
 */
export function canonicalPaymentProfile(parts: {
  bankAccount?: string | null
  routingNumber?: string | null
  acctNum?: string | null
}): string | undefined {
  const segments: string[] = []
  if (parts.bankAccount?.trim()) segments.push(`bank:${parts.bankAccount.trim()}`)
  if (parts.routingNumber?.trim()) segments.push(`routing:${parts.routingNumber.trim()}`)
  if (parts.acctNum?.trim()) segments.push(`acct:${parts.acctNum.trim()}`)
  if (!segments.length) return undefined
  return segments.join('|')
}

export function hashPaymentProfile(canonical: string | undefined): string | undefined {
  if (!canonical) return undefined
  return hashBankData(canonical)
}

/** Normalize Xero bankAccountDetails (object or string) for storage + hashing. */
export function canonicalXeroBankDetails(details: unknown): string | undefined {
  if (details == null) return undefined
  if (typeof details === 'string') {
    const t = details.trim()
    return t || undefined
  }
  if (typeof details === 'object') {
    try {
      const keys = Object.keys(details as object).sort()
      const normalized = keys.reduce<Record<string, unknown>>((acc, k) => {
        const v = (details as Record<string, unknown>)[k]
        if (v != null && v !== '') acc[k] = v
        return acc
      }, {})
      if (!Object.keys(normalized).length) return undefined
      return JSON.stringify(normalized)
    } catch {
      return undefined
    }
  }
  return undefined
}
