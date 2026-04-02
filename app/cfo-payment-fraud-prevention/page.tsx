import type { Metadata } from 'next'
import Link from 'next/link'
import { FaqJsonLd } from '@/components/JsonLd'
import MarketingSeoShell from '@/components/MarketingSeoShell'

export const metadata: Metadata = {
  title: 'Payment Fraud Prevention for CFOs | Vantirs',
  description:
    'Payment fraud prevention for CFOs: financial liability, board reporting, cyber insurance, and audit readiness. Use Vantirs with QuickBooks Online to catch vendor fraud before wires go out.',
  alternates: { canonical: '/cfo-payment-fraud-prevention' },
}

const FAQ_ITEMS = [
  {
    q: 'Why should a CFO prioritize payment fraud prevention now?',
    a: 'Vendor impersonation and BEC attacks can move millions in hours. The CFO owns the financial control narrative to the board and insurers—prevention and defensible controls reduce tail risk and reputational damage.',
  },
  {
    q: 'How does Vantirs help CFOs without replacing AP?',
    a: 'Vantirs adds a verification layer on QuickBooks Online: vendor fingerprints from payment history, anomaly alerts before pay runs, and signals your team can document for audit—not a replacement for your ERP or bank.',
  },
  {
    q: 'Does stronger vendor verification help with cyber insurance renewals?',
    a: 'Insurers increasingly ask about financial controls and fraud processes. Documented vendor verification and review trails can support underwriting conversations—your broker and policy terms apply.',
  },
]

const CHECKLIST = [
  'We have a documented process to validate bank account changes before funds are released.',
  'AP cannot override vendor master data without a second approval path for high-risk changes.',
  'We compare new payment instructions against historical pay data—not only the email that requested the change.',
  'We log who approved each invoice and payment batch for audit and board inquiry.',
  'We run periodic reviews of dormant vendors reactivated with urgent payment requests.',
  'We have a defined incident response playbook if fraud is suspected after a wire.',
  'Cyber insurance coverage and exclusions for social engineering are reviewed annually with finance and legal.',
  'We report material fraud risk and controls to the board or audit committee on a defined cadence.',
  'We test vendor onboarding and change controls at least annually or when processes change.',
  'We align IT access controls with who can pay vendors (no shared inboxes that can approve payments alone).',
]

export default function CfoPaymentFraudPreventionPage() {
  return (
    <MarketingSeoShell>
      <FaqJsonLd items={FAQ_ITEMS} />
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">Payment fraud prevention for CFOs</p>
          <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30] md:text-5xl">
            CFOs: stop payment fraud before it becomes a board-level crisis
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            When a fraudulent wire clears, the damage is not only the loss. It is{' '}
            <span className="font-medium text-[#0b1c30]">personal and organizational liability</span>, emergency board
            updates, strained insurer relationships, and questions about whether controls were “reasonable.” Payment fraud
            prevention for CFOs starts with consequences: one wrong approval can define the quarter.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-[#eff4ff] p-8 ring-1 ring-[#c3c5d9]/20">
            <h2 className="font-manrope text-xl font-bold text-[#0b1c30]">What keeps CFOs up at night</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
              <li>• <span className="font-semibold text-[#003ec7]">Financial liability</span>—who authorized the payment and what did they know?</li>
              <li>• <span className="font-semibold text-[#003ec7]">Board reporting</span>—material losses and control gaps become headline topics</li>
              <li>• <span className="font-semibold text-[#003ec7]">Cyber insurance</span>—social engineering and funds transfer fraud may fall in gray zones</li>
              <li>• <span className="font-semibold text-[#003ec7]">Risk & audit readiness</span>—regulators and auditors ask for evidence, not intentions</li>
            </ul>
          </div>
          <div className="rounded-[2rem] bg-white p-8 shadow-[0_12px_40px_rgba(11,28,48,0.06)] ring-1 ring-[#c3c5d9]/15">
            <h2 className="font-manrope text-xl font-bold text-[#0b1c30]">What Vantirs adds on QuickBooks Online</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Vantirs fingerprints vendors from real payment history, flags bank and email anomalies, and pushes alerts before
              pay runs—so finance and accounting share a defensible review trail. It does not replace your bank or ERP; it
              tightens the last mile before money leaves.
            </p>
            <div className="mt-6">
              <Link href="/signup" className="btn-primary-gradient inline-block px-6 py-3 text-sm font-semibold">
                Start free trial
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 rounded-[2rem] bg-white p-8 shadow-[0_12px_40px_rgba(11,28,48,0.06)] ring-1 ring-[#c3c5d9]/15 md:p-10">
          <h2 className="font-manrope text-2xl font-bold text-[#0b1c30] md:text-3xl">CFO payment fraud risk checklist</h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-600">
            Use this as a board-prep or internal audit prompt. Not every item will apply to every company—gaps are signals
            to prioritize.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {CHECKLIST.map(item => (
              <li
                key={item}
                className="flex gap-3 rounded-2xl bg-[#eff4ff] px-4 py-3 text-sm text-slate-800 ring-1 ring-[#c3c5d9]/15"
              >
                <span className="mt-0.5 shrink-0 font-bold text-[#003ec7]">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/for/cfos" className="text-sm font-semibold text-[#003ec7] underline-offset-4 hover:underline">
            CFOs
          </Link>
          <span className="text-slate-300">·</span>
          <Link href="/roi-calculator" className="text-sm font-semibold text-[#003ec7] underline-offset-4 hover:underline">
            ROI calculator
          </Link>
          <span className="text-slate-300">·</span>
          <Link href="/pricing" className="text-sm font-semibold text-[#003ec7] underline-offset-4 hover:underline">
            Pricing
          </Link>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/signup" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
            Start free trial
          </Link>
          <Link
            href="/roi-calculator"
            className="inline-flex items-center justify-center rounded-xl bg-[#dce9ff]/80 px-8 py-4 text-base font-semibold text-[#003ec7] transition-colors hover:bg-[#d3e4fe]"
          >
            Estimate exposure
          </Link>
        </div>
      </section>
    </MarketingSeoShell>
  )
}
