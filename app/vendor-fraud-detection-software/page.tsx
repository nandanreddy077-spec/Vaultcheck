import type { Metadata } from 'next'
import Link from 'next/link'
import MarketingSeoShell from '@/components/MarketingSeoShell'
import { FaqJsonLd } from '@/components/JsonLd'

const FAQ_ITEMS = [
  {
    q: 'What is vendor fraud detection software?',
    a: 'Vendor fraud detection software checks incoming invoices and payment instructions against your verified vendor history to surface mismatches — such as changed bank accounts, spoofed sender domains, or atypical invoice amounts — before any payment is approved or released.',
  },
  {
    q: 'How does Vantirs detect vendor fraud in QuickBooks Online?',
    a: 'Vantirs connects to your QuickBooks Online account via OAuth and builds a behavioral fingerprint for each vendor using historical payment data. When a new invoice or payment request deviates from that fingerprint — different bank account, unusual amount, lookalike email domain — Vantirs flags it with a specific, reviewable reason before your AP team approves payment.',
  },
  {
    q: 'What types of vendor fraud does Vantirs catch?',
    a: 'Vantirs detects business email compromise (BEC), vendor email compromise (VEC), fake invoice fraud, vendor bank account change fraud, duplicate invoices, and ghost vendor activity. It focuses on payment-instruction anomalies — the signals that appear right before a fraudulent payment would leave your account.',
  },
  {
    q: 'Is this only for large enterprise AP teams?',
    a: 'No. Vantirs is purpose-built for accounting firms and mid-market finance teams that need real fraud signals without a complex enterprise rollout. It connects to QuickBooks Online and surfaces risk in the workflows you already use.',
  },
  {
    q: 'How long does it take to get started?',
    a: 'Most teams are reviewing live fraud signals within one business day. Connect your QuickBooks Online account, and Vantirs begins building vendor fingerprints from your existing payment history immediately.',
  },
  {
    q: 'How does Vantirs compare to Eftsure or Trustpair?',
    a: 'Eftsure and Trustpair are built for large enterprise rollouts with long implementation cycles. Vantirs is optimized for accounting firms and mid-market finance teams on QuickBooks Online — faster to deploy, transparent pricing, and controls that map to how your team actually reviews AP.',
  },
]

const FRAUD_SIGNALS = [
  {
    title: 'Vendor bank account changes',
    description:
      'Any incoming payment instruction with a beneficiary account that differs from your verified history for that vendor. The highest-risk event in AP.',
  },
  {
    title: 'Lookalike sender domains',
    description:
      'BEC and VEC attacks use domains like acme-corp.com instead of acmecorp.com. Vantirs checks sender domains against known vendor identities in your books.',
  },
  {
    title: 'Invoice amount anomalies',
    description:
      'Invoice amounts that fall outside the statistical distribution of what this vendor has historically invoiced — flagged with the actual variance, not just a risk score.',
  },
  {
    title: 'First-time payment destinations',
    description:
      'Any payment going to a bank account that has never received money from your organization — regardless of whether the sender appears legitimate.',
  },
  {
    title: 'New vendor high-risk requests',
    description:
      'Vendors with no payment history requesting large transfers or unusual payment methods receive automatic elevated scrutiny.',
  },
  {
    title: 'Urgency and pressure patterns',
    description:
      'Language patterns associated with BEC urgency tactics, correlated with payment-instruction anomalies for compound risk scoring.',
  },
]

export const metadata: Metadata = {
  title: 'Vendor Fraud Detection Software for Finance Teams | Vantirs',
  description:
    'Vendor fraud detection software that catches bank account changes, BEC attacks, and fake invoices before payment leaves QuickBooks Online. Built for accounting firms and AP teams.',
  alternates: { canonical: '/vendor-fraud-detection-software' },
  keywords: [
    'vendor fraud detection software',
    'invoice fraud detection software',
    'accounts payable fraud detection tool',
    'BEC payment fraud prevention software',
    'vendor bank account verification software',
    'payment fraud prevention accounting firms',
  ],
}

