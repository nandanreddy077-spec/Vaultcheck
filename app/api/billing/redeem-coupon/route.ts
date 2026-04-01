import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { authorized, dbUser, error } = await requireRole(['admin'])
    if (!authorized || !dbUser) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json().catch(() => ({}))) as { coupon?: string }
    const coupon = body.coupon?.trim().toUpperCase()

    if (!coupon) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 })
    }

    const validCoupon = process.env.OUTREACH_COUPON_CODE?.trim().toUpperCase()
    if (!validCoupon) {
      return NextResponse.json(
        { error: 'Coupon redemption is not enabled. Contact support.' },
        { status: 503 }
      )
    }

    if (coupon !== validCoupon) {
      return NextResponse.json({ error: 'Invalid partner code. Please check and try again.' }, { status: 400 })
    }

    // Already on the outreach plan — no-op
    const firm = await prisma.firm.findUnique({
      where: { id: dbUser.firmId },
      select: { plan: true },
    })
    if (firm?.plan === 'pilot') {
      return NextResponse.json({ success: true })
    }

    // Activate outreach plan: Scale-tier features, 50 clients, free
    await prisma.firm.update({
      where: { id: dbUser.firmId },
      data: { plan: 'pilot', maxClients: 50 },
    })

    await prisma.auditLog.create({
      data: {
        firmId: dbUser.firmId,
        userId: dbUser.id,
        action: 'plan.outreach_coupon_redeemed',
        entityType: 'firm',
        entityId: dbUser.firmId,
        details: { plan: 'pilot', maxClients: 50 },
      },
    })

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to redeem coupon'
    console.error('[redeem-coupon]', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
