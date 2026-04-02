import type { Metadata } from 'next'
import Link from 'next/link'
import MarketingSeoShell from '@/components/MarketingSeoShell'
import { FaqJsonLd } from '@/components/JsonLd'

const FAQ_ITEMS = [
  { q: 'What is invoice fraud detection?', a: 'Invoice fraud detection identifies suspicious invoices before payment by checking for bank account mismatches, spoofed email domains, and statistical anomalies against vendor payment history.' },
  { q: 'How does Vantirs detect fake invoices?', a: "Vantirs fingerprints every vendor using QuickBooks Online payment history and flags invoices where bank details, email domains, or amounts don't match established patterns." },
  { q: 'Can Vantirs detect BEC-style invoice scams?', a: 'Yes. Vantirs surfaces email domain spoofing signals including look-alike domains, which are a hallmark of business email compromise (BEC) attacks targeting AP teams.' },
]

export const metadata: Metadata = {
  title: 'Invoice Fraud Detection Software | Vantirs',
  description:
    "AI-powered invoice fraud detection for accounting firms. Identify spoofed vendors, bank mismatches, and suspicious invoices before the wire leaves your client's account.",
  alternates: { canonical: '/invoice-fraud-detection' },
}

export default function InvoiceFraudDetectionPage() {
  return (
    <MarketingSeoShell>
      <FaqJsonLd items={FAQ_ITEMS} />
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">Invoice fraud detection</p>
            <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30] md:text-5xl">
              Catch invoice fraud before your team approves payment
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Vantirs detects invoice-level fraud signals (bank mismatches, suspicious vendor changes, spoofed email domains, and statistical anomalies) using each vendor&apos;s payment history in QuickBooks Online.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/signup" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
                Start free trial
              </Link>
              <Link href="/quickbooks-fraud-prevention" className="inline-flex items-center justify-center rounded-xl bg-[#dce9ff]/80 px-8 py-4 text-base font-semibold text-[#003ec7] transition-colors hover:bg-[#d3e4fe]">
                Explore QuickBooks protection
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-[0_12px_40px_rgba(11,28,48,0.08)] ring-1 ring-[#c3c5d9]/15">
            <h2 className="text-xl font-bold text-[#0b1c30]">Fraud types we flag</h2>
            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl bg-[#eff4ff] p-4">
                <p className="text-sm font-semibold text-[#0b1c30]">Bank account changes</p>
                <p className="mt-1 text-sm text-slate-600">Invoices asking for a different beneficiary than past payments.</p>
              </div>
              <div className="rounded-2xl bg-[#eff4ff] p-4">
                <p className="text-sm font-semibold text-[#0b1c30]">Email domain spoofing</p>
                <p className="mt-1 text-sm text-slate-600">Sender domains that don&apos;t match known vendor patterns (including look-alikes).</p>
              </div>
              <div className="rounded-2xl bg-[#eff4ff] p-4">
                <p className="text-sm font-semibold text-[#0b1c30]">Amount anomalies</p>
                <p className="mt-1 text-sm text-slate-600">Statistical outliers vs. vendor payment history.</p>
              </div>
              <div className="rounded-2xl bg-[#eff4ff] p-4">
                <p className="text-sm font-semibold text-[#0b1c30]">New vendor verification</p>
                <p className="mt-1 text-sm text-slate-600">First-time vendors require explicit review (no history = no trust).</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#eff4ff]">
        <div className="mx-auto max-w-7xl px-6 py-14 md:px-8">
          <h2 className="font-manrope text-3xl font-bold text-[#0b1c30] md:text-4xl">Designed for defensible approvals</h2>
          <p className="mt-4 max-w-2xl text-slate-600">
            Your team doesn&apos;t just need a &quot;risk score.&quot; Vantirs shows the specific signals (what changed, what doesn&apos;t match, why it&apos;s unusual) so reviews are faster and more defensible.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/vendor-verification-software" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
              Learn vendor verification
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
