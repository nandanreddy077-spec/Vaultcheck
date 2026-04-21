import { captureException } from '@/lib/monitoring'

export async function sendSlackAlert(opts: {
  webhookUrl: string
  text: string
}) {
  try {
    const res = await fetch(opts.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: opts.text }),
    })

    if (!res.ok) {
      captureException(new Error(`Slack webhook failed with status ${res.status}`), {
        tags: { service: 'slack', flow: 'alert-notification' },
        extra: { status: res.status },
      })
    }
  } catch (error) {
    captureException(error, {
      tags: { service: 'slack', flow: 'alert-notification' },
    })
  }
}

export function getSlackWebhookUrl() {
  return process.env.SLACK_WEBHOOK_URL
}

