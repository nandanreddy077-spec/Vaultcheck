import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

type RateLimitPreset = 'auth' | 'oauth' | 'checkout' | 'scan' | 'webhook'

const PRESETS: Record<RateLimitPreset, { requests: number; window: Parameters<typeof Ratelimit.slidingWindow>[1] }> = {
  auth: { requests: 10, window: '10 m' },
  oauth: { requests: 20, window: '10 m' },
  checkout: { requests: 15, window: '10 m' },
  scan: { requests: 60, window: '1 m' },
  webhook: { requests: 300, window: '1 m' },
}

let ratelimitRedis: Redis | null | undefined

function getRateLimitRedis() {
  if (ratelimitRedis !== undefined) return ratelimitRedis

  const hasRestCreds =
    !!(process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) &&
    !!(process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN)

  ratelimitRedis = hasRestCreds ? Redis.fromEnv() : null
  return ratelimitRedis
}

function getClientIp(req: NextRequest) {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

export function getRateLimitKey(req: NextRequest, scope: string, identifier?: string) {
  const actor = identifier || getClientIp(req)
  return `${scope}:${actor}`
}

export async function enforceRateLimit(opts: {
  req: NextRequest
  preset: RateLimitPreset
  scope: string
  identifier?: string
}) {
  const redis = getRateLimitRedis()
  if (!redis) {
    if (process.env.NODE_ENV === 'production') {
      console.warn(`[rate-limit] Redis not configured — rate limiting DISABLED for scope="${opts.scope}". Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN.`)
    }
    return null
  }

  const config = PRESETS[opts.preset]
  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.requests, config.window),
    prefix: `rl:${opts.scope}`,
    analytics: true,
  })

  const key = getRateLimitKey(opts.req, opts.scope, opts.identifier)
  const result = await ratelimit.limit(key)

  if (result.success) return null

  return NextResponse.json(
    {
      error: 'Too many requests. Please slow down and try again shortly.',
      retryAfterSeconds: Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)),
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(Math.max(1, Math.ceil((result.reset - Date.now()) / 1000))),
        'X-RateLimit-Limit': String(config.requests),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(result.reset),
      },
    }
  )
}
