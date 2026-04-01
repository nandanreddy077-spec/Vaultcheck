'use client'

import { useState } from 'react'
import { CheckCircle, Tag, Zap } from 'lucide-react'
import { parseJsonResponse } from '@/lib/parse-json-response'

type Plan = 'pilot' | 'solo' | 'starter' | 'growth' | 'scale' | 'enterprise'
type FirmPlan = Plan | 'trial' | string

type CheckoutPayload = {
  priceId: string
  customerId: string
  successUrl: string
  customData: Record<string, string>
  error?: string
}

type PaddleClient = {
  Environment: {
    set(value: 'sandbox' | 'production'): void
  }
  Initialize(config: {
    token: string
    checkout?: {
      settings?: {
        displayMode?: 'overlay'
        theme?: 'light'
        locale?: 'en'
        variant?: 'one-page'
        allowLogout?: boolean
        successUrl?: string
      }
    }
  }): void
  Checkout: {
    open(config: {
      items: Array<{ priceId: string; quantity: number }>
      customer?: { id?: string }
      customData?: Record<string, string>
      settings?: {
        displayMode?: 'overlay'
        theme?: 'light'
        locale?: 'en'
        variant?: 'one-page'
        allowLogout?: boolean
        successUrl?: string
      }
    }): void
  }
}

type PaddleWindow = Window & {
  Paddle?: PaddleClient
}

let paddleSetupPromise: Promise<PaddleClient> | null = null

async function getPaddleClient(): Promise<PaddleClient> {
  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
  if (!token) {
    throw new Error('Billing is not configured yet. Add NEXT_PUBLIC_PADDLE_CLIENT_TOKEN to your environment.')
  }

  if (!paddleSetupPromise) {
    paddleSetupPromise = new Promise<PaddleClient>((resolve, reject) => {
      const win = window as PaddleWindow

      const initialize = () => {
        const paddle = win.Paddle
        if (!paddle) {
          reject(new Error('Paddle checkout failed to load. Please refresh and try again.'))
          return
        }

        const environment =
          process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === 'production' ? 'production' : 'sandbox'
        paddle.Environment.set(environment)
        paddle.Initialize({
          token,
          checkout: {
            settings: {
              displayMode: 'overlay',
              variant: 'one-page',
              allowLogout: false,
              theme: 'light',
              locale: 'en',
            },
          },
        })
        resolve(paddle)
      }

      if (win.Paddle) {
        initialize()
        return
      }

      const existingScript = document.querySelector<HTMLScriptElement>('script[data-paddle-script="true"]')
      if (existingScript) {
        existingScript.addEventListener('load', initialize, { once: true })
        existingScript.addEventListener(
          'error',
          () => reject(new Error('Paddle checkout failed to load. Please refresh and try again.')),
          { once: true }
        )
        return
      }

      const script = document.createElement('script')
      script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js'
      script.async = true
      script.dataset.paddleScript = 'true'
      script.addEventListener('load', initialize, { once: true })
      script.addEventListener(
        'error',
        () => reject(new Error('Paddle checkout failed to load. Please refresh and try again.')),
        { once: true }
      )
      document.head.appendChild(script)
    }).catch(error => {
      paddleSetupPromise = null
      throw error
    })
  }

  return paddleSetupPromise
}

const UPGRADE_PLANS: Array<{
  id: Plan
  name: string
  price: string
  period: string
  clients: number
  features: string[]
  popular?: boolean
}> = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$79',
    period: '/mo',
    clients: 10,
    features: ['Up to 10 clients', 'Email alerts', 'Vendor fingerprinting'],
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '$149',
    period: '/mo',
    clients: 25,
    features: ['Up to 25 clients', 'Slack alerts', 'API access'],
    popular: true,
  },
  {
    id: 'scale',
    name: 'Scale',
    price: '$299',
    period: '/mo',
    clients: 50,
    features: ['Up to 50 clients', 'Custom rules', 'SLA guarantee'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    clients: 9999,
    features: ['Unlimited clients', 'White-label', 'Dedicated support'],
  },
]

const PLAN_LABELS: Record<string, string> = {
  trial: 'Free Trial',
  pilot: 'Outreach Partner',
  solo: 'Solo',
  starter: 'Starter',
  growth: 'Growth',
  scale: 'Scale',
  enterprise: 'Enterprise',
}

