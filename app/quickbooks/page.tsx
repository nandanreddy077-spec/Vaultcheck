import type { Metadata } from 'next'
import Link from 'next/link'
import MarketingSeoShell from '@/components/MarketingSeoShell'
import { PROBLEMS } from './[problem]/page'

export const metadata: Metadata = {
  title: 'QuickBooks Online Fraud Prevention Solutions | Vantirs',
  description:
    'Explore how Vantirs addresses vendor fraud, duplicate payments, bank verification, and more—natively inside QuickBooks Online for accounting firms.',
  alternates: { canonical: '/quickbooks' },
}

export default function QuickbooksHubPage() {
  const entries = Object.entries(PROBLEMS) as [string, (typeof PROBLEMS)[keyof typeof PROBLEMS]][]

  return (
    <MarketingSeoShell>
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">QuickBooks Online</p>
          <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30] md:text-5xl">
            Fraud prevention solutions for QuickBooks
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            Pick a topic to see how Vantirs uses vendor fingerprinting and payment history inside QuickBooks Online to reduce fraud risk without slowing routine AP.
          </p>
          <div className="mt-8">
            <Link href="/signup" className="btn-primary-gradient inline-flex px-8 py-4 text-base font-semibold">
              Start free trial
            </Link>
          </div>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map(([slug, item]) => (
            <Link
              key={slug}
              href={`/quickbooks/${slug}`}
              className="group rounded-[2rem] bg-[#eff4ff] p-6 text-[#003ec7] ring-1 ring-[#c3c5d9]/20 transition-shadow hover:shadow-[0_12px_40px_rgba(0,62,199,0.12)]"
            >
              <h2 className="font-manrope text-lg font-bold text-[#0b1c30] group-hover:text-[#003ec7]">{item.name}</h2>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{item.description}</p>
              <p className="mt-4 text-sm font-semibold">Read more →</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-4 text-sm font-semibold">
          <Link href="/quickbooks-fraud-prevention" className="text-[#003ec7] hover:text-[#0032a3]">
            QuickBooks fraud prevention
          </Link>
          <span className="text-slate-300">·</span>
          <Link href="/vendor-verification-software" className="text-[#003ec7] hover:text-[#0032a3]">
            Vendor verification
          </Link>
          <span className="text-slate-300">·</span>
          <Link href="/signup" className="text-[#003ec7] hover:text-[#0032a3]">
            Sign up
          </Link>
        </div>
      </section>
    </MarketingSeoShell>
  )
}
