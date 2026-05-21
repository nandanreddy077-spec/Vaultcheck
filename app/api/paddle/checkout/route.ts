import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { captureException } from '@/lib/monitoring'
import { prisma } from '@/lib/prisma'
import { getPaddle } from '@/lib/paddle'
import { PLAN_LIMITS, type PaidPlan } from '@/lib/plans'
import { enforceRateLimit } from '@/lib/rate-limit'

type CheckoutPlan = 'solo' | 'starter' | 'growth' | 'scale' | 'whitelabel' | 'enterprise'

const PRICE_ENV: Record<CheckoutPlan, string | undefined> = {
  solo: process.env.PADDLE_PRICE_SOLO,
  starter: process.env.PADDLE_PRICE_STARTER,
  growth: process.env.PADDLE_PRICE_GROWTH,
  scale: process.env.PADDLE_PRICE_SCALE,
  whitelabel: process.env.PADDLE_PRICE_WHITELABEL,
  enterprise: process.env.PADDLE_PRICE_ENTERPRISE,
}

function planToPriceAndMaxClients(plan: CheckoutPlan): { priceId: string; maxClients: number } {
  const priceId = PRICE_ENV[plan]
  const limits = PLAN_LIMITS[plan as PaidPlan]
  if (!priceId || !limits) {
    throw new Error(`PLAN_UNAVAILABLE:${plan}`)
  }
  return { priceId, maxClients: limits.maxClients }
}

async function ensurePaddleCustomerId(params: {
  firmId: string
  firmEmail: string
  firmName: string
  existingCustomerId: string | null
}) {
  const paddle = getPaddle()
  const { firmId, firmEmail, firmName, existingCustomerId } = params

  if (existingCustomerId) {
    try {
      const existingCustomer = await paddle.customers.get(existingCustomerId)
      return existingCustomer.id
    } catch (error) {
      console.warn('paddle checkout: invalid stored customer id, recreating', {
        firmId,
        existingCustomerId,
        error,
      })
    }
  }

  const customer = await paddle.customers.create({
    email: firmEmail,
    name: firmName,
    customData: { firmId },
  })

  await prisma.firm.update({
    where: { id: firmId },
    data: { paddleCustomerId: customer.id },
  })

  return customer.id
}

export async function POST(req: NextRequest) {
  try {
    const { authorized, dbUser, error } = await requireRole(['admin', 'staff'])
    if (!authorized || !dbUser) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 })
    }

    const rateLimitResponse = await enforceRateLimit({
      req,
      preset: 'checkout',
      scope: 'paddle-checkout',
      identifier: dbUser.id,
    })
    if (rateLimitResponse) return rateLimitResponse

    const body = (await req.json().catch(() => ({}))) as { plan?: string }
    const plan = body.plan as CheckoutPlan | undefined
    const validPlans: CheckoutPlan[] = ['solo', 'starter', 'growth', 'scale', 'whitelabel', 'enterprise']
    if (!plan || !validPlans.includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const firm = await prisma.firm.findUnique({
      where: { id: dbUser.firmId },
      select: { id: true, name: true, email: true, paddleCustomerId: true, plan: true },
    })
    if (!firm) return NextResponse.json({ error: 'Firm not found' }, { status: 404 })

    const { priceId, maxClients } = planToPriceAndMaxClients(plan)
    const paddleCustomerId = await ensurePaddleCustomerId({
      firmId: firm.id,
      firmEmail: firm.email,
      firmName: firm.name,
      existingCustomerId: firm.paddleCustomerId,
    })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.vantirs.com'
    return NextResponse.json({
      priceId,
      customerId: paddleCustomerId,
      successUrl: `${appUrl}/dashboard/settings?billing=success`,
      customData: {
        firmId: firm.id,
        plan,
        maxClients: String(maxClients),
      },
    })
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : typeof err === 'string' ? err : 'Checkout failed'
    captureException(err, {
      tags: { route: 'api/paddle/checkout', service: 'paddle' },
    })
    console.error('paddle checkout', err)
    return NextResponse.json(
      {
        error:
          message.startsWith('PLAN_UNAVAILABLE:')
            ? 'This plan is not available yet. Please contact us to get set up.'
            : message.includes('PADDLE_API_KEY')
            ? 'Billing is not configured yet. Add PADDLE_API_KEY and PADDLE_PRICE_* price IDs in your environment, or contact support.'
            : message,
      },
      { status: 500 }
    )
  }
}
