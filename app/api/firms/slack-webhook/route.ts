import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { captureException } from '@/lib/monitoring'

export async function POST(req: NextRequest) {
  const { authorized, dbUser, error } = await requireRole(['admin', 'staff'])
  if (!authorized || !dbUser) {
    return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json().catch(() => ({}))) as { slackWebhookUrl?: unknown }
  const raw = typeof body.slackWebhookUrl === 'string' ? body.slackWebhookUrl.trim() : ''

  if (raw && !raw.startsWith('https://hooks.slack.com/services/')) {
    return NextResponse.json({ error: 'Invalid Slack webhook URL format.' }, { status: 400 })
  }

  const slackWebhookUrl = raw || null

  try {
    await prisma.firm.update({
      where: { id: dbUser.firmId },
      data: { slackWebhookUrl },
    })

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save Slack webhook.'
    captureException(err, {
      tags: { route: 'api/firms/slack-webhook', service: 'slack' },
      extra: { firmId: dbUser.firmId },
    })
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

