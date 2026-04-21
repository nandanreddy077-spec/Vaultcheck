import { Resend } from 'resend'
import { captureException, captureMessage } from '@/lib/monitoring'

export async function sendAlertEmail(opts: {
  to: string
  subject: string
  text: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // In dev/early MVP, allow running without email delivery.
    captureMessage('RESEND_API_KEY missing; skipping alert email send.', {
      level: 'warning',
      tags: { service: 'resend', flow: 'alert-email' },
      extra: { to: opts.to, subject: opts.subject },
    })
    return
  }

  try {
    const resend = new Resend(apiKey)

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'alerts@vantirs.app',
      to: [opts.to],
      subject: opts.subject,
      text: opts.text,
    })
  } catch (error) {
    captureException(error, {
      tags: { service: 'resend', flow: 'alert-email' },
      extra: { to: opts.to, subject: opts.subject },
    })
  }
}

export async function sendWeeklyReportEmail(opts: {
  to: string[]
  subject: string
  text: string
  filename: string
  pdfBase64: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // Allow running without email delivery in dev/early MVP.
    captureMessage('RESEND_API_KEY missing; skipping weekly report email send.', {
      level: 'warning',
      tags: { service: 'resend', flow: 'weekly-report-email' },
      extra: { to: opts.to, subject: opts.subject, filename: opts.filename },
    })
    return
  }

  try {
    const resend = new Resend(apiKey)

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'reports@vantirs.app',
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      attachments: [
        {
          filename: opts.filename,
          content: opts.pdfBase64,
          contentType: 'application/pdf',
        },
      ],
    })
  } catch (error) {
    captureException(error, {
      tags: { service: 'resend', flow: 'weekly-report-email' },
      extra: { to: opts.to, subject: opts.subject, filename: opts.filename },
    })
  }
}

