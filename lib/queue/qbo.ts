import { Queue } from 'bullmq'
import type { ConnectionOptions } from 'bullmq'
import { redis } from '@/lib/queue/redis'

export const QBO_QUEUE_NAME = 'qbo-sync'

export const qboQueue = new Queue(QBO_QUEUE_NAME, {
  // bullmq pulls its own ioredis dependency; types can conflict even if runtime works.
  // Casting keeps the build passing while still using the same Redis URL.
  connection: redis as unknown as ConnectionOptions,
})

export type QboJobType = 'initial' | 'incremental' | 'dispatch_incremental' | 'weekly_reports'

export interface QboJobData {
  clientId?: string
  type: QboJobType
}

export async function enqueueQboSync(job: QboJobData) {
  // QBO sync/scanning are idempotent, so duplicates are safe.
  return qboQueue.add('sync', job, {
    removeOnComplete: true,
    removeOnFail: 100,
  })
}

