import type { Metadata } from 'next'
import Link from 'next/link'
import MarketingSeoShell from '@/components/MarketingSeoShell'

export const metadata: Metadata = {
  title: 'How It Works | Vantirs',
  description:
    'How Vantirs prevents vendor fraud in QuickBooks Online: connect, fingerprint vendors using payment history, and alert your team before pay runs.',
}

export default function HowItWorksPage() {
  return (
    <MarketingSeoShell>
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">How Vantirs works</p>
          <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30] md:text-5xl">
            Connect QuickBooks, fingerprint vendors, alert before payment runs
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            A transparent walkthrough of the workflow your accounting firm uses to challenge suspicious invoices before client money leaves the account.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] bg-white p-6 shadow-[0_12px_40px_rgba(11,28,48,0.06)] ring-1 ring-[#c3c5d9]/10">
            <p className="text-xs font-bold uppercase tracking-wider text-[#003ec7]">Step 1</p>
            <h2 className="mt-3 text-xl font-bold text-[#0b1c30]">Connect QuickBooks Online</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">OAuth to your clients’ QBO accounts and sync vendor/payment history.</p>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-[0_12px_40px_rgba(11,28,48,0.06)] ring-1 ring-[#c3c5d9]/10">
            <p className="text-xs font-bold uppercase tracking-wider text-[#003ec7]">Step 2</p>
            <h2 className="mt-3 text-xl font-bold text-[#0b1c30]">Fingerprint every vendor</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">We analyze payment patterns and build statistical vendor profiles.</p>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-[0_12px_40px_rgba(11,28,48,0.06)] ring-1 ring-[#c3c5d9]/10">
            <p className="text-xs font-bold uppercase tracking-wider text-[#003ec7]">Step 3</p>
            <h2 className="mt-3 text-xl font-bold text-[#0b1c30]">Alert before pay runs</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">When invoice details look suspicious, your team gets contextual alerts to review.</p>
          </div>
        </div>

        <div className="mt-12 rounded-[2rem] bg-[#eff4ff] p-8 ring-1 ring-[#c3c5d9]/15">
          <h2 className="text-2xl font-bold text-[#0b1c30]">Want to protect a specific workflow?</h2>
          <p className="mt-2 text-sm text-slate-600">Choose the landing page that matches your buyer intent:</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/invoice-fraud-detection" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
              Invoice fraud detection
            </Link>
            <Link href="/quickbooks-fraud-prevention" className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-semibold text-[#003ec7] ring-1 ring-[#c3c5d9]/20 hover:bg-[#f8f9ff]">
              QuickBooks protection
            </Link>
          </div>
        </div>
      </section>
    </MarketingSeoShell>
  )
}

