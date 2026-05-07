import { NextRequest, NextResponse, after } from 'next/server'
import crypto from 'crypto'
import { captureException } from '@/lib/monitoring'
import { prisma } from '@/lib/prisma'
import { incrementalSync } from '@/lib/qbo/sync'
import { enforceRateLimit, getRateLimitKey } from '@/lib/rate-limit'

function timingSafeEqual(a: string, b: string) {
  const aBuf = Buffer.from(a)
  const bBuf = Buffer.from(b)
  if (aBuf.length !== bBuf.length) return false
  return crypto.timingSafeEqual(aBuf, bBuf)
}

export async function POST(req: NextRequest) {
  try {
    const verifierToken = process.env.QBO_WEBHOOK_VERIFIER_TOKEN
    if (!verifierToken) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    const signature = req.headers.get('intuit-signature')
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    const rateLimitResponse = await enforceRateLimit({
      req,
      preset: 'webhook',
      scope: 'qbo-webhook',
      identifier: getRateLimitKey(req, 'qbo-webhook', signature.slice(0, 16)),
    })
    if (rateLimitResponse) return rateLimitResponse

    // Important: verify against the raw body.
    const rawBody = await req.text()

    const expectedSignature = crypto
      .createHmac('sha256', verifierToken)
      .update(rawBody)
      .digest('base64')

    if (!timingSafeEqual(expectedSignature.trim(), signature.trim())) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    let payload: unknown
    try {
      payload = JSON.parse(rawBody)
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const rawNotifications = (payload as { eventNotifications?: unknown }).eventNotifications
    const notifications: Array<{
      realmId?: string
      dataChangeEvent?: { entities?: Array<{ name?: string }> }
    }> = Array.isArray(rawNotifications)
      ? (rawNotifications as Array<{
          realmId?: string
          dataChangeEvent?: { entities?: Array<{ name?: string }> }
        }>)
      : []

    const clientIdsToSync: string[] = []

    for (const n of notifications) {
      const realmId = n.realmId
      if (!realmId) continue

      const client = await prisma.client.findFirst({
        where: { qboRealmId: realmId },
        select: { id: true },
      })

      if (!client) continue

      const entities = n.dataChangeEvent?.entities?.map(e => e.name) ?? []
      const isRelevant =
        entities.includes('Bill') || entities.includes('BillPayment') || entities.includes('Vendor')
      if (!isRelevant) continue

      clientIdsToSync.push(client.id)
    }

    // Run syncs after responding so QBO gets a fast 200 and doesn't retry.
    after(async () => {
      for (const clientId of clientIdsToSync) {
        try {
          await incrementalSync(clientId)
        } catch (err) {
          captureException(err, { tags: { route: 'api/webhooks/qbo', clientId } })
        }
      }
    })

    return NextResponse.json({ ok: true, syncing: clientIdsToSync.length })
  } catch (err) {
    captureException(err, {
      tags: { route: 'api/webhooks/qbo', service: 'qbo' },
    })
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

