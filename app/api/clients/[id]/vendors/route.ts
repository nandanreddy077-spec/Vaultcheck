import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { dbUser, error } = await requireAuth()
  if (error || !dbUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify client belongs to user's firm
  const client = await prisma.client.findFirst({
    where: { id: params.id, firmId: dbUser.firmId },
    select: { id: true },
  })

  if (!client) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 })
  }

  const { searchParams } = new URL(req.url)
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '50')))
  const skip = (page - 1) * limit

  const [vendors, total] = await Promise.all([
    prisma.vendor.findMany({
      where: { clientId: params.id, isActive: true },
      include: {
        fingerprint: true,
        _count: { select: { invoices: true } },
      },
      orderBy: { displayName: 'asc' },
      skip,
      take: limit,
    }),
    prisma.vendor.count({ where: { clientId: params.id, isActive: true } }),
  ])

  return NextResponse.json({ vendors, total, page, limit })
}
