import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('Missing STRIPE_SECRET_KEY')
  return new Stripe(key)
}

type Plan = 'pilot' | 'solo' | 'starter' | 'growth' | 'scale' | 'enterprise'

function planToPriceAndMaxClients(plan: Plan) {
  let price: string | undefined
  let maxClients: number

  switch (plan) {
    case 'solo':
      price = process.env.STRIPE_PRICE_SOLO
      maxClients = 1
      break
    case 'pilot':
      price = process.env.STRIPE_PRICE_PILOT
      maxClients = 20
      break
    case 'starter':
      price = process.env.STRIPE_PRICE_STARTER
      maxClients = 10
      break
    case 'growth':
      price = process.env.STRIPE_PRICE_GROWTH
      maxClients = 20
      break
    case 'scale':
      price = process.env.STRIPE_PRICE_SCALE
      maxClients = 50
      break
    case 'enterprise':
      price = process.env.STRIPE_PRICE_ENTERPRISE
      maxClients = 9999
      break
  }

  if (!price) throw new Error(`Missing Stripe price env for plan=${plan}`)
  return { price, maxClients }
}

export async function POST(req: NextRequest) {
  const { authorized, dbUser, error } = await requireRole(['admin', 'staff'])
  if (!authorized || !dbUser) {
    return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json().catch(() => ({}))) as { plan?: string }
  const plan = body.plan as Plan | undefined
  if (!plan || !['pilot', 'solo', 'starter', 'growth', 'scale', 'enterprise'].includes(plan)) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const firm = await prisma.firm.findUnique({
    where: { id: dbUser.firmId },
    select: { id: true, name: true, email: true, stripeCustomerId: true, plan: true },
  })
  if (!firm) return NextResponse.json({ error: 'Firm not found' }, { status: 404 })

  if (plan === 'pilot' && firm.plan !== 'pilot') {
    const pilotCount = await prisma.firm.count({ where: { plan: 'pilot' } })
    if (pilotCount >= 10) {
      return NextResponse.json({ error: 'Pilot offer is limited to the first 10 firms.' }, { status: 403 })
    }
  }

  const { price, maxClients } = planToPriceAndMaxClients(plan)
  const stripe = getStripe()

  let stripeCustomerId = firm.stripeCustomerId
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      name: firm.name,
      email: firm.email,
      metadata: { firmId: firm.id },
    })

    stripeCustomerId = customer.id
    await prisma.firm.update({
      where: { id: firm.id },
      data: { stripeCustomerId },
    })
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: stripeCustomerId,
    line_items: [{ price, quantity: 1 }],
    success_url: `${baseUrl}/dashboard/settings?stripe=success`,
    cancel_url: `${baseUrl}/dashboard/settings?stripe=cancel`,
    allow_promotion_codes: true,
    metadata: {
      firmId: firm.id,
      plan,
      maxClients: String(maxClients),
    },
    subscription_data: {
      metadata: {
        firmId: firm.id,
        plan,
        maxClients: String(maxClients),
      },
    },
  })

  return NextResponse.json({ url: session.url })
}

