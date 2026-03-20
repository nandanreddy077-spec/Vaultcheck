import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { getWeeklyReportData } from '@/lib/reports/weekly'
import WeeklyReportPdf from '@/lib/reports/WeeklyReportPdf'
import { renderToBuffer } from '@react-pdf/renderer'

export async function GET(
  _req: NextRequest,
  { params }: { params: { clientId: string } }
) {
  const { authorized, dbUser, error } = await requireRole(['admin', 'staff'])
  if (!authorized || !dbUser) {
    return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 })
  }

  const clientId = params.clientId
  const model = await getWeeklyReportData({ firmId: dbUser.firmId, clientId })

  const pdfBuffer = await renderToBuffer(<WeeklyReportPdf model={model} />)
  // NextResponse expects an ArrayBuffer/BodyInit; convert Buffer explicitly for TS compatibility.
  const pdfArrayBuffer = pdfBuffer.buffer.slice(
    pdfBuffer.byteOffset,
    pdfBuffer.byteOffset + pdfBuffer.byteLength,
  ) as ArrayBuffer

  return new NextResponse(pdfArrayBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="vaultcheck-weekly-${model.clientName.replaceAll(
        ' ',
        '-',
      )}.pdf"`,
    },
  })
}

