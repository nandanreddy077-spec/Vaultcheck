import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { captureException } from '@/lib/monitoring'
import { prisma } from '@/lib/prisma'
import { getPaddle } from '@/lib/paddle'
import { enforceRateLimit } from '@/lib/rate-limit'

type Plan = 'pilot' | 'solo' | 'starter' | 'growth' | 'scale' | 'whitelabel' | 'enterprise'

function planToPriceAndMaxClients(plan: Plan): { priceId: string; maxClients: number } {
  let priceId: string | undefined
  let maxClients: number

  switch (plan) {
    case 'solo':
      priceId = process.env.PADDLE_PRICE_SOLO
      maxClients = 5
      break
    case 'pilot':
      priceId = process.env.PADDLE_PRICE_PILOT
      maxClients = 20
      break
    case 'starter':
      priceId = process.env.PADDLE_PRICE_STARTER
      maxClients = 15
      break
    case 'growth':
      priceId = process.env.PADDLE_PRICE_GROWTH
      maxClients = 35
      break
    case 'scale':
      priceId = process.env.PADDLE_PRICE_SCALE
      maxClients = 50
      break
    case 'whitelabel':
      priceId = process.env.PADDLE_PRICE_WHITELABEL
      maxClients = 75
      break
    case 'enterprise':
      priceId = process.env.PADDLE_PRICE_ENTERPRISE
      maxClients = 9999
      break
  }

  if (!priceId) {
    throw new Error(`Missing Paddle price env for plan=${plan}`)
  }
  return { priceId, maxClients }
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
    const plan = body.plan as Plan | undefined
    if (!plan || !['pilot', 'solo', 'starter', 'growth', 'scale', 'whitelabel', 'enterprise'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const firm = await prisma.firm.findUnique({
      where: { id: dbUser.firmId },
      select: { id: true, name: true, email: true, paddleCustomerId: true, plan: true },
    })
    if (!firm) return NextResponse.json({ error: 'Firm not found' }, { status: 404 })

    if (plan === 'pilot' && firm.plan !== 'pilot') {
      const pilotCount = await prisma.firm.count({ where: { plan: 'pilot' } })
      if (pilotCount >= 10) {
        return NextResponse.json({ error: 'Pilot offer is limited to the first 10 firms.' }, { status: 403 })
      }
    }

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
          message.includes('PADDLE_API_KEY') || message.includes('Paddle price env')
            ? 'Billing is not configured yet. Add PADDLE_API_KEY and PADDLE_PRICE_* price IDs in your environment, or contact support.'
            : message,
      },
      { status: 500 }
    )
  }
}
