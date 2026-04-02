import type { Metadata } from 'next'
import Link from 'next/link'
import MarketingSeoShell from '@/components/MarketingSeoShell'

export const metadata: Metadata = {
  title: 'BEC Attacks Targeting Accounting Firms | Vantirs',
  description:
    'Learn why business email compromise (BEC) targets accounting firms and how to fight back with vendor fingerprinting and contextual invoice fraud alerts.',
}

export default function BecAttacksPost() {
  return (
    <MarketingSeoShell>
      <article className="mx-auto max-w-4xl px-6 py-16 md:px-8 md:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">Blog</p>
        <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30]">
          Business email compromise is targeting accounting firms. Here’s how to fight back.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-600">
          Accounting firms handle multiple clients’ money. That makes your vendor payment workflow a high-value target—and BEC scams often ride in disguised as “vendor updates.”
        </p>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-[#0b1c30]">What the attacker is trying to change</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
            <li>Vendor email domain (spoofed or look-alike sender)</li>
            <li>Bank details (requesting beneficiary changes)</li>
            <li>Invoice details that pressure approvals with urgency</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-[#0b1c30]">How to stop it with reviewable signals</h2>
          <p className="mt-3 text-slate-700">
            Vantirs connects to QuickBooks Online and fingerprints vendors based on payment history. When an invoice request doesn’t match historical behavior, the team receives contextual alerts to review before payment runs.
          </p>
        </section>

        <section className="mt-10 rounded-[2rem] bg-[#eff4ff] p-8 ring-1 ring-[#c3c5d9]/15">
          <h2 className="text-2xl font-bold text-[#0b1c30]">Next step: protect AP before the wire leaves</h2>
          <p className="mt-3 text-slate-700">
            Start with QuickBooks fraud prevention or see how invoice fraud detection works.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/bec-fraud-prevention" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
              BEC prevention
            </Link>
            <Link href="/quickbooks-fraud-prevention" className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-semibold text-[#003ec7] ring-1 ring-[#c3c5d9]/20 hover:bg-[#f8f9ff]">
              QuickBooks protection
            </Link>
          </div>
        </section>
      </article>
    </MarketingSeoShell>
  )
}

