import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { dbUser, error } = await requireAuth()
  if (error || !dbUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const vendor = await prisma.vendor.findFirst({
    where: { id: id, client: { firmId: dbUser.firmId } },
    include: { fingerprint: true },
  })

  if (!vendor) {
    return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
  }

  if (!vendor.fingerprint) {
    return NextResponse.json({ error: 'No fingerprint available for this vendor' }, { status: 404 })
  }

  return NextResponse.json(vendor.fingerprint)
}
