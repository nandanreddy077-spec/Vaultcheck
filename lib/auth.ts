import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { ensureProvisionedUser } from '@/lib/provision-user'

export async function getSession() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (!error && user) return user
  const { data: sessionData } = await supabase.auth.getSession()
  return sessionData?.session?.user ?? null
}

export async function requireAuth() {
  try {
    const supabase = await createClient()
    let user = null
    const { data: userData, error } = await supabase.auth.getUser()
    if (!error && userData?.user) {
      user = userData.user
    } else {
      const { data: sessionData } = await supabase.auth.getSession()
      user = sessionData?.session?.user ?? null
    }

    if (!user) {
      return { user: null, dbUser: null, error: 'Unauthorized' }
    }

    let dbUser = null
    try {
      dbUser = await prisma.user.findUnique({
        where: { supabaseUid: user.id },
        include: { firm: true },
      })
      if (!dbUser || !dbUser.firm) {
        dbUser = await ensureProvisionedUser(user)
      }
    } catch {
      return { user, dbUser: null, error: 'Database unavailable' }
    }

    if (!dbUser) {
      return { user, dbUser: null, error: 'User not found in database' }
    }

    if (!dbUser.firm) {
      return { user, dbUser: null, error: 'User is not linked to a firm' }
    }

    const now = new Date()

    // Auto-expire trial after 30 days — lock to 0 clients (force upgrade)
    if (dbUser.firm.plan === 'trial') {
      const trialStart = dbUser.firm.trialStartedAt ?? dbUser.firm.createdAt
      const trialExpiry = new Date(trialStart)
      trialExpiry.setDate(trialExpiry.getDate() + 30)
      if (now > trialExpiry) {
        await prisma.firm.update({
          where: { id: dbUser.firm.id },
          data: { maxClients: 0 },
        })
        dbUser.firm.maxClients = 0
      }
    }

    // Auto-expire pilot plan after 3 months
    if (
      dbUser.firm.plan === 'pilot' &&
      dbUser.firm.pilotExpiresAt &&
      dbUser.firm.pilotExpiresAt < now
    ) {
      await prisma.firm.update({
        where: { id: dbUser.firm.id },
        data: { plan: 'trial', maxClients: 0, pilotExpiresAt: null },
      })
      dbUser.firm.plan = 'trial'
      dbUser.firm.maxClients = 0
    }

    return { user, dbUser, error: null }
  } catch {
    return { user: null, dbUser: null, error: 'Unauthorized' }
  }
}

export async function requireRole(allowedRoles: string[]) {
  const { dbUser, error } = await requireAuth()
  if (error || !dbUser) return { authorized: false, dbUser: null, error }

  if (!allowedRoles.includes(dbUser.role)) {
    return { authorized: false, dbUser, error: 'Insufficient permissions' }
  }

  return { authorized: true, dbUser, error: null }
}
