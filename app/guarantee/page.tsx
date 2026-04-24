import Link from 'next/link'
import { Shield, CheckCircle, XCircle, ArrowRight, AlertTriangle } from 'lucide-react'
import VantirsLogo from '@/components/VantirsLogo'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '$10,000 Fraud Guarantee | Vantirs',
  description:
    'If Vantirs misses a fraud signal it should have caught from your QuickBooks history, we credit your subscription — up to $10,000. No other vendor verification tool offers this.',
}

export default function GuaranteePage() {
  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      <header className="fixed top-0 z-50 w-full border-b border-transparent bg-[#f8f9ff]/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <VantirsLogo href="/" className="inline-flex items-center" imageClassName="h-9 w-auto" width={160} height={54} />
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-[#0b1c30]">Sign in</Link>
            <Link href="/signup" className="btn-primary-gradient text-sm px-5 py-2.5">Start free trial</Link>
          </div>
        </nav>
      </header>

      <main className="pt-28">
        {/* Hero */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_400px_at_50%_-5%,#dce9ff_0%,transparent_60%)]" />
          <div className="relative mx-auto max-w-3xl px-6 text-center md:px-8">
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#003ec7] shadow-[0_12px_40px_rgba(0,62,199,0.3)]">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#e5eeff] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#003ec7]">
              Fraud Prevention Guarantee
            </div>
            <h1 className="font-manrope text-4xl font-extrabold leading-tight tracking-tight text-[#0b1c30] md:text-5xl">
              We back our detection with{' '}
              <span className="text-[#003ec7]">$10,000</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              If Vantirs scans an invoice, gives it a low-risk score, and that payment turns out to be
              fraudulent — we credit your account. Up to $10,000. No other vendor verification tool at
              our price point offers this.
            </p>
            <Link href="/signup" className="btn-primary-gradient mt-8 inline-flex px-10 py-4 text-base font-semibold">
              Start free trial — guarantee included
            </Link>
            <p className="mt-4 text-sm text-slate-400">No credit card required · Guarantee activates after trial</p>
          </div>
        </section>

        {/* How the guarantee works */}
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-6 md:px-8">
            <h2 className="mb-12 text-center font-manrope text-3xl font-bold text-[#0b1c30]">How it works</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  step: '01',
                  title: 'Vantirs scans the invoice',
                  desc: 'Every invoice from your QuickBooks sync is automatically scored against your vendor history — bank accounts, email domains, amounts, patterns.',
                },
                {
                  step: '02',
                  title: 'Your team approves it',
                  desc: 'Vantirs gives a low-risk score. You review it in your alert queue and approve the payment. The approval is logged with a timestamp.',
                },
                {
                  step: '03',
                  title: 'If it turns out to be fraud',
                  desc: 'Contact us within 30 days of discovering the fraud. We review the scan record. If our signal should have caught it, we credit your subscription — up to $10,000.',
                },
              ].map(item => (
                <div key={item.step} className="rounded-2xl bg-white p-8 shadow-[0_4px_20px_rgba(11,28,48,0.06)] ring-1 ring-[#c3c5d9]/15">
                  <p className="mb-4 font-manrope text-3xl font-extrabold text-[#003ec7]/20">{item.step}</p>
                  <h3 className="mb-3 font-manrope text-lg font-bold text-[#0b1c30]">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What's covered / not covered */}
        <section className="bg-[#eff4ff] py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-6 md:px-8">
            <h2 className="mb-12 text-center font-manrope text-3xl font-bold text-[#0b1c30]">What the guarantee covers</h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl bg-white p-8 shadow-[0_4px_20px_rgba(11,28,48,0.06)]">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dcfce7]">
                    <CheckCircle className="h-5 w-5 text-[#16a34a]" />
                  </div>
                  <h3 className="font-manrope text-lg font-bold text-[#0b1c30]">Covered</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    'Invoice was scanned by Vantirs and scored low-risk (0–35)',
                    'Payment was made after your team approved the Vantirs-reviewed invoice',
                    'Fraud type is bank account substitution, email spoofing, or vendor impersonation',
                    'Fraud reported within 30 days of discovery',
                    'Your QuickBooks was connected and synced at time of scan',
                    'You are on an active paid Vantirs plan',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#16a34a]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-white p-8 shadow-[0_4px_20px_rgba(11,28,48,0.06)]">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fce4e4]">
                    <XCircle className="h-5 w-5 text-[#dc2626]" />
                  </div>
                  <h3 className="font-manrope text-lg font-bold text-[#0b1c30]">Not covered</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    'Invoice was flagged high or critical risk by Vantirs and paid anyway',
                    'Invoice was not synced or scanned before payment',
                    'QuickBooks disconnected or sync was overdue at time of payment',
                    'Internal theft or employee fraud (outside vendor verification scope)',
                    'Fraud reported more than 30 days after discovery',
                    'Trial period — guarantee activates on first paid month',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#dc2626]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-3xl px-6 md:px-8">
            <h2 className="mb-12 text-center font-manrope text-3xl font-bold text-[#0b1c30]">Common questions</h2>
            <div className="space-y-6">
              {[
                {
                  q: 'Is this real or just marketing?',
                  a: "It's real. If Vantirs scores an invoice as low-risk and that invoice turns out to be fraudulent for a reason our scanner should have detected — bank account mismatch, email domain anomaly, amount outlier — we credit your account. The full terms are in our Terms of Service.",
                },
                {
                  q: 'What does "credit your account" mean exactly?',
                  a: 'We apply a credit equal to your subscription fee for up to 12 months, capped at $10,000. It applies to future billing cycles. This is a subscription credit, not a wire transfer.',
                },
                {
                  q: 'Why does the guarantee start after the trial?',
                  a: "During the 30-day trial, Vantirs is building your vendor fingerprints from scratch. The first sync gives us your history but some signals need more data to be reliable. We don't want to make a guarantee before our detection is fully calibrated for your specific vendor set.",
                },
                {
                  q: "What if Vantirs flagged it as high-risk but my team approved it anyway?",
                  a: "The guarantee doesn't cover payments made against Vantirs recommendations. If Vantirs said high-risk and your team overrode it, that's a human decision — the tool did its job. The audit log records every decision exactly for this reason.",
                },
                {
                  q: 'How do I make a claim?',
                  a: 'Email support@vantirs.com with your invoice ID, the Vantirs scan record, and your fraud documentation (police report or bank dispute confirmation). We review within 5 business days.',
                },
              ].map(item => (
                <div key={item.q} className="rounded-2xl bg-[#f8f9ff] p-7 ring-1 ring-[#c3c5d9]/15">
                  <h3 className="font-manrope text-base font-bold text-[#0b1c30]">{item.q}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-16 md:px-8 md:py-20">
          <div className="relative mx-auto max-w-3xl overflow-hidden rounded-[2rem] bg-[#0b1c30] px-8 py-16 text-center">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#003ec7]/25 blur-[80px]" />
            <div className="relative z-10 space-y-5">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h2 className="font-manrope text-3xl font-extrabold text-white">
                Protected from day one
              </h2>
              <p className="mx-auto max-w-md text-white/70">
                Start your 30-day free trial. The $10,000 guarantee activates the moment your first paid invoice is billed.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-10 py-4 text-base font-bold text-[#0b1c30] transition hover:bg-[#eff4ff]"
              >
                Start free trial <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="text-sm text-white/40">No credit card required</p>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="pb-12">
          <p className="mx-auto max-w-2xl px-6 text-center text-xs leading-relaxed text-slate-400">
            The Vantirs Fraud Prevention Guarantee is a subscription credit program, not insurance. Full terms
            available in our{' '}
            <Link href="/terms" className="underline hover:text-slate-600">Terms of Service</Link>.
            Vantirs does not guarantee detection of all fraud types. Always verify suspicious payments through
            direct phone contact with known vendor numbers regardless of risk score.
          </p>
        </section>

        <footer className="border-t border-[#c3c5d9]/15 bg-[#f8f9ff] py-10">
          <p className="text-center text-xs text-slate-400">
            © {new Date().getFullYear()} Vantirs. All rights reserved.{' '}
            <Link href="/privacy" className="hover:text-slate-600">Privacy</Link>{' · '}
            <Link href="/terms" className="hover:text-slate-600">Terms</Link>
          </p>
        </footer>
      </main>
    </div>
  )
}
