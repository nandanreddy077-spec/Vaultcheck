import { NextRequest, NextResponse } from 'next/server'
import { captureException } from '@/lib/monitoring'
import { prisma } from '@/lib/prisma'
import { enforceRateLimit } from '@/lib/rate-limit'
import { encrypt } from '@/lib/encryption'
import { createXeroOAuthClient } from '@/lib/xero/client'

export async function GET(req: NextRequest) {
  try {
    const rateLimitResponse = await enforceRateLimit({
      req,
      preset: 'oauth',
      scope: 'xero-callback',
    })
    if (rateLimitResponse) return rateLimitResponse

    const { searchParams } = req.nextUrl
    const code = searchParams.get('code')
    const stateParam = searchParams.get('state')
    const storedState = req.cookies.get('xero_state')?.value

    if (!code || !stateParam) {
      return NextResponse.redirect(new URL('/dashboard?error=xero_missing_params', req.url))
    }

    const [state, clientId, firmId] = stateParam.split(':')
    if (!storedState || storedState !== state) {
      return NextResponse.redirect(new URL('/dashboard?error=xero_state_mismatch', req.url))
    }

    if (!clientId || !firmId) {
      return NextResponse.redirect(new URL('/dashboard?error=xero_missing_client', req.url))
    }

    const client = await prisma.client.findFirst({
      where: { id: clientId, firmId },
      select: { id: true },
    })
    if (!client) {
      return NextResponse.redirect(new URL('/dashboard?error=xero_client_firm_mismatch', req.url))
    }

    const xeroClientId = process.env.XERO_CLIENT_ID
    const xeroClientSecret = process.env.XERO_CLIENT_SECRET
    const xeroRedirectUri = process.env.XERO_REDIRECT_URI
    if (!xeroClientId || !xeroClientSecret || !xeroRedirectUri) {
      return NextResponse.redirect(new URL('/dashboard?error=xero_not_configured', req.url))
    }

    const xero = await createXeroOAuthClient()
    const tokenSet = await xero.apiCallback(req.url)

    if (!tokenSet.access_token || !tokenSet.refresh_token || (!tokenSet.expires_in && !tokenSet.expires_at)) {
      captureException(new Error('Xero token response missing required fields'), {
        tags: { route: 'api/xero/callback', service: 'xero' },
        extra: {
          clientId,
          firmId,
          hasAccess: !!tokenSet.access_token,
          hasRefresh: !!tokenSet.refresh_token,
          hasExpiresIn: !!tokenSet.expires_in,
          hasExpiresAt: !!tokenSet.expires_at,
        },
      })
      return NextResponse.redirect(new URL('/dashboard?error=xero_invalid_tokens', req.url))
    }

    const expiresAtSeconds = tokenSet.expires_at ?? Math.floor(Date.now() / 1000) + Number(tokenSet.expires_in)
    if (!Number.isFinite(expiresAtSeconds) || expiresAtSeconds <= 0) {
      captureException(new Error('Xero token expires_in is invalid'), {
        tags: { route: 'api/xero/callback', service: 'xero' },
        extra: { clientId, firmId, expiresIn: tokenSet.expires_in, expiresAt: tokenSet.expires_at },
      })
      return NextResponse.redirect(new URL('/dashboard?error=xero_invalid_tokens', req.url))
    }

    xero.setTokenSet(tokenSet)
    const tenants = await xero.updateTenants()
    const tenantId = tenants?.[0]?.tenantId
    if (!tenantId) {
      captureException(new Error('Failed to retrieve Xero tenant ID'), {
        tags: { route: 'api/xero/callback', service: 'xero' },
        extra: { clientId, firmId },
      })
      return NextResponse.redirect(new URL('/dashboard?error=xero_no_tenant', req.url))
    }

    const expiry = new Date(expiresAtSeconds * 1000)

    await prisma.client.update({
      where: { id: clientId },
      data: {
        xeroTenantId: tenantId,
        xeroAccessToken: encrypt(tokenSet.access_token),
        xeroRefreshToken: encrypt(tokenSet.refresh_token),
        xeroTokenExpiry: expiry,
        xeroSyncStatus: 'pending',
      },
    })

    const response = NextResponse.redirect(
      new URL(`/dashboard/clients/${clientId}?xero=connected`, req.url),
    )
    response.cookies.delete('xero_state')

    return response
  } catch (err) {
    captureException(err, {
      tags: { route: 'api/xero/callback', service: 'xero' },
    })
    return NextResponse.redirect(new URL('/dashboard?error=xero_callback_failed', req.url))
  }
}
