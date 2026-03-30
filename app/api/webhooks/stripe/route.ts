import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET

function getStripe() {
  if (!stripeSecretKey) throw new Error('Missing STRIPE_SECRET_KEY')
  return new Stripe(stripeSecretKey)
}

export async function POST(req: NextRequest) {
  if (!stripeWebhookSecret) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
  }

  const rawBody = await req.text()
  const stripe = getStripe()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, stripeWebhookSecret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    const type = event.type

    if (
      type === 'customer.subscription.created' ||
      type === 'customer.subscription.updated' ||
      type === 'customer.subscription.deleted'
    ) {
      const subscription = event.data.object as Stripe.Subscription

      const customerId = typeof subscription.customer === 'string' ? subscription.customer : null
      if (!customerId) {
        return NextResponse.json({ ok: true })
      }

      const metadata = subscription.metadata || {}
      const planFromMeta = metadata.plan as string | undefined
      const maxClientsFromMetaRaw = metadata.maxClients as string | undefined
      const maxClientsFromMeta = maxClientsFromMetaRaw ? Number(maxClientsFromMetaRaw) : undefined

      const priceId =
        subscription.items.data[0]?.price?.id || (metadata.priceId as string | undefined)

      // If metadata isn’t set, fall back to a price->plan mapping using env vars.
      const planFromPrice =
        priceId === process.env.STRIPE_PRICE_SOLO
          ? 'solo'
          : priceId === process.env.STRIPE_PRICE_PILOT
            ? 'pilot'
          : priceId === process.env.STRIPE_PRICE_STARTER
            ? 'starter'
            : priceId === process.env.STRIPE_PRICE_GROWTH
              ? 'growth'
            : priceId === process.env.STRIPE_PRICE_SCALE
              ? 'scale'
              : priceId === process.env.STRIPE_PRICE_ENTERPRISE
                ? 'enterprise'
                : undefined

      const maxClientsFromPrice =
        planFromPrice === 'solo'
          ? 1
          : planFromPrice === 'pilot'
            ? 20
          : planFromPrice === 'starter'
            ? 10
            : planFromPrice === 'growth'
              ? 20
              : planFromPrice === 'scale'
                ? 50
              : planFromPrice === 'enterprise'
                ? 9999
                : undefined

      const nextPlan = planFromMeta || planFromPrice
      const nextMaxClients = maxClientsFromMeta ?? maxClientsFromPrice

      const firm = await prisma.firm.findUnique({
        where: { stripeCustomerId: customerId },
        select: { id: true },
      })
      if (!firm) return NextResponse.json({ ok: true })

      if (type === 'customer.subscription.deleted') {
        await prisma.firm.update({
          where: { id: firm.id },
          data: { plan: 'trial', maxClients: 3, stripeSubId: null },
        })
        await prisma.auditLog.create({
          data: {
            firmId: firm.id,
            action: 'stripe_subscription_deleted',
            entityType: 'firm',
            entityId: firm.id,
            details: { customerId },
          },
        })
        return NextResponse.json({ ok: true })
      }

      await prisma.firm.update({
        where: { id: firm.id },
        data: {
          plan: nextPlan || 'trial',
          maxClients: nextMaxClients || 3,
          stripeSubId: subscription.id,
        },
      })

      await prisma.auditLog.create({
        data: {
          firmId: firm.id,
          action: 'stripe_subscription_updated',
          entityType: 'firm',
          entityId: firm.id,
          details: {
            customerId,
            subscriptionId: subscription.id,
            plan: nextPlan || null,
            maxClients: nextMaxClients || null,
          },
        },
      })

      return NextResponse.json({ ok: true })
    }
  } catch {
    // Never leak webhook parsing details.
  }

  return NextResponse.json({ ok: true })
}

