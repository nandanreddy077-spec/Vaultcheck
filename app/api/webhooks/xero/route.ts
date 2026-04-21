import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { captureException } from '@/lib/monitoring'
import { prisma } from '@/lib/prisma'
import { enqueueXeroSync } from '@/lib/queue/xero'
import { enforceRateLimit, getRateLimitKey } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    const webhookKey = process.env.XERO_WEBHOOK_KEY
    if (!webhookKey) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    const signature = req.headers.get('x-xero-signature')
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    const rateLimitResponse = await enforceRateLimit({
      req,
      preset: 'webhook',
      scope: 'xero-webhook',
      identifier: getRateLimitKey(req, 'xero-webhook', signature.slice(0, 16)),
    })
    if (rateLimitResponse) return rateLimitResponse

    const rawBody = await req.text()

    const expectedSignature = crypto
      .createHmac('sha256', webhookKey)
      .update(rawBody)
      .digest('base64')

    const sigBuf = Buffer.from(signature)
    const expectedBuf = Buffer.from(expectedSignature)
    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return new NextResponse(null, { status: 401 })
    }

    let payload: { events?: Array<{ tenantId?: string; eventCategory?: string }> }
    try {
      payload = JSON.parse(rawBody)
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const events = payload.events ?? []

    // Intent-to-receive check: empty events array means Xero is validating the endpoint.
    if (events.length === 0) {
      return new NextResponse(null, { status: 200 })
    }

    let enqueued = 0

    for (const event of events) {
      const tenantId = event.tenantId
      if (!tenantId) continue

      const client = await prisma.client.findFirst({
        where: { xeroTenantId: tenantId },
        select: { id: true },
      })
      if (!client) continue

      const category = event.eventCategory?.toUpperCase()
      const isRelevant =
        category === 'CONTACT' ||
        category === 'INVOICE' ||
        category === 'PAYMENT' ||
        category === 'PURCHASEORDER' ||
        category === 'PURCHASE_ORDER'
      if (!isRelevant) continue

      await enqueueXeroSync({ clientId: client.id, type: 'incremental' })
      enqueued += 1
    }

    return NextResponse.json({ ok: true, enqueued })
  } catch (err) {
    captureException(err, {
      tags: { route: 'api/webhooks/xero', service: 'xero' },
    })
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
