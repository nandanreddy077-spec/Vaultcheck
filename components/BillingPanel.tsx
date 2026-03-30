'use client'

import { useState } from 'react'

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
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Checkout failed')
      if (data.url) window.location.href = data.url
      else throw new Error('Missing checkout url')
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Checkout failed'
      setError(message)
      setLoadingPlan(null)
    }
  }

  return (
    <div className="px-6 py-5">
      <h2 className="text-base font-semibold text-gray-900 mb-2">Billing</h2>
      <p className="text-sm text-gray-500 mb-4">
        Choose a plan to upgrade your firm subscription.
      </p>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</p>}

      {currentPlan === 'trial' && (
        <p className="text-xs text-gray-500 mb-3">
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
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loadingPlan === p.plan ? `Loading ${p.label}...` : p.plan === currentPlan ? `${p.label} (Current)` : p.label}
          </button>
          ))}
      </div>
    </div>
  )
}

