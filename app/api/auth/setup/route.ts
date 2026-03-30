import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { user, dbUser, error } = await requireAuth()
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Already set up — skip silently
  if (dbUser) {
    return NextResponse.json({ ok: true })
  }

  const { name, firmName } = await req.json()
  const resolvedName = name || user.email!.split('@')[0]
  const resolvedFirmName = firmName || `${resolvedName}'s Firm`

  const firm = await prisma.firm.create({
    data: {
      name: resolvedFirmName,
      email: user.email!,
      plan: 'trial',
      maxClients: 3,
    },
  })

  await prisma.user.create({
    data: {
      email: user.email!,
      name: resolvedName,
      role: 'admin',
      firmId: firm.id,
      supabaseUid: user.id,
    },
  })

  return NextResponse.json({ ok: true })
}