export default function VendorFraudDetectionSoftwarePage() {
  return (
    <MarketingSeoShell>
      <FaqJsonLd items={FAQ_ITEMS} />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-24">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">
              Vendor fraud detection software
            </p>
            <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30] md:text-5xl">
              Catch vendor fraud before the payment leaves your AP workflow
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Vantirs verifies every vendor payment instruction against your historical QuickBooks data and stops
              bank account fraud, BEC scams, and fake invoices before a single dollar moves — with specific,
              explainable signals your team can act on.
            </p>
            <div className="mt-4 rounded-xl border border-[#c3c5d9]/30 bg-[#eff4ff] px-5 py-4">
              <p className="text-sm font-semibold text-[#0b1c30]">
                61% of BEC attacks in 2026 use vendor email compromise — sending fraud from real, compromised vendor inboxes.
              </p>
              <p className="mt-1 text-xs text-slate-500">Microsoft Q1 2026 Email Threat Landscape Report</p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/demo" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
                See a live demo
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-xl bg-[#dce9ff]/80 px-8 py-4 text-base font-semibold text-[#003ec7] transition-colors hover:bg-[#d3e4fe]"
              >
                Start free trial
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[2rem] bg-white p-7 shadow-[0_12px_40px_rgba(11,28,48,0.08)] ring-1 ring-[#c3c5d9]/15">
              <p className="text-xs font-bold uppercase tracking-widest text-[#003ec7]">Before Vantirs</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                AP team receives an invoice from a known vendor with updated bank details. The sender domain looks
                correct. The amount matches the project. Two approvers sign off. $284,000 wires to a fraudulent account.
                Funds are unrecoverable.
              </p>
            </div>
            <div className="rounded-[2rem] bg-[#eff4ff] p-7 ring-1 ring-[#c3c5d9]/20">
              <p className="text-xs font-bold uppercase tracking-widest text-[#003ec7]">After Vantirs</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                Same invoice arrives. Vantirs flags: <strong className="text-[#0b1c30]">new beneficiary account — this vendor has received 47 payments, always to routing ×××4821. This payment routes to ×××9103, never previously used.</strong> AP team pauses, calls vendor directly. Fraud confirmed. Payment stopped.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fraud signals */}
      <section className="bg-[#0b1c30] py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6b8cff]">What Vantirs flags</p>
          <h2 className="mt-3 font-manrope text-3xl font-bold text-white md:text-4xl">
            Six fraud signals caught before payment approval
          </h2>
          <p className="mt-4 max-w-2xl text-slate-400">
            Every flag includes the specific anomaly — not just a risk score — so your team can review, escalate, or
            approve with full context.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FRAUD_SIGNALS.map((signal) => (
              <div
                key={signal.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
              >
                <h3 className="font-manrope text-base font-bold text-white">{signal.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{signal.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">How it works</p>
        <h2 className="mt-3 font-manrope text-3xl font-bold text-[#0b1c30] md:text-4xl">
          Three steps from connection to fraud prevention
        </h2>
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          <div className="relative">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#003ec7] font-manrope text-lg font-bold text-white">
              1
            </span>
            <h3 className="mt-4 font-manrope text-xl font-bold text-[#0b1c30]">Connect QuickBooks Online</h3>
            <p className="mt-2 text-slate-700">
              OAuth connection to your QBO account. No data migration, no IT project. Vantirs reads your existing
              vendor and payment history to build behavioral fingerprints for every vendor in your books.
            </p>
          </div>
          <div className="relative">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#003ec7] font-manrope text-lg font-bold text-white">
              2
            </span>
            <h3 className="mt-4 font-manrope text-xl font-bold text-[#0b1c30]">Vantirs monitors every invoice</h3>
            <p className="mt-2 text-slate-700">
              As invoices enter your AP queue, Vantirs compares payment instructions, sender identity, amounts, and
              timing against each vendor's verified historical pattern. Deviations generate specific, reviewable flags.
            </p>
          </div>
          <div className="relative">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#003ec7] font-manrope text-lg font-bold text-white">
              3
            </span>
            <h3 className="mt-4 font-manrope text-xl font-bold text-[#0b1c30]">Your team reviews before payment</h3>
            <p className="mt-2 text-slate-700">
              Alerts arrive via Slack and email with the exact anomaly described. Your AP team approves, escalates, or
              rejects with full context — and every decision creates an audit trail that supports NACHA compliance and
              internal review.
            </p>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="bg-[#eff4ff]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
          <h2 className="font-manrope text-3xl font-bold text-[#0b1c30] md:text-4xl">
            Built for the teams that actually process payments
          </h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl bg-white p-7 ring-1 ring-[#c3c5d9]/20">
              <h3 className="font-manrope text-lg font-bold text-[#0b1c30]">Accounting firms</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                You process payments for multiple clients across dozens of vendor relationships. One breach doesn't
                just cost money — it costs a client relationship and your firm's reputation. Vantirs gives you
                consistent controls across every client's AP without adding headcount.
              </p>
              <Link
                href="/for-accounting-firms"
                className="mt-4 inline-block text-sm font-semibold text-[#003ec7] underline-offset-2 hover:underline"
              >
                Built for accounting firms →
              </Link>
            </div>
            <div className="rounded-2xl bg-white p-7 ring-1 ring-[#c3c5d9]/20">
              <h3 className="font-manrope text-lg font-bold text-[#0b1c30]">AP teams at mid-market companies</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                Your team approves hundreds of invoices a week. Manual review can't scale, and a single missed fraud
                event can exceed an entire year of software spend. Vantirs surfaces only the flagged items so your
                team spends scrutiny where it matters.
              </p>
              <Link
                href="/accounts-payable-fraud-prevention"
                className="mt-4 inline-block text-sm font-semibold text-[#003ec7] underline-offset-2 hover:underline"
              >
                AP fraud prevention →
              </Link>
            </div>
            <div className="rounded-2xl bg-white p-7 ring-1 ring-[#c3c5d9]/20">
              <h3 className="font-manrope text-lg font-bold text-[#0b1c30]">CFOs and finance directors</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                You carry the liability if a fraudulent wire goes through. Vantirs gives you an auditable record that
                risk-based controls are operating before every payment — supporting NACHA 2026 compliance and
                cyber-insurance documentation.
              </p>
              <Link
                href="/cfo-payment-fraud-prevention"
                className="mt-4 inline-block text-sm font-semibold text-[#003ec7] underline-offset-2 hover:underline"
              >
                CFO fraud prevention →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <h2 className="font-manrope text-3xl font-bold text-[#0b1c30] md:text-4xl">
          What changes when you add Vantirs
        </h2>
        <div className="mt-8 overflow-x-auto rounded-2xl ring-1 ring-[#c3c5d9]/25">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-[#eff4ff] text-left text-[#0b1c30]">
              <tr>
                <th className="px-5 py-4 font-semibold">Scenario</th>
                <th className="px-5 py-4 font-semibold text-slate-500">Without Vantirs</th>
                <th className="px-5 py-4 font-semibold text-[#003ec7]">With Vantirs</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              <tr className="border-t border-[#c3c5d9]/20">
                <td className="px-5 py-4 font-medium text-[#0b1c30]">Vendor sends updated bank details</td>
                <td className="px-5 py-4">AP team approves based on relationship trust</td>
                <td className="px-5 py-4 text-emerald-700">Flagged: new beneficiary account, no history — requires out-of-band verification</td>
              </tr>
              <tr className="border-t border-[#c3c5d9]/20">
                <td className="px-5 py-4 font-medium text-[#0b1c30]">Invoice arrives from lookalike domain</td>
                <td className="px-5 py-4">Passes email security — domain spoofing not caught</td>
                <td className="px-5 py-4 text-emerald-700">Flagged: sender domain does not match verified vendor identity in QBO</td>
              </tr>
              <tr className="border-t border-[#c3c5d9]/20">
                <td className="px-5 py-4 font-medium text-[#0b1c30]">Invoice amount is 3x normal range</td>
                <td className="px-5 py-4">Passes dual-approval if both approvers know the vendor</td>
                <td className="px-5 py-4 text-emerald-700">Flagged: amount 3.2x above 90th percentile for this vendor — escalate before approval</td>
              </tr>
              <tr className="border-t border-[#c3c5d9]/20">
                <td className="px-5 py-4 font-medium text-[#0b1c30]">NACHA compliance audit</td>
                <td className="px-5 py-4">Manual documentation of controls — inconsistent and time-consuming</td>
                <td className="px-5 py-4 text-emerald-700">Audit trail auto-generated: every flag, reviewer decision, and timestamp recorded</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Learn more links */}
      <section className="border-t border-[#c3c5d9]/20 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 md:px-8">
          <h2 className="font-manrope text-xl font-bold text-[#0b1c30]">Learn more about payment fraud</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/blog/bec-vs-vec-accounting-firms"
              className="rounded-xl border border-[#c3c5d9]/25 bg-[#f8f9ff] p-4 hover:bg-[#eff4ff]"
            >
              <p className="text-sm font-semibold text-[#0b1c30]">BEC vs. VEC in 2026</p>
              <p className="mt-1 text-xs text-slate-500">Why 61% of attacks now come from vendor inboxes</p>
            </Link>
            <Link
              href="/blog/vendor-bank-account-change-fraud"
              className="rounded-xl border border-[#c3c5d9]/25 bg-[#f8f9ff] p-4 hover:bg-[#eff4ff]"
            >
              <p className="text-sm font-semibold text-[#0b1c30]">Vendor bank account fraud</p>
              <p className="mt-1 text-xs text-slate-500">The highest-risk moment in any AP workflow</p>
            </Link>
            <Link
              href="/blog/nacha-2026-ach-fraud-monitoring-compliance"
              className="rounded-xl border border-[#c3c5d9]/25 bg-[#f8f9ff] p-4 hover:bg-[#eff4ff]"
            >
              <p className="text-sm font-semibold text-[#0b1c30]">NACHA 2026 compliance</p>
              <p className="mt-1 text-xs text-slate-500">What your AP team must have in place by June 22</p>
            </Link>
            <Link
              href="/blog/ai-generated-fake-invoices"
              className="rounded-xl border border-[#c3c5d9]/25 bg-[#f8f9ff] p-4 hover:bg-[#eff4ff]"
            >
              <p className="text-sm font-semibold text-[#0b1c30]">AI-generated fake invoices</p>
              <p className="mt-1 text-xs text-slate-500">Why visual review no longer catches modern fraud</p>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-6 py-16 md:px-8 md:py-20">
        <h2 className="font-manrope text-3xl font-bold text-[#0b1c30]">Frequently asked questions</h2>
        <div className="mt-8 divide-y divide-[#c3c5d9]/25">
          {FAQ_ITEMS.map((item) => (
            <div key={item.q} className="py-6">
              <p className="font-manrope font-bold text-[#0b1c30]">{item.q}</p>
              <p className="mt-3 text-slate-700">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0b1c30]">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center md:px-8 md:py-20">
          <h2 className="font-manrope text-3xl font-bold text-white md:text-4xl">
            Stop fraudulent payments before the money leaves
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
            Connect Vantirs to QuickBooks Online and start reviewing live fraud signals within one business day.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/demo" className="btn-primary-gradient px-10 py-4 text-base font-semibold">
              Book a live demo
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 px-10 py-4 text-base font-semibold text-white hover:bg-white/10"
            >
              Start free trial
            </Link>
          </div>
          <p className="mt-5 text-xs text-slate-500">
            No IT setup · Connects to QuickBooks Online · NACHA 2026 audit trail included
          </p>
        </div>
      </section>
    </MarketingSeoShell>
  )
}
