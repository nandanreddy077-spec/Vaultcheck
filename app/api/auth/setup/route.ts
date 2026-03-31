import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  let user = null
  try {
    const supabase = await createClient()
    const { data: userData, error } = await supabase.auth.getUser()
    if (!error && userData?.user) {
      user = userData.user
    } else {
      const { data: sessionData } = await supabase.auth.getSession()
      user = sessionData?.session?.user ?? null
    }
  } catch {
    user = null
  }

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const existingUser = await prisma.user.findUnique({
    where: { supabaseUid: user.id },
    include: { firm: true },
  })

  // Already set up — skip silently
  if (existingUser) {
    return NextResponse.json({ ok: true })
  }

  const body = await req.json().catch(() => ({}))
  const metadata = user.user_metadata || {}
  const name = typeof body?.name === 'string' ? body.name : undefined
  const firmName = typeof body?.firmName === 'string' ? body.firmName : undefined
  const resolvedName =
    name ||
    (typeof metadata.name === 'string' ? metadata.name : undefined) ||
    user.email!.split('@')[0]
  const resolvedFirmName =
    firmName ||
    (typeof metadata.firmName === 'string' ? metadata.firmName : undefined) ||
    `${resolvedName}'s Firm`

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
