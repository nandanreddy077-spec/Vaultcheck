import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { QBO_AUTH_URL, QBO_SCOPES } from '@/lib/qbo/client'
import crypto from 'crypto'

export async function GET(req: NextRequest) {
  const { dbUser, error } = await requireAuth()
  if (error || !dbUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const clientId = req.nextUrl.searchParams.get('clientId')
  if (!clientId) {
    return NextResponse.json({ error: 'clientId required' }, { status: 400 })
  }

  const state = crypto.randomBytes(16).toString('hex')

  // Store state + clientId in cookie for verification at callback
  const params = new URLSearchParams({
    client_id: process.env.QBO_CLIENT_ID!,
    scope: QBO_SCOPES,
    redirect_uri: process.env.QBO_REDIRECT_URI!,
    response_type: 'code',
    state: `${state}:${clientId}`,
  })

  const response = NextResponse.redirect(`${QBO_AUTH_URL}?${params}`)
  response.cookies.set('qbo_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 600, // 10 minutes
    sameSite: 'lax',
  })

  return response
}
