'use client'

import { useState } from 'react'
import { CheckCircle, Tag, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 79,
    clients: 25,
    description: '1–5 person bookkeeping practices',
    persona: 'For small practices taking on AP work',
    features: [
      'Up to 25 client entities',
      'Vendor fingerprinting',
      'Email alerts & alert queue',
      'Multi-client dashboard',
      'NACHA 2026 audit trail',
    ],
    cta: 'Start free trial',
    ctaHref: '/signup',
    highlight: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    monthlyPrice: 199,
    clients: 75,
    description: 'CAS firms managing client AP',
    persona: 'For 6–20 person firms with active AP volume',
    features: [
      'Up to 75 client entities',
      'Everything in Starter',
      'Slack alerts (real-time)',
      'API access',
      'Priority support',
      'Custom detection rules',
    ],
    cta: 'Start free trial',
    ctaHref: '/signup',
    highlight: true,
  },
  {
    id: 'scale',
    name: 'Scale',
    monthlyPrice: 349,
    clients: 200,
    description: 'Multi-office & outsourced CFO firms',
    persona: 'For large practices and controller-layer providers',
    features: [
      'Up to 200 client entities',
      'Everything in Growth',
      'White-label reports & branding',
      'Dedicated onboarding',
      'SLA-backed support',
      'Partner-ready API',
    ],
    cta: 'Start free trial',
    ctaHref: '/signup',
    highlight: false,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: null,
    clients: null,
    description: 'Unlimited scale, custom integrations, security review',
    persona: 'For platforms, networks & large independent firms',
    features: [
      'Unlimited client entities',
      'Everything in Scale',
      'Custom integrations & SSO',
      'Security review & DPAs',
      'Dedicated account manager',
    ],
    cta: 'Book a call',
    ctaHref: 'https://calendly.com/nandan-vantirs/30min',
    highlight: false,
  },
]

