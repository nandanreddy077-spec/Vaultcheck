import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET — fetch verification request (public, no auth — vendor opens the link)
export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params

  const verification = await prisma.vendorVerification.findUnique({
    where: { token },
    include: {
      vendor: {
        include: { client: { select: { name: true } } },
      },
    },
  })

  if (!verification) return NextResponse.json({ error: 'Invalid link' }, { status: 404 })
  if (verification.status === 'completed') return NextResponse.json({ status: 'completed' })
  if (new Date() > verification.expiresAt) {
    await prisma.vendorVerification.update({ where: { token }, data: { status: 'expired' } })
    return NextResponse.json({ status: 'expired' }, { status: 410 })
  }

  return NextResponse.json({
    status: 'pending',
    vendorName: verification.vendor.displayName,
    clientName: verification.vendor.client.name,
    vendorEmail: verification.vendor.email,
  })
}

// PATCH — vendor submits their confirmation
export async function PATCH(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const body = await req.json()

  const verification = await prisma.vendorVerification.findUnique({ where: { token } })
  if (!verification) return NextResponse.json({ error: 'Invalid link' }, { status: 404 })
  if (verification.status !== 'pending') return NextResponse.json({ error: 'Already completed' }, { status: 409 })
  if (new Date() > verification.expiresAt) return NextResponse.json({ error: 'Link expired' }, { status: 410 })

  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'

  await prisma.vendorVerification.update({
    where: { token },
    data: {
      status: 'completed',
      completedAt: new Date(),
      confirmedName: body.name?.trim(),
      confirmedEmail: body.email?.trim()?.toLowerCase(),
      confirmedBankAccount: body.bankAccount?.trim(),
      confirmedRoutingNumber: body.routingNumber?.trim(),
      confirmedPhone: body.phone?.trim(),
      notes: body.notes?.trim(),
      ipAddress: ip,
    },
  })

  await prisma.auditLog.create({
    data: {
      firmId: verification.firmId,
      clientId: verification.clientId,
      action: 'vendor_verification_completed',
      entityType: 'vendor',
      entityId: verification.vendorId,
      details: {
        verificationId: verification.id,
        confirmedEmail: body.email,
        ip,
      },
    },
  })

  return NextResponse.json({ ok: true })
}
