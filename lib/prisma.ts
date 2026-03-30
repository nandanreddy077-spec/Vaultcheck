import '@/lib/env-bootstrap'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/** Protocol-relative DB URLs (`//host...`) break `new URL()` — common mistaken paste next to NEXT_PUBLIC_SUPABASE_URL. */
function connectionStringForUrlParse(connectionString: string): string {
  const t = connectionString.trim()
  if (t.startsWith('//')) return `https:${t}`
  return t
}

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('Missing DATABASE_URL or DIRECT_URL for Prisma Client.')
  }

  const url = new URL(connectionStringForUrlParse(connectionString))
  const pool = new Pool({
    host: url.hostname,
    port: parseInt(url.port || '5432', 10),
    database: url.pathname.replace(/^\//, ''),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    ssl: { rejectUnauthorized: false },
  })

  const adapter = new PrismaPg(pool)

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient()
  }
  return globalForPrisma.prisma
}

/**
 * Lazy proxy avoids instantiating pg + Prisma during `next build` import analysis.
 * First real access (e.g. `prisma.user.findUnique`) constructs the client.
 */
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrismaClient()
    const value = Reflect.get(client, prop, receiver) as unknown
    if (typeof value === 'function') {
      return (value as (...args: unknown[]) => unknown).bind(client)
    }
    return value
  },
})
