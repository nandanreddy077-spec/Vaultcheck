import { Contact, Invoice, Payment, Phone, PurchaseOrder } from 'xero-node'
import { hashBankData } from '@/lib/encryption'
import { calculateFingerprint } from '@/lib/fingerprint/calculate'
import { prisma } from '@/lib/prisma'
import { scanInvoice } from '@/lib/scanner/scan'
import { getXeroClient } from './client'

function asUpper(value: unknown): string {
  return typeof value === 'string' ? value.toUpperCase() : ''
}

function toDate(value: unknown, fallback = new Date()): Date {
  if (value instanceof Date) return value
  if (typeof value !== 'string') return fallback
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? fallback : date
}

function defaultPhone(phones: Phone[] | undefined): string | undefined {
  const phone = phones?.find(p => String(p.phoneType ?? '').toUpperCase() === 'DEFAULT') ?? phones?.[0]
  return phone?.phoneNumber ?? undefined
}

export async function initialSync(clientId: string) {
  await prisma.client.update({
    where: { id: clientId },
    data: { xeroSyncStatus: 'syncing' },
  })

  try {
    const xero = await getXeroClient(clientId)
    if (!xero) throw new Error('Xero client unavailable — check OAuth tokens')

    const contacts = await xero.getContacts()
    await syncContacts(clientId, contacts)

    const since = new Date()
    since.setMonth(since.getMonth() - 18)

    const bills = await xero.getBills({
      sinceDate: since,
    })
    const billsResult = await syncBills(clientId, bills)

    const purchaseOrders = await xero.getPurchaseOrders({
      sinceDate: since,
    })
    const purchaseOrdersResult = await syncPurchaseOrders(clientId, purchaseOrders)

    const payments = await xero.getPayments({
      sinceDate: since,
    })
    await syncPayments(clientId, payments)

    const allVendors = await prisma.vendor.findMany({
      where: { clientId, platform: 'xero' },
    })
    for (const vendor of allVendors) {
      await calculateFingerprint(vendor.id)
    }

    const invoicesToScan = await prisma.invoice.findMany({
      where: { clientId, platform: 'xero' },
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
      data: { xeroSyncStatus: 'synced', xeroLastSyncAt: new Date() },
    })

    return {
      success: true,
      vendorCount: contacts.length,
      billCount: billsResult.syncedCount,
      purchaseOrderCount: purchaseOrdersResult.syncedCount,
      paymentCount: payments.length,
    }
  } catch (err) {
    await prisma.client.update({
      where: { id: clientId },
      data: { xeroSyncStatus: 'error' },
    })
    throw err
  }
}

export async function incrementalSync(clientId: string) {
  const client = await prisma.client.findUnique({ where: { id: clientId } })
  if (!client?.xeroLastSyncAt) return initialSync(clientId)

  await prisma.client.update({
    where: { id: clientId },
    data: { xeroSyncStatus: 'syncing' },
  })

  try {
    const xero = await getXeroClient(clientId)
    if (!xero) throw new Error('Xero client unavailable')

    const modifiedSince = client.xeroLastSyncAt
    const changedContacts = await xero.getContacts(modifiedSince)
    const changedBills = await xero.getBills({ modifiedSince })
    const changedPurchaseOrders = await xero.getPurchaseOrders({ modifiedSince })
    const changedPayments = await xero.getPayments({ modifiedSince })

    const affectedVendorIds: string[] = []

    if (changedContacts.length) {
      await syncContacts(clientId, changedContacts)
      const xeroContactIds = changedContacts
        .map(c => c.contactID)
        .filter((id): id is string => Boolean(id))
      const syncedVendors = await prisma.vendor.findMany({
        where: { clientId, xeroContactId: { in: xeroContactIds } },
        select: { id: true },
      })
      affectedVendorIds.push(...syncedVendors.map(v => v.id))
    }

    let syncedInvoiceIds: string[] = []
    if (changedBills.length) {
      const result = await syncBills(clientId, changedBills)
      syncedInvoiceIds.push(...result.invoiceIds)
      affectedVendorIds.push(...result.vendorIds)
    }

    if (changedPurchaseOrders.length) {
      const result = await syncPurchaseOrders(clientId, changedPurchaseOrders)
      syncedInvoiceIds.push(...result.invoiceIds)
      affectedVendorIds.push(...result.vendorIds)
    }

    if (changedPayments.length) {
      const result = await syncPayments(clientId, changedPayments)
      affectedVendorIds.push(...result.vendorIds)
    }

    for (const vendorId of Array.from(new Set(affectedVendorIds))) {
      await calculateFingerprint(vendorId)
    }

    for (const invoiceId of Array.from(new Set(syncedInvoiceIds))) {
      await scanInvoice(invoiceId)
    }

    await prisma.client.update({
      where: { id: clientId },
      data: { xeroLastSyncAt: new Date(), xeroSyncStatus: 'synced' },
    })

    return {
      success: true,
      changedVendors: changedContacts.length,
      changedBills: changedBills.length,
      changedPurchaseOrders: changedPurchaseOrders.length,
      scannedInvoices: syncedInvoiceIds.length,
      updatedFingerprints: affectedVendorIds.length,
    }
  } catch (err) {
    await prisma.client.update({
      where: { id: clientId },
      data: { xeroSyncStatus: 'error' },
    })
    throw err
  }
}

