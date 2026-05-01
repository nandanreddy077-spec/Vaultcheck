export type CronAuthResult = 'ok' | 'unauthorized' | 'misconfigured'

export function verifyCronAuthorization(req: Request): CronAuthResult {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    console.error('[cron-auth] CRON_SECRET is not configured')
    return 'misconfigured'
  }

  const authHeader = req.headers.get('authorization')
  if (!authHeader) {
    return 'unauthorized'
  }

  return authHeader === `Bearer ${secret}` ? 'ok' : 'unauthorized'
}
