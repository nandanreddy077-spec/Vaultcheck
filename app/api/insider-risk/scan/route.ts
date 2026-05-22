import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { scanFirmInsiderRisk } from '@/lib/scanner/insider-risk'

export const maxDuration = 120

export async function POST() {
  const { dbUser, error } = await requireAuth()
  if (error || !dbUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const results = await scanFirmInsiderRisk(dbUser.firmId)
  const totalFlags = results.reduce((s, r) => s + r.flagsCreated, 0)
  const patterns = [...new Set(results.flatMap(r => r.patterns))]

  return NextResponse.json({ ok: true, totalFlags, patterns, clients: results })
}
