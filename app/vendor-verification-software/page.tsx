import type { Metadata } from 'next'
import Link from 'next/link'
import MarketingSeoShell from '@/components/MarketingSeoShell'

export const metadata: Metadata = {
  title: 'Vendor Verification Software | Vantirs',
  description:
    'The vendor verification layer your AP process is missing. Plug in to QuickBooks Online, fingerprint every vendor, and flag suspicious invoices before money leaves the account.',
}

export default function VendorVerificationSoftwarePage() {
  return (
    <MarketingSeoShell>
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">Vendor verification</p>
            <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30] md:text-5xl">
              Vendor verification software that stops fake vendors before the wire
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Vantirs plugs into QuickBooks Online and fingerprints every vendor against their payment history. When an invoice request looks off, your team gets real-time alerts in the moment it matters.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/signup" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
                Start 30-day free trial
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#dce9ff]/80 px-8 py-4 text-base font-semibold text-[#003ec7] transition-colors hover:bg-[#d3e4fe]"
              >
                See how it works
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-[0_12px_40px_rgba(11,28,48,0.08)] ring-1 ring-[#c3c5d9]/15">
            <h2 className="text-xl font-bold text-[#0b1c30]">What your team gets</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li>• Vendor fingerprinting using payment history (not guesses)</li>
              <li>• Bank account mismatch detection</li>
              <li>• Email/domain spoofing signals for BEC-style attacks</li>
              <li>• Alerts before approvals and payment runs</li>
            </ul>
            <div className="mt-6 rounded-2xl bg-[#eff4ff] p-5">
              <p className="text-sm font-semibold text-[#0b1c30]">Built for accounting firms managing client money</p>
              <p className="mt-1 text-sm text-slate-600">Prevent account drain, protect client trust, reduce liability exposure.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#eff4ff]">
        <div className="mx-auto max-w-7xl px-6 py-14 md:px-8">
          <h2 className="font-manrope text-3xl font-bold text-[#0b1c30] md:text-4xl">3-step verification workflow</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-[#003ec7]">Step 1</p>
              <h3 className="mt-2 text-lg font-bold text-[#0b1c30]">Connect QuickBooks Online</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">OAuth your client’s QuickBooks and sync vendor/payment history.</p>
            </div>
            <div className="rounded-2xl bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-[#003ec7]">Step 2</p>
              <h3 className="mt-2 text-lg font-bold text-[#0b1c30]">Fingerprint every vendor</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">We build statistical profiles so anomalies stand out immediately.</p>
            </div>
            <div className="rounded-2xl bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-[#003ec7]">Step 3</p>
              <h3 className="mt-2 text-lg font-bold text-[#0b1c30]">Alert before pay runs</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">High-risk invoices surface with context so approvals are defensible.</p>
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/roi-calculator" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
              Calculate your fraud risk
            </Link>
            <Link href="/pricing" className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-semibold text-[#003ec7] ring-1 ring-[#c3c5d9]/20 hover:bg-[#eff4ff]">
              View pricing
            </Link>
          </div>
        </div>
      </section>
    </MarketingSeoShell>
  )
}

