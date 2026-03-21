import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendAlertEmail } from '@/lib/notifications/resend'

// GET — list pending invitations for this firm
export async function GET() {
  const { authorized, dbUser, error } = await requireRole(['admin'])
  if (!authorized || !dbUser) {
    return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 })
  }

  const invitations = await prisma.invitation.findMany({
    where: { firmId: dbUser.firmId, status: 'pending' },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ invitations })
}

// POST — invite a new team member
export async function POST(req: NextRequest) {
  const { authorized, dbUser, error } = await requireRole(['admin'])
  if (!authorized || !dbUser) {
    return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json().catch(() => ({}))) as {
    email?: string
    name?: string
    role?: string
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const role = body.role === 'admin' ? 'admin' : 'staff'

  if (!email || !name) {
    return NextResponse.json({ error: 'Email and name are required.' }, { status: 400 })
  }

  // Check if user already exists in this firm
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser && existingUser.firmId === dbUser.firmId) {
    return NextResponse.json({ error: 'This person is already a team member.' }, { status: 409 })
  }

  // Check for existing pending invitation
  const existingInvite = await prisma.invitation.findFirst({
    where: { firmId: dbUser.firmId, email, status: 'pending' },
  })
  if (existingInvite) {
    return NextResponse.json({ error: 'An invitation has already been sent to this email.' }, { status: 409 })
  }

  const invitation = await prisma.invitation.create({
    data: {
      firmId: dbUser.firmId,
      email,
      name,
      role,
      invitedBy: dbUser.id,
    },
  })

  // Send invitation email
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  await sendAlertEmail({
    to: email,
    subject: `You're invited to join ${dbUser.firm.name} on VaultCheck`,
    text: [
      `Hi ${name},`,
      '',
      `${dbUser.name} has invited you to join ${dbUser.firm.name} on VaultCheck as a ${role}.`,
      '',
      `Click the link below to accept your invitation and create your account:`,
      `${appUrl}/invite/${invitation.id}`,
      '',
      `This invitation expires in 7 days.`,
      '',
      '— VaultCheck',
    ].join('\n'),
  })

  return NextResponse.json({ invitation }, { status: 201 })
}
