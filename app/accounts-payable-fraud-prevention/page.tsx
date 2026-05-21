import type { Metadata } from 'next'
import Link from 'next/link'
import MarketingSeoShell from '@/components/MarketingSeoShell'
import { FaqJsonLd } from '@/components/JsonLd'

const FAQ_ITEMS = [
  {
    q: 'What is accounts payable fraud?',
    a: 'Accounts payable fraud covers any scheme where fraudulent invoices or payment instructions cause a company to send money to an unauthorized party. The most common types are vendor impersonation (BEC/VEC), fake invoice submission, duplicate invoices, ghost vendors, and insider manipulation of payment details.',
  },
  {
    q: 'What is the most common AP fraud vector in 2026?',
    a: 'Vendor email compromise (VEC) — a BEC variant where the attacker uses a real, compromised vendor email address to send fraudulent payment-change requests. It bypasses most standard AP controls because the communication looks fully legitimate. VEC now accounts for 61% of all BEC attacks.',
  },
  {
    q: 'How does Vantirs prevent accounts payable fraud?',
    a: 'Vantirs connects to your QuickBooks Online account and builds a behavioral fingerprint for each vendor. When an invoice or payment instruction deviates from that fingerprint — changed bank account, unfamiliar sender domain, unusual amount — Vantirs surfaces a specific, reviewable flag before your team approves payment.',
  },
  {
    q: 'Does AP fraud prevention software replace our internal controls?',
    a: 'No — it strengthens them. Vantirs adds an automated pre-payment verification layer that your team reviews before approval. This complements your existing dual-approval policies, call-back procedures, and audit requirements rather than replacing them.',
  },
  {
    q: 'Does Vantirs help with NACHA 2026 compliance?',
    a: 'Yes. Vantirs creates an auditable record of pre-payment fraud checks — including each flag detected, reviewer decision, and timestamp — which supports the risk-based fraud monitoring documentation NACHA 2026 requires for ACH originators.',
  },
]

const AP_FRAUD_TYPES = [
  {
    name: 'Vendor email compromise (VEC)',
    risk: 'Critical',
    riskColor: 'text-red-600',
    description: 'Attacker uses a compromised real vendor inbox to send fraudulent bank-detail updates. Bypasses email authentication and dual-approval. Now 61% of all BEC attacks.',
  },
  {
    name: 'Business email compromise (BEC)',
    risk: 'Critical',
    riskColor: 'text-red-600',
    description: 'Impersonation of an executive or vendor via lookalike domain. Fraudster requests urgent wire or payment-detail change. FBI: $2.9B in losses in 2024.',
  },
  {
    name: 'Fake invoice fraud',
    risk: 'High',
    riskColor: 'text-orange-500',
    description: 'AI-generated invoices that match real vendor templates but route payment to a fraudulent account. Visual review no longer catches modern forgeries.',
  },
  {
    name: 'Vendor bank account change fraud',
    risk: 'High',
    riskColor: 'text-orange-500',
    description: 'Legitimate-looking request to update a vendor\'s bank details mid-relationship. The highest-risk event in any AP workflow — and the most common VEC delivery mechanism.',
  },
  {
    name: 'Duplicate invoice fraud',
    risk: 'Medium',
    riskColor: 'text-amber-500',
    description: 'Slight alterations to invoice numbers, amounts, or dates to push duplicate payments through. Often missed when AP volume is high.',
  },
  {
    name: 'Ghost vendor fraud',
    risk: 'Medium',
    riskColor: 'text-amber-500',
    description: 'Payments to vendors that don\'t exist or are controlled by insiders. Common in organizations without systematic new-vendor verification.',
  },
]

export const metadata: Metadata = {
  title: 'Accounts Payable Fraud Prevention Software | Vantirs',
  description:
    'Prevent AP fraud before the wire leaves. Vantirs catches vendor bank account changes, BEC attacks, fake invoices, and VEC in QuickBooks Online — with specific, reviewable signals before payment approval.',
  alternates: { canonical: '/accounts-payable-fraud-prevention' },
  keywords: [
    'accounts payable fraud prevention software',
    'AP fraud prevention',
    'accounts payable fraud detection tool',
    'prevent AP fraud QuickBooks',
    'invoice fraud prevention software',
  ],
}

