import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { createXeroOAuthClient } from '@/lib/xero/client'
import { captureException } from '@/lib/monitoring'
import { prisma } from '@/lib/prisma'
import { enforceRateLimit } from '@/lib/rate-limit'
import crypto from 'crypto'

export async function GET(req: NextRequest) {
  try {
    const { dbUser, error } = await requireAuth()
    if (error || !dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rateLimitResponse = await enforceRateLimit({
      req,
      preset: 'oauth',
      scope: 'xero-connect',
      identifier: dbUser.id,
    })
    if (rateLimitResponse) return rateLimitResponse

    if (!['admin', 'staff'].includes(dbUser.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const clientId = req.nextUrl.searchParams.get('clientId')
    if (!clientId) {
      return NextResponse.json({ error: 'clientId required' }, { status: 400 })
    }

    const client = await prisma.client.findFirst({
      where: { id: clientId, firmId: dbUser.firmId },
      select: { id: true },
    })
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    if (!process.env.XERO_CLIENT_ID || !process.env.XERO_REDIRECT_URI || !process.env.XERO_CLIENT_SECRET) {
      return NextResponse.json({ error: 'Xero integration is not configured.' }, { status: 503 })
    }

    const state = crypto.randomBytes(16).toString('hex')
    const oauthState = `${state}:${clientId}:${dbUser.firmId}`
    const xero = await createXeroOAuthClient(oauthState)
    const consentUrl = await xero.buildConsentUrl()
    const response = NextResponse.redirect(consentUrl)
    response.cookies.set('xero_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 600,
      sameSite: 'lax',
    })

    return response
  } catch (err) {
    captureException(err, {
      tags: { route: 'api/xero/connect', service: 'xero' },
    })
    return NextResponse.json({ error: 'Failed to start Xero connection.' }, { status: 500 })
  }
}
