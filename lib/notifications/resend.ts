import { Resend } from 'resend'

export async function sendAlertEmail(opts: {
  to: string
  subject: string
  text: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // In dev/early MVP, allow running without email delivery.
    return
  }

  const resend = new Resend(apiKey)

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'alerts@vantirs.app',
    to: [opts.to],
    subject: opts.subject,
    text: opts.text,
  })
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
    return
  }

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
}

