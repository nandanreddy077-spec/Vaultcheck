import type { Metadata } from 'next'
import Link from 'next/link'
import MarketingSeoShell from '@/components/MarketingSeoShell'

export const metadata: Metadata = {
  title: 'BEC Fraud Prevention Software | Vantirs',
  description:
    'Stop business email compromise from draining accounts payable. Vantirs flags spoofed vendor emails, bank mismatches, and suspicious invoices before the wire leaves QuickBooks Online.',
}

export default function BecFraudPreventionPage() {
  return (
    <MarketingSeoShell>
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">BEC fraud prevention</p>
            <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30] md:text-5xl">
              Stop business email compromise before AP pays the scam
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Vantirs detects BEC-style invoice scams by correlating email/domain signals with vendor payment history in QuickBooks Online. If the request doesn’t match how the vendor actually behaves, your team sees it.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/signup" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
                Start free trial
              </Link>
              <Link href="/invoice-fraud-detection" className="inline-flex items-center justify-center rounded-xl bg-[#dce9ff]/80 px-8 py-4 text-base font-semibold text-[#003ec7] transition-colors hover:bg-[#d3e4fe]">
                Learn invoice signals
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-[0_12px_40px_rgba(11,28,48,0.08)] ring-1 ring-[#c3c5d9]/15">
            <h2 className="text-xl font-bold text-[#0b1c30]">BEC attack signals we flag</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li>• Spoofed vendor email domains (including look-alikes)</li>
              <li>• Bank account changes vs historical payments</li>
              <li>• Amount anomalies vs vendor’s normal patterns</li>
              <li>• New vendor requests that require explicit review</li>
            </ul>
            <div className="mt-6">
              <Link href="/quickbooks-fraud-prevention" className="text-sm font-semibold text-[#003ec7] hover:text-[#0032a3]">
                Built for QuickBooks Online →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingSeoShell>
  )
}

