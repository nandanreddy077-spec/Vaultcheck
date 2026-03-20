import { encrypt, decrypt } from '@/lib/encryption'
import { prisma } from '@/lib/prisma'

const QBO_BASE = process.env.QBO_ENVIRONMENT === 'production'
  ? 'https://quickbooks.api.intuit.com'
  : 'https://sandbox-quickbooks.api.intuit.com'

const TOKEN_URL = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer'

export const QBO_AUTH_URL = 'https://appcenter.intuit.com/connect/oauth2'
export const QBO_SCOPES = 'com.intuit.quickbooks.accounting'

export async function getQBOClient(clientId: string) {
  const client = await prisma.client.findUnique({ where: { id: clientId } })
  if (!client?.qboAccessToken || !client?.qboRealmId) return null

  // Auto-refresh if token is expired or expires within 5 minutes
  if (!client.qboTokenExpiry || client.qboTokenExpiry < new Date(Date.now() + 5 * 60_000)) {
    const refreshed = await refreshTokens(clientId, client.qboRefreshToken!)
    if (!refreshed) return null
    return createQBOClient(clientId, refreshed.accessToken, refreshed.realmId)
  }

  const accessToken = decrypt(client.qboAccessToken)
  return createQBOClient(clientId, accessToken, client.qboRealmId)
}

function createQBOClient(clientId: string, accessToken: string, realmId: string) {
  async function query<T>(sql: string): Promise<T[]> {
    const url = `${QBO_BASE}/v3/company/${realmId}/query?query=${encodeURIComponent(sql)}&minorversion=65`
    const res = await fetchWithRetry(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    })
    const data = await res.json()
    const entity = Object.keys(data.QueryResponse || {})[0]
    return data.QueryResponse?.[entity] || []
  }

  async function cdc(entities: string, changedSince: string) {
    const url = `${QBO_BASE}/v3/company/${realmId}/cdc?entities=${entities}&changedSince=${encodeURIComponent(changedSince)}&minorversion=65`
    const res = await fetchWithRetry(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    })
    return res.json()
  }

  return { query, cdc, realmId, clientId }
}

async function refreshTokens(clientId: string, encryptedRefreshToken: string) {
  try {
    const refreshToken = decrypt(encryptedRefreshToken)
    const credentials = Buffer.from(
      `${process.env.QBO_CLIENT_ID}:${process.env.QBO_CLIENT_SECRET}`
    ).toString('base64')

    const res = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    })

    if (!res.ok) return null
    const tokens = await res.json()

    const expiry = new Date(Date.now() + tokens.expires_in * 1000)
    const client = await prisma.client.findUnique({ where: { id: clientId } })

    await prisma.client.update({
      where: { id: clientId },
      data: {
        qboAccessToken: encrypt(tokens.access_token),
        qboRefreshToken: encrypt(tokens.refresh_token),
        qboTokenExpiry: expiry,
      },
    })

    if (!client?.qboRealmId) return null
    return { accessToken: tokens.access_token, realmId: client.qboRealmId }
  } catch {
    return null
  }
}

async function fetchWithRetry(url: string, options: RequestInit, retries = 3): Promise<Response> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const res = await fetch(url, options)
    if (res.status === 429) {
      await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000))
      continue
    }
    if (!res.ok && attempt < retries - 1) {
      await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 500))
      continue
    }
    return res
  }
  throw new Error(`QBO request failed after ${retries} retries`)
}
