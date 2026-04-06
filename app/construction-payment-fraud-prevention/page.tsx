import type { Metadata } from 'next'
import Link from 'next/link'
import MarketingSeoShell from '@/components/MarketingSeoShell'

export const metadata: Metadata = {
  title: 'Construction Payment Fraud Prevention | Vantirs',
  description:
    'Construction payment fraud prevention for accounting and AP teams. Stop invoice diversion and vendor impersonation before high-value contractor payments are sent.',
  alternates: { canonical: '/construction-payment-fraud-prevention' },
}

const scenarios = [
  {
    title: 'Subcontractor bank change before draw release',
    detail:
      'A known subcontractor appears to request a last-minute account update, but beneficiary details do not match prior payment history.',
  },
  {
    title: 'Spoofed project email requesting urgent payment',
    detail:
      'A look-alike domain impersonates a project contact and pushes AP to bypass normal validation controls for a six-figure wire.',
  },
  {
    title: 'Inflated invoice that blends into project volume',
    detail:
      'A fraudulent amount increase hides inside a high-velocity payment cycle where teams rely on manual spot checks.',
  },
]

export default function ConstructionPaymentFraudPreventionPage() {
  return (
    <MarketingSeoShell>
      <article className="mx-auto max-w-5xl px-6 py-16 md:px-8 md:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">Construction fraud prevention</p>
        <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30] md:text-5xl">
          Construction companies lose millions to payment fraud. Here&apos;s how to stop it.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-600">
          Construction and manufacturing account for a disproportionate share of invoice fraud due to complex
          subcontractor chains, high-value invoices, and email-based payment instructions.
        </p>

        <section className="mt-10 rounded-[2rem] bg-[#eff4ff] p-8 ring-1 ring-[#c3c5d9]/15">
          <h2 className="text-2xl font-bold text-[#0b1c30]">Why this matters right now</h2>
          <p className="mt-3 text-slate-700">
            Recent UK anti-fraud campaign data highlights rising construction invoice fraud losses and recurring
            payment-diversion patterns. Finance teams need preventative controls before approvals, not forensic reviews
            after money leaves.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-[#0b1c30]">3 common construction payment fraud scenarios</h2>
          <div className="mt-6 grid gap-5">
            {scenarios.map(s => (
              <div key={s.title} className="rounded-2xl bg-white p-6 shadow-[0_12px_40px_rgba(11,28,48,0.06)] ring-1 ring-[#c3c5d9]/15">
                <h3 className="text-lg font-bold text-[#0b1c30]">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{s.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-[#0b1c30]">How Vantirs protects construction payment workflows</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
            <li>Verifies beneficiary and routing data against known vendor payment history</li>
            <li>Flags sender domain spoofing and BEC-style urgency patterns</li>
            <li>Surfaces amount anomalies with context before payment approval</li>
            <li>Creates a defensible review trail for controllers and auditors</li>
          </ul>
        </section>

        <section className="mt-10 rounded-[2rem] bg-[#eff4ff] p-8 ring-1 ring-[#c3c5d9]/15">
          <h2 className="text-2xl font-bold text-[#0b1c30]">Protect construction payments before funds move</h2>
          <p className="mt-3 text-slate-700">
            See how Vantirs helps accounting and AP teams catch high-risk invoices before wire release.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/signup" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
              Start free trial
            </Link>
            <Link
              href="/invoice-fraud/construction"
              className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-semibold text-[#003ec7] ring-1 ring-[#c3c5d9]/20 hover:bg-[#f8f9ff]"
            >
              Read construction invoice fraud guide
            </Link>
          </div>
        </section>
      </article>
    </MarketingSeoShell>
  )
}
