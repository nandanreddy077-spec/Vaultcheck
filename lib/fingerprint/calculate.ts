import { prisma } from '@/lib/prisma'

function mean(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

function stdDev(arr: number[], avg?: number): number {
  const m = avg ?? mean(arr)
  return Math.sqrt(arr.reduce((sum, x) => sum + Math.pow(x - m, 2), 0) / arr.length)
}

function median(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

function daysBetween(a: Date, b: Date): number {
  return Math.abs(b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)
}

function monthsBetween(a: Date, b: Date): number {
  return Math.abs((b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()))
}

function detectPatterns(invoiceNums: string[]): string[] {
  if (!invoiceNums.length) return []
  // Extract common prefix patterns like "INV-", "BILL-", etc.
  const patterns: Set<string> = new Set()
  for (const num of invoiceNums) {
    const match = num.match(/^([A-Z]+[-_#]?)/)
    if (match) patterns.add(match[1])
  }
  return Array.from(patterns)
}

export async function calculateFingerprint(vendorId: string) {
  const invoices = await prisma.invoice.findMany({
    // Fingerprints should reflect "normal" based on payment history,
    // not on pending/unpaid bills.
    where: { vendorId, status: 'paid' },
    orderBy: { createdAt: 'asc' },
  })

  if (invoices.length < 2) {
    // Not enough data — create minimal fingerprint
    if (invoices.length === 1) {
      const inv = invoices[0]
      await prisma.vendorFingerprint.upsert({
        where: { vendorId },
        update: {
          avgAmount: inv.amount,
          stdDevAmount: 0,
          minAmount: inv.amount,
          maxAmount: inv.amount,
          medianAmount: inv.amount,
          knownEmails: inv.senderEmail ? [inv.senderEmail] : [],
          knownBankHashes: inv.bankAccountHash ? [inv.bankAccountHash] : [],
          invoicePatterns: inv.invoiceNumber ? detectPatterns([inv.invoiceNumber]) : [],
          totalInvoices: 1,
          totalPaid: inv.amount,
          confidenceScore: 0.05,
          lastUpdated: new Date(),
        },
        create: {
          vendorId,
          avgAmount: inv.amount,
          stdDevAmount: 0,
          minAmount: inv.amount,
          maxAmount: inv.amount,
          medianAmount: inv.amount,
          knownEmails: inv.senderEmail ? [inv.senderEmail] : [],
          knownBankHashes: inv.bankAccountHash ? [inv.bankAccountHash] : [],
          invoicePatterns: inv.invoiceNumber ? detectPatterns([inv.invoiceNumber]) : [],
          typicalDayOfMonth: [],
          totalInvoices: 1,
          totalPaid: inv.amount,
          confidenceScore: 0.05,
        },
      })
    }
    return
  }

  const amounts = invoices.map(i => i.amount)
  const avg = mean(amounts)
  const std = stdDev(amounts, avg)
  const med = median(amounts)

  // Frequency: days between consecutive invoices
  const gaps: number[] = []
  for (let i = 1; i < invoices.length; i++) {
    gaps.push(daysBetween(invoices[i - 1].createdAt, invoices[i].createdAt))
  }
  const avgFreqDays = gaps.length ? mean(gaps) : undefined

  // Typical days of month
  const daysOfMonth = invoices.map(i => i.createdAt.getDate())
  const typicalDayOfMonth = Array.from(new Set(daysOfMonth))

  // Known emails and bank hashes (deduplicated)
  const knownEmails = Array.from(
    new Set(invoices.map(i => i.senderEmail).filter((e): e is string => !!e)),
  )
  const knownBankHashes = Array.from(
    new Set(invoices.map(i => i.bankAccountHash).filter((e): e is string => !!e)),
  )
  const invoicePatterns = detectPatterns(invoices.map(i => i.invoiceNumber).filter((n): n is string => !!n))

  // Confidence: 0-1 based on data volume and history length
  const totalInvoices = invoices.length
  const monthsOfHistory = invoices.length >= 2
    ? monthsBetween(invoices[0].createdAt, invoices[invoices.length - 1].createdAt)
    : 0
  const confidence = Math.min(1, (totalInvoices / 12) * 0.5 + (monthsOfHistory / 12) * 0.5)

  await prisma.vendorFingerprint.upsert({
    where: { vendorId },
    update: {
      avgAmount: avg,
      stdDevAmount: std,
      minAmount: Math.min(...amounts),
      maxAmount: Math.max(...amounts),
      medianAmount: med,
      avgFreqDays,
      typicalDayOfMonth,
      knownEmails,
      knownBankHashes,
      invoicePatterns,
      totalInvoices,
      totalPaid: amounts.reduce((a, b) => a + b, 0),
      confidenceScore: confidence,
      lastUpdated: new Date(),
    },
    create: {
      vendorId,
      avgAmount: avg,
      stdDevAmount: std,
      minAmount: Math.min(...amounts),
      maxAmount: Math.max(...amounts),
      medianAmount: med,
      avgFreqDays,
      typicalDayOfMonth,
      knownEmails,
      knownBankHashes,
      invoicePatterns,
      totalInvoices,
      totalPaid: amounts.reduce((a, b) => a + b, 0),
      confidenceScore: confidence,
    },
  })
}
