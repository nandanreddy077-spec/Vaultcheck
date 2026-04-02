import type { Metadata } from 'next'
import Link from 'next/link'
import MarketingSeoShell from '@/components/MarketingSeoShell'

export const metadata: Metadata = {
  title: 'Vantirs vs Trustpair | Invoice Fraud Protection | Vantirs',
  description:
    'A direct comparison of Vantirs vs Trustpair for accounting firms on QuickBooks Online. See how QuickBooks-native vendor fingerprinting and contextual alerts help prevent vendor fraud.',
}

export default function VsTrustpairPage() {
  return (
    <MarketingSeoShell>
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">Comparison</p>
          <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30] md:text-5xl">
            Vantirs vs Trustpair: what accounting firms actually need
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            Both tools talk about “fraud detection.” Vantirs is built around QuickBooks Online vendor fingerprinting and contextual alerts so your team can review with confidence.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-white p-6 shadow-[0_12px_40px_rgba(11,28,48,0.06)] ring-1 ring-[#c3c5d9]/15">
            <h2 className="text-xl font-bold text-[#0b1c30]">What Vantirs emphasizes</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li>• QuickBooks-native vendor fingerprinting</li>
              <li>• Bank mismatch + email spoofing signals</li>
              <li>• Alerts designed for review defensibility</li>
              <li>• Firm-wide consistency across clients</li>
            </ul>
          </div>

          <div className="rounded-[2rem] bg-[#eff4ff] p-6 ring-1 ring-[#c3c5d9]/15">
            <h2 className="text-xl font-bold text-[#0b1c30]">What you should evaluate</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li>• How the tool connects to your accounting workflow</li>
              <li>• What signals it surfaces (not just a score)</li>
              <li>• Whether alerts are reviewable and auditable</li>
              <li>• Fit for accounting firms managing multiple clients</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/signup" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
            Start free trial
          </Link>
          <Link href="/roi-calculator" className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-semibold text-[#003ec7] ring-1 ring-[#c3c5d9]/20 hover:bg-[#f8f9ff]">
            Estimate ROI
          </Link>
        </div>
      </section>
    </MarketingSeoShell>
  )
}

