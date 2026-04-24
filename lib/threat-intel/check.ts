import { prisma } from '@/lib/prisma'

export interface ThreatMatch {
  flagId: string
  reason: string
  matchedOn: 'emailDomain' | 'bankHash' | 'vendorName'
}

/**
 * Check whether a vendor/invoice matches any active GlobalThreatFlag
 * created by other firms. Returns all matches found.
 */
export async function checkThreatIntel({
  emailDomain,
  bankHash,
  vendorName,
}: {
  emailDomain?: string | null
  bankHash?: string | null
  vendorName?: string | null
}): Promise<ThreatMatch[]> {
  if (!emailDomain && !bankHash && !vendorName) return []

  const conditions: object[] = []
  if (emailDomain) conditions.push({ emailDomain: emailDomain.toLowerCase().trim() })
  if (bankHash) conditions.push({ bankHash })
  if (vendorName) conditions.push({ vendorName: vendorName.toLowerCase().trim() })

  const flags = await prisma.globalThreatFlag.findMany({
    where: { active: true, OR: conditions },
    select: { id: true, reason: true, emailDomain: true, bankHash: true, vendorName: true },
  })

  return flags.map(flag => ({
    flagId: flag.id,
    reason: flag.reason,
    matchedOn: flag.emailDomain === emailDomain?.toLowerCase()
      ? 'emailDomain'
      : flag.bankHash === bankHash
        ? 'bankHash'
        : 'vendorName',
  }))
}
