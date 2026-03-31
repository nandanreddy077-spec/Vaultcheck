import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  try {
    const { dbUser, error } = await requireAuth()
    if (error || !dbUser) {
      return NextResponse.json({ firmName: null }, { status: 401 })
    }
    return NextResponse.json({ firmName: dbUser.firm?.name ?? null })
  } catch {
    return NextResponse.json({ firmName: null }, { status: 500 })
  }
}
