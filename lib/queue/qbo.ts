import { Queue } from 'bullmq'
import { redis } from '@/lib/queue/redis'

export const QBO_QUEUE_NAME = 'qbo-sync'

export const qboQueue = new Queue(QBO_QUEUE_NAME, {
  connection: redis,
})

export type QboSyncJobType = 'initial' | 'incremental'

export interface QboSyncJobData {
  clientId: string
  type: QboSyncJobType
}

export async function enqueueQboSync(job: QboSyncJobData) {
  // QBO sync/scanning are idempotent, so duplicates are safe.
  return qboQueue.add('sync', job, {
    removeOnComplete: true,
    removeOnFail: 100,
  })
}