// Days until NACHA Phase 2 deadline: June 22, 2026
function daysUntilNacha(): number {
  const deadline = new Date('2026-06-22T00:00:00')
  const now = new Date()
  return Math.max(0, Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
}

export default function PricingSection() {
  const [annual, setAnnual] = useState(false)
  const [coupon, setCoupon] = useState('')
  const nachadays = daysUntilNacha()

  function claimCoupon() {
    const code = coupon.trim()
    if (code) {
      window.location.href = `/signup?coupon=${encodeURIComponent(code)}`
    }
  }

  return (
    <section className="bg-[#eff4ff] py-20 md:py-24" id="pricing">
      <div className="mx-auto max-w-7xl px-6 md:px-8">

        {/* NACHA 2026 urgency banner */}
        {nachadays > 0 && (
          <div className="mb-10 mx-auto max-w-3xl rounded-xl bg-amber-50 border border-amber-200 px-5 py-4 flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
            <div>
              <p className="text-sm font-semibold text-amber-900">
                NACHA Phase 2 deadline: <span className="text-amber-700">{nachadays} days away</span> (June 22, 2026)
              </p>
              <p className="mt-0.5 text-xs text-amber-700 leading-relaxed">
                Every ACH originator — including accounting firms submitting vendor payments for clients — must now have documented, risk-based fraud monitoring. Vantirs generates the audit trail automatically.{' '}
                <a href="/nacha-2026-vendor-payment-compliance" className="underline font-medium hover:text-amber-900">
                  What this means for your firm →
                </a>
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7] mb-2">Pricing</p>
          <h2 className="font-manrope text-3xl font-bold text-[#0b1c30] md:text-4xl">
            Simple tiers that scale with your firm
          </h2>
          <p className="mt-3 text-slate-600">
            One subscription covers all your clients. Per-client pricing — the way accounting firms think.
          </p>


          {/* Monthly / Annual toggle */}
          <div className="mt-5 inline-flex items-center gap-1 rounded-full bg-white p-1 shadow-sm ring-1 ring-[#c3c5d9]/20">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                !annual ? 'bg-[#003ec7] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                annual ? 'bg-[#003ec7] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Annual&nbsp;
              <span className="font-bold text-emerald-500">-20%</span>
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Annual billing saves 20% vs. paying monthly — predictable renewals for your finance team.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {PLANS.map(plan => {
            const price = plan.monthlyPrice
              ? annual
                ? Math.round(plan.monthlyPrice * 0.8)
                : plan.monthlyPrice
              : null

            return (
              <div
                key={plan.id}
                className={`flex flex-col rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(11,28,48,0.06)] transition-shadow hover:shadow-[0_12px_40px_rgba(11,28,48,0.10)] ${
                  plan.highlight
                    ? 'ring-2 ring-[#003ec7]'
                    : 'ring-1 ring-[#c3c5d9]/15'
                }`}
              >
                {plan.highlight && (
                  <span className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#003ec7]">
                    ⭐ Most popular
                  </span>
                )}

                <h3 className="font-manrope text-lg font-bold text-[#0b1c30]">{plan.name}</h3>
                <p className="mt-0.5 text-xs font-medium text-slate-700">{plan.description}</p>
                <p className="mt-0.5 text-[11px] text-slate-400 italic">{plan.persona}</p>

                <div className="mt-4">
                  {price !== null ? (
                    <>
                      <span className="text-4xl font-bold text-[#0b1c30]">${price}</span>
                      <span className="text-sm text-slate-500">/mo</span>
                      {annual && plan.monthlyPrice && (
                        <p className="mt-0.5 text-xs font-medium text-emerald-600">
                          Billed ${Math.round(plan.monthlyPrice * 0.8 * 12)}/year
                        </p>
                      )}
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-[#0b1c30]">Custom</span>
                  )}
                </div>

                {plan.clients ? (
                  <p className="mt-1 mb-4 text-xs font-semibold text-[#003ec7]">
                    Up to {plan.clients} clients · ${plan.monthlyPrice ? (plan.monthlyPrice / plan.clients).toFixed(2) : '—'}/client
                  </p>
                ) : (
                  <p className="mt-1 mb-4 text-xs font-semibold text-[#003ec7]">Unlimited clients</p>
                )}

                <ul className="flex-1 space-y-2">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.ctaHref}
                  className={`mt-6 block w-full rounded-xl py-3 text-center text-sm font-semibold transition ${
                    plan.highlight
                      ? 'bg-[#003ec7] text-white hover:bg-[#0032a3]'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            )
          })}
        </div>

        {/* Who is this for — ICP clarity row */}
        <div className="mt-10 mx-auto max-w-4xl rounded-2xl bg-white ring-1 ring-[#c3c5d9]/20 p-6 shadow-[0_4px_20px_rgba(11,28,48,0.06)]">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7] mb-4">Who uses Vantirs</p>
          <div className="grid gap-6 sm:grid-cols-3 text-sm">
            <div>
              <p className="font-semibold text-[#0b1c30]">Bookkeeping & CAS firms</p>
              <p className="mt-1 text-xs text-slate-500">Managing vendor payments for 30–200 QBO clients. You run weekly payment batches — Vantirs screens every invoice before it hits your approval queue.</p>
            </div>
            <div>
              <p className="font-semibold text-[#0b1c30]">Outsourced CFO providers</p>
              <p className="mt-1 text-xs text-slate-500">Controller-level services for 10–50 clients. You need board-ready fraud documentation and a defensible approval workflow — not a spreadsheet.</p>
            </div>
            <div>
              <p className="font-semibold text-[#0b1c30]">QB consultants & platforms</p>
              <p className="mt-1 text-xs text-slate-500">Want to add fraud protection to your service offering? Scale and Enterprise include white-label reports you can put your own brand on.</p>
            </div>
          </div>
        </div>

        {/* Partner / outreach plan */}
        <div className="mt-6 mx-auto max-w-2xl rounded-2xl bg-gradient-to-br from-[#0b1c30] to-[#003ec7] p-8 text-white shadow-[0_12px_40px_rgba(0,62,199,0.22)]">
          <div className="flex items-start gap-4">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <Tag className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 mb-1">
                Partner Outreach Plan
              </p>
              <h3 className="font-manrope text-xl font-bold">
                Scale plan — complimentary for select partners
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-blue-100">
                Have a partner code? Activate the{' '}
                <strong className="text-white">Scale plan (200 clients)</strong> free for 3 months.{' '}
                Same features as a paid Scale subscription during the trial — no credit card required for the partner period.
              </p>
              <div className="mt-5 flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={e => setCoupon(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && claimCoupon()}
                  placeholder="Enter partner code…"
                  className="flex-1 rounded-xl bg-white/10 px-4 py-2.5 text-sm text-white placeholder-blue-300 outline-none ring-1 ring-white/20 focus:ring-white/50"
                />
                <button
                  type="button"
                  onClick={claimCoupon}
                  disabled={!coupon.trim()}
                  className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#003ec7] transition hover:bg-blue-50 disabled:opacity-50"
                >
                  Claim
                </button>
              </div>
              <p className="mt-3 text-xs text-blue-300">
                Clicking Claim will take you to sign up — apply the code in Settings → Billing after login.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <p className="text-center text-sm text-slate-400">
            All plans start with <strong className="text-slate-600">3 clients free for 30 days</strong> · No credit card required · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  )
}
