import { NextRequest, NextResponse } from 'next/server'
import { EventName, type SubscriptionNotification } from '@paddle/paddle-node-sdk'
import { captureException } from '@/lib/monitoring'
import { prisma } from '@/lib/prisma'
import { getPaddle } from '@/lib/paddle'
import { enforceRateLimit } from '@/lib/rate-limit'

function planFromPaddlePriceId(priceId: string | undefined): PlanFromPrice | undefined {
  if (!priceId) return undefined
  if (priceId === process.env.PADDLE_PRICE_SOLO) return { plan: 'solo', maxClients: 5 }
  if (priceId === process.env.PADDLE_PRICE_PILOT) return { plan: 'pilot', maxClients: 20 }
  if (priceId === process.env.PADDLE_PRICE_STARTER) return { plan: 'starter', maxClients: 15 }
  if (priceId === process.env.PADDLE_PRICE_GROWTH) return { plan: 'growth', maxClients: 35 }
  if (priceId === process.env.PADDLE_PRICE_SCALE) return { plan: 'scale', maxClients: 50 }
  if (priceId === process.env.PADDLE_PRICE_WHITELABEL) return { plan: 'whitelabel', maxClients: 75 }
  if (priceId === process.env.PADDLE_PRICE_ENTERPRISE) return { plan: 'enterprise', maxClients: 9999 }
  return undefined
}

type PlanFromPrice = { plan: string; maxClients: number }

async function applySubscription(sub: SubscriptionNotification) {
  const firm = await prisma.firm.findFirst({
    where: { paddleCustomerId: sub.customerId },
    select: { id: true },
  })
  if (!firm) return

  const priceId = sub.items[0]?.price?.id
  const fromPrice = planFromPaddlePriceId(priceId)

  // Price ID is the source of truth for entitlements — customData is for audit only.
  const nextPlan = fromPrice?.plan
  const nextMaxClients = fromPrice?.maxClients

  if (sub.status === 'canceled') {
    await prisma.firm.update({
      where: { id: firm.id },
      data: { plan: 'trial', maxClients: 3, paddleSubscriptionId: null },
    })
    await prisma.auditLog.create({
      data: {
        firmId: firm.id,
        action: 'paddle_subscription_canceled',
        entityType: 'firm',
        entityId: firm.id,
        details: { customerId: sub.customerId, subscriptionId: sub.id },
      },
    })
    return
  }

  if (sub.status === 'active' || sub.status === 'trialing' || sub.status === 'past_due' || sub.status === 'paused') {
    await prisma.firm.update({
      where: { id: firm.id },
      data: {
        plan: nextPlan || 'trial',
        maxClients: nextMaxClients ?? 3,
        paddleSubscriptionId: sub.id,
      },
    })
    await prisma.auditLog.create({
      data: {
        firmId: firm.id,
        action: 'paddle_subscription_updated',
        entityType: 'firm',
        entityId: firm.id,
        details: {
          customerId: sub.customerId,
          subscriptionId: sub.id,
          plan: nextPlan ?? null,
          maxClients: nextMaxClients ?? null,
          status: sub.status,
        },
      },
    })
  }
}

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.PADDLE_WEBHOOK_SECRET
    if (!secret) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    const signature = req.headers.get('paddle-signature')
    if (!signature) {
      return NextResponse.json({ error: 'Missing paddle-signature' }, { status: 400 })
    }

    const rateLimitResponse = await enforceRateLimit({
      req,
      preset: 'webhook',
      scope: 'paddle-webhook',
      identifier: signature.slice(0, 16),
    })
    if (rateLimitResponse) return rateLimitResponse

    const rawBody = await req.text()
    const paddle = getPaddle()

    let event: unknown
    try {
      event = await paddle.webhooks.unmarshal(rawBody, secret, signature)
    } catch {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const e = event as { eventType: string; data: unknown }
    const subscriptionEvents: string[] = [
      EventName.SubscriptionActivated,
      EventName.SubscriptionCanceled,
      EventName.SubscriptionCreated,
      EventName.SubscriptionUpdated,
      EventName.SubscriptionTrialing,
      EventName.SubscriptionPastDue,
      EventName.SubscriptionPaused,
      EventName.SubscriptionResumed,
    ]

    if (subscriptionEvents.includes(e.eventType)) {
      await applySubscription(e.data as SubscriptionNotification)
    }
  } catch (err) {
    captureException(err, {
      tags: { route: 'api/webhooks/paddle', service: 'paddle' },
    })
    console.error('paddle webhook handler', err)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
