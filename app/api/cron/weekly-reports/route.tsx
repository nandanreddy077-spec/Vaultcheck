import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyCronAuthorization } from '@/lib/cron-auth'
import { captureException } from '@/lib/monitoring'
import { getWeeklyReportData } from '@/lib/reports/weekly'
import { sendWeeklyReportEmail } from '@/lib/notifications/resend'
import React from 'react'
import { renderToBuffer } from '@react-pdf/renderer'
import WeeklyReportPdf from '@/lib/reports/WeeklyReportPdf'

// Called every Monday at 6am UTC via GitHub Actions cron.
// Generates and emails weekly PDF reports for all active clients.
export const maxDuration = 300

export async function POST(req: Request) {
  const cronAuth = verifyCronAuthorization(req)
  if (cronAuth !== 'ok') {
    const status = cronAuth === 'misconfigured' ? 503 : 401
    return NextResponse.json(
      { error: cronAuth === 'misconfigured' ? 'Server misconfigured' : 'Unauthorized' },
      { status }
    )
  }

  const clients = await prisma.client.findMany({
    where: { isActive: true },
    select: { id: true, firmId: true },
  })

  const firmIds = [...new Set(clients.map(c => c.firmId))]
  const firmUsers = await prisma.user.findMany({
    where: { firmId: { in: firmIds }, role: { in: ['admin', 'staff'] } },
    select: { firmId: true, email: true },
  })

  const emailsByFirm = new Map<string, string[]>()
  for (const u of firmUsers) {
    const list = emailsByFirm.get(u.firmId) ?? []
    if (u.email) list.push(u.email)
    emailsByFirm.set(u.firmId, list)
  }

  let generated = 0
  let errors = 0

  for (const c of clients) {
    const recipients = emailsByFirm.get(c.firmId) ?? []
    if (!recipients.length) continue

    try {
      const model = await getWeeklyReportData({ firmId: c.firmId, clientId: c.id })
      const pdfBuffer = await renderToBuffer(<WeeklyReportPdf model={model} />)
      const pdfBase64 = pdfBuffer.toString('base64')

      await sendWeeklyReportEmail({
        to: recipients,
        subject: `[Vantirs] Weekly report — ${model.clientName}`,
        text: 'Attached is your Vantirs weekly payment verification report. It provides payment verification assistance and does not guarantee fraud detection.',
        pdfBase64,
        filename: `vantirs-weekly-${model.clientName.replaceAll(' ', '-')}.pdf`,
      })

      await prisma.auditLog.create({
        data: {
          firmId: c.firmId,
          clientId: c.id,
          userId: null,
          action: 'weekly_report_generated',
          entityType: 'client',
          entityId: `${c.firmId}:${c.id}`,
          details: { clientName: model.clientName, range: model.range },
        },
      })

      generated++
    } catch (err) {
      captureException(err, { tags: { route: 'cron/weekly-reports' }, extra: { clientId: c.id } })
      errors++
    }
  }

  return NextResponse.json({ ok: true, generated, errors })
}