export default function BillingPanel({
  currentPlan,
}: {
  currentPlan: FirmPlan
  pilotAvailable: boolean
}) {
  const [loadingPlan, setLoadingPlan] = useState<Plan | null>(null)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [coupon, setCoupon] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponMsg, setCouponMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function startCheckout(plan: Plan) {
    setLoadingPlan(plan)
    setCheckoutError(null)
    try {
      const res = await fetch('/api/paddle/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await parseJsonResponse<CheckoutPayload>(res)
      if (!res.ok) throw new Error(data?.error || `Checkout failed (${res.status})`)
      if (!data?.priceId || !data?.customerId) {
        throw new Error(data?.error || 'Missing Paddle checkout configuration.')
      }

      const paddle = await getPaddleClient()
      paddle.Checkout.open({
        items: [{ priceId: data.priceId, quantity: 1 }],
        customer: {
          id: data.customerId,
        },
        customData: data.customData,
        settings: {
          displayMode: 'overlay',
          variant: 'one-page',
          allowLogout: false,
          theme: 'light',
          locale: 'en',
          successUrl: data.successUrl,
        },
      })
      setLoadingPlan(null)
    } catch (e: unknown) {
      setCheckoutError(e instanceof Error ? e.message : 'Checkout failed')
      setLoadingPlan(null)
    }
  }

  async function redeemCoupon() {
    const code = coupon.trim()
    if (!code) return
    setCouponLoading(true)
    setCouponMsg(null)
    try {
      const res = await fetch('/api/billing/redeem-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coupon: code }),
      })
      const data = await parseJsonResponse<{ error?: string; success?: boolean }>(res)
      if (!res.ok || !data?.success) {
        setCouponMsg({ type: 'error', text: data?.error || 'Invalid code. Please check and try again.' })
      } else {
        setCouponMsg({
          type: 'success',
          text: 'Partner plan activated! You now have access to 50 clients — refreshing…',
        })
        setTimeout(() => window.location.reload(), 2000)
      }
    } catch {
      setCouponMsg({ type: 'error', text: 'Failed to redeem code. Please try again.' })
    } finally {
      setCouponLoading(false)
    }
  }

  const planLabel = PLAN_LABELS[currentPlan] ?? currentPlan

  return (
    <div className="px-6 py-5 space-y-6">
      {/* Current plan badge */}
      <div>
        <h2 className="text-xl font-semibold text-[#0b1c30] mb-2">Billing &amp; Plan</h2>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eff4ff] px-3 py-1 text-sm font-semibold text-[#003ec7]">
            <Zap className="h-3.5 w-3.5" />
            Current: {planLabel}
          </span>
          {currentPlan === 'trial' && (
            <span className="text-xs text-slate-400">· 30-day free trial</span>
          )}
        </div>
      </div>

      {checkoutError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          {checkoutError}
        </p>
      )}

      {/* Upgrade plan cards */}
      <div>
        <p className="text-sm font-semibold text-[#0b1c30] mb-3">Upgrade your plan</p>
        <div className="grid grid-cols-2 gap-3">
          {UPGRADE_PLANS.map(plan => {
            const isCurrent = plan.id === currentPlan
            return (
              <button
                key={plan.id}
                type="button"
                disabled={loadingPlan !== null || isCurrent}
                onClick={() => startCheckout(plan.id)}
                className={`relative flex flex-col items-start rounded-xl p-4 text-left transition ring-1 ${
                  plan.popular
                    ? 'bg-[#003ec7] text-white ring-[#003ec7] hover:bg-[#0032a3]'
                    : isCurrent
                    ? 'bg-[#eff4ff] text-[#003ec7] ring-[#003ec7]/30 cursor-default'
                    : 'bg-white text-[#0b1c30] ring-[#c3c5d9]/30 hover:ring-[#003ec7]/40 hover:shadow-sm'
                } disabled:opacity-60`}
              >
                {plan.popular && !isCurrent && (
                  <span className="absolute -top-2 right-3 rounded-full bg-emerald-400 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                    Popular
                  </span>
                )}
                {isCurrent && (
                  <span className="absolute -top-2 right-3 rounded-full bg-[#003ec7] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                    Current
                  </span>
                )}

                <span className="text-sm font-bold">{plan.name}</span>
                <span className={`text-xl font-extrabold leading-tight ${plan.popular ? 'text-white' : 'text-[#0b1c30]'}`}>
                  {plan.price}
                  <span className="text-xs font-normal opacity-70">{plan.period}</span>
                </span>
                <span className={`text-[10px] mt-0.5 mb-2 ${plan.popular ? 'text-blue-200' : 'text-slate-500'}`}>
                  {plan.clients < 9999 ? `${plan.clients} clients` : 'Unlimited clients'}
                </span>

                <ul className="space-y-0.5 w-full">
                  {plan.features.map(f => (
                    <li
                      key={f}
                      className={`flex items-center gap-1.5 text-[10px] ${
                        plan.popular ? 'text-blue-100' : 'text-slate-500'
                      }`}
                    >
                      <CheckCircle className="h-3 w-3 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {loadingPlan === plan.id && (
                  <span className="mt-2 text-[10px] opacity-70 animate-pulse">Processing…</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Partner coupon section — hidden if already on outreach plan */}
      {currentPlan !== 'pilot' && (
        <div className="rounded-xl bg-gradient-to-br from-[#0b1c30] to-[#003ec7] p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="h-4 w-4 text-blue-200" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
              Partner Outreach Code
            </span>
          </div>
          <p className="text-sm text-blue-100 mb-4 leading-relaxed">
            Have a partner code? Activate the{' '}
            <strong className="text-white">Scale plan (50 clients)</strong> completely free.{' '}
            <span className="line-through text-blue-300 text-xs">$99/mo value</span>
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={coupon}
              onChange={e => setCoupon(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && redeemCoupon()}
              placeholder="Enter partner code…"
              className="flex-1 rounded-lg bg-white/10 px-3 py-2 text-sm text-white placeholder-blue-300 outline-none ring-1 ring-white/20 focus:ring-white/50"
            />
            <button
              onClick={redeemCoupon}
              disabled={!coupon.trim() || couponLoading}
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#003ec7] transition hover:bg-blue-50 disabled:opacity-50"
            >
              {couponLoading ? 'Checking…' : 'Redeem'}
            </button>
          </div>
          {couponMsg && (
            <p
              className={`mt-2.5 text-xs font-medium ${
                couponMsg.type === 'success' ? 'text-emerald-300' : 'text-red-300'
              }`}
            >
              {couponMsg.text}
            </p>
          )}
        </div>
      )}

      {currentPlan === 'pilot' && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800 flex items-start gap-2">
          <CheckCircle className="h-4 w-4 mt-0.5 shrink-0 text-emerald-600" />
          <span>
            You&apos;re on the <strong>Outreach Partner plan</strong> — up to 50 clients, all Scale features, no charge.
          </span>
        </div>
      )}
    </div>
  )
}
