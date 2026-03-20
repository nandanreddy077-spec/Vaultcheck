import IORedis from 'ioredis'

const redisUrl = process.env.UPSTASH_REDIS_URL
if (!redisUrl) {
  throw new Error('Missing UPSTASH_REDIS_URL (needed for BullMQ/Redis queue).')
}

// Upstash Redis is compatible with standard ioredis URLs.
export const redis = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
})