async function syncContacts(clientId: string, contacts: Contact[]) {
  for (const c of contacts) {
    const contactId = c.contactID
    if (!contactId) continue

    const email = c.emailAddress || undefined
    const emailDomain = email ? email.split('@')[1] : undefined
    const phone = defaultPhone(c.phones)
    const isActive = asUpper(c.contactStatus) === 'ACTIVE'

    await prisma.vendor.upsert({
      where: { clientId_xeroContactId: { clientId, xeroContactId: contactId } },
      update: {
        displayName: c.name ?? 'Unknown vendor',
        email,
        emailDomain,
        phone,
        bankAccount: c.bankAccountDetails || undefined,
        isActive,
        updatedAt: new Date(),
      },
      create: {
        clientId,
        xeroContactId: contactId,
        platform: 'xero',
        displayName: c.name ?? 'Unknown vendor',
        email,
        emailDomain,
        phone,
        bankAccount: c.bankAccountDetails || undefined,
        isActive,
        firstSeenAt: toDate(c.updatedDateUTC),
      },
    })
  }
}

async function syncBills(
  clientId: string,
  bills: Invoice[],
): Promise<{ invoiceIds: string[]; vendorIds: string[]; syncedCount: number }> {
  const invoiceIds: string[] = []
  const vendorIds: string[] = []
  let syncedCount = 0

  for (const b of bills) {
    const billId = b.invoiceID
    if (!billId) continue

    const status = asUpper(b.status)
    if (status === 'VOIDED' || status === 'DELETED') continue

    const contactId = b.contact?.contactID
    const vendor = await prisma.vendor.findFirst({
      where: { clientId, xeroContactId: contactId },
    })

    const vendorBankHash = vendor?.bankAccount ? hashBankData(vendor.bankAccount) : undefined

    const existing = await prisma.invoice.findFirst({
      where: { xeroBillId: billId },
      select: { id: true, status: true, bankAccountHash: true },
    })

    const isPaid = status === 'PAID'
    const nextStatus = existing?.status
      ? existing.status
      : isPaid
        ? 'paid'
        : 'pending'

    const upserted = await prisma.invoice.upsert({
      where: { xeroBillId: billId },
      update: {
        amount: b.total ?? 0,
        invoiceNumber: b.invoiceNumber,
        currency: String(b.currencyCode || 'USD'),
        dueDate: b.dueDate ? new Date(b.dueDate) : undefined,
        bankAccountHash: existing?.bankAccountHash ?? vendorBankHash,
        status: nextStatus,
        vendorId: vendor?.id,
        senderEmail: vendor?.email,
      },
      create: {
        clientId,
        vendorId: vendor?.id,
        xeroBillId: billId,
        platform: 'xero',
        invoiceNumber: b.invoiceNumber,
        amount: b.total ?? 0,
        currency: String(b.currencyCode || 'USD'),
        dueDate: b.dueDate ? new Date(b.dueDate) : undefined,
        bankAccountHash: vendorBankHash,
        senderEmail: vendor?.email,
        status: isPaid ? 'paid' : 'pending',
        createdAt: toDate(b.date),
      },
    })

    invoiceIds.push(upserted.id)
    if (vendor?.id) vendorIds.push(vendor.id)
    syncedCount += 1
  }

  return { invoiceIds, vendorIds, syncedCount }
}

