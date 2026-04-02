import type { Metadata } from 'next'
import Link from 'next/link'
import MarketingSeoShell from '@/components/MarketingSeoShell'

export const metadata: Metadata = {
  title: 'Automated Vendor Verification vs Manual | Vantirs',
  description:
    'Compare automated vendor verification vs manual checks. Reduce review time, catch bank mismatches earlier, and make approvals more defensible.',
}

export default function VendorVerificationVsManualPage() {
  return (
    <MarketingSeoShell>
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">Evaluation</p>
          <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30] md:text-5xl">
            Automated vendor verification vs manual review
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            Manual checks rely on judgment, memory, and busy-season bandwidth. Vantirs fingerprints vendors using QuickBooks payment history and flags the signals your team can prove they reviewed.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-[2rem] bg-white ring-1 ring-[#c3c5d9]/15">
          <div className="grid gap-0 md:grid-cols-2">
            <div className="p-6 md:p-8">
              <h2 className="text-xl font-bold text-[#0b1c30]">Manual verification</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                <li>• Slower and inconsistent across clients</li>
                <li>• Hard to prove you checked the “right history”</li>
                <li>• Easy to miss bank detail changes</li>
                <li>• Reacts after suspicious requests land</li>
              </ul>
            </div>
            <div className="p-6 bg-[#eff4ff] md:p-8">
              <h2 className="text-xl font-bold text-[#0b1c30]">Automated verification (Vantirs)</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                <li>• Vendor fingerprinting anchored to QuickBooks history</li>
                <li>• Bank mismatch and BEC signal alerts before pay runs</li>
                <li>• Consistent rules across your entire firm</li>
                <li>• Defensible signals to support approvals</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/signup" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
            Start with a free trial
          </Link>
          <Link href="/vendor-verification-software" className="inline-flex items-center justify-center rounded-xl bg-[#dce9ff]/80 px-8 py-4 text-base font-semibold text-[#003ec7] transition-colors hover:bg-[#d3e4fe]">
            Learn vendor verification →
          </Link>
        </div>
      </section>
    </MarketingSeoShell>
  )
}

