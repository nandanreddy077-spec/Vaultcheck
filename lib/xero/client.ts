import { Contact, Invoice, Payment, PurchaseOrder, TokenSet, TokenSetParameters, XeroClient } from 'xero-node'
import { decrypt, encrypt } from '@/lib/encryption'
import { prisma } from '@/lib/prisma'

export const XERO_SCOPES = [
  'openid',
  'profile',
  'email',
  'accounting.transactions',
  'accounting.contacts',
  'accounting.settings',
  'offline_access',
]

function getXeroSdkConfig(state?: string) {
  const clientId = process.env.XERO_CLIENT_ID
  const clientSecret = process.env.XERO_CLIENT_SECRET
  const redirectUri = process.env.XERO_REDIRECT_URI
  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Xero integration is not configured')
  }

  return {
    clientId,
    clientSecret,
    redirectUris: [redirectUri],
    scopes: XERO_SCOPES,
    state,
  }
}

export async function createXeroOAuthClient(state?: string) {
  const xero = new XeroClient(getXeroSdkConfig(state))
  await xero.initialize()
  return xero
}

function toTokenSet(accessToken: string, refreshToken: string, expiry?: Date): TokenSetParameters {
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: 'Bearer',
    expires_at: expiry ? Math.floor(expiry.getTime() / 1000) : undefined,
  }
}

async function withRateLimitRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn()
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 429 && attempt < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
        continue
      }
      if (attempt < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500))
        continue
      }
      throw err
    }
  }
  throw new Error(`Xero request failed after ${retries} retries`)
}

async function persistRefreshedTokenSet(clientId: string, tokenSet: TokenSet) {
  const accessToken = tokenSet.access_token
  const refreshToken = tokenSet.refresh_token
  const expiresAt = tokenSet.expires_at
  if (!accessToken || !refreshToken || !expiresAt) return false

  await prisma.client.update({
    where: { id: clientId },
    data: {
      xeroAccessToken: encrypt(accessToken),
      xeroRefreshToken: encrypt(refreshToken),
      xeroTokenExpiry: new Date(expiresAt * 1000),
    },
  })
  return true
}

export async function getXeroClient(clientId: string) {
  const client = await prisma.client.findUnique({ where: { id: clientId } })
  if (!client?.xeroAccessToken || !client?.xeroRefreshToken || !client?.xeroTenantId) return null

  const xero = await createXeroOAuthClient()
  const tokenSet = toTokenSet(
    decrypt(client.xeroAccessToken),
    decrypt(client.xeroRefreshToken),
    client.xeroTokenExpiry ?? undefined,
  )
  xero.setTokenSet(tokenSet)

  const expiresSoon =
    !client.xeroTokenExpiry || client.xeroTokenExpiry < new Date(Date.now() + 5 * 60_000)
  if (expiresSoon) {
    const refreshed = await xero.refreshWithRefreshToken(
      process.env.XERO_CLIENT_ID,
      process.env.XERO_CLIENT_SECRET,
      decrypt(client.xeroRefreshToken),
    )
    const persisted = await persistRefreshedTokenSet(clientId, refreshed)
    if (!persisted) return null
    xero.setTokenSet(refreshed)
  }

  const tenantId = client.xeroTenantId

  async function getContacts(modifiedSince?: Date): Promise<Contact[]> {
    const response = await withRateLimitRetry(() =>
      xero.accountingApi.getContacts(
        tenantId,
        modifiedSince,
        'IsSupplier==true',
        undefined,
        undefined,
        undefined,
        true,
      ),
    )
    return response.body.contacts ?? []
  }

  async function getBills(opts?: { modifiedSince?: Date; sinceDate?: Date }): Promise<Invoice[]> {
    const filters = ['Type=="ACCPAY"']
    if (opts?.sinceDate) {
      filters.push(
        `Date>=DateTime(${opts.sinceDate.getFullYear()},${opts.sinceDate.getMonth() + 1},${opts.sinceDate.getDate()})`,
      )
    }

    const response = await withRateLimitRetry(() =>
      xero.accountingApi.getInvoices(
        tenantId,
        opts?.modifiedSince,
        filters.join('&&'),
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        true,
      ),
    )
    return response.body.invoices ?? []
  }

  async function getPayments(opts?: { modifiedSince?: Date; sinceDate?: Date }): Promise<Payment[]> {
    const filters = ['PaymentType=="ACCPAYPAYMENT"']
    if (opts?.sinceDate) {
      filters.push(
        `Date>=DateTime(${opts.sinceDate.getFullYear()},${opts.sinceDate.getMonth() + 1},${opts.sinceDate.getDate()})`,
      )
    }

    const response = await withRateLimitRetry(() =>
      xero.accountingApi.getPayments(tenantId, opts?.modifiedSince, filters.join('&&')),
    )
    return response.body.payments ?? []
  }

  async function getPurchaseOrders(opts?: {
    modifiedSince?: Date
    sinceDate?: Date
  }): Promise<PurchaseOrder[]> {
    const dateFrom = opts?.sinceDate ? opts.sinceDate.toISOString().split('T')[0] : undefined
    const response = await withRateLimitRetry(() =>
      xero.accountingApi.getPurchaseOrders(
        tenantId,
        opts?.modifiedSince,
        undefined,
        dateFrom,
      ),
    )
    return response.body.purchaseOrders ?? []
  }

  return { tenantId, clientId, getContacts, getBills, getPayments, getPurchaseOrders }
}
