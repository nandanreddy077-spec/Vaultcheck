import Link from 'next/link'
import { ArrowRight, CheckCircle, Shield, AlertTriangle, FileText } from 'lucide-react'
import VantirsLogo from '@/components/VantirsLogo'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'E&O / Cyber Insurance Renewal & AP Fraud Controls | Vantirs',
  description:
    'Your E&O and cyber insurer is now asking about vendor bank account verification. Vantirs gives you a documented, automated control that satisfies carriers — live in 10 minutes.',
}

export default function InsuranceRenewalPage() {
  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      <header className="fixed top-0 z-50 w-full border-b border-transparent bg-[#f8f9ff]/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <VantirsLogo href="/" className="inline-flex items-center" imageClassName="h-9 w-auto" width={160} height={54} />
          <Link href="/signup" className="btn-primary-gradient text-sm px-5 py-2.5">Get protected now</Link>
        </nav>
      </header>

      <main className="pt-28">
        {/* Hero */}
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_400px_at_50%_-5%,#dce9ff_0%,transparent_60%)]" />
          <div className="relative mx-auto max-w-3xl px-6 text-center md:px-8">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#e5eeff] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#003ec7]">
              <Shield className="h-3 w-3" />
              Insurance Renewal
            </div>
            <h1 className="font-manrope text-4xl font-extrabold leading-tight text-[#0b1c30] md:text-5xl">
              Your insurer is about to ask about{' '}
              <span className="text-[#003ec7]">vendor bank verification.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              E&O and cyber insurance carriers are tightening requirements for accounting firms. A spreadsheet
              answer is no longer enough. Vantirs gives you an automated, documented control that satisfies
              underwriters — and makes your renewal conversation very short.
            </p>
            <Link href="/signup" className="btn-primary-gradient mt-8 inline-flex items-center gap-2 px-10 py-4 text-base font-semibold">
              Get compliant before renewal <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-4 text-sm text-slate-400">No credit card required · Live in 10 minutes</p>
          </div>
        </section>

        {/* What carriers are asking */}
        <section className="bg-[#eff4ff] py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-6 md:px-8">
            <div className="mb-12 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7] mb-2">What underwriters want to know</p>
              <h2 className="font-manrope text-3xl font-bold text-[#0b1c30]">The questions on your renewal application — answered</h2>
            </div>
            <div className="space-y-4">
              {[
                {
                  question: '"What is your process for validating vendor bank account changes before payment?"',
                  bad: 'We email the vendor to confirm (manual, no audit trail, easy to spoof)',
                  good: 'Vantirs automatically compares every invoice\'s bank details against our QuickBooks payment history and flags mismatches before payment. Every check is logged.',
                },
                {
                  question: '"How do you verify that a new vendor is legitimate before your first payment?"',
                  bad: 'We search online and use judgment (undocumented, inconsistent)',
                  good: 'All first-time vendors are automatically held in a review queue. No payment proceeds without an explicit documented approval.',
                },
                {
                  question: '"Do you have controls to detect BEC / business email compromise targeting your AP process?"',
                  bad: 'We train staff to look for suspicious emails (no automated detection)',
                  good: 'Vantirs flags email domains that don\'t match a vendor\'s known email history, including look-alike domains. Every flag requires review before payment.',
                },
                {
                  question: '"Can you provide documentation of your AP fraud prevention controls for the past 12 months?"',
                  bad: 'We would have to reconstruct this from emails and spreadsheets',
                  good: 'Vantirs generates an exportable compliance report covering every invoice, scan result, flag, and resolution decision for any date range.',
                },
              ].map(item => (
                <div key={item.question} className="rounded-2xl bg-white p-7 shadow-[0_4px_20px_rgba(11,28,48,0.06)]">
                  <p className="mb-5 text-sm font-bold italic text-[#0b1c30]">{item.question}</p>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl bg-[#fce4e4]/40 p-4">
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#dc2626]">Most firms answer</p>
                      <p className="text-xs leading-relaxed text-slate-600">{item.bad}</p>
                    </div>
                    <div className="rounded-xl bg-[#dcfce7]/40 p-4">
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#16a34a]">With Vantirs</p>
                      <p className="text-xs leading-relaxed text-slate-700">{item.good}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why this matters for premiums */}
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-6 md:px-8">
            <div className="mb-12 text-center">
              <h2 className="font-manrope text-3xl font-bold text-[#0b1c30]">Why AP fraud controls affect your premium</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: <AlertTriangle className="h-7 w-7 text-[#a94900]" />,
                  title: 'BEC claims are the #1 driver of E&O losses',
                  desc: 'Business email compromise targeting accounting firm AP processes has become the largest single category of professional liability claims. Underwriters know this.',
                },
                {
                  icon: <FileText className="h-7 w-7 text-[#003ec7]" />,
                  title: 'Documentation is now required, not optional',
                  desc: 'Carriers are moving from "do you have a process?" to "show us your documented controls." Verbal policies and spreadsheets no longer satisfy underwriting requirements.',
                },
                {
                  icon: <Shield className="h-7 w-7 text-[#0d5c2e]" />,
                  title: 'Automated controls get better rates',
                  desc: 'Firms with technology-based AP controls — versus manual review — are demonstrating lower risk profiles. Some carriers are offering premium credits for documented automated controls.',
                },
              ].map(item => (
                <div key={item.title} className="rounded-2xl bg-[#f8f9ff] p-7 ring-1 ring-[#c3c5d9]/15">
                  <div className="mb-4">{item.icon}</div>
                  <h3 className="font-manrope text-base font-bold text-[#0b1c30] mb-2">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What you give your carrier */}
        <section className="bg-[#0b1c30] py-16 md:py-20">
          <div className="mx-auto max-w-3xl px-6 md:px-8">
            <h2 className="mb-10 text-center font-manrope text-3xl font-bold text-white">
              What you send your carrier with Vantirs
            </h2>
            <ul className="space-y-4">
              {[
                'Automated vendor bank account verification on every invoice — logged and timestamped',
                'Documented approval workflow for all high-risk and first-time vendor payments',
                'Alert history showing every detected anomaly and resolution',
                'Exportable compliance report for any time period in PDF or CSV',
                'NACHA 2026 account validation compliance documentation',
                'Bank account change detection log — every catch, before payment went out',
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
