import type { Metadata } from 'next'
import Link from 'next/link'
import MarketingSeoShell from '@/components/MarketingSeoShell'

export const metadata: Metadata = {
  title: '7 Types of Accounts Payable Fraud (And Which Ones Slip Past Your Controls) | Vantirs',
  description:
    'Explore seven types of accounts payable fraud: how each works, why routine controls miss them, and how to detect ghost vendors, BEC, duplicate invoices, and more.',
  alternates: { canonical: '/blog/types-of-ap-fraud' },
}

export default function TypesOfApFraudPost() {
  return (
    <MarketingSeoShell>
      <article className="mx-auto max-w-4xl px-6 py-16 md:px-8 md:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">Blog</p>
        <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30]">
          7 types of accounts payable fraud (and which ones slip past your controls)
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-600">
          Understanding types of accounts payable fraud helps you tune detection—not just segregation of duties. Below, seven common schemes: how they work, how they slip through typical workflows, and how to spot them earlier.
        </p>

        <section className="mt-10">
          <h2 className="font-manrope text-2xl font-bold text-[#0b1c30]">1. Ghost vendors</h2>
          <p className="mt-3 text-slate-700">
            <strong className="text-[#0b1c30]">How it works:</strong> A fake vendor is created in the master file and paid like any legitimate supplier.
          </p>
          <p className="mt-3 text-slate-700">
            <strong className="text-[#0b1c30]">Why it slips through:</strong> If new vendor setup is lightly reviewed or one person can both create and approve, the scheme hides in volume.
          </p>
          <p className="mt-3 text-slate-700">
            <strong className="text-[#0b1c30]">How to detect:</strong> Look for vendors with no purchase history, odd naming patterns, duplicate addresses, or payments to individuals who should not receive firm funds.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-manrope text-2xl font-bold text-[#0b1c30]">2. Duplicate invoices</h2>
          <p className="mt-3 text-slate-700">
            <strong className="text-[#0b1c30]">How it works:</strong> The same invoice (or a near copy) is submitted twice—sometimes with a different bank account on the second pass.
          </p>
          <p className="mt-3 text-slate-700">
            <strong className="text-[#0b1c30]">Why it slips through:</strong> Basic amount matching passes; reviewers focus on vendor name, not invoice ID or bank detail deltas.
          </p>
          <p className="mt-3 text-slate-700">
            <strong className="text-[#0b1c30]">How to detect:</strong> Cross-check invoice numbers, dates, and amounts; flag duplicate pairs and any payee change between them.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-manrope text-2xl font-bold text-[#0b1c30]">3. Vendor impersonation</h2>
          <p className="mt-3 text-slate-700">
            <strong className="text-[#0b1c30]">How it works:</strong> An attacker poses as a known supplier via email or portal to redirect payment.
          </p>
          <p className="mt-3 text-slate-700">
            <strong className="text-[#0b1c30]">Why it slips through:</strong> The vendor record is “real”; only the contact path is wrong—something static approvals rarely test.
          </p>
          <p className="mt-3 text-slate-700">
            <strong className="text-[#0b1c30]">How to detect:</strong> Compare communication domains to historical threads; require out-of-band confirmation for bank updates.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-manrope text-2xl font-bold text-[#0b1c30]">4. Bank change fraud</h2>
          <p className="mt-3 text-slate-700">
            <strong className="text-[#0b1c30]">How it works:</strong> Fraudsters convince AP to send the next payment to a new account they control.
          </p>
          <p className="mt-3 text-slate-700">
            <strong className="text-[#0b1c30]">Why it slips through:</strong> Staff trust urgency and familiar branding; QBO stores the new details without questioning whether they match prior payee history.
          </p>
          <p className="mt-3 text-slate-700">
            <strong className="text-[#0b1c30]">How to detect:</strong> Fingerprint prior payments; alert when routing or account numbers diverge from established patterns.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-manrope text-2xl font-bold text-[#0b1c30]">5. Overbilling</h2>
          <p className="mt-3 text-slate-700">
            <strong className="text-[#0b1c30]">How it works:</strong> Invoices exceed contract rates, quantities, or agreed scope.
          </p>
          <p className="mt-3 text-slate-700">
            <strong className="text-[#0b1c30]">Why it slips through:</strong> AP matches to a PO header but not line-level pricing; busy approvers rubber-stamp.
          </p>
          <p className="mt-3 text-slate-700">
            <strong className="text-[#0b1c30]">How to detect:</strong> Three-way match, statistical sampling, and trend reviews on vendor spend versus prior periods.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-manrope text-2xl font-bold text-[#0b1c30]">6. Kickback schemes</h2>
          <p className="mt-3 text-slate-700">
            <strong className="text-[#0b1c30]">How it works:</strong> An insider steers business or inflated payments to a vendor who shares the benefit.
          </p>
          <p className="mt-3 text-slate-700">
            <strong className="text-[#0b1c30]">Why it slips through:</strong> Transactions look “authorized”; collusion defeats pure system controls.
          </p>
          <p className="mt-3 text-slate-700">
            <strong className="text-[#0b1c30]">How to detect:</strong> Rotation of duties, vendor analytics, whistleblower channels, and board-level review of related-party risk.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-manrope text-2xl font-bold text-[#0b1c30]">7. Business email compromise (BEC)</h2>
          <p className="mt-3 text-slate-700">
            <strong className="text-[#0b1c30]">How it works:</strong> Compromised or spoofed email drives fake payment instructions or fake invoices from what looks like leadership or a vendor.
          </p>
          <p className="mt-3 text-slate-700">
            <strong className="text-[#0b1c30]">Why it slips through:</strong> Email is trusted; MFA on mail does not prove message content. AP processes optimize for speed.
          </p>
          <p className="mt-3 text-slate-700">
            <strong className="text-[#0b1c30]">How to detect:</strong> Domain authentication signals, vendor fingerprinting, and payment holds on anomalous bank or invoice changes.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-manrope text-2xl font-bold text-[#0b1c30]">Build detection that matches the fraud type</h2>
          <p className="mt-3 text-slate-700">
            Layer policy with tooling: start from{' '}
            <Link href="/accounts-payable-fraud-prevention" className="font-semibold text-[#003ec7] underline-offset-2 hover:underline">
              accounts payable fraud prevention
            </Link>{' '}
            practices, then add continuous monitoring on top of your stack. For a concise rollout path, see{' '}
            <Link href="/prevent" className="font-semibold text-[#003ec7] underline-offset-2 hover:underline">
              prevent
            </Link>{' '}
            —our hub for stopping payment fraud before funds leave.
          </p>
        </section>

        <section className="mt-10 rounded-[2rem] bg-[#eff4ff] p-8 ring-1 ring-[#c3c5d9]/15">
          <h2 className="font-manrope text-2xl font-bold text-[#0b1c30]">Stop AP fraud before it clears</h2>
          <p className="mt-3 text-slate-700">
            Pair education on fraud types with prevention workflows and invoice-level detection so your controls match how attackers actually behave.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/accounts-payable-fraud-prevention" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
              AP fraud prevention
            </Link>
            <Link href="/prevent" className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-semibold text-[#003ec7] ring-1 ring-[#c3c5d9]/20 hover:bg-[#f8f9ff]">
              Prevention hub
            </Link>
          </div>
        </section>
      </article>
    </MarketingSeoShell>
  )
}
