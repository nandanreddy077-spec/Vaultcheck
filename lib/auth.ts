import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

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

export async function requireAuth(req?: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return { user: null, dbUser: null, error: 'Unauthorized' }
  }

  const dbUser = await prisma.user.findUnique({
    where: { supabaseUid: user.id },
    include: { firm: true },
  })

  if (!dbUser) {
    return { user, dbUser: null, error: 'User not found in database' }
  }

  return { user, dbUser, error: null }
}

export async function requireRole(allowedRoles: string[]) {
  const { user, dbUser, error } = await requireAuth()
  if (error || !dbUser) return { authorized: false, dbUser: null, error }

  if (!allowedRoles.includes(dbUser.role)) {
    return { authorized: false, dbUser, error: 'Insufficient permissions' }
  }

  return { authorized: true, dbUser, error: null }
}
