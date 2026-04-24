'use client'

import { useState } from 'react'
import { CheckCircle, Tag } from 'lucide-react'
import Link from 'next/link'

const PLANS = [
  {
    id: 'solo',
    name: 'Solo',
    monthlyPrice: 39,
    clients: 5,
    description: 'Solo CPAs and small practices',
    features: [
      'Up to 5 client entities',
      'Vendor fingerprinting',
      'Email alerts',
      'Alert queue',
    ],
    cta: 'Get started',
    ctaHref: '/signup',
    highlight: false,
  },
  {
    id: 'starter',
    name: 'Pro',
    monthlyPrice: 99,
    clients: 15,
    description: 'Growing firms',
    features: [
      'Up to 15 client entities',
      'Everything in Solo',
      'Multi-client dashboard',
      'Email alerts & review queue',
    ],
    cta: 'Get started',
    ctaHref: '/signup',
    highlight: false,
  },
  {
    id: 'growth',
    name: 'Business',
    monthlyPrice: 199,
    clients: 35,
    description: 'Established firms',
    features: [
      'Up to 35 client entities',
      'Everything in Pro',
      'Slack alerts',
      'API access',
      'Priority support',
    ],
    cta: 'Get started',
    ctaHref: '/signup',
    highlight: true,
  },
  {
    id: 'scale',
    name: 'Scale',
    monthlyPrice: 299,
    clients: 50,
    description: 'High-volume and multi-office firms',
    features: [
      'Up to 50 client entities',
      'Everything in Business',
      'Custom detection rules',
      'Dedicated onboarding',
      'SLA-backed support',
    ],
    cta: 'Get started',
    ctaHref: '/signup',
    highlight: false,
  },
  {
    id: 'whitelabel',
    name: 'White-label',
    monthlyPrice: 499,
    clients: 75,
    description: 'CFO firms, platforms & QB consultants',
    features: [
      'Up to 75 client entities',
      'Everything in Scale',
      'White-label reports & branding',
      'Partner-ready API access',
    ],
    cta: 'Get started',
    ctaHref: '/signup',
    highlight: false,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: null,
    clients: null,
    description: 'Unlimited scale, security review, custom terms',
    features: [
      'Unlimited client entities',
      'Everything in White-label',
      'Custom integrations & SSO',
      'Security review & DPAs',
      'Dedicated account manager',
    ],
    cta: 'Book a call',
    ctaHref: 'https://calendly.com/nandan-vantirs/30min',
    highlight: false,
  },
]

export default function PricingSection() {
  const [annual, setAnnual] = useState(false)
  const [coupon, setCoupon] = useState('')

  function claimCoupon() {
    const code = coupon.trim()
    if (code) {
      window.location.href = `/signup?coupon=${encodeURIComponent(code)}`
    }
  }

  return (
    <section className="bg-[#eff4ff] py-20 md:py-24" id="pricing">
      <div className="mx-auto max-w-7xl px-6 md:px-8">

        {/* Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7] mb-2">Pricing</p>
          <h2 className="font-manrope text-3xl font-bold text-[#0b1c30] md:text-4xl">
            Simple tiers that scale with your firm
          </h2>
          <p className="mt-3 text-slate-600">
            One subscription covers your clients. Heavy verification volume? Add-on packs are available — contact us after you&apos;re live.
          </p>

          {/* Monthly / Annual toggle */}
          <div className="mt-6 inline-flex items-center gap-1 rounded-full bg-white p-1 shadow-sm ring-1 ring-[#c3c5d9]/20">
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
            Annual billing saves 20% vs. paying monthly — same features, predictable renewals for your finance team.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
                <p className="mt-0.5 text-xs text-slate-500">{plan.description}</p>

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

                {plan.clients && (
                  <p className="mt-1 mb-4 text-xs font-semibold text-[#003ec7]">
                    Up to {plan.clients} clients
                  </p>
                )}
                {!plan.clients && (
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

        {/* Partner / outreach plan */}
        <div className="mt-8 mx-auto max-w-2xl rounded-2xl bg-gradient-to-br from-[#0b1c30] to-[#003ec7] p-8 text-white shadow-[0_12px_40px_rgba(0,62,199,0.22)]">
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
                <strong className="text-white">Scale plan (50 clients)</strong> free for 3 months.{' '}
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
          <a
            href="/guarantee"
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#003ec7] shadow-sm ring-1 ring-[#003ec7]/15 hover:bg-[#eff4ff] transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            Protected by our $10,000 Fraud Guarantee — see terms
          </a>
        </div>
      </div>
    </section>
  )
}
