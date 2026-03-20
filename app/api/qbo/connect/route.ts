import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { QBO_AUTH_URL, QBO_SCOPES } from '@/lib/qbo/client'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function GET(req: NextRequest) {
  const { dbUser, error } = await requireAuth()
  if (error || !dbUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!['admin', 'staff'].includes(dbUser.role)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  const clientId = req.nextUrl.searchParams.get('clientId')
  if (!clientId) {
    return NextResponse.json({ error: 'clientId required' }, { status: 400 })
  }

  // Prevent cross-tenant OAuth connections.
  const client = await prisma.client.findFirst({
    where: { id: clientId, firmId: dbUser.firmId },
    select: { id: true },
  })
  if (!client) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 })
  }

  const state = crypto.randomBytes(16).toString('hex')

  // Store state cookie + state params for verification at callback.
  const params = new URLSearchParams({
    client_id: process.env.QBO_CLIENT_ID!,
    scope: QBO_SCOPES,
    redirect_uri: process.env.QBO_REDIRECT_URI!,
    response_type: 'code',
    state: `${state}:${clientId}:${dbUser.firmId}`,
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
