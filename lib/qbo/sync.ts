import { getQBOClient } from './client'
import { prisma } from '@/lib/prisma'
import { calculateFingerprint } from '@/lib/fingerprint/calculate'
import { hashBankData } from '@/lib/encryption'

interface QBOVendor {
  Id: string
  DisplayName: string
  CompanyName?: string
  PrimaryEmailAddr?: { Address: string }
  PrimaryPhone?: { FreeFormNumber: string }
  BillAddr?: object
  Active: boolean
  MetaData: { CreateTime: string; LastUpdatedTime: string }
}

interface QBOBill {
  Id: string
  VendorRef: { value: string; name: string }
  TotalAmt: number
  CurrencyRef?: { value: string }
  DueDate?: string
  DocNumber?: string
  TxnDate: string
  PaymentType?: string
  BankAccountRef?: { value: string }
  MetaData: { CreateTime: string }
}

export async function initialSync(clientId: string) {
  await prisma.client.update({
    where: { id: clientId },
    data: { syncStatus: 'syncing' },
  })

  try {
    const qbo = await getQBOClient(clientId)
    if (!qbo) throw new Error('QBO client unavailable — check OAuth tokens')

    // 1. Sync vendors
    const vendors = await qbo.query<QBOVendor>('SELECT * FROM Vendor MAXRESULTS 1000')
    await syncVendors(clientId, vendors)

    // 2. Sync bills (last 18 months)
    const since = new Date()
    since.setMonth(since.getMonth() - 18)
    const sinceStr = since.toISOString().split('T')[0]

    const bills = await qbo.query<QBOBill>(
      `SELECT * FROM Bill WHERE TxnDate >= '${sinceStr}' MAXRESULTS 1000`
    )
    await syncBills(clientId, bills)

    // 3. Build fingerprints for all vendors with enough data
    const allVendors = await prisma.vendor.findMany({ where: { clientId } })
    for (const vendor of allVendors) {
      await calculateFingerprint(vendor.id)
    }

    await prisma.client.update({
      where: { id: clientId },
      data: { syncStatus: 'synced', lastSyncAt: new Date() },
    })

    return { success: true, vendorCount: vendors.length, billCount: bills.length }
  } catch (err) {
    await prisma.client.update({
      where: { id: clientId },
      data: { syncStatus: 'error' },
    })
    throw err
  }
}

export async function incrementalSync(clientId: string) {
  const client = await prisma.client.findUnique({ where: { id: clientId } })
  if (!client?.lastSyncAt) return initialSync(clientId)

  const qbo = await getQBOClient(clientId)
  if (!qbo) throw new Error('QBO client unavailable')

  const changedSince = client.lastSyncAt.toISOString()
  const cdcData = await qbo.cdc('Vendor,Bill', changedSince)

  const changedVendors: QBOVendor[] = cdcData.CDCResponse?.[0]?.QueryResponse?.find(
    (q: any) => q.Vendor
  )?.Vendor || []

  const changedBills: QBOBill[] = cdcData.CDCResponse?.[0]?.QueryResponse?.find(
    (q: any) => q.Bill
  )?.Bill || []

  if (changedVendors.length) await syncVendors(clientId, changedVendors)
  if (changedBills.length) await syncBills(clientId, changedBills)

  await prisma.client.update({
    where: { id: clientId },
    data: { lastSyncAt: new Date() },
  })

  return { success: true, changedVendors: changedVendors.length, changedBills: changedBills.length }
}

async function syncVendors(clientId: string, vendors: QBOVendor[]) {
  for (const v of vendors) {
    const email = v.PrimaryEmailAddr?.Address
    const emailDomain = email ? email.split('@')[1] : undefined

    await prisma.vendor.upsert({
      where: { clientId_qboVendorId: { clientId, qboVendorId: v.Id } },
      update: {
        displayName: v.DisplayName,
        companyName: v.CompanyName,
        email,
        emailDomain,
        phone: v.PrimaryPhone?.FreeFormNumber,
        isActive: v.Active,
        updatedAt: new Date(),
      },
      create: {
        clientId,
        qboVendorId: v.Id,
        displayName: v.DisplayName,
        companyName: v.CompanyName,
        email,
        emailDomain,
        phone: v.PrimaryPhone?.FreeFormNumber,
        isActive: v.Active,
        firstSeenAt: new Date(v.MetaData.CreateTime),
      },
    })
  }
}

async function syncBills(clientId: string, bills: QBOBill[]) {
  for (const b of bills) {
    const vendor = await prisma.vendor.findFirst({
      where: { clientId, qboVendorId: b.VendorRef.value },
    })

    const bankAccountHash = b.BankAccountRef?.value
      ? hashBankData(b.BankAccountRef.value)
      : undefined

    await prisma.invoice.upsert({
      where: { qboBillId: b.Id } as any,
      update: {
        amount: b.TotalAmt,
        dueDate: b.DueDate ? new Date(b.DueDate) : undefined,
        bankAccountHash,
        status: 'pending',
      },
      create: {
        clientId,
        vendorId: vendor?.id,
        qboBillId: b.Id,
        invoiceNumber: b.DocNumber,
        amount: b.TotalAmt,
        currency: b.CurrencyRef?.value || 'USD',
        dueDate: b.DueDate ? new Date(b.DueDate) : undefined,
        bankAccountHash,
        status: 'pending',
        createdAt: new Date(b.MetaData.CreateTime),
      },
    })

    // Update vendor's last payment date
    if (vendor) {
      await prisma.vendor.update({
        where: { id: vendor.id },
        data: { lastPaymentAt: new Date(b.TxnDate) },
      })
    }
  }
}
