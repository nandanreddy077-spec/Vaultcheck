import type { Metadata } from 'next'
import Link from 'next/link'
import MarketingSeoShell from '@/components/MarketingSeoShell'
import { ATTACK_TYPES } from './[attackType]/page'

export const metadata: Metadata = {
  title: 'Fraud Prevention by Attack Type | Vantirs',
  description:
    'Explore fraud prevention guidance by attack type: vendor impersonation, BEC, bank changes, ghost vendors, and more—with practical checklists for accounting teams on QuickBooks Online.',
  alternates: { canonical: '/prevent' },
}

export default function PreventHubPage() {
  const entries = Object.entries(ATTACK_TYPES) as [keyof typeof ATTACK_TYPES, (typeof ATTACK_TYPES)[keyof typeof ATTACK_TYPES]][]

  return (
    <MarketingSeoShell>
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">Fraud prevention</p>
        <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30] md:text-5xl">
          Fraud prevention by attack type
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
          Deep dives on common AP and vendor-payment attacks—what they are, how Vantirs detects them in QuickBooks Online, and actionable checklists your firm can use with clients.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/signup" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
            Start free trial
          </Link>
          <Link
            href="/invoice-fraud-detection"
            className="inline-flex items-center justify-center rounded-xl bg-[#dce9ff]/80 px-8 py-4 text-base font-semibold text-[#003ec7] transition-colors hover:bg-[#d3e4fe]"
          >
            Invoice fraud detection
          </Link>
        </div>
      </section>

      <section className="border-t border-[#c3c5d9]/15 bg-[#eff4ff] py-14">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <h2 className="font-manrope text-2xl font-bold text-[#0b1c30] md:text-3xl">Browse attack types</h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            Each guide includes detection signals, prevention steps, and links to{' '}
            <Link href="/bec-fraud-prevention" className="font-semibold text-[#003ec7] hover:text-[#0032a3]">
              BEC protection
            </Link>
            ,{' '}
            <Link href="/vendor-verification-software" className="font-semibold text-[#003ec7] hover:text-[#0032a3]">
              vendor verification
            </Link>
            , and{' '}
            <Link href="/invoice-fraud-detection" className="font-semibold text-[#003ec7] hover:text-[#0032a3]">
              invoice fraud detection
            </Link>
            .
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map(([slug, { name, definition }]) => (
              <Link
                key={slug}
                href={`/prevent/${slug}`}
                className="group rounded-[2rem] bg-white p-6 shadow-[0_12px_40px_rgba(11,28,48,0.08)] ring-1 ring-[#c3c5d9]/15 transition-shadow hover:shadow-[0_16px_48px_rgba(11,28,48,0.12)]"
              >
                <h3 className="font-manrope text-xl font-bold text-[#0b1c30] group-hover:text-[#003ec7]">{name}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">{definition}</p>
                <p className="mt-4 text-sm font-semibold text-[#003ec7]">Read guide →</p>
              </Link>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/signup" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
              Get started
            </Link>
            <Link
              href="/bec-fraud-prevention"
              className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-semibold text-[#003ec7] ring-1 ring-[#c3c5d9]/20 hover:bg-[#eff4ff]"
            >
              BEC fraud prevention
            </Link>
          </div>
        </div>
      </section>
    </MarketingSeoShell>
  )
}
