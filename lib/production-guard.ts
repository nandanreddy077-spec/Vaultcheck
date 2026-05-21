export type ServiceStatus = 'ok' | 'degraded' | 'down' | 'not_configured'

export function isProductionRuntime(): boolean {
  return process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production'
}

export function hasRedisRateLimit(): boolean {
  return !!(
    (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) &&
    (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN)
  )
}

export function hasResend(): boolean {
  return !!process.env.RESEND_API_KEY?.trim()
}

export function hasCronSecret(): boolean {
  return !!process.env.CRON_SECRET?.trim()
}

export function hasEncryptionKey(): boolean {
  const key = process.env.ENCRYPTION_KEY?.trim()
  return !!key && /^[0-9a-fA-F]{64}$/.test(key)
}

/** Required for production fraud-alert delivery. */
export function requireResendForAlerts(): void {
  if (isProductionRuntime() && !hasResend()) {
    throw new Error(
      'RESEND_API_KEY is required in production for fraud alert delivery. Configure Resend or disable production deploy.',
    )
  }
}

export function getProductionReadiness(): {
  ready: boolean
  checks: Record<string, ServiceStatus>
} {
  const checks: Record<string, ServiceStatus> = {
    database: 'ok', // validated separately in /api/health
    encryption: hasEncryptionKey() ? 'ok' : 'down',
    cron: hasCronSecret() ? 'ok' : isProductionRuntime() ? 'down' : 'not_configured',
    resend: hasResend() ? 'ok' : isProductionRuntime() ? 'degraded' : 'not_configured',
    rate_limit: hasRedisRateLimit() ? 'ok' : isProductionRuntime() ? 'degraded' : 'not_configured',
  }

  const blocking = ['encryption', 'cron'] as const
  const ready = blocking.every(k => checks[k] === 'ok')

  return { ready, checks }
}
