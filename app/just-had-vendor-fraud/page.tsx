import Link from 'next/link'
import { AlertTriangle, ArrowRight, CheckCircle, Clock, Phone, Shield } from 'lucide-react'
import VantirsLogo from '@/components/VantirsLogo'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Just Had a Vendor Fraud Incident? Here\'s What to Do | Vantirs',
  description:
    'If your firm just experienced vendor payment fraud or a BEC attack, here are the immediate steps to take — and how to make sure it never happens again.',
}

export default function JustHadVendorFraudPage() {
  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      <header className="fixed top-0 z-50 w-full border-b border-transparent bg-[#f8f9ff]/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <VantirsLogo href="/" className="inline-flex items-center" imageClassName="h-9 w-auto" width={160} height={54} />
          <Link href="/signup" className="btn-primary-gradient text-sm px-5 py-2.5">Get protected now</Link>
        </nav>
      </header>

      <main className="pt-28">
        {/* Hero — empathetic, urgent */}
        <section className="relative overflow-hidden py-16 md:py-24 bg-[#0b1c30]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_400px_at_50%_-5%,#ba1a1a20_0%,transparent_60%)]" />
          <div className="relative mx-auto max-w-3xl px-6 text-center md:px-8">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#ffdad6]/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff8a80]">
              <AlertTriangle className="h-3 w-3" />
              Fraud Incident Response
            </div>
            <h1 className="font-manrope text-4xl font-extrabold leading-tight text-white md:text-5xl">
              You just had a vendor fraud incident.{' '}
              <span className="text-[#ff8a80]">Here is what to do right now.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              Payment fraud recovery rates average 22%. Every hour matters. Follow these steps immediately,
              then get the controls in place so it never happens to another client.
            </p>
          </div>
        </section>

        {/* Immediate action timeline */}
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-3xl px-6 md:px-8">
            <div className="mb-4 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ba1a1a]">Do this in the next 4 hours</p>
              <h2 className="mt-2 font-manrope text-3xl font-bold text-[#0b1c30]">Immediate response checklist</h2>
            </div>
            <div className="mt-10 space-y-4">
              {[
                {
                  time: 'Right now',
                  color: 'bg-[#ba1a1a]',
                  title: 'Call your bank — request a wire recall',
                  desc: 'If the payment was a wire transfer, call your bank immediately. Wire recalls must be initiated within hours. ACH payments can sometimes be reversed within 24 hours. Have your transaction number ready.',
                  icon: <Phone className="h-4 w-4 text-white" />,
                },
                {
                  time: 'Within 1 hour',
                  color: 'bg-[#a94900]',
                  title: 'File an IC3 report',
                  desc: 'Report the fraud to the FBI\'s Internet Crime Complaint Center at ic3.gov. This creates an official record and sometimes triggers a Financial Fraud Kill Chain if the funds are still in transit.',
                  icon: <AlertTriangle className="h-4 w-4 text-white" />,
                },
                {
                  time: 'Within 2 hours',
                  color: 'bg-[#565e74]',
                  title: 'Notify the real vendor',
                  desc: 'Call the legitimate vendor using a phone number from your records — not from any recent emails. Confirm their actual bank details. Determine if they sent the invoice or if it was spoofed.',
                  icon: <Phone className="h-4 w-4 text-white" />,
                },
                {
                  time: 'Within 4 hours',
                  color: 'bg-[#003ec7]',
                  title: 'Document everything for insurance',
                  desc: 'Preserve all emails, invoices, and payment confirmations. Your E&O or cyber insurance carrier will require a detailed incident report. The more documentation you have, the stronger your claim.',
                  icon: <Clock className="h-4 w-4 text-white" />,
                },
                {
                  time: 'This week',
                  color: 'bg-[#0d5c2e]',
                  title: 'Notify affected clients and legal counsel',
                  desc: 'Depending on your engagement scope, you may have a duty to notify clients. Loop in your attorney before sending any communications — what you say now will matter if there is litigation.',
                  icon: <CheckCircle className="h-4 w-4 text-white" />,
                },
              ].map(step => (
                <div key={step.title} className="flex gap-5 rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(11,28,48,0.06)] ring-1 ring-[#c3c5d9]/15">
                  <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${step.color}`}>
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{step.time}</span>
                      <h3 className="font-manrope text-base font-bold text-[#0b1c30]">{step.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it happened + how Vantirs prevents it */}
        <section className="bg-[#eff4ff] py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-6 md:px-8">
            <div className="mb-12 text-center">
              <h2 className="font-manrope text-3xl font-bold text-[#0b1c30]">What most firms miss until it is too late</h2>
              <p className="mt-3 text-slate-600">The three most common attack patterns — and the signals Vantirs would have flagged.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  attack: 'Bank account substitution',
                  how: 'Fraudster impersonates vendor, sends invoice with new routing + account number. Looks identical to real invoices.',
                  signal: 'Vantirs flags any bank account hash that does not match prior payments to that vendor — before payment.',
                },
                {
                  attack: 'Email domain spoofing',
                  how: 'Invoice arrives from vendor-name@companv.com (note the typo) or a look-alike domain registered days earlier.',
                  signal: "Vantirs checks sender domain against vendor's known email history and flags domains that don't match.",
                },
                {
                  attack: 'New vendor urgency',
                  how: 'First invoice from a vendor, often with "urgent payment needed" language and a tight deadline.',
                  signal: 'All first-time vendors are automatically flagged for explicit review — no payment history means no automatic trust.',
                },
              ].map(item => (
                <div key={item.attack} className="rounded-2xl bg-white p-7 shadow-[0_4px_20px_rgba(11,28,48,0.06)]">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-[#ba1a1a]">Attack pattern</p>
                  <h3 className="font-manrope text-base font-bold text-[#0b1c30] mb-2">{item.attack}</h3>
                  <p className="text-xs leading-relaxed text-slate-500 mb-4">{item.how}</p>
                  <div className="rounded-lg bg-[#eff4ff] p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#003ec7] mb-1">Vantirs signal</p>
                    <p className="text-xs leading-relaxed text-[#0b1c30]">{item.signal}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA — urgency */}
        <section className="py-16 md:py-20 px-6 md:px-8">
          <div className="relative mx-auto max-w-3xl overflow-hidden rounded-[2rem] bg-[#0b1c30] px-8 py-16 text-center">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#003ec7]/25 blur-[80px]" />
            <div className="relative z-10 space-y-5">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h2 className="font-manrope text-3xl font-extrabold text-white">
                Get protected in 10 minutes
              </h2>
              <p className="mx-auto max-w-md text-white/70">
                Connect QuickBooks. Vantirs scans your vendor history and flags every future invoice before payment.
                No vendor portal, no IT setup, no waiting.
              </p>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link href="/signup" className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-[#0b1c30] hover:bg-[#eff4ff] transition">
                  Start free trial <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/guarantee" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition">
                  See $10K guarantee
                </Link>
              </div>
              <p className="text-sm text-white/40">No credit card required · Live in 10 minutes</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
