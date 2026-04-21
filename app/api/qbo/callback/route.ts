import { NextRequest, NextResponse } from 'next/server'
import { captureException } from '@/lib/monitoring'
import { prisma } from '@/lib/prisma'
import { enforceRateLimit } from '@/lib/rate-limit'
import { encrypt } from '@/lib/encryption'

const TOKEN_URL = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer'

export async function GET(req: NextRequest) {
  try {
    const rateLimitResponse = await enforceRateLimit({
      req,
      preset: 'oauth',
      scope: 'qbo-callback',
    })
    if (rateLimitResponse) return rateLimitResponse

    const { searchParams } = req.nextUrl
    const code = searchParams.get('code')
    const realmId = searchParams.get('realmId')
    const stateParam = searchParams.get('state')
    const storedState = req.cookies.get('qbo_state')?.value

    if (!code || !realmId || !stateParam) {
      return NextResponse.redirect(new URL('/dashboard?error=qbo_missing_params', req.url))
    }

    const [state, clientId, firmId] = stateParam.split(':')
    if (!storedState || storedState !== state) {
      return NextResponse.redirect(new URL('/dashboard?error=qbo_state_mismatch', req.url))
    }

    if (!clientId || !firmId) {
      return NextResponse.redirect(new URL('/dashboard?error=qbo_missing_client', req.url))
    }

    // Enforce cross-tenant safety: callback state must match an existing client for this firm.
    const client = await prisma.client.findFirst({
      where: { id: clientId, firmId },
      select: { id: true },
    })
    if (!client) {
      return NextResponse.redirect(new URL('/dashboard?error=qbo_client_firm_mismatch', req.url))
    }

    const qboClientId = process.env.QBO_CLIENT_ID
    const qboClientSecret = process.env.QBO_CLIENT_SECRET
    const qboRedirectUri = process.env.QBO_REDIRECT_URI
    if (!qboClientId || !qboClientSecret || !qboRedirectUri) {
      return NextResponse.redirect(new URL('/dashboard?error=qbo_not_configured', req.url))
    }

    const credentials = Buffer.from(`${qboClientId}:${qboClientSecret}`).toString('base64')

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
        redirect_uri: qboRedirectUri,
      }),
    })

    if (!tokenRes.ok) {
      captureException(new Error(`QBO token exchange failed with status ${tokenRes.status}`), {
        tags: { route: 'api/qbo/callback', service: 'qbo' },
        extra: { clientId, firmId, realmId, status: tokenRes.status },
      })
      return NextResponse.redirect(new URL('/dashboard?error=qbo_token_exchange_failed', req.url))
    }

    const tokens = await tokenRes.json()

    if (!tokens.access_token || !tokens.refresh_token || !tokens.expires_in) {
      captureException(new Error('QBO token response missing required fields'), {
        tags: { route: 'api/qbo/callback', service: 'qbo' },
        extra: { clientId, firmId, realmId, hasAccess: !!tokens.access_token, hasRefresh: !!tokens.refresh_token, hasExpiry: !!tokens.expires_in },
      })
      return NextResponse.redirect(new URL('/dashboard?error=qbo_invalid_tokens', req.url))
    }

    const expiresIn = Number(tokens.expires_in)
    if (!Number.isFinite(expiresIn) || expiresIn <= 0) {
      captureException(new Error('QBO token expires_in is invalid'), {
        tags: { route: 'api/qbo/callback', service: 'qbo' },
        extra: { clientId, firmId, expiresIn: tokens.expires_in },
      })
      return NextResponse.redirect(new URL('/dashboard?error=qbo_invalid_tokens', req.url))
    }

    const expiry = new Date(Date.now() + expiresIn * 1000)

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
  } catch (err) {
    captureException(err, {
      tags: { route: 'api/qbo/callback', service: 'qbo' },
    })
    return NextResponse.redirect(new URL('/dashboard?error=qbo_callback_failed', req.url))
  }
}
