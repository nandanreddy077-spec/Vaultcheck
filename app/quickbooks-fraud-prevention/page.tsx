import type { Metadata } from 'next'
import Link from 'next/link'
import MarketingSeoShell from '@/components/MarketingSeoShell'

export const metadata: Metadata = {
  title: 'QuickBooks Fraud Prevention App | Vantirs',
  description:
    'QuickBooks Online fraud prevention built natively for accounting firms. Fingerprint vendors using payment history and flag bank mismatches and spoofed emails before clients pay.',
}

export default function QuickbooksFraudPreventionPage() {
  return (
    <MarketingSeoShell>
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">QuickBooks Online</p>
            <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30] md:text-5xl">
              QuickBooks fraud prevention that works with your real AP data
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Vantirs connects to QuickBooks Online, fingerprints vendors against their payment history, and flags suspicious invoices using signals that match how vendor fraud actually slips through AP workflows.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/signup" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
                Start free trial
              </Link>
              <Link href="/how-it-works" className="inline-flex items-center justify-center rounded-xl bg-[#dce9ff]/80 px-8 py-4 text-base font-semibold text-[#003ec7] transition-colors hover:bg-[#d3e4fe]">
                See setup walkthrough
              </Link>
            </div>

            <div className="mt-8 rounded-2xl bg-[#eff4ff] p-5">
              <p className="text-sm font-semibold text-[#0b1c30]">QBO is your source of truth</p>
              <p className="mt-1 text-sm text-slate-600">We anchor verification on vendor history already in QuickBooks, so alerts are contextual.</p>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-[0_12px_40px_rgba(11,28,48,0.08)] ring-1 ring-[#c3c5d9]/15">
            <h2 className="text-xl font-bold text-[#0b1c30]">What QuickBooks protection looks like</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li>• Vendor fingerprinting from payment history</li>
              <li>• Bank account mismatch alerts tied to invoice requests</li>
              <li>• Email domain spoofing signals (BEC-style)</li>
              <li>• Ongoing monitoring across every client’s vendor activity</li>
            </ul>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/for-accounting-firms" className="inline-flex flex-1 items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#003ec7] ring-1 ring-[#c3c5d9]/20 hover:bg-[#eff4ff]">
                Built for firms
              </Link>
              <Link href="/pricing" className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#eff4ff] px-4 py-3 text-sm font-semibold text-[#003ec7] ring-1 ring-[#c3c5d9]/20 hover:bg-white">
                Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingSeoShell>
  )
}

