import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function getSession() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function requireAuth() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return { user: null, dbUser: null, error: 'Unauthorized' }
  }

  let dbUser = await prisma.user.findUnique({
    where: { supabaseUid: user.id },
    include: { firm: true },
  })

  if (!dbUser) {
    // User authenticated via Supabase but DB record not yet created
    // (happens when email confirmation is disabled and auth/callback is bypassed)
    const name = user.user_metadata?.name || user.email?.split('@')[0] || 'User'
    const firmName = user.user_metadata?.firmName || `${name}'s Firm`

    const firm = await prisma.firm.create({
      data: { name: firmName, email: user.email!, plan: 'trial', maxClients: 3 },
    })

    dbUser = await prisma.user.create({
      data: { email: user.email!, name, role: 'admin', firmId: firm.id, supabaseUid: user.id },
      include: { firm: true },
    })
  }

  return { user, dbUser, error: null }
}

export async function requireRole(allowedRoles: string[]) {
  const { dbUser, error } = await requireAuth()
  if (error || !dbUser) return { authorized: false, dbUser: null, error }

  if (!allowedRoles.includes(dbUser.role)) {
    return { authorized: false, dbUser, error: 'Insufficient permissions' }
  }

  return { authorized: true, dbUser, error: null }
}
