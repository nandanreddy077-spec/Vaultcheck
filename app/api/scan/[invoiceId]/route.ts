import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { scanInvoice } from '@/lib/scanner/scan'
import { prisma } from '@/lib/prisma'

export async function POST(
  _req: NextRequest,
  { params }: { params: { invoiceId: string } }
) {
  const { dbUser, error } = await requireAuth()
  if (error || !dbUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify invoice belongs to this firm
  const invoice = await prisma.invoice.findFirst({
    where: {
      id: params.invoiceId,
      client: { firmId: dbUser.firmId },
    },
  })

  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
  }

  try {
    const result = await scanInvoice(params.invoiceId)
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
