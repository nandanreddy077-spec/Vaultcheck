import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  (() => {
    // PrismaPg (pg.Pool) manages its own connection pool — use DIRECT_URL to
    // bypass PgBouncer (Transaction Pooler). Falling back to DATABASE_URL if
    // DIRECT_URL is not set (e.g. local dev without pooler).
    const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error('Missing DATABASE_URL environment variable for Prisma Client.')
    }

    const adapter = new PrismaPg({ connectionString })

    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })
  })()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
