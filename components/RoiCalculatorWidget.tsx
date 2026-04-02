'use client'

import { useMemo, useState } from 'react'
import { ArrowRight } from 'lucide-react'

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export default function RoiCalculatorWidget() {
  // NOTE: This is a lightweight estimate for UX/SEO; final reporting should be based on real customer baselines.
  const [monthlyPaymentVolume, setMonthlyPaymentVolume] = useState<number>(100000)
  const [monthlyVendors, setMonthlyVendors] = useState<number>(250)
  const [fraudRatePct, setFraudRatePct] = useState<number>(0.2) // baseline vendor fraud rate assumption

  const [email, setEmail] = useState('')

  const fmt = useMemo(() => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), [])

  const results = useMemo(() => {
    const volume = Math.max(0, monthlyPaymentVolume)
    const vendors = Math.max(0, monthlyVendors)
    const fraudRate = clamp(fraudRatePct, 0, 5) / 100 // 0%..5%

    // Estimate loss from fraud = total paid * assumed fraud rate.
    const estimatedMonthlyLoss = volume * fraudRate

    // Assume Vantirs reduces realized/avoidable losses by a conservative factor.
    const reductionFactor = 0.6
    const estimatedMonthlySavings = estimatedMonthlyLoss * reductionFactor

    const estimatedAnnualSavings = estimatedMonthlySavings * 12

    // A rough "risk score" that correlates with vendor count and fraud exposure.
    const vendorIntensity = vendors / 500
    const riskScore = Math.round(clamp(100 * fraudRate * (0.6 + vendorIntensity), 5, 95))

    return {
      estimatedMonthlyLoss,
      estimatedMonthlySavings,
      estimatedAnnualSavings,
      riskScore,
    }
  }, [fraudRatePct, monthlyPaymentVolume, monthlyVendors])

  function handleRequestReport(e: React.FormEvent) {
    e.preventDefault()
    // Route user to signup; we don't have a lead capture endpoint in this codebase yet.
    const params = new URLSearchParams()
    if (email.trim()) params.set('email', email.trim())
    params.set('roi', '1')
    params.set('riskScore', String(results.riskScore))
    params.set('annualSavings', String(Math.round(results.estimatedAnnualSavings)))
    window.location.assign(`/signup?${params.toString()}`)
  }

  return (
    <section className="mx-auto max-w-5xl px-6 pb-16 md:px-8 md:pb-20">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-[2rem] bg-white p-6 shadow-[0_12px_40px_rgba(11,28,48,0.08)] ring-1 ring-[#c3c5d9]/15">
          <h2 className="font-manrope text-2xl font-bold text-[#0b1c30]">Estimate your AP fraud exposure</h2>
          <p className="mt-2 text-sm text-slate-600">
            Enter a rough monthly baseline. You will get an estimated risk score and potential annual savings.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleRequestReport}>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Monthly payment volume</span>
              <input
                type="number"
                min={0}
                step={1000}
                value={monthlyPaymentVolume}
                onChange={e => setMonthlyPaymentVolume(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-[#c3c5d9]/40 bg-[#f8f9ff] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#003ec7]/20"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Monthly active vendors</span>
              <input
                type="number"
                min={0}
                step={10}
                value={monthlyVendors}
                onChange={e => setMonthlyVendors(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-[#c3c5d9]/40 bg-[#f8f9ff] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#003ec7]/20"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Baseline fraud rate (assumption)</span>
              <input
                type="number"
                min={0}
                step={0.05}
                max={5}
                value={fraudRatePct}
                onChange={e => setFraudRatePct(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-[#c3c5d9]/40 bg-[#f8f9ff] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#003ec7]/20"
              />
              <span className="mt-1 block text-xs text-slate-500">Default: 0.2% (you can adjust)</span>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Work email (optional)</span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@firm.com"
                className="mt-1 w-full rounded-xl border border-[#c3c5d9]/40 bg-[#f8f9ff] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#003ec7]/20"
              />
            </label>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#003ec7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#002fa3]"
            >
              Request ROI report
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="text-xs text-slate-500">
              Estimate only. Final results depend on your vendor mix and historical payment patterns.
            </p>
          </form>
        </div>

        <div className="space-y-4">
          <div className="rounded-[2rem] bg-[#eff4ff] p-6 ring-1 ring-[#c3c5d9]/15">
            <p className="text-xs font-bold uppercase tracking-wider text-[#003ec7]">Risk score</p>
            <div className="mt-2">
              <span className="text-5xl font-extrabold text-[#0b1c30]">{results.riskScore}</span>
              <span className="ml-2 text-sm font-semibold text-slate-600">/ 100</span>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Higher scores indicate more exposure given your payment volume and vendor count.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-5 shadow-[0_12px_40px_rgba(11,28,48,0.06)] ring-1 ring-[#c3c5d9]/10">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Estimated monthly loss</p>
              <p className="mt-1 text-xl font-bold text-[#0b1c30]">{fmt.format(results.estimatedMonthlyLoss)}</p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-[0_12px_40px_rgba(11,28,48,0.06)] ring-1 ring-[#c3c5d9]/10">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Estimated annual savings</p>
              <p className="mt-1 text-xl font-bold text-[#0b1c30]">{fmt.format(results.estimatedAnnualSavings)}</p>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 ring-1 ring-[#c3c5d9]/15">
            <h3 className="text-lg font-bold text-[#0b1c30]">Why this matters</h3>
            <p className="mt-2 text-sm text-slate-600">
              Vantirs reduces avoidable losses by identifying mismatches between invoice requests and historical vendor payment behavior in QuickBooks Online.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

