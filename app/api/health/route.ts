import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getProductionReadiness, hasRedisRateLimit, hasResend } from '@/lib/production-guard'

export async function GET() {
  let database: 'up' | 'down' = 'down'
  try {
    await prisma.$queryRaw`SELECT 1`
    database = 'up'
  } catch {
    database = 'down'
  }

  const { ready, checks } = getProductionReadiness()
  checks.database = database === 'up' ? 'ok' : 'down'

  const ok = database === 'up' && ready

  return NextResponse.json(
    {
      ok,
      productionReady: ok,
      services: {
        database,
        encryption: checks.encryption,
        cron: checks.cron,
        resend: checks.resend,
        rate_limit: checks.rate_limit,
      },
      configured: {
        resend: hasResend(),
        redis: hasRedisRateLimit(),
      },
      timestamp: new Date().toISOString(),
    },
    { status: ok ? 200 : 503 }
  )
}
