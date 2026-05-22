import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendEmail, getAccounts } from '@/lib/agent/email-sender'

// POST — create a verification request and email the vendor
export async function POST(req: Request) {
  const { dbUser, error } = await requireAuth()
  if (error || !dbUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { vendorId, message } = await req.json()
  if (!vendorId) return NextResponse.json({ error: 'vendorId required' }, { status: 400 })

  const vendor = await prisma.vendor.findFirst({
    where: { id: vendorId, client: { firmId: dbUser.firmId } },
    include: { client: { select: { name: true } } },
  })
  if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
  if (!vendor.email) return NextResponse.json({ error: 'Vendor has no email on file' }, { status: 400 })

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  const verification = await prisma.vendorVerification.create({
    data: {
      vendorId,
      clientId: vendor.clientId,
      firmId: dbUser.firmId,
      requestedBy: dbUser.id,
      expiresAt,
    },
  })

  const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.vantirs.com'}/verify/${verification.token}`
  const firm = dbUser.firm as { name: string } | undefined
  const firmName = firm?.name ?? 'Your accounting firm'

  const emailBody = `Hi${vendor.displayName ? ` ${vendor.displayName.split(' ')[0]}` : ''},

${message || `${firmName} is verifying payment details for all active vendors as part of our standard fraud prevention process.`}

Please click the link below to confirm your business name, contact email, and bank account details. This takes less than 2 minutes and creates a secure record that protects both of us.

Verify your details: ${verifyUrl}

This link expires in 7 days. If you did not expect this request, please contact us immediately.

${firmName}
Powered by Vantirs Vendor Verification`

  try {
    const accounts = getAccounts()
    await sendEmail({
      to: vendor.email,
      subject: `Action required: Verify payment details for ${vendor.client.name}`,
      body: emailBody,
      account: accounts[0],
    })
  } catch {
    // Email failed but verification token still created — firm can share link manually
  }

  await prisma.auditLog.create({
    data: {
      firmId: dbUser.firmId,
      clientId: vendor.clientId,
      userId: dbUser.id,
      action: 'vendor_verification_sent',
      entityType: 'vendor',
      entityId: vendorId,
      details: { verificationId: verification.id, vendorEmail: vendor.email },
    },
  })

  return NextResponse.json({
    ok: true,
    verificationId: verification.id,
    verifyUrl,
    expiresAt,
  })
}

// GET — list verifications for a vendor
export async function GET(req: Request) {
  const { dbUser, error } = await requireAuth()
  if (error || !dbUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const vendorId = searchParams.get('vendorId')
  if (!vendorId) return NextResponse.json({ error: 'vendorId required' }, { status: 400 })

  const vendor = await prisma.vendor.findFirst({
    where: { id: vendorId, client: { firmId: dbUser.firmId } },
  })
  if (!vendor) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const verifications = await prisma.vendorVerification.findMany({
    where: { vendorId },
    orderBy: { requestedAt: 'desc' },
    take: 10,
  })

  return NextResponse.json(verifications)
}
