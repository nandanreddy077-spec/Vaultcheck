import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import * as Sentry from '@sentry/nextjs'

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

  let dbUser = null
  try {
    dbUser = await prisma.user.findUnique({
      where: { supabaseUid: user.id },
      include: { firm: true },
    })
  } catch (e) {
    Sentry.captureException(e)
    return { user, dbUser: null, error: 'Failed to load user record' }
  }

  if (!dbUser) {
    return { user, dbUser: null, error: 'User not found in database' }
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
