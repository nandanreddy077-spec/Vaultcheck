import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { encrypt } from '@/lib/encryption'
import { requireAuth } from '@/lib/auth'

const TOKEN_URL = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const code = searchParams.get('code')
  const realmId = searchParams.get('realmId')
  const stateParam = searchParams.get('state')
  const storedState = req.cookies.get('qbo_state')?.value

  if (!code || !realmId || !stateParam) {
    return NextResponse.redirect(new URL('/dashboard?error=qbo_missing_params', req.url))
  }

  const [state, clientId] = stateParam.split(':')
  if (!storedState || storedState !== state) {
    return NextResponse.redirect(new URL('/dashboard?error=qbo_state_mismatch', req.url))
  }

  if (!clientId) {
    return NextResponse.redirect(new URL('/dashboard?error=qbo_missing_client', req.url))
  }

  // Exchange code for tokens
  const credentials = Buffer.from(
    `${process.env.QBO_CLIENT_ID}:${process.env.QBO_CLIENT_SECRET}`
  ).toString('base64')

  const tokenRes = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.QBO_REDIRECT_URI!,
    }),
  })

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL('/dashboard?error=qbo_token_exchange_failed', req.url))
  }

  const tokens = await tokenRes.json()
  const expiry = new Date(Date.now() + tokens.expires_in * 1000)

  await prisma.client.update({
    where: { id: clientId },
    data: {
      qboRealmId: realmId,
      qboAccessToken: encrypt(tokens.access_token),
      qboRefreshToken: encrypt(tokens.refresh_token),
      qboTokenExpiry: expiry,
      syncStatus: 'pending',
    },
  })

  // Clear state cookie
  const response = NextResponse.redirect(
    new URL(`/dashboard/clients/${clientId}?qbo=connected`, req.url)
  )
  response.cookies.delete('qbo_state')

  return response
}
