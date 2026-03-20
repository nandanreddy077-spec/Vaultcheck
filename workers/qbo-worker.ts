import { Job, Worker } from 'bullmq'
import { QBO_QUEUE_NAME } from '@/lib/queue/qbo'
import { redis } from '@/lib/queue/redis'
import { initialSync, incrementalSync } from '@/lib/qbo/sync'
import type { QboSyncJobData } from '@/lib/queue/qbo'

async function runSync(data: QboSyncJobData) {
  if (data.type === 'initial') return initialSync(data.clientId)
  return incrementalSync(data.clientId)
}

// Runs continuously. Configure your deployment (Railway worker, ECS, etc.)
// to execute `npm run worker:qbo`.
const worker = new Worker(
  QBO_QUEUE_NAME,
  async (job: Job<QboSyncJobData>) => {
    if (!job.data) throw new Error('Missing job data')
    return runSync(job.data)
  },
  {
    connection: redis,
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

