import IORedis from 'ioredis'

// During local build/dev, this env var may be missing. Avoid throwing at import-time
// (Next.js may import route modules while building). In production, UPSTASH_REDIS_URL
// should be set and will override this fallback.
const redisUrl = process.env.UPSTASH_REDIS_URL || 'redis://localhost:6379'

// Upstash Redis is compatible with standard ioredis URLs.
export const redis = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
})

