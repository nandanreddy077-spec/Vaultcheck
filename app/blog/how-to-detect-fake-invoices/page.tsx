import type { Metadata } from 'next'
import Link from 'next/link'
import MarketingSeoShell from '@/components/MarketingSeoShell'

export const metadata: Metadata = {
  title: 'How to Detect Fake Invoices Before You Pay Them | Vantirs',
  description:
    'A step-by-step guide to detect fake invoices, including red flags and a practical checklist for AP teams on QuickBooks Online.',
}

export default function FakeInvoicesPost() {
  return (
    <MarketingSeoShell>
      <article className="mx-auto max-w-4xl px-6 py-16 md:px-8 md:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">Blog</p>
        <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30]">
          How to detect fake invoices before you pay them: a step-by-step guide
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-600">
          Fake invoices usually succeed because teams lack fast, contextual proof. Here’s how to catch them using repeatable signals.
        </p>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-[#0b1c30]">Step 1: Verify vendor identity and history</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
            <li>Check vendor bank details vs prior payments</li>
            <li>Confirm email/domain matches expected vendor patterns</li>
            <li>Watch for “urgent” pressure paired with account changes</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-[#0b1c30]">Step 2: Compare invoice changes to what’s normal</h2>
          <p className="mt-3 text-slate-700">
            If an invoice is “different” in a way your team can’t quickly explain, it’s a signal. Good fraud controls turn differences into reviewable evidence.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-[#0b1c30]">Step 3: Use automation for consistency</h2>
          <p className="mt-3 text-slate-700">
            Vantirs fingerprints vendors using QuickBooks Online payment history and flags bank mismatches and spoofed email signals so your team doesn’t rely on memory.
          </p>
        </section>

        <section className="mt-10 rounded-[2rem] bg-[#eff4ff] p-8 ring-1 ring-[#c3c5d9]/15">
          <h2 className="text-2xl font-bold text-[#0b1c30]">Want a reviewable workflow?</h2>
          <p className="mt-3 text-slate-700">
            See how Vantirs catches suspicious invoices before the wire leaves the account.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/invoice-fraud-detection" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
              Invoice fraud detection
            </Link>
            <Link href="/quickbooks-fraud-prevention" className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-semibold text-[#003ec7] ring-1 ring-[#c3c5d9]/20 hover:bg-[#f8f9ff]">
              QuickBooks prevention
            </Link>
          </div>
        </section>
      </article>
    </MarketingSeoShell>
  )
}