export default function AccountsPayableFraudPreventionPage() {
  return (
    <MarketingSeoShell>
      <FaqJsonLd items={FAQ_ITEMS} />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-24">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">AP fraud prevention</p>
            <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30] md:text-5xl">
              Prevent accounts payable fraud before the wire leaves
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              AP fraud doesn't announce itself. It arrives as a routine invoice from a familiar vendor at the right time —
              and leaves as an irreversible wire transfer. Vantirs adds a pre-payment verification layer to QuickBooks Online
              so your team catches it before approval, not after.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-[#eff4ff] p-4 text-center">
                <p className="font-manrope text-2xl font-extrabold text-[#003ec7]">$2.9B</p>
                <p className="mt-1 text-xs text-slate-600">BEC losses in 2024 (FBI IC3)</p>
              </div>
              <div className="rounded-xl bg-[#eff4ff] p-4 text-center">
                <p className="font-manrope text-2xl font-extrabold text-[#003ec7]">61%</p>
                <p className="mt-1 text-xs text-slate-600">of BEC now uses real vendor inboxes</p>
              </div>
              <div className="rounded-xl bg-[#eff4ff] p-4 text-center">
                <p className="font-manrope text-2xl font-extrabold text-[#003ec7]">~0%</p>
                <p className="mt-1 text-xs text-slate-600">recovery rate after wire clears</p>
              </div>
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

          <div className="rounded-[2rem] bg-white p-8 shadow-[0_12px_40px_rgba(11,28,48,0.08)] ring-1 ring-[#c3c5d9]/15">
            <h2 className="font-manrope text-lg font-bold text-[#0b1c30]">
              What Vantirs flags before payment approval
            </h2>
            <ul className="mt-5 space-y-4 text-sm text-slate-700">
              <li className="flex gap-3">
                <span className="mt-0.5 flex-shrink-0 text-emerald-600">✓</span>
                <span>Vendor bank account changed from verified history — flagged with previous vs. new account detail</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex-shrink-0 text-emerald-600">✓</span>
                <span>Sender domain differs from vendor's verified identity in QuickBooks</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex-shrink-0 text-emerald-600">✓</span>
                <span>Invoice amount outside this vendor's historical statistical range</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex-shrink-0 text-emerald-600">✓</span>
                <span>Payment routing to a beneficiary account with no prior history in your books</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex-shrink-0 text-emerald-600">✓</span>
                <span>New vendor requests routed to high-risk account types or geographies</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex-shrink-0 text-emerald-600">✓</span>
                <span>Duplicate invoice patterns across vendor, amount, and timing dimensions</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* AP fraud types */}
      <section className="bg-[#eff4ff]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
          <h2 className="font-manrope text-3xl font-bold text-[#0b1c30] md:text-4xl">
            The six AP fraud types your team faces in 2026
          </h2>
          <p className="mt-4 max-w-2xl text-slate-600">
            Each requires a different detection approach. Vantirs addresses all six through behavioral verification
            at the payment-instruction level.
          </p>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {AP_FRAUD_TYPES.map((t) => (
              <div key={t.name} className="rounded-2xl bg-white p-6 ring-1 ring-[#c3c5d9]/20">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-manrope text-base font-bold text-[#0b1c30]">{t.name}</h3>
                  <span className={`flex-shrink-0 text-xs font-bold ${t.riskColor}`}>{t.risk}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{t.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it integrates */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-manrope text-3xl font-bold text-[#0b1c30] md:text-4xl">
              Sits on top of your existing QuickBooks workflow
            </h2>
            <p className="mt-4 text-slate-700">
              No new AP system. No workflow rebuild. Vantirs connects to QuickBooks Online via OAuth and adds a
              pre-payment verification layer to the process your team already uses. Flags arrive via Slack and email
              before your pay run — giving reviewers specific context, not just a risk score.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              <li className="flex gap-3">
                <span className="text-[#003ec7]">→</span>
                <span><strong className="text-[#0b1c30]">Connects in under a day.</strong> OAuth sync to your QBO account, no IT project required.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#003ec7]">→</span>
                <span><strong className="text-[#0b1c30]">Specific, actionable flags.</strong> Every alert includes the exact anomaly — not a score to interpret.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#003ec7]">→</span>
                <span><strong className="text-[#0b1c30]">Audit trail auto-generated.</strong> Every review decision is timestamped and stored for NACHA compliance and internal audit.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#003ec7]">→</span>
                <span><strong className="text-[#0b1c30]">Built for accounting firms.</strong> Multi-client support for firms managing AP across dozens of client books.</span>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#c3c5d9]/25 bg-[#f8f9ff] p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Related pages</p>
              <div className="mt-4 space-y-3">
                <Link href="/bec-fraud-prevention" className="flex items-center gap-2 text-sm font-semibold text-[#003ec7] hover:underline underline-offset-2">
                  <span>→</span> BEC fraud prevention
                </Link>
                <Link href="/vendor-fraud-detection-software" className="flex items-center gap-2 text-sm font-semibold text-[#003ec7] hover:underline underline-offset-2">
                  <span>→</span> Vendor fraud detection software
                </Link>
                <Link href="/nacha-2026-compliance" className="flex items-center gap-2 text-sm font-semibold text-[#003ec7] hover:underline underline-offset-2">
                  <span>→</span> NACHA 2026 compliance
                </Link>
                <Link href="/blog/bec-vs-vec-accounting-firms" className="flex items-center gap-2 text-sm font-semibold text-[#003ec7] hover:underline underline-offset-2">
                  <span>→</span> BEC vs. VEC: what finance teams need to know in 2026
                </Link>
                <Link href="/blog/vendor-bank-account-change-fraud" className="flex items-center gap-2 text-sm font-semibold text-[#003ec7] hover:underline underline-offset-2">
                  <span>→</span> Vendor bank account change fraud
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#eff4ff]">
        <div className="mx-auto max-w-4xl px-6 py-16 md:px-8 md:py-20">
          <h2 className="font-manrope text-3xl font-bold text-[#0b1c30]">Frequently asked questions</h2>
          <div className="mt-8 divide-y divide-[#c3c5d9]/25">
            {FAQ_ITEMS.map((item) => (
              <div key={item.q} className="py-6">
                <p className="font-manrope font-bold text-[#0b1c30]">{item.q}</p>
                <p className="mt-3 text-slate-700">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <div className="rounded-[2rem] bg-[#0b1c30] p-10 text-center">
          <h2 className="font-manrope text-3xl font-bold text-white">
            AP fraud prevention that catches what your controls miss
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Connect Vantirs to QuickBooks Online. Start reviewing live AP fraud signals before your next pay run.
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
          <p className="mt-5 text-xs text-slate-500">No IT setup · QuickBooks Online · NACHA 2026 audit trail</p>
        </div>
      </section>
    </MarketingSeoShell>
  )
}
