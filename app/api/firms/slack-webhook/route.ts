import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { authorized, dbUser, error } = await requireRole(['admin', 'staff'])
  if (!authorized || !dbUser) {
    return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json().catch(() => ({}))) as { slackWebhookUrl?: unknown }
  const raw = typeof body.slackWebhookUrl === 'string' ? body.slackWebhookUrl.trim() : ''

  const slackWebhookUrl = raw
    ? (() => {
        // Slack incoming webhooks look like:
        // https://hooks.slack.com/services/<TEAM_ID>/<CHANNEL_ID>/<TOKEN>
        if (!raw.startsWith('https://hooks.slack.com/services/')) {
          throw new Error('Invalid Slack webhook URL format.')
        }
        return raw
      })()
    : null

  try {
    await prisma.firm.update({
      where: { id: dbUser.firmId },
      data: { slackWebhookUrl },
    })

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save Slack webhook.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

