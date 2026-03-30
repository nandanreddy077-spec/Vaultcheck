import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getPaddle } from '@/lib/paddle'

type Plan = 'pilot' | 'solo' | 'starter' | 'growth' | 'scale' | 'enterprise'

function planToPriceAndMaxClients(plan: Plan): { priceId: string; maxClients: number } {
  let priceId: string | undefined
  let maxClients: number

  switch (plan) {
    case 'solo':
      priceId = process.env.PADDLE_PRICE_SOLO
      maxClients = 1
      break
    case 'pilot':
      priceId = process.env.PADDLE_PRICE_PILOT
      maxClients = 20
      break
    case 'starter':
      priceId = process.env.PADDLE_PRICE_STARTER
      maxClients = 10
      break
    case 'growth':
      priceId = process.env.PADDLE_PRICE_GROWTH
      maxClients = 20
      break
    case 'scale':
      priceId = process.env.PADDLE_PRICE_SCALE
      maxClients = 50
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

export async function POST(req: NextRequest) {
  try {
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
    const paddle = getPaddle()

    let paddleCustomerId = firm.paddleCustomerId
    if (!paddleCustomerId) {
      const customer = await paddle.customers.create({
        email: firm.email,
        name: firm.name,
        customData: { firmId: firm.id },
      })
      paddleCustomerId = customer.id
      await prisma.firm.update({
        where: { id: firm.id },
        data: { paddleCustomerId },
      })
    }

    const transaction = await paddle.transactions.create({
      items: [{ priceId, quantity: 1 }],
      customerId: paddleCustomerId,
      customData: {
        firmId: firm.id,
        plan,
        maxClients: String(maxClients),
      },
    })

    const url = transaction.checkout?.url
    if (!url) {
      return NextResponse.json(
        { error: 'Paddle did not return a checkout URL. Ensure prices are subscription/recurring in Paddle.' },
        { status: 502 }
      )
    }

    return NextResponse.json({ url })
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : typeof err === 'string' ? err : 'Checkout failed'
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
