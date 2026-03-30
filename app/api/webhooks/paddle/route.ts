import { NextRequest, NextResponse } from 'next/server'
import { EventName, type SubscriptionNotification } from '@paddle/paddle-node-sdk'
import { prisma } from '@/lib/prisma'
import { getPaddle } from '@/lib/paddle'

function planFromPaddlePriceId(priceId: string | undefined): PlanFromPrice | undefined {
  if (!priceId) return undefined
  if (priceId === process.env.PADDLE_PRICE_SOLO) return { plan: 'solo', maxClients: 1 }
  if (priceId === process.env.PADDLE_PRICE_PILOT) return { plan: 'pilot', maxClients: 20 }
  if (priceId === process.env.PADDLE_PRICE_STARTER) return { plan: 'starter', maxClients: 10 }
  if (priceId === process.env.PADDLE_PRICE_GROWTH) return { plan: 'growth', maxClients: 20 }
  if (priceId === process.env.PADDLE_PRICE_SCALE) return { plan: 'scale', maxClients: 50 }
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

  const custom = sub.customData as Record<string, unknown> | null | undefined
  const planFromMeta =
    typeof custom?.['plan'] === 'string' ? custom['plan'] : undefined
  const maxClientsFromMetaRaw = custom?.['maxClients']
  const maxClientsFromMeta =
    typeof maxClientsFromMetaRaw === 'string' || typeof maxClientsFromMetaRaw === 'number'
      ? Number(maxClientsFromMetaRaw)
      : undefined

  const priceId = sub.items[0]?.price?.id
  const fromPrice = planFromPaddlePriceId(priceId)

  const nextPlan = planFromMeta || fromPrice?.plan
  const nextMaxClients = maxClientsFromMeta ?? fromPrice?.maxClients

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
  const secret = process.env.PADDLE_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const signature = req.headers.get('paddle-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing paddle-signature' }, { status: 400 })
  }

  const rawBody = await req.text()
  const paddle = getPaddle()

  let event: unknown
  try {
    event = await paddle.webhooks.unmarshal(rawBody, secret, signature)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
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
    console.error('paddle webhook handler', err)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
