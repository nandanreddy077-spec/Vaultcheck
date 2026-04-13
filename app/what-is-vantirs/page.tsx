import type { Metadata } from 'next'
import Link from 'next/link'
import MarketingSeoShell from '@/components/MarketingSeoShell'
import { FaqJsonLd, WebPageJsonLd } from '@/components/JsonLd'
import { getSiteUrl } from '@/lib/site-url'

const pageTitle = 'What Is Vantirs? AP Payment Fraud Prevention Explained | Vantirs'
const pageDescription =
  'Learn what Vantirs is, who it is for, and how it prevents vendor payment fraud for accounting firms and AP teams using QuickBooks Online.'

const FAQ_ITEMS = [
  {
    q: 'What is Vantirs?',
    a: 'Vantirs is payment fraud prevention software for accounting firms and AP teams using QuickBooks Online. It helps teams verify vendor payment instructions and detect suspicious invoices before money moves.',
  },
  {
    q: 'Who should use Vantirs?',
    a: 'Vantirs is built for accounting firms, AP managers, controllers, and CFOs that need stronger controls against vendor impersonation, bank change fraud, and invoice diversion.',
  },
  {
    q: 'How does Vantirs reduce payment fraud risk?',
    a: 'Vantirs compares payment instructions against historical vendor patterns, flags anomalies such as bank mismatches and spoofed domains, and supports documented pre-payment reviews.',
  },
  {
    q: 'Is Vantirs for QuickBooks Online workflows?',
    a: 'Yes. Vantirs is designed to add fraud verification signals to QuickBooks Online-driven AP workflows so teams can approve payments with clearer evidence.',
  },
]

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: '/what-is-vantirs' },
  keywords: [
    'what is Vantirs',
    'Vantirs payment fraud prevention',
    'accounts payable fraud prevention software for accounting firms',
  ],
}

export default function WhatIsVantirsPage() {
  const url = `${getSiteUrl()}/what-is-vantirs`

  return (
    <MarketingSeoShell>
      <WebPageJsonLd title={pageTitle} description={pageDescription} url={url} />
      <FaqJsonLd items={FAQ_ITEMS} />
      <article className="mx-auto max-w-4xl px-6 py-16 md:px-8 md:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">Overview</p>
        <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30]">
          What is Vantirs?
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-600">
          Vantirs is payment fraud prevention software for accounting firms and AP teams. It helps teams detect risky
          payment instruction changes and suspicious invoices before payment release.
        </p>

        <section className="mt-10">
          <h2 className="font-manrope text-2xl font-bold text-[#0b1c30]">What problem does Vantirs solve?</h2>
          <p className="mt-3 text-slate-700">
            Most AP fraud losses happen when a payment looks normal but routing details are wrong. Vantirs adds a
            pre-payment verification layer so teams can detect vendor bank mismatches, sender spoofing signals, and
            unusual payment behavior before funds move.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-manrope text-2xl font-bold text-[#0b1c30]">Who is Vantirs for?</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
            <li>Accounting firms managing client payables and vendor changes</li>
            <li>AP managers who need faster, more defensible payment approvals</li>
            <li>Controllers and CFOs accountable for payment controls and audit readiness</li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="font-manrope text-2xl font-bold text-[#0b1c30]">How does Vantirs work?</h2>
          <ol className="mt-6 list-decimal space-y-4 pl-5 text-slate-700">
            <li>Connect AP workflows and vendor payment history from QuickBooks Online.</li>
            <li>Evaluate each payment and vendor change for measurable fraud risk signals.</li>
            <li>Flag high-risk items before approval and keep a review record for finance teams.</li>
          </ol>
        </section>

        <section className="mt-10 rounded-[2rem] bg-[#eff4ff] p-8 ring-1 ring-[#c3c5d9]/15">
          <h2 className="font-manrope text-2xl font-bold text-[#0b1c30]">Explore Vantirs by use case</h2>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/vendor-fraud-detection-software" className="btn-primary-gradient px-6 py-3 text-sm font-semibold">
              Vendor fraud detection software
            </Link>
            <Link
              href="/accounts-payable-fraud-prevention"
              className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#003ec7] ring-1 ring-[#c3c5d9]/20 hover:bg-[#f8f9ff]"
            >
              AP fraud prevention
            </Link>
            <Link
              href="/blog/nacha-2026-ach-fraud-monitoring-compliance"
              className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#003ec7] ring-1 ring-[#c3c5d9]/20 hover:bg-[#f8f9ff]"
            >
              NACHA 2026 compliance guide
            </Link>
          </div>
        </section>
      </article>
    </MarketingSeoShell>
  )
}
