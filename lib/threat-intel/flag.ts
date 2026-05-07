import { prisma } from '@/lib/prisma'

/**
 * Called when a firm resolves an alert as confirmed_fraud.
 * Creates a GlobalThreatFlag so every other Vantirs client with
 * the same vendor email domain or bank account gets warned automatically.
 */
export async function createThreatFlag({
  firmId,
  vendorName,
  emailDomain,
  bankHash,
  reason = 'bank_fraud',
  notes,
}: {
  firmId: string
  vendorName?: string | null
  emailDomain?: string | null
  bankHash?: string | null
  reason?: string
  notes?: string
}) {
  // Need at least one identifier to be useful
  if (!vendorName && !emailDomain && !bankHash) return

  // Avoid duplicate flags from the same firm for the same identifiers
  const existing = await prisma.globalThreatFlag.findFirst({
    where: {
      flaggedByFirmId: firmId,
      active: true,
      OR: [
        emailDomain ? { emailDomain } : {},
        bankHash ? { bankHash } : {},
      ].filter(c => Object.keys(c).length > 0),
    },
  })

  if (existing) return

  await prisma.globalThreatFlag.create({
    data: {
      vendorName: vendorName?.toLowerCase().trim() ?? null,
      emailDomain: emailDomain?.toLowerCase().trim() ?? null,
      bankHash: bankHash ?? null,
      flaggedByFirmId: firmId,
      reason,
      notes: notes ?? null,
    },
  })
}
