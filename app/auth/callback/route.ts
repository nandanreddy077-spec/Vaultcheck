import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/dashboard'
  const inviteId = searchParams.get('inviteId')

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', req.url))
  }

  // We need to set cookies on the ACTUAL response object that gets returned.
  // Using cookies() from next/headers won't work because NextResponse.redirect()
  // creates a new response that doesn't include those cookies.
  const cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[] = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookies) {
          cookiesToSet.push(...cookies.map(c => ({ name: c.name, value: c.value, options: c.options as Record<string, unknown> })))
        },
      },
    }
  )

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.user) {
    console.error('Auth callback error:', error?.message, error?.status)
    console.error('Request cookies:', req.cookies.getAll().map(c => c.name))
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error?.message || 'auth_failed')}`, req.url))
  }

  const { user } = data

  // Determine redirect destination
  let redirectTo = next

  // Check if user already exists in DB
  const existing = await prisma.user.findUnique({ where: { supabaseUid: user.id } })

  if (!existing) {
    // Check if this is an invitation acceptance
    const metaInviteId = inviteId || user.user_metadata?.inviteId
    let invitation = null

    if (metaInviteId) {
      invitation = await prisma.invitation.findFirst({
        where: { id: metaInviteId, status: 'pending' },
        include: { firm: true },
      })
    }

    if (invitation) {
      // Invited user — add to existing firm
      await prisma.user.create({
        data: {
          email: user.email!,
          name: invitation.name,
          role: invitation.role,
          firmId: invitation.firmId,
          supabaseUid: user.id,
        },
      })

      // Mark invitation as accepted
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: 'accepted' },
      })
    } else {
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

      // Redirect new users to onboarding
      redirectTo = '/dashboard/onboarding'
    }
  }

  // Create redirect response and attach ALL auth cookies to it
  const response = NextResponse.redirect(new URL(redirectTo, req.url))
  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options)
  })

  return response
}
