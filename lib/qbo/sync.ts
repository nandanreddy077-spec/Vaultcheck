import { runConcurrently } from '@/lib/concurrency'
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

    // 3. Build fingerprints for all vendors based on paid history (parallel, 10 at a time)
    const allVendors = await prisma.vendor.findMany({ where: { clientId } })
    await runConcurrently(allVendors.map(v => () => calculateFingerprint(v.id)), 10)

    // 4. Scan newly synced invoices to generate alerts/risk scores (parallel, 5 at a time)
    const invoicesToScan = await prisma.invoice.findMany({
      where: { clientId },
      select: { id: true, status: true },
    })
    const terminalStatuses = ['approved', 'rejected', 'paid']
    const pendingScans = invoicesToScan.filter(inv => !terminalStatuses.includes(inv.status))
    await runConcurrently(pendingScans.map(inv => () => scanInvoice(inv.id)), 5)

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

    // Update fingerprints only for vendors whose payment history changed (parallel)
    const uniqueVendorIds = Array.from(new Set(affectedVendorIds))
    await runConcurrently(uniqueVendorIds.map(id => () => calculateFingerprint(id)), 10)

    // Scan invoices that were created/updated during this sync (parallel)
    const uniqueInvoiceIds = Array.from(new Set(syncedInvoiceIds))
    await runConcurrently(uniqueInvoiceIds.map(id => () => scanInvoice(id)), 5)

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
  await runConcurrently(
    vendors.map(v => async () => {
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
    }),
    20
  )
}

async function syncBills(
  clientId: string,
  bills: QBOBill[]
): Promise<{ invoiceIds: string[]; vendorIds: string[] }> {
  // Pre-fetch all vendors for this client once, then use a map — avoids N queries
  const allVendors = await prisma.vendor.findMany({
    where: { clientId },
    select: { id: true, qboVendorId: true, email: true },
  })
  const vendorByQboId = new Map(allVendors.map(v => [v.qboVendorId, v]))

  const invoiceIds: string[] = []
  const vendorIds: string[] = []
  const mu = new Map<string, string>() // qboBillId → invoiceId

  await runConcurrently(
    bills.map(b => async () => {
      const vendor = vendorByQboId.get(b.VendorRef.value) ?? null
      const bankAccountHash = b.BankAccountRef?.value
        ? hashBankData(b.BankAccountRef.value)
        : undefined

      // Read existing status so we don't overwrite human decisions
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
          createdAt: new Date(b.TxnDate),
        },
      })

      mu.set(b.Id, upserted.id)
      if (vendor?.id) vendorIds.push(vendor.id)
    }),
    20
  )

  for (const id of mu.values()) invoiceIds.push(id)
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
