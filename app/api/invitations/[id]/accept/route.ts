import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET — fetch invitation details for the accept page (no auth required)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const invitation = await prisma.invitation.findUnique({
    where: { id },
    include: { firm: { select: { name: true } } },
  })

  if (!invitation) {
    return NextResponse.json({ error: 'Invitation not found.' }, { status: 404 })
  }

  if (invitation.status !== 'pending') {
    return NextResponse.json({
      error: invitation.status === 'accepted'
        ? 'This invitation has already been accepted.'
        : 'This invitation has been revoked.',
    }, { status: 410 })
  }

  // Check expiry (7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  if (invitation.createdAt < sevenDaysAgo) {
    return NextResponse.json({ error: 'This invitation has expired.' }, { status: 410 })
  }

  return NextResponse.json({
    invitation: {
      id: invitation.id,
      email: invitation.email,
      name: invitation.name,
      role: invitation.role,
      firmName: invitation.firm.name,
    },
  })
}
