import type { Metadata } from 'next'
import Link from 'next/link'
import MarketingSeoShell from '@/components/MarketingSeoShell'

export const metadata: Metadata = {
  title: 'Why Your Accounting Firm Needs Vendor Fraud Insurance (And Prevention) | Vantirs',
  description:
    'Understand accounting firm fraud liability: E&O exposure when client funds go to fraudsters, insurance gaps, and why prevention costs less than claims.',
  alternates: { canonical: '/blog/vendor-fraud-insurance' },
}

export default function VendorFraudInsurancePost() {
  return (
    <MarketingSeoShell>
      <article className="mx-auto max-w-4xl px-6 py-16 md:px-8 md:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">Blog</p>
        <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30]">
          Why your accounting firm needs vendor fraud insurance (and prevention)
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-600">
          When a client’s payment is diverted to a fraudster, conversations quickly turn to accounting firm fraud liability—not just cybersecurity. Insurance can help, but policies have limits. Prevention reduces frequency and severity in ways renewals alone cannot.
        </p>

        <section className="mt-10">
          <h2 className="font-manrope text-2xl font-bold text-[#0b1c30]">E&O exposure when client payments go to fraudsters</h2>
          <p className="mt-3 text-slate-700">
            Firms that touch AP workflows, approve bills, or manage vendor updates may face claims that professional standards were not met—especially if a bank change was processed without reasonable verification. Even when the firm followed internal policy, plaintiffs may argue the policy was insufficient for known BEC risk.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
            <li>Allegations of negligent supervision of client funds or vendor master data</li>
            <li>Disputes over who “owned” the verification step between client staff and firm</li>
            <li>Reputational harm that outlasts a single engagement</li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="font-manrope text-2xl font-bold text-[#0b1c30]">Where insurance coverage often falls short</h2>
          <p className="mt-3 text-slate-700">
            Crime, cyber, and E&O policies each cover different failure modes. Vendor fraud losses may sit in a gray area: social engineering is not always “hacking,” and professional liability may exclude certain payment-processing acts unless endorsed.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
            <li>Sub-limits or exclusions for voluntary payments induced by fraud</li>
            <li>Retention and premium impacts after a claim—even when payout is partial</li>
            <li>Client relationships that do not survive the claims process</li>
          </ul>
          <p className="mt-4 text-slate-700">
            Insurance belongs in the stack—but not as the only control. See how firms like yours structure risk on our{' '}
            <Link href="/for-accounting-firms" className="font-semibold text-[#003ec7] underline-offset-2 hover:underline">
              accounting firms
            </Link>{' '}
            page.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-manrope text-2xl font-bold text-[#0b1c30]">Why prevention is cheaper than claims</h2>
          <p className="mt-3 text-slate-700">
            The fully loaded cost of a vendor fraud incident includes client make-goods, legal fees, carrier negotiations, staff time, and lost referrals. A disciplined prevention program—verification workflows, anomaly detection, and documented approvals—reduces incident rate and strengthens underwriting posture.
          </p>
          <p className="mt-4 text-slate-700">
            Quantify the upside with our{' '}
            <Link href="/roi-calculator" className="font-semibold text-[#003ec7] underline-offset-2 hover:underline">
              ROI calculator
            </Link>
            : model time saved versus loss avoided when high-risk payments are caught upstream.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-manrope text-2xl font-bold text-[#0b1c30]">A practical split: insure residual risk, prevent the rest</h2>
          <p className="mt-3 text-slate-700">
            Carry appropriate professional and crime coverage with your broker. In parallel, implement vendor fingerprinting, bank-change holds, and invoice anomaly alerts so the most common attack paths never mature into claims. Underwriters increasingly ask what you do before the wire—not only after.
          </p>
        </section>

        <section className="mt-10 rounded-[2rem] bg-[#eff4ff] p-8 ring-1 ring-[#c3c5d9]/15">
          <h2 className="font-manrope text-2xl font-bold text-[#0b1c30]">Pair insurance with prevention</h2>
          <p className="mt-3 text-slate-700">
            Protect client cash and firm reputation with controls designed for accounting workflows—not generic IT checklists.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/for-accounting-firms" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
              For accounting firms
            </Link>
            <Link href="/roi-calculator" className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-semibold text-[#003ec7] ring-1 ring-[#c3c5d9]/20 hover:bg-[#f8f9ff]">
              ROI calculator
            </Link>
          </div>
        </section>
      </article>
    </MarketingSeoShell>
  )
}
