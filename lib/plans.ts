export type PaidPlan = 'solo' | 'starter' | 'growth' | 'scale' | 'whitelabel' | 'enterprise' | 'pilot'

export const PLAN_LIMITS: Record<
  PaidPlan,
  { maxClients: number; label: string }
> = {
  solo: { maxClients: 5, label: 'Solo' },
  pilot: { maxClients: 10, label: 'Pilot' },
  starter: { maxClients: 25, label: 'Starter' },
  growth: { maxClients: 75, label: 'Growth' },
  scale: { maxClients: 200, label: 'Scale' },
  whitelabel: { maxClients: 75, label: 'White-label' },
  enterprise: { maxClients: 9999, label: 'Enterprise' },
}

// Permanent free tier — no expiry, 3 clients forever
export const FREE_MAX_CLIENTS = 3
// Paid plan trial — 14 days, then locked until upgraded
export const TRIAL_MAX_CLIENTS = 3

/** Map Paddle price IDs to internal plan + entitlements. */
export function planFromPaddlePriceId(priceId: string | undefined): {
  plan: string
  maxClients: number
} | undefined {
  if (!priceId) return undefined

  const map: Array<{ env: string | undefined; plan: PaidPlan }> = [
    { env: process.env.PADDLE_PRICE_SOLO, plan: 'solo' },
    { env: process.env.PADDLE_PRICE_PILOT, plan: 'pilot' },
    { env: process.env.PADDLE_PRICE_STARTER, plan: 'starter' },
    { env: process.env.PADDLE_PRICE_GROWTH, plan: 'growth' },
    { env: process.env.PADDLE_PRICE_SCALE, plan: 'scale' },
    { env: process.env.PADDLE_PRICE_WHITELABEL, plan: 'whitelabel' },
    { env: process.env.PADDLE_PRICE_ENTERPRISE, plan: 'enterprise' },
  ]

  for (const entry of map) {
    if (entry.env && entry.env === priceId) {
      const limits = PLAN_LIMITS[entry.plan]
      return { plan: entry.plan, maxClients: limits.maxClients }
    }
  }

  return undefined
}
