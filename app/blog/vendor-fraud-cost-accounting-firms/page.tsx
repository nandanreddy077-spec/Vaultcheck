import type { Metadata } from 'next'
import Link from 'next/link'
import MarketingSeoShell from '@/components/MarketingSeoShell'

export const metadata: Metadata = {
  title: 'The Real Cost of Vendor Fraud for Accounting Firms | Vantirs',
  description:
    'Learn the real financial and reputational cost of vendor fraud for accounting firms—and the controls that prevent it before funds are wired.',
}

export default function VendorFraudCostPost() {
  return (
    <MarketingSeoShell>
      <article className="mx-auto max-w-4xl px-6 py-16 md:px-8 md:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">Blog</p>
        <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30]">
          The real cost of vendor fraud for accounting firms (and how to stop it)
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-600">
          Vendor fraud doesn’t just steal money. It creates liabilities, client churn, insurance friction, and a paper trail you never wanted to write.
        </p>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-[#0b1c30]">1) Direct loss: the wire that can’t be reversed</h2>
          <p className="mt-3 text-slate-700">
            Once a fraudulent invoice results in a payment, recovery becomes slow and uncertain. The “cost” is not just the stolen amount—it’s the time and effort required to unwind the incident.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-[#0b1c30]">2) Indirect loss: trust, client relationships, and risk</h2>
          <p className="mt-3 text-slate-700">
            Accounting firms are judged on consistency and defensibility. Suspicious payments become a credibility issue—especially when “we thought it looked right” is the only explanation.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-[#0b1c30]">3) Operational cost: after-the-fact investigations</h2>
          <p className="mt-3 text-slate-700">
            Your team inherits the cleanup: vendor vetting, client comms, internal audits, and security reviews—work that could have been prevented with real-time vendor verification.
          </p>
        </section>

        <section className="mt-10 rounded-[2rem] bg-[#eff4ff] p-8 ring-1 ring-[#c3c5d9]/15">
          <h2 className="text-2xl font-bold text-[#0b1c30]">A prevention framework your team can prove</h2>
          <p className="mt-3 text-slate-700">
            Vantirs fingerprints vendors using QuickBooks Online payment history and flags mismatches—so reviews are faster and defensible. That turns “maybe fraud” into specific, reviewable signals.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/vendor-verification-software" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
              See vendor verification
            </Link>
            <Link href="/roi-calculator" className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-semibold text-[#003ec7] ring-1 ring-[#c3c5d9]/20 hover:bg-[#f8f9ff]">
              Calculate ROI
            </Link>
          </div>
        </section>
      </article>
    </MarketingSeoShell>
  )
}

