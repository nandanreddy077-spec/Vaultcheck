import { canonicalPaymentProfile } from '@/lib/vendor-payment-profile'

/** QBO Vendor fields used for remittance fingerprinting (minorversion 65+). */
export type QboVendorRaw = {
  Id: string
  AcctNum?: string
  TaxIdentifier?: string
  VendorPaymentBankDetail?: {
    BankAccountName?: string
    BankAccountNumber?: string
    RoutingNumber?: string
    IBAN?: string
  }
}

export function extractQboVendorPayment(v: QboVendorRaw): {
  bankAccount: string | undefined
  routingNumber: string | undefined
} {
  const detail = v.VendorPaymentBankDetail
  const bankParts: string[] = []
  if (detail?.BankAccountNumber) bankParts.push(detail.BankAccountNumber)
  if (detail?.BankAccountName) bankParts.push(detail.BankAccountName)
  if (detail?.IBAN) bankParts.push(detail.IBAN)

  const bankAccount =
    bankParts.length > 0
      ? bankParts.join(':')
      : v.AcctNum?.trim() || undefined

  const routingNumber = detail?.RoutingNumber?.trim() || undefined

  const canonical = canonicalPaymentProfile({
    bankAccount,
    routingNumber,
    acctNum: v.AcctNum?.trim(),
  })

  return {
    bankAccount: canonical ?? bankAccount,
    routingNumber,
  }
}
