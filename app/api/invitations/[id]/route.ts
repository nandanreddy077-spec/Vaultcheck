import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// DELETE — revoke an invitation
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { authorized, dbUser, error } = await requireRole(['admin'])
  if (!authorized || !dbUser) {
    return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 })
  }

  const invitation = await prisma.invitation.findUnique({ where: { id } })
  if (!invitation || invitation.firmId !== dbUser.firmId) {
    return NextResponse.json({ error: 'Invitation not found.' }, { status: 404 })
  }

  await prisma.invitation.update({
    where: { id },
    data: { status: 'revoked' },
  })

  return NextResponse.json({ ok: true })
}
