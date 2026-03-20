export async function sendSlackAlert(opts: {
  webhookUrl: string
  text: string
}) {
  const res = await fetch(opts.webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: opts.text }),
  })

  if (!res.ok) {
    // Don't fail the scan/sync pipeline on notification issues.
    // Log details only if you have structured logging set up.
    return
  }
}

export function getSlackWebhookUrl() {
  return process.env.SLACK_WEBHOOK_URL
}

