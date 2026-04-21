import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`

    return NextResponse.json({
      ok: true,
      services: {
        database: 'up',
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        services: {
          database: 'down',
        },
        error: error instanceof Error ? error.message : 'Database health check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    )
  }
}
