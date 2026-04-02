import type { Metadata } from 'next'
import Link from 'next/link'
import { FaqJsonLd } from '@/components/JsonLd'
import MarketingSeoShell from '@/components/MarketingSeoShell'

export const metadata: Metadata = {
  title: 'Eftsure Alternative for Accounting Firms | Vantirs',
  description:
    'Compare Vantirs as an eftsure alternative for accounting firms: QuickBooks-native vendor fingerprinting, fast onboarding, and transparent pricing—built for firms, not generic enterprise rollouts.',
  alternates: { canonical: '/eftsure-alternative' },
}

const FAQ_ITEMS = [
  {
    q: 'Is Vantirs a direct replacement for Eftsure?',
    a: 'Both address payment fraud and vendor risk, but Vantirs is purpose-built for accounting firms on QuickBooks Online—with vendor fingerprinting from your books, Slack and email alerts, and a workflow that fits how firms review AP—not a one-size-fits-all enterprise suite.',
  },
  {
    q: 'Why would an accounting firm choose Vantirs over Eftsure?',
    a: 'Teams often choose Vantirs for QuickBooks-native integration, faster time-to-value, pricing aligned with firm size, and flexibility without long enterprise lock-in. Evaluate both against your client mix and approval workflows.',
  },
  {
    q: 'Does Vantirs work outside QuickBooks Online?',
    a: 'Vantirs is optimized for QuickBooks Online today. If your stack is QBO-centric, you get the deepest vendor history signals; other ERPs may be on our roadmap.',
  },
]

const COMPARISON_ROWS = [
  { feature: 'Vendor fingerprinting from payment history', vantirs: 'Yes (QBO-native)', note: 'Core to how we flag anomalies' },
  { feature: 'Bank account change detection', vantirs: 'Yes', note: 'Compared against historical pay data' },
  { feature: 'Email / domain spoofing signals', vantirs: 'Yes', note: 'BEC-style patterns' },
  { feature: 'Built for accounting firms & client books', vantirs: 'Yes', note: 'Workflow and pricing aimed at firms' },
  { feature: 'QuickBooks Online–first integration', vantirs: 'Yes', note: 'OAuth sync to vendor & payment data' },
  { feature: 'Slack + email alerts', vantirs: 'Yes', note: 'Real-time before pay runs' },
]

export default function EftsureAlternativePage() {
  return (
    <MarketingSeoShell>
      <FaqJsonLd items={FAQ_ITEMS} />
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">Eftsure alternative</p>
          <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30] md:text-5xl">
            Looking for an Eftsure alternative? Vantirs is built for accounting firms.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            Eftsure has earned adoption in AP and finance teams worldwide. If your priority is{' '}
            <span className="font-medium text-[#0b1c30]">accounting firms on QuickBooks Online</span>, transparent
            onboarding, and controls that map to how you already review vendor payments, Vantirs is worth a serious look—not
            because one product is “bad,” but because the fit for firm workflows and QBO data is different.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-[#eff4ff] p-8 ring-1 ring-[#c3c5d9]/20">
            <h2 className="font-manrope text-xl font-bold text-[#0b1c30]">Where we align (feature parity you care about)</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
              <li>• Strong focus on stopping fraudulent payments and vendor impersonation</li>
              <li>• Signals when payment details or behavior diverge from history</li>
              <li>• Designed for teams that need defensible review—not just a score</li>
            </ul>
          </div>
          <div className="rounded-[2rem] bg-white p-8 shadow-[0_12px_40px_rgba(11,28,48,0.06)] ring-1 ring-[#c3c5d9]/15">
            <h2 className="font-manrope text-xl font-bold text-[#0b1c30]">What Vantirs does differently</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
              <li>• <span className="font-semibold text-[#003ec7]">Built for accounting firms</span> managing multiple clients and recurring close cycles</li>
              <li>• <span className="font-semibold text-[#003ec7]">QuickBooks-native</span> vendor fingerprints from real payment history in QBO</li>
              <li>• <span className="font-semibold text-[#003ec7]">Faster onboarding</span>—connect QBO and start surfacing risk without a multi-month enterprise program</li>
              <li>• <span className="font-semibold text-[#003ec7]">No lock-in positioning</span>—we win on value and fit, not contract complexity</li>
            </ul>
          </div>
        </div>

        <div className="mt-14">
          <h2 className="font-manrope text-2xl font-bold text-[#0b1c30] md:text-3xl">At-a-glance comparison</h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-600">
            Honest framing: we’re not claiming to replicate every Eftsure module—we’re showing what Vantirs emphasizes for
            firms on QuickBooks Online. Validate details in your own evaluation.
          </p>
          <div className="mt-8 overflow-x-auto rounded-[2rem] ring-1 ring-[#c3c5d9]/20">
            <div className="min-w-[640px]">
              <div className="grid grid-cols-[1.4fr_1fr_1.2fr] gap-px bg-[#c3c5d9]/25">
                <div className="bg-white px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Capability</div>
                <div className="bg-white px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#003ec7]">Vantirs</div>
                <div className="bg-white px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Notes</div>
                {COMPARISON_ROWS.map(row => (
                  <div key={row.feature} className="contents">
                    <div className="bg-[#eff4ff] px-5 py-4 text-sm font-medium text-[#0b1c30]">{row.feature}</div>
                    <div className="bg-[#eff4ff] px-5 py-4 text-sm text-slate-700">{row.vantirs}</div>
                    <div className="bg-[#eff4ff] px-5 py-4 text-sm text-slate-600">{row.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/vendor-verification-software" className="text-sm font-semibold text-[#003ec7] underline-offset-4 hover:underline">
            Vendor verification software
          </Link>
          <span className="text-slate-300">·</span>
          <Link href="/pricing" className="text-sm font-semibold text-[#003ec7] underline-offset-4 hover:underline">
            Pricing
          </Link>
          <span className="text-slate-300">·</span>
          <Link href="/quickbooks-fraud-prevention" className="text-sm font-semibold text-[#003ec7] underline-offset-4 hover:underline">
            QuickBooks fraud prevention
          </Link>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/signup" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
            Start free trial
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-xl bg-[#dce9ff]/80 px-8 py-4 text-base font-semibold text-[#003ec7] transition-colors hover:bg-[#d3e4fe]"
          >
            See pricing
          </Link>
        </div>
      </section>
    </MarketingSeoShell>
  )
}
