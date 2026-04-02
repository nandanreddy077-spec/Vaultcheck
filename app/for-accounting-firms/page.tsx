import type { Metadata } from 'next'
import Link from 'next/link'
import { FaqJsonLd } from '@/components/JsonLd'
import MarketingSeoShell from '@/components/MarketingSeoShell'

export const metadata: Metadata = {
  title: 'Fraud Prevention for Accounting Firms | Vantirs',
  description:
    'Built for accounting firms that manage client money on QuickBooks Online. Prevent vendor fraud and BEC-style invoice scams with contextual vendor fingerprinting and alerts.',
  alternates: { canonical: '/for-accounting-firms' },
}

const FAQ_ITEMS = [
  {
    q: 'What payment fraud risks do accounting firms face when managing client AP?',
    a: 'Firms are exposed when fraudulent invoices, spoofed vendor emails, or unauthorized bank changes slip through busy-season reviews. A single bad wire can create direct loss, client trust issues, and lengthy investigations. Controls that compare new requests to how each vendor actually paid in the past reduce that exposure.',
  },
  {
    q: 'How does vendor fingerprinting help my firm catch fraud without slowing every invoice?',
    a: 'Fingerprinting builds a profile from each vendor’s QuickBooks Online payment history—amounts, timing, bank details, and related signals—so anomalies stand out with context. Your team focuses on exceptions that look wrong relative to history instead of re-checking every routine bill.',
  },
  {
    q: 'Can one Vantirs setup cover multiple clients on QuickBooks Online?',
    a: 'Yes. You connect each client’s QuickBooks Online company via OAuth and get vendor-level signals per client. That keeps reviews scoped to the right books and helps firms apply consistent fraud checks across their portfolio.',
  },
]

export default function ForAccountingFirmsPage() {
  return (
    <MarketingSeoShell>
      <FaqJsonLd items={FAQ_ITEMS} />
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">Accounting firms</p>
            <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30] md:text-5xl">
              Fraud prevention for accounting firms protecting client payments
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              If you handle multiple clients on QuickBooks Online, you can’t afford “every invoice is different” reviews. Vantirs fingerprints vendors per client history and flags suspicious requests before clients release funds.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/signup" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
                Start 30-day free trial
              </Link>
              <Link href="/roi-calculator" className="inline-flex items-center justify-center rounded-xl bg-[#dce9ff]/80 px-8 py-4 text-base font-semibold text-[#003ec7] transition-colors hover:bg-[#d3e4fe]">
                Calculate ROI
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#eff4ff] p-4">
                <p className="text-sm font-semibold text-[#0b1c30]">Defensible reviews</p>
                <p className="mt-1 text-sm text-slate-600">Alerts include the specific signals behind each flag.</p>
              </div>
              <div className="rounded-2xl bg-[#eff4ff] p-4">
                <p className="text-sm font-semibold text-[#0b1c30]">Client trust</p>
                <p className="mt-1 text-sm text-slate-600">Prevent wiring errors and fraud incidents that damage relationships.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-[0_12px_40px_rgba(11,28,48,0.08)] ring-1 ring-[#c3c5d9]/15">
            <h2 className="text-xl font-bold text-[#0b1c30]">What you can automate</h2>
            <p className="mt-2 text-sm text-slate-600">
              Turn manual checks into ongoing controls across every client’s vendor activity.
            </p>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li>• Vendor changes that require review</li>
              <li>• Bank detail mismatches vs history</li>
              <li>• Email domain spoofing signals</li>
              <li>• Statistical outliers that look “off” but are hard to prove</li>
            </ul>
            <div className="mt-6">
              <Link href="/invoice-fraud-detection" className="text-sm font-semibold text-[#003ec7] hover:text-[#0032a3]">
                Learn more about invoice fraud detection →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingSeoShell>
  )
}

