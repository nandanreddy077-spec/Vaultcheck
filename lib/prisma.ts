import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  (() => {
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      throw new Error('Missing DATABASE_URL environment variable for Prisma Client.')
    }

    const adapter = new PrismaPg({ connectionString: databaseUrl })

    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })
  })()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
