import type { Metadata } from 'next'
import Link from 'next/link'
import MarketingSeoShell from '@/components/MarketingSeoShell'
import { INDUSTRIES } from './[industry]/page'

export const metadata: Metadata = {
  title: 'Invoice Fraud Prevention by Industry | Vantirs',
  description:
    'Industry-specific invoice fraud prevention for healthcare, construction, legal, manufacturing, and more. See how Vantirs flags bank mismatches, spoofed domains, and suspicious invoices in QuickBooks Online.',
  alternates: { canonical: '/invoice-fraud' },
}

export default function InvoiceFraudHubPage() {
  const industries = Object.entries(INDUSTRIES).sort((a, b) => a[1].name.localeCompare(b[1].name))

  return (
    <MarketingSeoShell>
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">Browse by industry</p>
        <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30] md:text-5xl">
          Invoice fraud prevention by industry
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
          Explore how Vantirs helps finance teams in each sector catch bank mismatches, email spoofing, amount anomalies, and risky new vendors—before payments leave QuickBooks Online.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/signup" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
            Start free trial
          </Link>
          <Link
            href="/invoice-fraud-detection"
            className="inline-flex items-center justify-center rounded-xl bg-[#dce9ff]/80 px-8 py-4 text-base font-semibold text-[#003ec7] transition-colors hover:bg-[#d3e4fe]"
          >
            Invoice fraud detection overview
          </Link>
        </div>
      </section>

      <section className="border-t border-[#c3c5d9]/15 bg-[#eff4ff] py-14">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <h2 className="font-manrope text-2xl font-bold text-[#0b1c30] md:text-3xl">Industries</h2>
          <p className="mt-2 text-slate-600">Deep dives on fraud context and how Vantirs fits your AP workflow.</p>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map(([slug, row]) => (
              <li key={slug}>
                <Link
                  href={`/invoice-fraud/${slug}`}
                  className="block rounded-[2rem] bg-white p-6 shadow-[0_12px_40px_rgba(11,28,48,0.06)] ring-1 ring-[#c3c5d9]/15 transition-shadow hover:shadow-[0_12px_40px_rgba(11,28,48,0.1)]"
                >
                  <p className="text-sm font-bold text-[#003ec7]">{row.name}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 line-clamp-3">{row.description}</p>
                  <span className="mt-4 inline-flex text-sm font-semibold text-[#003ec7]">Read more →</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 md:px-8">
        <h2 className="font-manrope text-2xl font-bold text-[#0b1c30] md:text-3xl">Related</h2>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href="/vendor-verification-software" className="btn-primary-gradient px-6 py-3 text-sm font-semibold">
            Vendor verification software
          </Link>
          <Link
            href="/quickbooks-fraud-prevention"
            className="inline-flex items-center justify-center rounded-xl bg-[#eff4ff] px-6 py-3 text-sm font-semibold text-[#003ec7] ring-1 ring-[#c3c5d9]/20 hover:bg-[#e4edff]"
          >
            QuickBooks fraud prevention
          </Link>
          <Link href="/signup" className="inline-flex items-center justify-center rounded-xl bg-[#eff4ff] px-6 py-3 text-sm font-semibold text-[#003ec7] ring-1 ring-[#c3c5d9]/20 hover:bg-[#e4edff]">
            Sign up
          </Link>
        </div>
      </section>
    </MarketingSeoShell>
  )
}
