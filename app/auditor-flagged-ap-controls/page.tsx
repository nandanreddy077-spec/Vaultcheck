import Link from 'next/link'
import { ArrowRight, CheckCircle, FileText, Shield, Clock } from 'lucide-react'
import VantirsLogo from '@/components/VantirsLogo'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Auditor Flagged Your AP Controls? Fix It Fast | Vantirs',
  description:
    'If your external auditor identified vendor verification as a control gap, Vantirs gives you a documented, auditable AP fraud prevention process in 10 minutes — not weeks.',
}

export default function AuditorFlaggedPage() {
  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      <header className="fixed top-0 z-50 w-full border-b border-transparent bg-[#f8f9ff]/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <VantirsLogo href="/" className="inline-flex items-center" imageClassName="h-9 w-auto" width={160} height={54} />
          <Link href="/signup" className="btn-primary-gradient text-sm px-5 py-2.5">Fix it in 10 minutes</Link>
        </nav>
      </header>

      <main className="pt-28">
        {/* Hero */}
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_400px_at_50%_-5%,#dce9ff_0%,transparent_60%)]" />
          <div className="relative mx-auto max-w-3xl px-6 text-center md:px-8">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#e5eeff] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#003ec7]">
              <FileText className="h-3 w-3" />
              Auditor Remediation
            </div>
            <h1 className="font-manrope text-4xl font-extrabold leading-tight text-[#0b1c30] md:text-5xl">
              Your auditor flagged AP controls.{' '}
              <span className="text-[#003ec7]">Here is how to fix it — fast.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              Vendor bank account verification is now a standard audit question for CPA firms. Vantirs gives
              you a documented, automated control that satisfies auditors, E&O carriers, and NACHA 2026 —
              live in 10 minutes, no IT ticket required.
            </p>
            <Link href="/signup" className="btn-primary-gradient mt-8 inline-flex items-center gap-2 px-10 py-4 text-base font-semibold">
              Get compliant now <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-4 text-sm text-slate-400">No credit card required · 30-day free trial</p>
          </div>
        </section>

        {/* What auditors are actually asking */}
        <section className="bg-[#eff4ff] py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-6 md:px-8">
            <div className="mb-12 text-center">
              <h2 className="font-manrope text-3xl font-bold text-[#0b1c30]">What auditors are asking — and how Vantirs answers</h2>
              <p className="mt-3 text-slate-600">The exact questions being raised in AP control reviews right now.</p>
            </div>
            <div className="space-y-4">
              {[
                {
                  q: 'Do you have a documented process for verifying vendor bank account details before ACH payments?',
                  a: 'Yes. Vantirs automatically checks every invoice against the vendor\'s payment history in QuickBooks. Any bank account that differs from prior payments triggers an alert and requires explicit approval.',
                  proof: 'Audit trail: every invoice has a scan record with risk score, checks performed, and approver.',
                },
                {
                  q: 'How do you detect when a vendor\'s payment details have been changed by a third party?',
                  a: 'Vantirs hashes and stores known bank accounts per vendor. Any invoice with a different bank account hash is flagged as high-risk before payment — not after.',
                  proof: 'Exportable report showing all bank account change detections and resolution decisions.',
                },
                {
                  q: 'What controls exist for first-time vendor payments?',
                  a: 'New vendors with no payment history are automatically flagged for explicit review. No payment goes through without a documented approval from your team.',
                  proof: 'New vendor queue with approval timestamps, accessible in the dashboard and exportable.',
                },
                {
                  q: 'How do you comply with NACHA 2026 account validation requirements?',
                  a: 'Vantirs validates bank account details against your own QuickBooks payment history — no separate vendor portal or manual outreach required. Every validation is logged with a timestamp.',
                  proof: 'NACHA compliance report available for every invoice processed through Vantirs.',
                },
              ].map(item => (
                <div key={item.q} className="rounded-2xl bg-white p-7 shadow-[0_4px_20px_rgba(11,28,48,0.06)] ring-1 ring-[#c3c5d9]/15">
                  <p className="mb-4 text-sm font-semibold text-[#0b1c30] before:mr-2 before:text-[#003ec7] before:content-['Q:']">{item.q}</p>
                  <p className="mb-4 text-sm leading-relaxed text-slate-600 before:mr-2 before:font-bold before:text-[#0d5c2e] before:content-['A:']">{item.a}</p>
                  <div className="flex items-start gap-2 rounded-lg bg-[#eff4ff] px-4 py-3">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[#003ec7]" />
                    <p className="text-xs font-medium text-[#003ec7]">{item.proof}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* From flagged to fixed */}
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-6 md:px-8">
            <div className="mb-12 text-center">
              <h2 className="font-manrope text-3xl font-bold text-[#0b1c30]">From flagged to fixed in one afternoon</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  step: '1',
                  time: '5 minutes',
                  icon: <Clock className="h-6 w-6 text-[#003ec7]" />,
                  title: 'Connect QuickBooks',
                  desc: 'OAuth flow — one click, no IT ticket. Vantirs pulls your vendor history and starts building fingerprints immediately.',
                },
                {
                  step: '2',
                  time: '10 minutes',
                  icon: <Shield className="h-6 w-6 text-[#003ec7]" />,
                  title: 'Review your risk profile',
                  desc: 'See which vendors have anomaly signals, which invoices are flagged, and your overall AP risk score across all clients.',
                },
                {
                  step: '3',
                  time: 'Ongoing',
                  icon: <FileText className="h-6 w-6 text-[#003ec7]" />,
                  title: 'Export your audit documentation',
                  desc: 'Every invoice scan is logged. Export a compliance report showing your vendor verification controls — ready for your next audit.',
                },
              ].map(item => (
                <div key={item.step} className="rounded-2xl bg-[#eff4ff] p-7 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                    {item.icon}
                  </div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#003ec7]">{item.time}</p>
                  <h3 className="font-manrope text-lg font-bold text-[#0b1c30] mb-2">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What you get to show the auditor */}
        <section className="bg-[#0b1c30] py-16 md:py-20">
          <div className="mx-auto max-w-3xl px-6 md:px-8">
            <h2 className="mb-10 text-center font-manrope text-3xl font-bold text-white">What you hand the auditor</h2>
            <ul className="space-y-4">
              {[
                'Per-invoice scan records with risk score, factors checked, and timestamp',
                'Vendor fingerprint history — known bank accounts, email domains, payment patterns',
                'Alert log showing every flag, who reviewed it, and their decision',
                'Bank account change detection log — every instance caught before payment',
                'New vendor review queue with approval timestamps',
                'Exportable PDF compliance report for the engagement period',
              ].map(item => (
                <li key={item} className="flex items-start gap-3 text-white/80">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#4ade80]" />
                  <span className="text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 text-center">
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-xl bg-white px-10 py-4 text-base font-bold text-[#0b1c30] hover:bg-[#eff4ff] transition">
                Start free trial <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-4 text-sm text-white/40">Live in 10 minutes · No credit card required</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
