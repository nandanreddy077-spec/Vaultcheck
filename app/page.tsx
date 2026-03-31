import Link from 'next/link'
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Lock,
  ArrowRight,
  Receipt,
  Zap,
  Bell,
  BarChart3,
  Quote,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--surface)] text-[#0b1c30]">
      {/* Nav — Trustpair-style: airy, anchor links */}
      <header className="fixed top-0 z-50 w-full border-b border-transparent bg-[#f8f9ff]/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-[#003ec7]" strokeWidth={1.75} />
            <span className="font-manrope text-xl font-extrabold tracking-tight text-[#0b1c30]">Vantirs</span>
          </Link>
          <div className="hidden items-center gap-10 md:flex">
            <a href="#platform" className="text-sm font-medium text-slate-600 transition-colors hover:text-[#003ec7]">
              Platform
            </a>
            <a href="#how" className="text-sm font-medium text-slate-600 transition-colors hover:text-[#003ec7]">
              How it works
            </a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 transition-colors hover:text-[#003ec7]">
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

              {/* Micro stats — Trustpair “at a glance” feel */}
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
                          Beneficiary details don’t match historical payments to this vendor.
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

        {/* Social proof strip — Trustpair logo row tone */}
        <section className="border-y border-transparent bg-[#eff4ff] py-10">
          <div className="mx-auto max-w-7xl px-6 text-center md:px-8">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Built for firms who protect client cash
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
              {['QuickBooks Online', 'OAuth', 'SOC2-ready stack', 'Email & Slack'].map(label => (
                <span
                  key={label}
                  className="rounded-full bg-white/90 px-4 py-2 text-xs font-medium text-slate-600 shadow-[0_4px_20px_rgba(11,28,48,0.04)]"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* How it works — Trustpair “Onboarding / Monitoring / Payments” rhythm */}
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
                  desc: 'OAuth to your client’s QuickBooks Online in one click. We sync vendors and invoice history.',
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
                  Purpose-built signals for BEC and vendor impersonation—not generic “risk scores.”
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
                  desc: 'Surfaces sender domains that don’t match known vendor domains—including look-alikes.',
                },
                {
                  icon: <TrendingUp className="h-9 w-9 text-[#565e74]" />,
                  title: 'Amount anomalies',
                  desc: 'Statistical outliers vs. the vendor’s history—so “unusual” is measurable, not a hunch.',
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

        {/* Testimonials — Trustpair “Voices of Trust” */}
        <section className="py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#003ec7]">Why firms choose verification</p>
              <h2 className="mt-3 font-manrope text-3xl font-bold text-[#0b1c30] md:text-4xl">Clarity before every payment</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {[
                {
                  quote:
                    'We finally have a consistent way to challenge suspicious invoices before clients release funds. The team is faster—and calmer.',
                  role: 'Managing Partner',
                  org: 'Regional CPA firm',
                },
                {
                  quote:
                    'Bank detail changes used to slip through during busy season. Now they surface as exceptions we can prove we reviewed.',
                  role: 'Director of Client Accounting',
                  org: 'Outsourced CFO practice',
                },
              ].map(t => (
                <blockquote
                  key={t.role}
                  className="relative rounded-2xl bg-[#f8f9ff] p-8 shadow-[0_4px_20px_rgba(11,28,48,0.04)] ring-1 ring-[#c3c5d9]/10"
                >
                  <Quote className="absolute right-6 top-6 h-8 w-8 text-[#dce9ff]" aria-hidden />
                  <p className="relative text-sm leading-relaxed text-slate-700">&ldquo;{t.quote}&rdquo;</p>
                  <footer className="mt-6 border-t border-[#c3c5d9]/15 pt-4">
                    <p className="text-sm font-semibold text-[#0b1c30]">{t.role}</p>
                    <p className="text-xs text-slate-500">{t.org}</p>
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

        {/* Pricing — existing tiers, restyled */}
        <section className="bg-[#eff4ff] py-20 md:py-24" id="pricing">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="mx-auto mb-12 max-w-3xl rounded-2xl bg-gradient-to-br from-[#003ec7] to-[#0052ff] p-8 text-center shadow-[0_12px_40px_rgba(0,62,199,0.25)] md:p-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">Start here</p>
              <h2 className="mt-2 font-manrope text-2xl font-bold text-white md:text-3xl">Run a free vendor audit — no commitment</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm text-blue-100">
                We connect to QuickBooks Online, scan 12 months of payment history, and deliver a risk report. If we find
                nothing, there&apos;s nothing to buy.
              </p>
              <Link
                href="/signup"
                className="mt-6 inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#003ec7] transition hover:bg-blue-50"
              >
                Request your free audit →
              </Link>
              <p className="mt-3 text-xs text-blue-200">No credit card. No sales call. Just the data.</p>
            </div>

            <div className="mx-auto mb-10 max-w-3xl rounded-2xl bg-amber-50/90 px-6 py-4 text-amber-950 ring-1 ring-amber-200/60">
              <p className="text-sm font-semibold">Founding Firm pricing — limited spots</p>
              <p className="mt-1 text-sm text-amber-900/90">
                The first firms lock in <strong>$49/client/month for life</strong>. Once the cohort fills, standard
                pricing applies.
              </p>
            </div>

            <div className="mx-auto mb-4 max-w-2xl text-center">
              <h2 className="font-manrope text-3xl font-bold text-[#0b1c30]">Pricing</h2>
              <p className="mt-2 text-slate-600">Per-client pricing — your incentives and ours stay aligned.</p>
              <p className="mt-2 text-sm text-slate-400">
                Save 20% with annual billing · All plans include a 30-day free trial
              </p>
            </div>

            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  name: 'Founding Firm',
                  badge: 'Locked for life',
                  badgeColor: 'bg-amber-50 text-amber-800',
                  price: '$49',
                  unit: '/client/mo',
                  clients: 'First 10 firms only',
                  note: 'Price never increases',
                  features: ['Full platform access', 'Unlimited vendor scans', 'Email & Slack alerts', 'Vendor fingerprinting', 'Priority onboarding'],
                  cta: 'Claim founding spot',
                  ctaStyle: 'bg-amber-500 text-white hover:bg-amber-600',
                },
                {
                  name: 'Firm Starter',
                  badge: '1–5 clients',
                  badgeColor: 'bg-slate-100 text-slate-600',
                  price: '$79',
                  unit: '/client/mo',
                  clients: '5-client firm = $395/mo',
                  note: 'Less than 1 hour of CPA time',
                  features: ['Multi-client dashboard', 'Email alerts', 'Vendor fingerprinting', 'Alert queue', '30-day free trial'],
                  cta: 'Start free trial',
                  ctaStyle: 'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50',
                },
                {
                  name: 'Firm Growth',
                  badge: '6–20 clients',
                  badgeColor: 'bg-blue-50 text-blue-700',
                  price: '$69',
                  unit: '/client/mo',
                  clients: '15-client firm = $1,035/mo',
                  note: 'Volume discount kicks in',
                  features: ['Everything in Starter', 'Slack alerts', 'API access', 'Priority support', 'Quarterly business review'],
                  cta: 'Start free trial',
                  ctaStyle: 'bg-[#003ec7] text-white hover:bg-[#0032a3]',
                  popular: true,
                },
                {
                  name: 'Firm Pro',
                  badge: '21+ clients',
                  badgeColor: 'bg-slate-100 text-slate-600',
                  price: '$49',
                  unit: '/client/mo',
                  clients: '30-client firm = $1,470/mo',
                  note: 'Best rate for largest firms',
                  features: ['Everything in Growth', 'Custom detection rules', 'Dedicated onboarding', 'SLA guarantee', 'White-label reports'],
                  cta: 'Start free trial',
                  ctaStyle: 'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50',
                },
              ].map(plan => (
                <div
                  key={plan.name}
                  className={`flex flex-col rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(11,28,48,0.06)] ring-1 ${
                    plan.popular ? 'ring-2 ring-[#003ec7]' : 'ring-[#c3c5d9]/15'
                  }`}
                >
                  {plan.popular && (
                    <span className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#003ec7]">Most popular</span>
                  )}
                  <span className={`mb-3 inline-flex w-fit rounded-full px-2.5 py-0.5 text-xs font-medium ${plan.badgeColor}`}>
                    {plan.badge}
                  </span>
                  <h3 className="font-manrope text-lg font-bold text-[#0b1c30]">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-[#0b1c30]">{plan.price}</span>
                    <span className="text-xs text-slate-500">{plan.unit}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-600">{plan.clients}</p>
                  <p className="mb-4 text-xs text-slate-400">{plan.note}</p>
                  <ul className="mb-6 flex-1 space-y-2">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup" className={`block w-full rounded-lg py-2.5 text-center text-sm font-semibold ${plan.ctaStyle}`}>
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>

            <p className="mt-10 text-center text-sm text-slate-400">
              <strong className="text-slate-600">Annual billing saves 20%</strong>
              <Link href="/signup" className="ml-1 text-[#003ec7] hover:underline">
                Switch to annual →
              </Link>
            </p>
          </div>
        </section>

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
              <Link href="/" className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-[#003ec7]" />
                <span className="font-manrope text-lg font-bold text-[#0b1c30]">Vantirs</span>
              </Link>
              <p className="mt-4 text-xs leading-relaxed text-slate-500">
                Payment verification for accounting firms on QuickBooks Online—fingerprint vendors, flag anomalies,
                protect client cash.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Product</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>
                  <a href="#platform" className="hover:text-[#003ec7]">
                    Platform
                  </a>
                </li>
                <li>
                  <a href="#how" className="hover:text-[#003ec7]">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-[#003ec7]">
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
              </ul>
            </div>
            <div className="flex flex-col justify-end md:items-end">
              <p className="text-xs text-slate-400">© {new Date().getFullYear()} Vantirs. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
