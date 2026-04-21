import { Queue } from 'bullmq'
import type { ConnectionOptions } from 'bullmq'
import { redis } from '@/lib/queue/redis'

export const XERO_QUEUE_NAME = 'xero-sync'

export const xeroQueue = new Queue(XERO_QUEUE_NAME, {
  connection: redis as unknown as ConnectionOptions,
})

export type XeroJobType = 'initial' | 'incremental' | 'dispatch_incremental'

export interface XeroJobData {
  clientId?: string
  type: XeroJobType
}

export async function enqueueXeroSync(job: XeroJobData) {
  return xeroQueue.add('sync', job, {
    removeOnComplete: true,
    removeOnFail: 100,
  })
}
