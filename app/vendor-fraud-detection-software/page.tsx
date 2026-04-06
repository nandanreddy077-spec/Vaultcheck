import type { Metadata } from 'next'
import Link from 'next/link'
import MarketingSeoShell from '@/components/MarketingSeoShell'
import { FaqJsonLd } from '@/components/JsonLd'

const FAQ_ITEMS = [
  {
    q: 'What is vendor fraud detection software?',
    a: 'Vendor fraud detection software checks invoices and payment instructions against vendor history to surface mismatches before funds are released.',
  },
  {
    q: 'How does Vantirs detect vendor fraud in QuickBooks Online?',
    a: 'Vantirs fingerprints each vendor using payment history and flags anomalies such as bank-account changes, look-alike email domains, and unusual invoice amounts.',
  },
  {
    q: 'Is this only for enterprise AP teams?',
    a: 'No. Vantirs is built for accounting firms and AP teams that need practical, reviewable fraud signals without replacing their current accounting workflow.',
  },
]

export const metadata: Metadata = {
  title: 'Vendor Fraud Detection Software | Vantirs',
  description:
    'Vendor fraud detection software for accounting firms on QuickBooks Online. Flag bank mismatches, spoofed domains, and risky invoices before payment.',
  alternates: { canonical: '/vendor-fraud-detection-software' },
}

export default function VendorFraudDetectionSoftwarePage() {
  return (
    <MarketingSeoShell>
      <FaqJsonLd items={FAQ_ITEMS} />
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">Vendor fraud detection software</p>
            <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30] md:text-5xl">
              Catch vendor fraud before payment leaves your AP workflow
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Vantirs adds a verification layer to QuickBooks Online so your team can stop vendor impersonation and
              payment diversion attempts before approving high-risk invoices.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/signup" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
                Start free trial
              </Link>
              <Link
                href="/invoice-fraud-detection"
                className="inline-flex items-center justify-center rounded-xl bg-[#dce9ff]/80 px-8 py-4 text-base font-semibold text-[#003ec7] transition-colors hover:bg-[#d3e4fe]"
              >
                Explore invoice fraud detection
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-[0_12px_40px_rgba(11,28,48,0.08)] ring-1 ring-[#c3c5d9]/15">
            <h2 className="text-xl font-bold text-[#0b1c30]">What Vantirs flags before approval</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li>• Vendor bank details that do not match known history</li>
              <li>• Look-alike sender domains used in BEC attacks</li>
              <li>• Invoice amounts outside expected statistical ranges</li>
              <li>• First-time vendors requiring stronger verification controls</li>
            </ul>
            <div className="mt-6 rounded-2xl bg-[#eff4ff] p-5">
              <p className="text-sm font-semibold text-[#0b1c30]">Designed for defensible AP reviews</p>
              <p className="mt-1 text-sm text-slate-600">
                Fraud signals are specific and explainable so teams can approve, reject, or escalate with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#eff4ff]">
        <div className="mx-auto max-w-7xl px-6 py-14 md:px-8">
          <h2 className="font-manrope text-3xl font-bold text-[#0b1c30] md:text-4xl">
            Built for accounting firms that move client money
          </h2>
          <p className="mt-4 max-w-2xl text-slate-600">
            Most vendor fraud happens when teams are overloaded and relying on memory. Vantirs applies repeatable
            verification to every invoice so controls stay consistent at volume.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/accounts-payable-fraud-prevention" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
              AP fraud prevention
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-semibold text-[#003ec7] ring-1 ring-[#c3c5d9]/20 hover:bg-[#eff4ff]"
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>
    </MarketingSeoShell>
  )
}
