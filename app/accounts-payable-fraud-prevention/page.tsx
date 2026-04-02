import type { Metadata } from 'next'
import Link from 'next/link'
import MarketingSeoShell from '@/components/MarketingSeoShell'

export const metadata: Metadata = {
  title: 'Accounts Payable Fraud Prevention Software | Vantirs',
  description:
    'Prevent AP fraud before payment clears. Vantirs flags suspicious invoices and vendor/payment mismatches in QuickBooks Online so approvals are faster and more defensible.',
}

export default function AccountsPayableFraudPreventionPage() {
  return (
    <MarketingSeoShell>
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">AP fraud prevention</p>
            <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30] md:text-5xl">
              Prevent accounts payable fraud before the wire leaves
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Vantirs sits on top of your AP workflow in QuickBooks Online. It compares incoming invoice details to historical vendor payments and flags mismatches that indicate vendor impersonation, BEC, or bank change fraud.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/signup" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
                Start free trial
              </Link>
              <Link href="/bec-fraud-prevention" className="inline-flex items-center justify-center rounded-xl bg-[#dce9ff]/80 px-8 py-4 text-base font-semibold text-[#003ec7] transition-colors hover:bg-[#d3e4fe]">
                Protect from BEC
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-[0_12px_40px_rgba(11,28,48,0.08)] ring-1 ring-[#c3c5d9]/15">
            <h2 className="text-xl font-bold text-[#0b1c30]">Signals your team can trust</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li>• Bank account changes vs vendor history</li>
              <li>• Email/domain spoofing indicators</li>
              <li>• Amount anomalies that are measurable</li>
              <li>• New vendor review signals (no history = more scrutiny)</li>
            </ul>
            <div className="mt-6 rounded-2xl bg-[#eff4ff] p-5">
              <p className="text-sm font-semibold text-[#0b1c30]">Goal: fewer “maybe” approvals</p>
              <p className="mt-1 text-sm text-slate-600">Turn uncertainty into alerts with context.</p>
            </div>
          </div>
        </div>
      </section>
    </MarketingSeoShell>
  )
}

