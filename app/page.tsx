import Link from 'next/link'
import {
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Lock,
  ArrowRight,
  Receipt,
  Zap,
  Bell,
  BarChart3,
  Star,
  Shield,
} from 'lucide-react'
import VantirsLogo from '@/components/VantirsLogo'
import PricingSection from '@/components/PricingSection'
import ExitIntentPopup from '@/components/ExitIntentPopup'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--surface)] text-[#0b1c30]">
      {/* Nav — Trustpair-style: airy, anchor links */}
      <header className="fixed top-0 z-50 w-full border-b border-transparent bg-[#f8f9ff]/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <VantirsLogo href="/" className="inline-flex items-center" imageClassName="h-9 w-auto" width={160} height={54} />
          <div className="hidden items-center gap-10 md:flex">
            <a href="/quickbooks-fraud-prevention" className="text-sm font-medium text-slate-600 transition-colors hover:text-[#003ec7]">
              Platform
            </a>
            <a href="/how-it-works" className="text-sm font-medium text-slate-600 transition-colors hover:text-[#003ec7]">
              How it works
            </a>
            <a href="/pricing" className="text-sm font-medium text-slate-600 transition-colors hover:text-[#003ec7]">
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-[#0b1c30]">
              Sign in
            </Link>
            <Link href="/signup" className="btn-primary-gradient text-sm px-5 py-2.5">
              Start free trial
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero — split layout + product preview (stitch-inspired) */}
        <section className="relative overflow-hidden pt-28 pb-16 md:pb-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_480px_at_15%_-10%,#dce9ff_0%,transparent_55%),radial-gradient(700px_400px_at_90%_20%,#e5eeff_0%,transparent_50%)]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#e5eeff]/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#434656]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#003ec7]" aria-hidden />
                NACHA 2026 compliant · Built for accounting firms
              </div>
              <h1 className="font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30] md:text-5xl lg:text-[3.25rem]">
                Vendor fraud protection.{' '}
                <span className="text-[#003ec7]">Live in 10 minutes.</span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-slate-600">
                We verify vendors from your QuickBooks history — no vendor portal, no IT setup, no sales call.
                Every invoice scored, every bank account change flagged, before money leaves the account.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/signup" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
                  Start free — no credit card
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#dce9ff]/80 px-8 py-4 text-base font-semibold text-[#003ec7] transition-colors hover:bg-[#d3e4fe]"
                >
                  Sign in
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <p className="text-sm text-slate-400">Free plan available · No credit card · Upgrade anytime</p>
              </div>

              {/* Differentiators */}
              <div className="flex flex-wrap items-center gap-8 border-t border-[#c3c5d9]/20 pt-8">
                <div>
                  <p className="font-manrope text-2xl font-bold text-[#0b1c30]">10 min</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">To go live</p>
                </div>
                <div className="hidden h-10 w-px bg-[#c3c5d9]/25 sm:block" />
                <div>
                  <p className="font-manrope text-2xl font-bold text-[#0b1c30]">No portal</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">Vendors do nothing</p>
                </div>
                <div className="hidden h-10 w-px bg-[#c3c5d9]/25 sm:block" />
                <div>
                  <p className="font-manrope text-2xl font-bold text-[#0b1c30]">NACHA 2026</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">Ready now</p>
                </div>
              </div>
            </div>

            {/* Product mock — invoice + alert (from stitch) */}
            <div className="relative lg:justify-self-end">
              <div className="absolute -inset-6 rounded-[2rem] bg-[#003ec7]/[0.06] blur-3xl" aria-hidden />
              <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_12px_40px_rgba(11,28,48,0.08)] ring-1 ring-[#c3c5d9]/15">
                <div className="mb-6 flex items-center justify-between border-b border-[#c3c5d9]/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eff4ff] text-[#003ec7]">
                      <Receipt className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0b1c30]">Invoice #INV-2024-082</p>
                      <p className="text-[10px] text-slate-500">Summit Ridge Services LLC</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#ffdad6] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#93000a]">
                    Critical
                  </span>
                </div>
                <div className="space-y-5">
                  <div className="rounded-xl bg-[#eff4ff] p-4 pl-4 ring-1 ring-[#ba1a1a]/20" style={{ borderLeftWidth: 4, borderLeftColor: '#ba1a1a' }}>
                    <div className="flex gap-3">
                      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#ba1a1a]" />
                      <div>
                        <p className="text-sm font-bold text-[#0b1c30]">Bank mismatch detected</p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-600">
                          Beneficiary details don't match historical payments to this vendor.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-[#f8f9ff] p-3">
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">Expected</p>
                      <p className="font-mono text-sm font-medium">···· 8829</p>
                    </div>
                    <div className="rounded-lg bg-[#ffdad6]/40 p-3">
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#93000a]">On invoice</p>
                      <p className="font-mono text-sm font-bold text-[#93000a]">···· 4102</p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-[#e5eeff] p-4">
                    <div className="mb-3 flex justify-between text-xs font-bold">
                      <span>Anomaly score</span>
                      <span className="text-[#ba1a1a]">98 / 100</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#c3c5d9]/25">
                      <div className="h-full w-[98%] rounded-full bg-[#ba1a1a]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <section className="border-y border-transparent bg-[#eff4ff] py-10 md:py-12">
          <div className="mx-auto max-w-7xl px-6 text-center md:px-8">
            <h2 className="mb-4 font-manrope text-lg font-bold leading-snug text-[#0b1c30] md:text-xl">
              The only vendor verification tool built for accounting firms — not enterprise AP teams
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
              Connects to QuickBooks in one click. No vendor portals, no IT tickets, no DKIM configuration.
              Your vendors do nothing — you get protected immediately.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
              {['NACHA 2026 Ready', 'SOC 2 Ready', '256-bit encryption', 'QuickBooks Certified', 'No vendor friction'].map(label => (
                <span
                  key={label}
                  className="rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-[#003ec7] shadow-[0_4px_20px_rgba(11,28,48,0.04)] ring-1 ring-[#003ec7]/10"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* How it works — Trustpair "Onboarding / Monitoring / Payments" rhythm */}
        <section id="how" className="scroll-mt-24 py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="font-manrope text-3xl font-bold tracking-tight text-[#0b1c30] md:text-4xl">
                How Vantirs protects your clients
              </h2>
              <p className="mt-4 text-slate-600">
                From first sync to every payment run—continuous controls without another spreadsheet.
              </p>
            </div>
            <div className="grid gap-12 md:grid-cols-3 md:gap-10">
              {[
                {
                  icon: <Zap className="h-8 w-8 text-[#003ec7]" strokeWidth={1.5} />,
                  title: 'Connect QuickBooks',
                  desc: "OAuth to your client's QuickBooks Online in one click. We sync vendors and invoice history.",
                },
                {
                  icon: <BarChart3 className="h-8 w-8 text-[#003ec7]" strokeWidth={1.5} />,
                  title: 'Fingerprint every vendor',
                  desc: 'We analyze payment patterns and build statistical profiles—so anomalies stand out instantly.',
                },
                {
                  icon: <Bell className="h-8 w-8 text-[#003ec7]" strokeWidth={1.5} />,
                  title: 'Alert before pay runs',
                  desc: 'High-risk invoices surface in your queue with context—approve, reject, or escalate with confidence.',
                },
              ].map((item, i) => (
                <div key={item.title} className="group text-center md:text-left">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-[0_4px_20px_rgba(11,28,48,0.06)] transition-transform duration-300 group-hover:scale-[1.03] md:mx-0">
                    {item.icon}
                  </div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#003ec7]">Step {i + 1}</p>
                  <h3 className="font-manrope text-xl font-bold text-[#0b1c30]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform / detection — feature grid */}
        <section id="platform" className="scroll-mt-24 bg-[#eff4ff] py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="mb-12 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
              <div className="max-w-xl">
                <h2 className="font-manrope text-3xl font-bold tracking-tight text-[#0b1c30] md:text-4xl">
                  What we detect
                </h2>
                <p className="mt-3 text-slate-600">
                  Purpose-built signals for BEC and vendor impersonation—not generic "risk scores."
                </p>
              </div>
              <Link href="/signup" className="inline-flex items-center gap-2 text-sm font-bold text-[#003ec7] hover:gap-3">
                Start free trial <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: <AlertTriangle className="h-9 w-9 text-[#ba1a1a]" />,
                  title: 'Bank account changes',
                  desc: 'Flags when an invoice asks for a different bank account than prior payments to that vendor.',
                },
                {
                  icon: <Lock className="h-9 w-9 text-[#a94900]" />,
                  title: 'Duplicate invoices',
                  desc: 'Detects invoices submitted twice — same vendor, same amount, different invoice number — before double-payment clears.',
                },
                {
                  icon: <TrendingUp className="h-9 w-9 text-[#565e74]" />,
                  title: 'Amount anomalies',
                  desc: 'Statistical outliers vs. the vendor history—so unusual is measurable, not a hunch.',
                },
                {
                  icon: <CheckCircle className="h-9 w-9 text-[#003ec7]" />,
                  title: 'New vendor review',
                  desc: 'First-time vendors get explicit review—no payment history, no automatic trust.',
                },
              ].map(f => (
                <div
                  key={f.title}
                  className="rounded-2xl bg-white p-8 shadow-[0_4px_20px_rgba(11,28,48,0.06)] transition-shadow hover:shadow-[0_12px_40px_rgba(11,28,48,0.08)]"
                >
                  <div className="mb-4">{f.icon}</div>
                  <h3 className="font-manrope text-lg font-bold text-[#0b1c30]">{f.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* NACHA 2026 compliance section */}
        <section className="py-20 md:py-24 bg-[#0b1c30]">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#003ec7]/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#93b4ff]">
                  NACHA 2026 Compliance
                </div>
                <h2 className="font-manrope text-3xl font-bold tracking-tight text-white md:text-4xl">
                  Your auditor is about to ask about vendor bank verification
                </h2>
                <p className="text-lg leading-relaxed text-white/70">
                  NACHA&apos;s 2026 rule changes require ACH originators to verify that bank account details
                  belong to the intended recipient before every payment. Vantirs gives you a documented,
                  auditable verification record for every vendor — automatically.
                </p>
                <ul className="space-y-3">
                  {[
                    'Bank account change detection on every invoice — logged with timestamp',
                    'Full audit trail per vendor: who approved, when, and what was flagged',
                    'Exportable compliance report for E&O carriers and external auditors',
                    'No manual process, no spreadsheet — defensible documentation by default',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm text-white/80">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#4ade80]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/nacha-2026-compliance"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#93b4ff] hover:gap-3 transition-all"
                >
                  Read our NACHA 2026 guide <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="rounded-2xl bg-white/5 p-8 ring-1 ring-white/10 space-y-5">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#93b4ff]">What auditors now ask</p>
                {[
                  {
                    q: 'Do you verify vendor bank accounts before ACH payments?',
                    a: 'Yes — Vantirs flags any bank account change vs. prior payment history before your client pays.',
                  },
                  {
                    q: 'Can you show me your vendor verification controls?',
                    a: 'Yes — every invoice has a scan record with risk score, factors checked, and approver.',
                  },
                  {
                    q: 'What happens when a new vendor requests payment?',
                    a: 'Vantirs flags first-time vendors automatically and holds them for explicit review.',
                  },
                ].map(item => (
                  <div key={item.q} className="rounded-xl bg-white/5 p-5">
                    <p className="text-sm font-semibold text-white">{item.q}</p>
                    <p className="mt-2 text-xs leading-relaxed text-white/60">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How detection works */}
        <section className="py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#003ec7]">How it works</p>
              <h2 className="mt-3 font-manrope text-3xl font-bold text-[#0b1c30] md:text-4xl">Exactly what gets checked — and how</h2>
              <p className="mt-4 text-base text-slate-600">
                Vantirs reads your QuickBooks history. Every signal is derived from data that already exists in your books — no manual input, no vendor portals, no configuration.
              </p>
            </div>

            {/* Steps */}
            <div className="relative mx-auto max-w-3xl">
              <div className="absolute left-[1.375rem] top-8 hidden h-[calc(100%-4rem)] w-px bg-[#c3c5d9]/40 md:block" />
              {[
                {
                  step: '1',
                  title: 'Connect QuickBooks via official OAuth',
                  body: 'Two-minute setup using QuickBooks\' own OAuth flow. Vantirs receives read-only access — it cannot move money, create vendors, or modify any data in your books.',
                },
                {
                  step: '2',
                  title: 'Vantirs builds a payment fingerprint per vendor',
                  body: 'For every vendor across every client, Vantirs maps their historical payment destinations, typical invoice amounts, and billing cadence. This fingerprint is the baseline everything gets compared against.',
                },
                {
                  step: '3',
                  title: 'Every new invoice is automatically scored',
                  body: 'When a new invoice syncs from QBO, Vantirs scores it against that vendor\'s fingerprint. No manual submission — it happens on every payment run.',
                },
                {
                  step: '4',
                  title: 'Mismatches surface with the specific reason',
                  body: 'Alerts say exactly what changed: "Bank account routing number differs from the last 12 payments to this vendor" or "Invoice amount is 340% above this vendor\'s historical average." Your team sees the evidence — not a score.',
                },
              ].map(item => (
                <div key={item.step} className="relative mb-8 flex gap-6 last:mb-0">
                  <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#003ec7] text-sm font-bold text-white shadow-sm">
                    {item.step}
                  </div>
                  <div className="pb-2 pt-1.5">
                    <h3 className="font-manrope text-base font-semibold text-[#0b1c30]">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust signals */}
            <div className="mt-16 rounded-2xl bg-[#f8f9ff] p-8 ring-1 ring-[#c3c5d9]/20 md:p-10">
              <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Verifiable by your IT or compliance team</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    icon: <Shield className="h-5 w-5 text-[#003ec7]" />,
                    label: 'Official QBO OAuth',
                    detail: 'Read-only. No credentials stored. Revoke access from your QBO settings at any time.',
                  },
                  {
                    icon: <Lock className="h-5 w-5 text-[#003ec7]" />,
                    label: 'AES-256 encryption',
                    detail: 'All payment data encrypted at rest. Bank account details are hashed, never stored in plaintext.',
                  },
                  {
                    icon: <CheckCircle className="h-5 w-5 text-[#003ec7]" />,
                    label: 'Full audit trail',
                    detail: 'Every invoice decision logged with timestamp, reviewer, and risk factors. Exportable for auditors.',
                  },
                  {
                    icon: <BarChart3 className="h-5 w-5 text-[#003ec7]" />,
                    label: 'No vendor portal',
                    detail: 'Vendors do nothing. No signup, no portal, no disruption to existing payment workflows.',
                  },
                ].map(t => (
                  <div key={t.label} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      {t.icon}
                      <span className="text-sm font-semibold text-[#0b1c30]">{t.label}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-500">{t.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Dark CTA band — Trustpair demo strip */}
        <section className="px-6 py-12 md:px-8">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-[#0b1c30] px-8 py-16 text-center md:px-16 md:py-20">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#003ec7]/25 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#833700]/20 blur-[100px]" />
            <div className="relative z-10 space-y-6">
              <h2 className="font-manrope text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                Every payment run deserves a second look
              </h2>
              <p className="mx-auto max-w-lg text-lg text-white/75">
                Free plan available — up to 3 clients, no time limit, no credit card. Paid plans unlock more clients and full audit trail exports.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row sm:gap-4">
                <Link
                  href="/signup"
                  className="inline-flex min-w-[200px] items-center justify-center rounded-xl bg-white px-10 py-4 text-base font-bold text-[#0b1c30] transition hover:bg-[#eff4ff]"
                >
                  Start free trial
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex min-w-[200px] items-center justify-center rounded-xl border border-white/25 bg-transparent px-10 py-4 text-base font-bold text-white hover:bg-white/10"
                >
                  Request free audit
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing — client component with toggle + outreach plan */}
        <PricingSection />

        {/* Disclaimer */}
        <section className="py-10">
          <p className="mx-auto max-w-2xl px-6 text-center text-xs leading-relaxed text-slate-400 md:px-8">
            Vantirs provides payment verification assistance and helps flag anomalies. It does not guarantee fraud
            detection. Always verify suspicious payments through direct phone contact with known vendor numbers.
          </p>
        </section>

        {/* Footer — multi-column, Trustpair density */}
        <footer className="border-t border-[#c3c5d9]/15 bg-[#f8f9ff] py-14">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-2 md:gap-12 lg:grid-cols-4 md:px-8">
            <div>
              <VantirsLogo href="/" className="inline-flex items-center" imageClassName="h-8 w-auto" width={142} height={48} />
              <p className="mt-4 text-xs leading-relaxed text-slate-500">
                Payment verification for accounting firms on QuickBooks Online—fingerprint vendors, flag anomalies,
                protect client cash.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Product</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>
                  <a href="/vendor-fraud-detection-software" className="hover:text-[#003ec7]">
                    Vendor fraud detection
                  </a>
                </li>
                <li>
                  <a href="/invoice-fraud-detection" className="hover:text-[#003ec7]">
                    Invoice fraud detection
                  </a>
                </li>
                <li>
                  <a href="/accounts-payable-fraud-prevention" className="hover:text-[#003ec7]">
                    AP fraud prevention
                  </a>
                </li>
                <li>
                  <a href="/quickbooks-fraud-prevention" className="hover:text-[#003ec7]">
                    Platform
                  </a>
                </li>
                <li>
                  <a href="/how-it-works" className="hover:text-[#003ec7]">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="/pricing" className="hover:text-[#003ec7]">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Legal</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>
                  <Link href="/terms" className="hover:text-[#003ec7]">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-[#003ec7]">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="hover:text-[#003ec7]">
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col justify-end md:items-end">
              <p className="text-xs text-slate-400">© {new Date().getFullYear()} Vantirs. All rights reserved.</p>
            </div>
          </div>
        </footer>

        <ExitIntentPopup />
      </main>
    </div>
  )
}
