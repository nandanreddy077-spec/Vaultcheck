import type { Metadata } from 'next'
import Link from 'next/link'
import MarketingSeoShell from '@/components/MarketingSeoShell'

export const metadata: Metadata = {
  title: 'Blog | Vantirs',
  description:
    'Guides and research on invoice fraud, vendor verification, and QuickBooks Online fraud prevention for accounting firms.',
  alternates: { canonical: '/blog' },
}

const POSTS = [
  { href: '/blog/vendor-fraud-cost-accounting-firms', title: 'The Real Cost of Vendor Fraud for Accounting Firms (And How to Stop It)' },
  { href: '/blog/how-to-detect-fake-invoices', title: 'How to Detect Fake Invoices Before You Pay Them: A Step-by-Step Guide' },
  { href: '/blog/bec-attacks-accounting-firms', title: 'Business Email Compromise Is Targeting Accounting Firms. Here’s How to Fight Back' },
]

export default function BlogIndexPage() {
  return (
    <MarketingSeoShell>
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">Resources</p>
          <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30] md:text-5xl">
            Blog: invoice fraud prevention for accounting firms
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            Practical, execution-focused guidance to help you detect vendor fraud and BEC-style invoice scams before payment leaves your clients’ QuickBooks.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {POSTS.map(p => (
            <article key={p.href} className="rounded-[2rem] bg-white p-6 shadow-[0_12px_40px_rgba(11,28,48,0.06)] ring-1 ring-[#c3c5d9]/15">
              <h2 className="text-lg font-bold text-[#0b1c30]">{p.title}</h2>
              <div className="mt-4">
                <Link href={p.href} className="text-sm font-semibold text-[#003ec7] hover:text-[#0032a3]">
                  Read →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </MarketingSeoShell>
  )
}

