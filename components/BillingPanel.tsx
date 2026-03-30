'use client'

import { useState } from 'react'
import { parseJsonResponse } from '@/lib/parse-json-response'

type Plan = 'pilot' | 'solo' | 'starter' | 'growth' | 'scale' | 'enterprise'

const plans: Array<{ plan: Plan; label: string }> = [
  { plan: 'pilot', label: 'Pilot (Outreach) - $99' },
  { plan: 'solo', label: 'Solo' },
  { plan: 'starter', label: 'Firm Starter - up to 10' },
  { plan: 'growth', label: 'Firm Growth - up to 20' },
  { plan: 'scale', label: 'Firm Scale - up to 50' },
  { plan: 'enterprise', label: 'Firm Enterprise' },
]

type FirmPlan = Plan | 'trial' | string

export default function BillingPanel({ currentPlan, pilotAvailable }: { currentPlan: FirmPlan; pilotAvailable: boolean }) {
  const [loadingPlan, setLoadingPlan] = useState<Plan | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function startCheckout(plan: Plan) {
    setLoadingPlan(plan)
    setError(null)
    try {
      const res = await fetch('/api/paddle/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await parseJsonResponse<{ error?: string; url?: string }>(res)
      if (!res.ok) {
        throw new Error(data?.error || `Checkout failed (${res.status})`)
      }
      if (data?.url) window.location.href = data.url
      else throw new Error(data?.error || 'Missing checkout URL. Check Paddle configuration.')
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Checkout failed'
      setError(message)
      setLoadingPlan(null)
    }
  }

  return (
    <div className="px-6 py-5">
      <h2 className="text-xl font-semibold text-[#0b1c30] mb-2">Billing</h2>
      <p className="text-sm text-slate-500 mb-4">
        Choose a plan to upgrade your firm subscription.
      </p>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</p>}

      {currentPlan === 'trial' && (
        <p className="text-xs text-slate-500 mb-3">
          Pick the plan that matches how many QuickBooks client entities you expect to connect.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        {plans
          .filter(p => p.plan !== 'pilot' || pilotAvailable || currentPlan === 'pilot')
          .map(p => (
          <button
            key={p.plan}
            type="button"
            disabled={loadingPlan === p.plan || p.plan === currentPlan}
            onClick={() => startCheckout(p.plan)}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-gradient-to-br from-[#003ec7] to-[#0052ff] text-white hover:opacity-90 disabled:opacity-50"
          >
            {loadingPlan === p.plan ? `Loading ${p.label}...` : p.plan === currentPlan ? `${p.label} (Current)` : p.label}
          </button>
          ))}
      </div>
    </div>
  )
}