async function syncPurchaseOrders(
  clientId: string,
  purchaseOrders: PurchaseOrder[],
): Promise<{ invoiceIds: string[]; vendorIds: string[]; syncedCount: number }> {
  const invoiceIds: string[] = []
  const vendorIds: string[] = []
  let syncedCount = 0

  for (const po of purchaseOrders) {
    const purchaseOrderId = po.purchaseOrderID
    if (!purchaseOrderId) continue

    const status = asUpper(po.status)
    if (status === 'DELETED') continue

    const contactId = po.contact?.contactID
    const vendor = await prisma.vendor.findFirst({
      where: { clientId, xeroContactId: contactId },
    })

    const poExternalId = `po:${purchaseOrderId}`
    const existing = await prisma.invoice.findFirst({
      where: { xeroBillId: poExternalId },
      select: { id: true, status: true, bankAccountHash: true },
    })
    const vendorBankHash = vendor?.bankAccount ? hashBankData(vendor.bankAccount) : undefined

    const isPaidLike = status === 'BILLED'
    const nextStatus = existing?.status
      ? existing.status
      : isPaidLike
        ? 'paid'
        : 'pending'

    const upserted = await prisma.invoice.upsert({
      where: { xeroBillId: poExternalId },
      update: {
        amount: po.total ?? 0,
        invoiceNumber: po.purchaseOrderNumber,
        currency: String(po.currencyCode || 'USD'),
        dueDate: po.deliveryDate ? new Date(po.deliveryDate) : undefined,
        bankAccountHash: existing?.bankAccountHash ?? vendorBankHash,
        status: nextStatus,
        vendorId: vendor?.id,
        senderEmail: vendor?.email,
      },
      create: {
        clientId,
        vendorId: vendor?.id,
        xeroBillId: poExternalId,
        platform: 'xero',
        invoiceNumber: po.purchaseOrderNumber,
        amount: po.total ?? 0,
        currency: String(po.currencyCode || 'USD'),
        dueDate: po.deliveryDate ? new Date(po.deliveryDate) : undefined,
        bankAccountHash: vendorBankHash,
        senderEmail: vendor?.email,
        status: isPaidLike ? 'paid' : 'pending',
        createdAt: toDate(po.date),
      },
    })

    invoiceIds.push(upserted.id)
    if (vendor?.id) vendorIds.push(vendor.id)
    syncedCount += 1
  }

  return { invoiceIds, vendorIds, syncedCount }
}

async function syncPayments(
  clientId: string,
  payments: Payment[],
): Promise<{ vendorIds: string[]; paymentCount: number }> {
  const sorted = [...payments].sort(
    (a, b) => toDate(a.date).getTime() - toDate(b.date).getTime(),
  )

  const affectedVendorIds = new Set<string>()

  for (const p of sorted) {
    if (asUpper(p.status) !== 'AUTHORISED') continue
    if (!p.invoice?.invoiceID) continue

    const paidAt = toDate(p.date)

    await prisma.invoice.updateMany({
      where: {
        clientId,
        xeroBillId: p.invoice.invoiceID,
      },
      data: { status: 'paid' },
    })

    const invoices = await prisma.invoice.findMany({
      where: { clientId, xeroBillId: p.invoice.invoiceID },
      select: { vendorId: true },
    })

    for (const inv of invoices) {
      if (!inv.vendorId) continue
      affectedVendorIds.add(inv.vendorId)
      await prisma.vendor.update({
        where: { id: inv.vendorId },
        data: { lastPaymentAt: paidAt },
      })
    }
  }

  return { vendorIds: Array.from(affectedVendorIds), paymentCount: payments.length }
}
