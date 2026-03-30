import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  (() => {
    // PrismaPg uses pg.Pool — use DIRECT_URL to bypass PgBouncer Transaction Pooler.
    // Parse the URL manually so special characters in the password (e.g. [ ] @ # %)
    // don't break URL parsing in the pg library.
    const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error('Missing DATABASE_URL environment variable for Prisma Client.')
    }

    const url = new URL(connectionString)
    const pool = new Pool({
      host: url.hostname,
      port: parseInt(url.port || '5432'),
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
  })()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
