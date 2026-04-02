import type { Metadata } from 'next'
import Link from 'next/link'
import { FaqJsonLd } from '@/components/JsonLd'
import MarketingSeoShell from '@/components/MarketingSeoShell'

export const metadata: Metadata = {
  title: 'Trustpair Alternative for SMBs & Accounting Firms | Vantirs',
  description:
    'Evaluating a trustpair alternative? Vantirs delivers vendor payment verification for SMBs and accounting firms on QuickBooks—without enterprise complexity or heavy implementation.',
  alternates: { canonical: '/trustpair-alternative' },
}

const FAQ_ITEMS = [
  {
    q: 'Is Vantirs a good Trustpair alternative for a small or mid-size firm?',
    a: 'Yes, when your stack centers on QuickBooks Online and you want vendor fingerprinting and alerts without a long enterprise deployment. Vantirs is priced and positioned for firms and SMB finance teams, not only global procure-to-pay programs.',
  },
  {
    q: 'How does Vantirs compare on implementation effort?',
    a: 'Vantirs connects via QuickBooks Online OAuth and focuses on signals from your own payment history. Many teams get value quickly compared to multi-module enterprise rollouts—though your timeline depends on clients and data quality.',
  },
  {
    q: 'Where should I read a deeper comparison?',
    a: 'See our dedicated Vantirs vs Trustpair page for positioning and evaluation criteria, then book a trial if QBO-native vendor verification fits your workflow.',
  },
]

const COMPARISON_ROWS = [
  { feature: 'Target buyer profile', vantirs: 'SMBs & accounting firms', angle: 'Faster decisions, less procurement overhead' },
  { feature: 'Accounting system depth', vantirs: 'QuickBooks Online–native', angle: 'Fingerprints from vendor + pay history in QBO' },
  { feature: 'Enterprise procurement depth', vantirs: 'Light by design', angle: 'We focus on payment fraud before funds leave' },
  { feature: 'Bank & vendor anomaly signals', vantirs: 'Yes', angle: 'Historical comparison, not generic scores only' },
  { feature: 'Alert channels', vantirs: 'Slack, email', angle: 'Fits how small teams already work' },
  { feature: 'Pricing & packaging', vantirs: 'Firm-friendly tiers', angle: 'See transparent pricing on our site' },
]

export default function TrustpairAlternativePage() {
  return (
    <MarketingSeoShell>
      <FaqJsonLd items={FAQ_ITEMS} />
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">Trustpair alternative</p>
          <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30] md:text-5xl">
            Trustpair alternative built for SMBs and accounting firms
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            Trustpair serves large organizations with deep payment security needs. If you found the enterprise footprint too
            heavy—complex procurement, long implementation, or cost that doesn’t match a firm or SMB budget—{' '}
            <span className="font-medium text-[#0b1c30]">Vantirs is built for companies that live in QuickBooks Online</span>{' '}
            and need vendor verification without the enterprise overhead.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-white p-8 shadow-[0_12px_40px_rgba(11,28,48,0.06)] ring-1 ring-[#c3c5d9]/15">
            <h2 className="font-manrope text-xl font-bold text-[#0b1c30]">What Vantirs shares with enterprise tools</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
              <li>• Serious intent: stop fraudulent payments and vendor impersonation</li>
              <li>• Attention to payment instructions and changes that break from history</li>
              <li>• Alerts meant for human review—not blind automation</li>
            </ul>
          </div>
          <div className="rounded-[2rem] bg-[#eff4ff] p-8 ring-1 ring-[#c3c5d9]/20">
            <h2 className="font-manrope text-xl font-bold text-[#0b1c30]">Built for SMBs & firms vs. enterprise programs</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
              <li>• <span className="font-semibold text-[#003ec7]">Simpler path to value</span>—QBO connect, not a multi-year transformation</li>
              <li>• <span className="font-semibold text-[#003ec7]">Pricing aligned with firm size</span>—not enterprise-only contracts</li>
              <li>• <span className="font-semibold text-[#003ec7]">Workflow fit</span>—alerts where accountants already work (Slack, email)</li>
              <li>• <span className="font-semibold text-[#003ec7]">No “one size fits all” assumption</span>—we optimize for QBO-centric books</li>
            </ul>
          </div>
        </div>

        <div className="mt-14">
          <h2 className="font-manrope text-2xl font-bold text-[#0b1c30] md:text-3xl">Feature comparison (angle: SMB & firm fit)</h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-600">
            This table highlights positioning—not a claim that every Trustpair capability exists in Vantirs. Use it to decide
            whether our QuickBooks-native approach matches your team.
          </p>
          <div className="mt-8 overflow-x-auto rounded-[2rem] ring-1 ring-[#c3c5d9]/20">
            <div className="min-w-[640px]">
              <div className="grid grid-cols-[1.3fr_1fr_1.2fr] gap-px bg-[#c3c5d9]/25">
                <div className="bg-white px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Area</div>
                <div className="bg-white px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#003ec7]">Vantirs</div>
                <div className="bg-white px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">SMB / firm angle</div>
                {COMPARISON_ROWS.map(row => (
                  <div key={row.feature} className="contents">
                    <div className="bg-[#eff4ff] px-5 py-4 text-sm font-medium text-[#0b1c30]">{row.feature}</div>
                    <div className="bg-[#eff4ff] px-5 py-4 text-sm text-slate-700">{row.vantirs}</div>
                    <div className="bg-[#eff4ff] px-5 py-4 text-sm text-slate-600">{row.angle}</div>
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
          <Link href="/vs-trustpair" className="text-sm font-semibold text-[#003ec7] underline-offset-4 hover:underline">
            Vantirs vs Trustpair
          </Link>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/signup" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
            Start free trial
          </Link>
          <Link
            href="/vs-trustpair"
            className="inline-flex items-center justify-center rounded-xl bg-[#dce9ff]/80 px-8 py-4 text-base font-semibold text-[#003ec7] transition-colors hover:bg-[#d3e4fe]"
          >
            Read full comparison
          </Link>
        </div>
      </section>
    </MarketingSeoShell>
  )
}
