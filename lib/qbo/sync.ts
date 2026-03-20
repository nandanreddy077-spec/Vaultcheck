import { getQBOClient } from './client'
import { prisma } from '@/lib/prisma'
import { calculateFingerprint } from '@/lib/fingerprint/calculate'
import { hashBankData } from '@/lib/encryption'
import { scanInvoice } from '@/lib/scanner/scan'

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

interface QBOBillPayment {
  Id: string
  TxnDate: string
  // QuickBooks represents the bill(s) being paid in LinkedTxn on Line items.
  Line?: Array<{
    LinkedTxn?: Array<{ TxnId?: string; TxnType?: string }> | { TxnId?: string; TxnType?: string }
  }>
  LinkedTxn?:
    | Array<{ TxnId?: string; TxnType?: string }>
    | { TxnId?: string; TxnType?: string }
}

type CdcQueryResponse = {
  Vendor?: QBOVendor[]
  Bill?: QBOBill[]
  BillPayment?: QBOBillPayment[]
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

    // 2b. Sync bill payments so we can mark invoices as "paid"
    const billPayments = await qbo.query<QBOBillPayment>(
      `SELECT * FROM BillPayment WHERE TxnDate >= '${sinceStr}' MAXRESULTS 1000`
    )
    await syncBillPayments(clientId, billPayments)

    // 3. Build fingerprints for all vendors based on paid history
    const allVendors = await prisma.vendor.findMany({ where: { clientId } })
    for (const vendor of allVendors) {
      await calculateFingerprint(vendor.id)
    }

    // 4. Scan newly synced invoices to generate alerts/risk scores
    const invoicesToScan = await prisma.invoice.findMany({
      where: { clientId },
      select: { id: true, status: true },
    })
    const terminalStatuses = ['approved', 'rejected', 'paid']
    for (const inv of invoicesToScan) {
      if (!terminalStatuses.includes(inv.status)) {
        await scanInvoice(inv.id)
      }
    }

    await prisma.client.update({
      where: { id: clientId },
      data: { syncStatus: 'synced', lastSyncAt: new Date() },
    })

    return {
      success: true,
      vendorCount: vendors.length,
      billCount: bills.length,
      paymentCount: billPayments.length,
    }
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

  await prisma.client.update({
    where: { id: clientId },
    data: { syncStatus: 'syncing' },
  })

  try {
    const qbo = await getQBOClient(clientId)
    if (!qbo) throw new Error('QBO client unavailable')

    const changedSince = client.lastSyncAt.toISOString()
    const cdcData = await qbo.cdc('Vendor,Bill,BillPayment', changedSince)
    const typedCdcData = cdcData as unknown as {
      CDCResponse?: Array<{ QueryResponse?: CdcQueryResponse[] }>
    }

    const queryResponse = typedCdcData.CDCResponse?.[0]?.QueryResponse ?? []
    const changedVendors: QBOVendor[] = queryResponse.find(q => Array.isArray(q.Vendor))?.Vendor ?? []
    const changedBills: QBOBill[] = queryResponse.find(q => Array.isArray(q.Bill))?.Bill ?? []
    const changedBillPayments: QBOBillPayment[] =
      queryResponse.find(q => Array.isArray(q.BillPayment))?.BillPayment ?? []

    const affectedVendorIds: string[] = []
    if (changedVendors.length) {
      await syncVendors(clientId, changedVendors)
      const qboVendorIds = changedVendors.map(v => v.Id)
      const syncedVendors = await prisma.vendor.findMany({
        where: { clientId, qboVendorId: { in: qboVendorIds } },
        select: { id: true },
      })
      affectedVendorIds.push(...syncedVendors.map(v => v.id))
    }

    let syncedInvoiceIds: string[] = []
    if (changedBills.length) {
      const result = await syncBills(clientId, changedBills)
      syncedInvoiceIds = result.invoiceIds
      affectedVendorIds.push(...result.vendorIds)
    }

    if (changedBillPayments.length) {
      const result = await syncBillPayments(clientId, changedBillPayments)
      affectedVendorIds.push(...result.vendorIds)
    }

    // Update fingerprints only for vendors whose payment history changed
    for (const vendorId of Array.from(new Set(affectedVendorIds))) {
      await calculateFingerprint(vendorId)
    }

    // Scan invoices that were created/updated during this sync
    for (const invoiceId of Array.from(new Set(syncedInvoiceIds))) {
      await scanInvoice(invoiceId)
    }

    await prisma.client.update({
      where: { id: clientId },
      data: { lastSyncAt: new Date(), syncStatus: 'synced' },
    })

    return {
      success: true,
      changedVendors: changedVendors.length,
      changedBills: changedBills.length,
      scannedInvoices: syncedInvoiceIds.length,
      updatedFingerprints: affectedVendorIds.length,
    }
  } catch (err) {
    await prisma.client.update({
      where: { id: clientId },
      data: { syncStatus: 'error' },
    })
    throw err
  }
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

async function syncBills(
  clientId: string,
  bills: QBOBill[]
): Promise<{ invoiceIds: string[]; vendorIds: string[] }> {
  const invoiceIds: string[] = []
  const vendorIds: string[] = []

  for (const b of bills) {
    const vendor = await prisma.vendor.findFirst({
      where: { clientId, qboVendorId: b.VendorRef.value },
    })

    const bankAccountHash = b.BankAccountRef?.value
      ? hashBankData(b.BankAccountRef.value)
      : undefined

    const existing = await prisma.invoice.findFirst({
      where: { qboBillId: b.Id },
      select: { id: true, status: true },
    })

    const nextStatus = existing?.status || 'pending'

    const upserted = await prisma.invoice.upsert({
      where: { qboBillId: b.Id },
      update: {
        amount: b.TotalAmt,
        invoiceNumber: b.DocNumber,
        currency: b.CurrencyRef?.value || 'USD',
        dueDate: b.DueDate ? new Date(b.DueDate) : undefined,
        bankAccountHash,
        // Preserve any human decision (approved/rejected) and avoid wiping it on sync.
        status: nextStatus,
        vendorId: vendor?.id,
        senderEmail: vendor?.email,
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
        senderEmail: vendor?.email,
        status: 'pending',
        // Use QuickBooks transaction date for fingerprinting and frequency anomalies.
        createdAt: new Date(b.TxnDate),
      },
    })

    // Vendor.lastPaymentAt is updated during BillPayment sync (paid invoices),
    // not during Bill sync.

    // Track what changed so we can rescan/recompute fingerprints
    invoiceIds.push(upserted.id)
    if (vendor?.id) vendorIds.push(vendor.id)
  }

  return { invoiceIds, vendorIds }
}

function extractLinkedBillIds(payment: QBOBillPayment): string[] {
  const billIds = new Set<string>()

  const addLinkedTxn = (linkedTxn: { TxnId?: string; TxnType?: string } | undefined) => {
    if (!linkedTxn) return
    const txnId = linkedTxn.TxnId
    if (!txnId) return
    // If TxnType is present, only include Bills.
    if (linkedTxn.TxnType && linkedTxn.TxnType !== 'Bill') return
    billIds.add(txnId)
  }

  const rootLinked = payment.LinkedTxn
  if (Array.isArray(rootLinked)) {
    for (const lt of rootLinked) addLinkedTxn(lt)
  } else {
    addLinkedTxn(rootLinked)
  }

  if (payment.Line) {
    for (const line of payment.Line) {
      const linked = line.LinkedTxn
      if (Array.isArray(linked)) {
        for (const lt of linked) addLinkedTxn(lt)
      } else {
        addLinkedTxn(linked)
      }
    }
  }

  return Array.from(billIds)
}

async function syncBillPayments(
  clientId: string,
  payments: QBOBillPayment[]
): Promise<{ vendorIds: string[]; paymentCount: number }> {
  // Process ascending so vendor.lastPaymentAt ends up as the latest payment date.
  const sorted = [...payments].sort((a, b) => new Date(a.TxnDate).getTime() - new Date(b.TxnDate).getTime())

  const affectedVendorIds = new Set<string>()

  for (const p of sorted) {
    const billIds = extractLinkedBillIds(p)
    if (!billIds.length) continue

    const paidAt = new Date(p.TxnDate)
    const paymentVendorIds = new Set<string>()

    // Mark invoices as paid. Keep other decision fields intact (we only update status).
    await prisma.invoice.updateMany({
      where: {
        clientId,
        qboBillId: { in: billIds },
      },
      data: {
        status: 'paid',
      },
    })

    // Update vendor's last payment date from all affected invoices.
    const invoices = await prisma.invoice.findMany({
      where: { clientId, qboBillId: { in: billIds } },
      select: { vendorId: true },
    })

    for (const inv of invoices) {
      if (!inv.vendorId) continue
      paymentVendorIds.add(inv.vendorId)
      affectedVendorIds.add(inv.vendorId)
    }

    for (const vendorId of Array.from(paymentVendorIds)) {
      await prisma.vendor.update({
        where: { id: vendorId },
        data: { lastPaymentAt: paidAt },
      })
    }
  }

  return { vendorIds: Array.from(affectedVendorIds), paymentCount: payments.length }
}
