import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/dashboard'

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', req.url))
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.user) {
    return NextResponse.redirect(new URL('/login?error=auth_failed', req.url))
  }

  const { user } = data

  // Check if user already exists in DB
  const existing = await prisma.user.findUnique({ where: { supabaseUid: user.id } })

  if (!existing) {
    // New user — create firm + user from signup metadata
    const name = user.user_metadata?.name || user.email?.split('@')[0] || 'User'
    const firmName = user.user_metadata?.firmName || `${name}'s Firm`

    const firm = await prisma.firm.create({
      data: {
        name: firmName,
        email: user.email!,
        plan: 'trial',
        maxClients: 3,
      },
    })

    await prisma.user.create({
      data: {
        email: user.email!,
        name,
        role: 'admin',
        firmId: firm.id,
        supabaseUid: user.id,
      },
    })
  }

  return NextResponse.redirect(new URL(next, req.url))
}
