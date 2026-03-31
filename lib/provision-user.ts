import { prisma } from '@/lib/prisma'

type AuthLikeUser = {
  id: string
  email?: string | null
  user_metadata?: Record<string, unknown> | null
}

function resolveProfile(user: AuthLikeUser) {
  const metadata = user.user_metadata || {}
  const email = user.email?.trim().toLowerCase()

  if (!email) {
    throw new Error('Authenticated user is missing an email address.')
  }

  const fallbackName = email.split('@')[0]
  const name =
    (typeof metadata.name === 'string' && metadata.name.trim()) ||
    fallbackName
  const firmName =
    (typeof metadata.firmName === 'string' && metadata.firmName.trim()) ||
    `${name}'s Firm`

  return { email, name, firmName }
}

export async function ensureProvisionedUser(user: AuthLikeUser) {
  const { email, name, firmName } = resolveProfile(user)

  const existingByUid = await prisma.user.findUnique({
    where: { supabaseUid: user.id },
    include: { firm: true },
  })

  if (existingByUid?.firm) {
    return existingByUid
  }

  const firm = await prisma.firm.upsert({
    where: { email },
    update: {},
    create: {
      name: firmName,
      email,
      plan: 'trial',
      maxClients: 3,
    },
  })

  const provisionedUser = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      supabaseUid: user.id,
      firmId: firm.id,
      role: 'admin',
    },
    create: {
      email,
      name,
      role: 'admin',
      firmId: firm.id,
      supabaseUid: user.id,
    },
    include: { firm: true },
  })

  return provisionedUser
}
