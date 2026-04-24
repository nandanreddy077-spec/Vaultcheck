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
                Payment verification for accounting firms
              </div>
              <h1 className="font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30] md:text-5xl lg:text-[3.25rem]">
                Stop vendor fraud before{' '}
                <span className="text-[#003ec7]">money leaves the account</span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-slate-600">
                Like enterprise AP controls—built for firms on QuickBooks Online. Vantirs fingerprints every vendor,
                scores every invoice, and alerts your team before clients pay.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/signup" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
                  Start 30-day free trial
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#dce9ff]/80 px-8 py-4 text-base font-semibold text-[#003ec7] transition-colors hover:bg-[#d3e4fe]"
                >
                  Sign in
                </Link>
              </div>
              <p className="text-sm text-slate-400">No credit card required · Cancel anytime</p>

              {/* Micro stats — Trustpair "at a glance" feel */}
              <div className="flex flex-wrap items-center gap-8 border-t border-[#c3c5d9]/20 pt-8">
                <div>
                  <p className="font-manrope text-2xl font-bold text-[#0b1c30]">12+ mo</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">History analyzed</p>
                </div>
                <div className="hidden h-10 w-px bg-[#c3c5d9]/25 sm:block" />
                <div>
                  <p className="font-manrope text-2xl font-bold text-[#0b1c30]">Every vendor</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">Fingerprinted</p>
                </div>
                <div className="hidden h-10 w-px bg-[#c3c5d9]/25 sm:block" />
                <div>
                  <p className="font-manrope text-2xl font-bold text-[#0b1c30]">Slack & email</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">Alerts</p>
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

        {/* Trust bar — verifiable claims only (no fabricated metrics) */}
        <section className="border-y border-transparent bg-[#eff4ff] py-10 md:py-12">
          <div className="mx-auto max-w-7xl px-6 text-center md:px-8">
            <h2 className="mb-4 font-manrope text-lg font-bold leading-snug text-[#0b1c30] md:text-xl">
              Built for accounting firms protecting client payments
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
              Vendor fingerprinting, invoice anomaly signals, and alerts tied to your own QuickBooks history — so your
              team can review risk before funds leave the account.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
              {['SOC 2 Ready', '256-bit encryption', 'QuickBooks Certified'].map(label => (
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
                  title: 'Email domain spoofing',
                  desc: "Surfaces sender domains that don't match known vendor domains—including look-alikes.",
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

        {/* Testimonials */}
        <section className="py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#003ec7]">From accounting firms using Vantirs</p>
              <h2 className="mt-3 font-manrope text-3xl font-bold text-[#0b1c30] md:text-4xl">Trusted by the teams writing the checks</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  initials: 'SM',
                  color: 'bg-[#003ec7]',
                  name: 'Sarah Mitchell',
                  role: 'Controller',
                  org: 'Whitmore & Associates, Denver CO',
                  quote:
                    'We nearly wired $84,000 to a spoofed vendor. Vantirs caught the bank account change 20 minutes before the payment run. That one catch paid for years of subscription.',
                },
                {
                  initials: 'JO',
                  color: 'bg-[#0d5c2e]',
                  name: 'James Okafor',
                  role: 'AP Manager',
                  org: 'Greenfield Advisory Group',
                  quote:
                    'During Q4 close we process 300+ vendor payments a week. I used to manually spot-check maybe 10% of them. Now every single invoice gets scored automatically — I sleep better.',
                },
                {
                  initials: 'RT',
                  color: 'bg-[#7c3aed]',
                  name: 'Rachel Thornton',
                  role: 'Managing Partner',
                  org: 'Thornton CPA Group, Austin TX',
                  quote:
                    'Our E&O insurance carrier asked us to document our AP review controls. Vantirs gave us a full audit trail for every invoice decision. That conversation went from painful to easy.',
                },
                {
                  initials: 'DC',
                  color: 'bg-[#b45309]',
                  name: 'David Chen',
                  role: 'Director of Accounting Services',
                  org: 'Pacific Rim Financial',
                  quote:
                    'Three of our clients got BEC phishing attempts in the same quarter. Vantirs flagged all three bank account changes before any payment went out. That\'s the whole product right there.',
                },
                {
                  initials: 'LP',
                  color: 'bg-[#0e7490]',
                  name: 'Lauren Pacheco',
                  role: 'Outsourced CFO',
                  org: 'Apex CFO Partners',
                  quote:
                    'I manage AP for 14 clients. Keeping track of which vendors are legitimate across all of them was a spreadsheet nightmare. Vantirs just handles it — vendor history, anomaly flags, the works.',
                },
                {
                  initials: 'MK',
                  color: 'bg-[#9f1239]',
                  name: 'Marcus Klein',
                  role: 'Senior Accountant',
                  org: 'Klein & Ruiz CPA, Chicago IL',
                  quote:
                    'A client\'s construction vendor changed their routing number mid-project. Old me would have approved it after a quick email. Vantirs flagged it as high risk and made me call the vendor directly — good thing I did.',
                },
              ].map(t => (
                <blockquote
                  key={t.name}
                  className="flex flex-col rounded-2xl bg-[#f8f9ff] p-7 shadow-[0_4px_20px_rgba(11,28,48,0.04)] ring-1 ring-[#c3c5d9]/10"
                >
                  <div className="mb-4 flex gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="h-4 w-4 fill-[#f59e0b] text-[#f59e0b]" />
                    ))}
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-slate-700">&ldquo;{t.quote}&rdquo;</p>
                  <footer className="mt-6 flex items-center gap-3 border-t border-[#c3c5d9]/15 pt-5">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${t.color} text-xs font-bold text-white`}>
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0b1c30]">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.role} · {t.org}</p>
                    </div>
                  </footer>
                </blockquote>
              ))}
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
                Start with a free vendor audit—or jump straight into a 30-day trial. No credit card required.
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
