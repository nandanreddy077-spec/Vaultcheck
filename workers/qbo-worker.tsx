import { Job, Worker } from 'bullmq'
import type { ConnectionOptions } from 'bullmq'
import { QBO_QUEUE_NAME, enqueueQboSync, qboQueue } from '@/lib/queue/qbo'
import { redis } from '@/lib/queue/redis'
import { initialSync, incrementalSync } from '@/lib/qbo/sync'
import type { QboJobData } from '@/lib/queue/qbo'
import { prisma } from '@/lib/prisma'

import React from 'react'
import { renderToBuffer } from '@react-pdf/renderer'
import { getWeeklyReportData } from '@/lib/reports/weekly'
import WeeklyReportPdf from '@/lib/reports/WeeklyReportPdf'
import { sendWeeklyReportEmail } from '@/lib/notifications/resend'

async function runSync(data: QboJobData) {
  if (data.type === 'initial') {
    if (!data.clientId) throw new Error('Missing clientId for initial sync')
    return initialSync(data.clientId)
  }

  if (data.type === 'incremental') {
    if (!data.clientId) throw new Error('Missing clientId for incremental sync')
    return incrementalSync(data.clientId)
  }

  if (data.type === 'dispatch_incremental') {
    const clients = await prisma.client.findMany({
      where: { isActive: true },
      select: { id: true },
    })

    let enqueued = 0
    for (const c of clients) {
      await enqueueQboSync({ clientId: c.id, type: 'incremental' })
      enqueued += 1
    }
    return { enqueued }
  }

  if (data.type === 'weekly_reports') {
    const clients = await prisma.client.findMany({
      where: { isActive: true },
      select: { id: true, firmId: true },
    })

    const firmIds = Array.from(new Set(clients.map(c => c.firmId)))
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
    for (const c of clients) {
      const recipients = emailsByFirm.get(c.firmId) ?? []
      if (!recipients.length) continue

      const model = await getWeeklyReportData({ firmId: c.firmId, clientId: c.id })
      const pdfBuffer = await renderToBuffer(<WeeklyReportPdf model={model} />)
      const pdfBase64 = pdfBuffer.toString('base64')

      await sendWeeklyReportEmail({
        to: recipients,
        subject: `[VaultCheck] Weekly report — ${model.clientName}`,
        text:
          'Attached is your VaultCheck weekly payment verification report. It provides payment verification assistance and does not guarantee fraud detection.',
        pdfBase64,
        filename: `vaultcheck-weekly-${model.clientName.replaceAll(' ', '-')}.pdf`,
      })

      generated += 1

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
    }

    return { generated }
  }

  throw new Error(`Unknown job type: ${data.type}`)
}

// Runs continuously. Configure your deployment (Railway worker, ECS, etc.)
// to execute `npm run worker:qbo`.

async function ensureScheduledJobs() {
  await qboQueue.add(
    'sync',
    { type: 'dispatch_incremental' } satisfies QboJobData,
    {
      jobId: 'dispatch_incremental_every_4h',
      repeat: { every: 4 * 60 * 60 * 1000 },
      removeOnComplete: true,
      removeOnFail: 100,
    },
  )

  await qboQueue.add(
    'sync',
    { type: 'weekly_reports' } satisfies QboJobData,
    {
      jobId: 'weekly_reports_monday_6am',
      // BullMQ expects a cron-parser "pattern" string (not `cron`).
      repeat: { pattern: '0 6 * * 1' },
      removeOnComplete: true,
      removeOnFail: 100,
    },
  )
}

ensureScheduledJobs().catch(err => {
  console.error('Failed to ensure scheduled QBO jobs', err)
})

const worker = new Worker(
  QBO_QUEUE_NAME,
  async (job: Job<QboJobData>) => {
    if (!job.data) throw new Error('Missing job data')
    return runSync(job.data)
  },
  {
    connection: redis as unknown as ConnectionOptions,
    concurrency: 2,
  }
)

worker.on('completed', job => {
  console.log(`qbo-sync completed: ${job.id}`)
})

worker.on('failed', (job, err) => {
  console.error(`qbo-sync failed: ${job?.id}`, err)
})

async function shutdown(signal: string) {
  console.log(`qbo-worker shutting down due to ${signal}...`)
  await worker.close()
  process.exit(0)
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

