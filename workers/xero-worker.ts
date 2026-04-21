import { Job, Worker } from 'bullmq'
import type { ConnectionOptions } from 'bullmq'
import { XERO_QUEUE_NAME, enqueueXeroSync, xeroQueue } from '@/lib/queue/xero'
import { redis } from '@/lib/queue/redis'
import { initialSync, incrementalSync } from '@/lib/xero/sync'
import type { XeroJobData } from '@/lib/queue/xero'
import { prisma } from '@/lib/prisma'

async function runSync(data: XeroJobData) {
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
      where: { isActive: true, xeroTenantId: { not: null } },
      select: { id: true },
    })

    let enqueued = 0
    for (const c of clients) {
      await enqueueXeroSync({ clientId: c.id, type: 'incremental' })
      enqueued += 1
    }
    return { enqueued }
  }

  throw new Error(`Unknown job type: ${data.type}`)
}

async function ensureScheduledJobs() {
  await xeroQueue.add(
    'sync',
    { type: 'dispatch_incremental' } satisfies XeroJobData,
    {
      jobId: 'xero_dispatch_incremental_every_4h',
      repeat: { every: 4 * 60 * 60 * 1000 },
      removeOnComplete: true,
      removeOnFail: 100,
    },
  )
}

ensureScheduledJobs().catch(err => {
  console.error('Failed to ensure scheduled Xero jobs', err)
})

const worker = new Worker(
  XERO_QUEUE_NAME,
  async (job: Job<XeroJobData>) => {
    if (!job.data) throw new Error('Missing job data')
    return runSync(job.data)
  },
  {
    connection: redis as unknown as ConnectionOptions,
    concurrency: 2,
  },
)

worker.on('completed', job => {
  console.log(`xero-sync completed: ${job.id}`)
})

worker.on('failed', (job, err) => {
  console.error(`xero-sync failed: ${job?.id}`, err)
})

async function shutdown(signal: string) {
  console.log(`xero-worker shutting down due to ${signal}...`)
  await worker.close()
  process.exit(0)
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
