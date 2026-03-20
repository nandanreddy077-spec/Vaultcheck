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
    from: process.env.RESEND_FROM_EMAIL || 'alerts@vaultcheck.app',
    to: [opts.to],
    subject: opts.subject,
    text: opts.text,
  })
}

