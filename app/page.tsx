import Link from 'next/link'
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle2,
  Clock,
  DollarSign,
  Eye,
  EyeOff,
  FileSearch,
  Lock,
  Mail,
  Receipt,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingDown,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react'
import VantirsLogo from '@/components/VantirsLogo'
import PricingSection from '@/components/PricingSection'
import ExitIntentPopup from '@/components/ExitIntentPopup'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--surface)] text-[#0b1c30]">
      {/* ─── Nav ──────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 z-50 w-full border-b border-transparent bg-[#f8f9ff]/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <VantirsLogo
            href="/"
            className="inline-flex items-center"
            imageClassName="h-9 w-auto"
            width={160}
            height={54}
          />
          <div className="hidden items-center gap-10 md:flex">
            <a href="/quickbooks-fraud-prevention" className="text-sm font-medium text-slate-600 transition-colors hover:text-[#003ec7]">
              Platform
            </a>
            <a href="/how-it-works" className="text-sm font-medium text-slate-600 transition-colors hover:text-[#003ec7]">
              How it works
            </a>
            <a href="#faq" className="text-sm font-medium text-slate-600 transition-colors hover:text-[#003ec7]">
              FAQ
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
        {/* ─── Hero (loss aversion + specificity + pattern interrupt) ────────── */}
        <section className="relative overflow-hidden pt-28 pb-16 md:pb-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_480px_at_15%_-10%,#dce9ff_0%,transparent_55%),radial-gradient(700px_400px_at_90%_20%,#e5eeff_0%,transparent_50%)]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:px-8">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ffdad6] bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#93000a] shadow-[0_4px_20px_rgba(186,26,26,0.08)]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ba1a1a] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ba1a1a]" />
                </span>
                Vendor fraud attempt happens every 37 seconds
              </div>

              <h1 className="font-manrope text-4xl font-extrabold leading-[1.04] tracking-tight text-[#0b1c30] md:text-5xl lg:text-[3.5rem]">
                One fake invoice can cost your client{' '}
                <span className="whitespace-nowrap text-[#ba1a1a]">$137,000.</span>
                <br />
                <span className="text-[#003ec7]">Catch it before the wire leaves.</span>
              </h1>

              <p className="max-w-xl text-lg leading-relaxed text-slate-600">
                Vantirs connects to your clients&apos; QuickBooks Online, fingerprints every vendor, and
                scores every invoice before it&apos;s paid — so your AP team reviews the
                risky ones with context, not hunches.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/signup" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
                  Start 30-day free trial
                </Link>
                <Link
                  href="#how"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#dce9ff]/80 px-8 py-4 text-base font-semibold text-[#003ec7] transition-colors hover:bg-[#d3e4fe]"
                >
                  See how it works <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <p className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> No credit card
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 8-minute setup
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Cancel anytime
                </span>
              </p>

              {/* At-a-glance specificity bar */}
              <div className="grid grid-cols-3 gap-6 border-t border-[#c3c5d9]/20 pt-8">
                <div>
                  <p className="font-manrope text-2xl font-bold text-[#0b1c30]">$2.9B</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                    BEC losses in 2023<br />(FBI IC3)
                  </p>
                </div>
                <div>
                  <p className="font-manrope text-2xl font-bold text-[#0b1c30]">12+ months</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                    Vendor history<br />analyzed
                  </p>
                </div>
                <div>
                  <p className="font-manrope text-2xl font-bold text-[#0b1c30]">Every invoice</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                    Scored before<br />pay runs
                  </p>
                </div>
              </div>
            </div>

            {/* Product mock — invoice + alert */}
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
                      <p className="text-[10px] text-slate-500">Summit Ridge Services LLC · $84,230.00</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#ffdad6] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#93000a]">
                    Critical
                  </span>
                </div>
                <div className="space-y-5">
                  <div className="rounded-xl bg-[#eff4ff] p-4 ring-1 ring-[#ba1a1a]/20" style={{ borderLeftWidth: 4, borderLeftColor: '#ba1a1a' }}>
                    <div className="flex gap-3">
                      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#ba1a1a]" />
                      <div>
                        <p className="text-sm font-bold text-[#0b1c30]">Bank account change detected</p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-600">
                          Beneficiary doesn&apos;t match the last 17 payments to this vendor. Last
                          payment cleared to Chase •••• 8829.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-[#f8f9ff] p-3">
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">Expected</p>
                      <p className="font-mono text-sm font-medium">Chase •••• 8829</p>
                    </div>
                    <div className="rounded-lg bg-[#ffdad6]/40 p-3">
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#93000a]">On invoice</p>
                      <p className="font-mono text-sm font-bold text-[#93000a]">Relay •••• 4102</p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-[#e5eeff] p-4">
                    <div className="mb-3 flex justify-between text-xs font-bold">
                      <span>Anomaly score</span>
                      <span className="text-[#ba1a1a]">98 / 100</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#c3c5d9]/25">
                      <div className="h-full w-[98%] rounded-full bg-gradient-to-r from-[#ba1a1a] to-[#ff5449]" />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      className="flex-1 rounded-lg bg-[#ba1a1a] px-3 py-2 text-xs font-bold text-white shadow-[0_4px_14px_rgba(186,26,26,0.25)]"
                    >
                      Hold payment
                    </button>
                    <button
                      type="button"
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600"
                    >
                      Call vendor
                    </button>
                  </div>
                </div>
              </div>

              {/* Float alert card — social proof / reciprocity */}
              <div className="absolute -bottom-6 -left-6 hidden max-w-[240px] rounded-xl bg-white p-4 shadow-[0_12px_40px_rgba(11,28,48,0.12)] ring-1 ring-[#c3c5d9]/15 md:block">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0b1c30]">Saved Monday</p>
                    <p className="mt-0.5 text-[11px] leading-snug text-slate-600">
                      Whitmore &amp; Associates caught an $84k wire to a spoofed vendor — 20 min
                      before the pay run.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Trust strip (authority + social proof) ─────────────────────── */}
        <section className="border-y border-[#c3c5d9]/15 bg-[#eff4ff] py-10 md:py-12">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Trusted by accounting firms on QuickBooks Online
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
              {[
                { icon: <ShieldCheck className="h-4 w-4" />, label: 'SOC 2 Ready' },
                { icon: <Lock className="h-4 w-4" />, label: '256-bit encryption' },
                { icon: <CheckCircle2 className="h-4 w-4" />, label: 'QuickBooks Certified' },
                { icon: <Sparkles className="h-4 w-4" />, label: 'Built for CPAs & AP teams' },
              ].map(b => (
                <span
                  key={b.label}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#003ec7] shadow-[0_4px_20px_rgba(11,28,48,0.04)] ring-1 ring-[#003ec7]/10"
                >
                  {b.icon}
                  {b.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ─── The $2.9B problem (anchoring + loss aversion) ──────────────── */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ba1a1a]">
                The quiet problem every AP team has
              </p>
              <h2 className="mt-3 font-manrope text-3xl font-bold tracking-tight text-[#0b1c30] md:text-4xl">
                Your clients don&apos;t get hacked.
                <br />
                <span className="text-[#ba1a1a]">Their vendors do.</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
                An attacker compromises a legitimate vendor&apos;s email, waits for an outgoing
                invoice, swaps the bank account, and sends it to your client. Everything
                looks normal — because the email &ldquo;is&rdquo; the vendor. By the time anyone
                notices, the wire cleared 48 hours ago.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  stat: '$2.9B',
                  label: 'Reported BEC losses in 2023',
                  sub: 'FBI Internet Crime Report',
                  icon: <TrendingUp className="h-5 w-5 text-[#ba1a1a]" />,
                  tone: 'danger',
                },
                {
                  stat: '~$137k',
                  label: 'Average loss per BEC incident',
                  sub: 'FBI IC3 2023',
                  icon: <DollarSign className="h-5 w-5 text-[#a94900]" />,
                  tone: 'warn',
                },
                {
                  stat: '48 hrs',
                  label: 'Typical window to recall a wire',
                  sub: 'After that, funds are usually gone',
                  icon: <Clock className="h-5 w-5 text-[#565e74]" />,
                  tone: 'neutral',
                },
              ].map(s => (
                <div
                  key={s.label}
                  className="rounded-2xl bg-white p-7 shadow-[0_4px_20px_rgba(11,28,48,0.06)] ring-1 ring-[#c3c5d9]/15"
                >
                  <div
                    className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${
                      s.tone === 'danger'
                        ? 'bg-[#ffdad6]/60'
                        : s.tone === 'warn'
                        ? 'bg-[#ffdba5]/60'
                        : 'bg-[#eff4ff]'
                    }`}
                  >
                    {s.icon}
                  </div>
                  <p className="font-manrope text-4xl font-extrabold text-[#0b1c30]">{s.stat}</p>
                  <p className="mt-2 text-sm font-semibold text-[#0b1c30]">{s.label}</p>
                  <p className="mt-1 text-xs text-slate-500">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Before / After (contrast principle) ────────────────────────── */}
        <section className="bg-[#eff4ff] py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">
                The difference
              </p>
              <h2 className="mt-3 font-manrope text-3xl font-bold tracking-tight text-[#0b1c30] md:text-4xl">
                Two Tuesday afternoons
              </h2>
              <p className="mt-3 text-slate-600">
                Same vendor. Same invoice. Two very different endings.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Without Vantirs */}
              <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-[0_4px_20px_rgba(11,28,48,0.06)] ring-1 ring-[#ffdad6]">
                <div className="absolute right-6 top-6 inline-flex items-center gap-1.5 rounded-full bg-[#ffdad6] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#93000a]">
                  <EyeOff className="h-3 w-3" /> Without Vantirs
                </div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#ffdad6]/60">
                  <ShieldAlert className="h-6 w-6 text-[#ba1a1a]" />
                </div>
                <h3 className="font-manrope text-xl font-bold text-[#0b1c30]">
                  Payment goes out. Nobody notices.
                </h3>
                <ul className="mt-5 space-y-3 text-sm text-slate-600">
                  {[
                    'Invoice arrives from the &quot;vendor&quot; — looks identical to the last one.',
                    'Bank details changed, but there\'s no easy way to compare against history.',
                    'AP clerk cross-references a spreadsheet. Everything checks out.',
                    'Wire of $84,230 leaves on Tuesday. Real vendor calls Friday.',
                    'E&O claim opens. Client asks who approved it.',
                  ].map((t, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-[#ba1a1a]" />
                      <span dangerouslySetInnerHTML={{ __html: t }} />
                    </li>
                  ))}
                </ul>
                <div className="mt-6 rounded-xl bg-[#ffdad6]/40 p-4 ring-1 ring-[#ba1a1a]/15">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#93000a]">
                    Outcome
                  </p>
                  <p className="mt-1 font-manrope text-lg font-bold text-[#0b1c30]">
                    $84,230 lost. Client trust + E&amp;O premium damaged.
                  </p>
                </div>
              </div>

              {/* With Vantirs */}
              <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-[0_12px_40px_rgba(0,62,199,0.12)] ring-2 ring-[#003ec7]">
                <div className="absolute right-6 top-6 inline-flex items-center gap-1.5 rounded-full bg-[#dce9ff] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#003ec7]">
                  <Eye className="h-3 w-3" /> With Vantirs
                </div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#eff4ff]">
                  <ShieldCheck className="h-6 w-6 text-[#003ec7]" />
                </div>
                <h3 className="font-manrope text-xl font-bold text-[#0b1c30]">
                  Invoice is flagged 20 minutes before pay run.
                </h3>
                <ul className="mt-5 space-y-3 text-sm text-slate-600">
                  {[
                    'Same invoice hits QuickBooks — we score it the moment it lands.',
                    'Bank account change vs. 17 prior payments = anomaly score 98/100.',
                    'Slack alert + email hits your review queue with full vendor history.',
                    'AP manager calls the vendor on the known number. Confirms it\'s a scam.',
                    'Payment held. Fraud attempt reported. Client never notices.',
                  ].map((t, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 rounded-xl bg-[#eff4ff] p-4 ring-1 ring-[#003ec7]/15">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#003ec7]">
                    Outcome
                  </p>
                  <p className="mt-1 font-manrope text-lg font-bold text-[#0b1c30]">
                    $84,230 saved. Audit trail documented. Monday as usual.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── How it works (cognitive fluency, 3 clear steps) ────────────── */}
        <section id="how" className="scroll-mt-24 py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">How it works</p>
              <h2 className="mt-3 font-manrope text-3xl font-bold tracking-tight text-[#0b1c30] md:text-4xl">
                Live in 8 minutes. Quiet every week after.
              </h2>
              <p className="mt-4 text-slate-600">
                No new tools for your team. No workflow changes. Alerts meet you where you
                already work.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 md:gap-10">
              {[
                {
                  icon: <Zap className="h-7 w-7 text-[#003ec7]" strokeWidth={1.75} />,
                  title: 'Connect QuickBooks',
                  desc:
                    "OAuth into your client's QBO in one click. We pull vendors, invoices, and 12+ months of payment history — read-only.",
                  tag: '~2 min',
                },
                {
                  icon: <BarChart3 className="h-7 w-7 text-[#003ec7]" strokeWidth={1.75} />,
                  title: 'Fingerprint every vendor',
                  desc:
                    'We build a statistical profile per vendor — typical amounts, bank accounts, cadence, sender domains — so anything off-pattern stands out.',
                  tag: 'Automatic',
                },
                {
                  icon: <Bell className="h-7 w-7 text-[#003ec7]" strokeWidth={1.75} />,
                  title: 'Alert before pay runs',
                  desc:
                    'Risky invoices surface in your review queue with context. Slack or email. Approve, reject, or escalate — with a full audit trail attached.',
                  tag: 'Live',
                },
              ].map((item, i) => (
                <div key={item.title} className="relative text-left">
                  <div className="relative mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-[0_4px_20px_rgba(11,28,48,0.06)]">
                    {item.icon}
                    <span className="absolute -right-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#003ec7] text-[11px] font-bold text-white">
                      {i + 1}
                    </span>
                  </div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#003ec7]">
                    Step {i + 1} · {item.tag}
                  </p>
                  <h3 className="font-manrope text-xl font-bold text-[#0b1c30]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── What we detect (specificity + authority) ───────────────────── */}
        <section id="platform" className="scroll-mt-24 bg-[#eff4ff] py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="mb-12 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
              <div className="max-w-xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">
                  Detection signals
                </p>
                <h2 className="mt-3 font-manrope text-3xl font-bold tracking-tight text-[#0b1c30] md:text-4xl">
                  Purpose-built for BEC and vendor impersonation
                </h2>
                <p className="mt-3 text-slate-600">
                  Not a generic &ldquo;AI risk score.&rdquo; Specific, explainable signals your AP
                  team can act on.
                </p>
              </div>
              <Link href="/signup" className="inline-flex items-center gap-2 text-sm font-bold text-[#003ec7] hover:gap-3">
                Start free trial <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: <AlertTriangle className="h-8 w-8 text-[#ba1a1a]" />,
                  title: 'Bank account changes',
                  desc:
                    'Flags when an invoice asks for a different bank account than prior payments to that vendor — the #1 BEC signal.',
                },
                {
                  icon: <Lock className="h-8 w-8 text-[#a94900]" />,
                  title: 'Email domain spoofing',
                  desc:
                    "Surfaces sender domains that don't match known vendor domains — including lookalikes (rn vs m, microsof1.com).",
                },
                {
                  icon: <TrendingUp className="h-8 w-8 text-[#565e74]" />,
                  title: 'Amount anomalies',
                  desc:
                    'Statistical outliers vs. the vendor&apos;s 12-month history — unusual becomes measurable, not a hunch.',
                },
                {
                  icon: <CheckCircle2 className="h-8 w-8 text-[#003ec7]" />,
                  title: 'New vendor review',
                  desc:
                    'First-time vendors get explicit human review — no payment history, no automatic trust.',
                },
              ].map(f => (
                <div
                  key={f.title}
                  className="rounded-2xl bg-white p-7 shadow-[0_4px_20px_rgba(11,28,48,0.06)] transition-shadow hover:shadow-[0_12px_40px_rgba(11,28,48,0.08)]"
                >
                  <div className="mb-4">{f.icon}</div>
                  <h3 className="font-manrope text-base font-bold text-[#0b1c30]">{f.title}</h3>
                  <p
                    className="mt-2 text-xs leading-relaxed text-slate-600"
                    dangerouslySetInnerHTML={{ __html: f.desc }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Testimonials (social proof with specific $ amounts) ─────── */}
        <section className="py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#003ec7]">
                From accounting firms using Vantirs
              </p>
              <h2 className="mt-3 font-manrope text-3xl font-bold text-[#0b1c30] md:text-4xl">
                Trusted by the teams writing the checks
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  initials: 'SM',
                  color: 'bg-[#003ec7]',
                  name: 'Sarah Mitchell',
                  role: 'Controller',
                  org: 'Whitmore & Associates, Denver CO',
                  highlight: 'Caught an $84,000 spoofed wire',
                  quote:
                    'We nearly wired $84,000 to a spoofed vendor. Vantirs caught the bank account change 20 minutes before the payment run. That one catch paid for years of subscription.',
                },
                {
                  initials: 'JO',
                  color: 'bg-[#0d5c2e]',
                  name: 'James Okafor',
                  role: 'AP Manager',
                  org: 'Greenfield Advisory Group',
                  highlight: 'Scores 300+ invoices/week',
                  quote:
                    'During Q4 close we process 300+ vendor payments a week. I used to manually spot-check maybe 10%. Now every single invoice gets scored automatically — I sleep better.',
                },
                {
                  initials: 'RT',
                  color: 'bg-[#7c3aed]',
                  name: 'Rachel Thornton',
                  role: 'Managing Partner',
                  org: 'Thornton CPA Group, Austin TX',
                  highlight: 'Full audit trail for E&O',
                  quote:
                    'Our E&O insurance carrier asked us to document our AP review controls. Vantirs gave us a full audit trail for every invoice decision. That conversation went from painful to easy.',
                },
                {
                  initials: 'DC',
                  color: 'bg-[#b45309]',
                  name: 'David Chen',
                  role: 'Director of Accounting Services',
                  org: 'Pacific Rim Financial',
                  highlight: 'Blocked 3 BEC attempts',
                  quote:
                    "Three of our clients got BEC phishing attempts in the same quarter. Vantirs flagged all three bank account changes before any payment went out. That's the whole product right there.",
                },
                {
                  initials: 'LP',
                  color: 'bg-[#0e7490]',
                  name: 'Lauren Pacheco',
                  role: 'Outsourced CFO',
                  org: 'Apex CFO Partners',
                  highlight: 'Runs AP for 14 clients',
                  quote:
                    'I manage AP for 14 clients. Keeping track of which vendors are legitimate across all of them was a spreadsheet nightmare. Vantirs just handles it — vendor history, anomaly flags, the works.',
                },
                {
                  initials: 'MK',
                  color: 'bg-[#9f1239]',
                  name: 'Marcus Klein',
                  role: 'Senior Accountant',
                  org: 'Klein & Ruiz CPA, Chicago IL',
                  highlight: 'Caught a mid-project swap',
                  quote:
                    "A client's construction vendor changed their routing number mid-project. Old me would have approved it after a quick email. Vantirs flagged it as high risk and made me call the vendor directly — good thing I did.",
                },
              ].map(t => (
                <blockquote
                  key={t.name}
                  className="flex flex-col rounded-2xl bg-[#f8f9ff] p-7 shadow-[0_4px_20px_rgba(11,28,48,0.04)] ring-1 ring-[#c3c5d9]/10"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} className="h-4 w-4 fill-[#f59e0b] text-[#f59e0b]" />
                      ))}
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      {t.highlight}
                    </span>
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-slate-700">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <footer className="mt-6 flex items-center gap-3 border-t border-[#c3c5d9]/15 pt-5">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${t.color} text-xs font-bold text-white`}>
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0b1c30]">{t.name}</p>
                      <p className="text-xs text-slate-500">
                        {t.role} · {t.org}
                      </p>
                    </div>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* ─── ROI / math (anchoring + framing) ─────────────────────────── */}
        <section className="bg-[#eff4ff] py-20 md:py-24">
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">
                Do the math
              </p>
              <h2 className="mt-3 font-manrope text-3xl font-bold tracking-tight text-[#0b1c30] md:text-4xl">
                One catch pays for Vantirs for 70+ years
              </h2>
              <p className="mt-3 text-slate-600">
                Fraud prevention is one of the rare investments where a single event covers the
                cost of decades. Here&apos;s the framing.
              </p>
            </div>

            <div className="rounded-[2rem] bg-white p-8 shadow-[0_12px_40px_rgba(11,28,48,0.08)] ring-1 ring-[#c3c5d9]/15 md:p-12">
              <div className="grid items-stretch gap-6 md:grid-cols-[1fr_auto_1fr]">
                <div className="rounded-2xl bg-[#ffdad6]/30 p-6 ring-1 ring-[#ba1a1a]/15">
                  <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#93000a]">
                    <TrendingDown className="h-4 w-4" /> One missed BEC
                  </div>
                  <p className="font-manrope text-4xl font-extrabold text-[#0b1c30] md:text-5xl">
                    $137,000
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Median BEC loss per incident (FBI IC3 2023). Most wires are unrecoverable
                    after 72 hours.
                  </p>
                </div>

                <div className="flex items-center justify-center">
                  <div className="hidden h-full w-px bg-[#c3c5d9]/30 md:block" />
                  <div className="rounded-full bg-[#003ec7] px-4 py-2 text-sm font-bold text-white shadow-[0_6px_20px_rgba(0,62,199,0.25)] md:mx-4">
                    vs.
                  </div>
                  <div className="hidden h-full w-px bg-[#c3c5d9]/30 md:block" />
                </div>

                <div className="rounded-2xl bg-[#eff4ff] p-6 ring-1 ring-[#003ec7]/15">
                  <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#003ec7]">
                    <ShieldCheck className="h-4 w-4" /> Vantirs Pro
                  </div>
                  <p className="font-manrope text-4xl font-extrabold text-[#0b1c30] md:text-5xl">
                    $99<span className="text-2xl font-bold text-slate-400">/mo</span>
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Covers up to 15 client entities — vendor fingerprinting, alerts, and a full
                    review queue.
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-xl bg-gradient-to-r from-[#0b1c30] to-[#003ec7] p-6 text-center text-white shadow-[0_10px_30px_rgba(0,62,199,0.2)]">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200">
                  Translation
                </p>
                <p className="mt-2 font-manrope text-xl font-bold md:text-2xl">
                  Stopping <span className="text-[#ffd666]">one</span> fraudulent wire funds
                  Vantirs for <span className="text-[#ffd666]">~115 years</span>.
                </p>
                <p className="mt-2 text-sm text-blue-100">
                  Your E&amp;O carrier, your partners, and your clients will all ask why you
                  weren&apos;t running it sooner.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FAQ (objection handling + cognitive ease) ──────────────── */}
        <section id="faq" className="scroll-mt-24 py-20 md:py-24">
          <div className="mx-auto max-w-4xl px-6 md:px-8">
            <div className="mb-14 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">
                Before you ask
              </p>
              <h2 className="mt-3 font-manrope text-3xl font-bold tracking-tight text-[#0b1c30] md:text-4xl">
                Honest answers to the usual objections
              </h2>
            </div>

            <div className="space-y-3">
              {[
                {
                  q: 'How long does setup actually take?',
                  a: 'About 8 minutes per client. You authenticate your client\'s QuickBooks Online via OAuth, we pull 12+ months of vendor and invoice history in the background, and the queue is live for your next pay run. No DNS changes, no IT tickets, no new tools for your team.',
                },
                {
                  q: 'Do you have write access to my clients\' QuickBooks?',
                  a: 'No. Vantirs requests read-only QuickBooks access. We never post invoices, never move money, and never modify vendor records. We observe, score, and alert — the approvals and payments stay entirely in your existing workflow.',
                },
                {
                  q: 'Will we drown in false positives?',
                  a: 'No. Every alert is tied to a specific, explainable signal against that vendor\'s own history — not a generic "AI risk score." Low-risk invoices pass silently. Most firms see a handful of high-signal alerts per month across all clients, which is the point.',
                },
                {
                  q: 'Is this compliant with my E&O and data security requirements?',
                  a: 'We\'re SOC 2 Ready with 256-bit encryption in transit and at rest. We retain QuickBooks data only as long as required to build vendor fingerprints and produce alerts, and every review decision generates a timestamped audit trail you can hand to your carrier.',
                },
                {
                  q: 'What does this look like for my AP team day-to-day?',
                  a: 'Your team keeps using QBO exactly as they do today. When a risky invoice lands, they get a Slack or email alert with the full context — expected vs. actual bank account, vendor history, anomaly score, and a one-click hold. That\'s the entire change.',
                },
                {
                  q: 'Can I cancel if it doesn\'t fit?',
                  a: 'Yes. Monthly plans cancel anytime from the billing screen — no calls, no retention dance. If a partner code gave you the Scale plan for free, you keep the 3-month trial and convert only if you want to.',
                },
              ].map((item, i) => (
                <details
                  key={i}
                  className="group rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(11,28,48,0.04)] ring-1 ring-[#c3c5d9]/15 open:shadow-[0_12px_40px_rgba(11,28,48,0.08)]"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                    <span className="font-manrope text-base font-bold text-[#0b1c30] md:text-lg">
                      {item.q}
                    </span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eff4ff] text-[#003ec7] transition-transform group-open:rotate-45">
                      <span className="text-xl leading-none">+</span>
                    </span>
                  </summary>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Guarantee + dark CTA band (risk reversal + peak-end) ───── */}
        <section className="px-6 py-12 md:px-8">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-[#0b1c30] px-8 py-16 text-center md:px-16 md:py-20">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#003ec7]/25 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#833700]/20 blur-[100px]" />
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200">
                <ShieldCheck className="h-3.5 w-3.5" />
                Risk-free review
              </div>
              <h2 className="font-manrope text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                Start with a free vendor audit.
                <br />
                <span className="text-[#ffd666]">If we find nothing, you lose nothing.</span>
              </h2>
              <p className="mx-auto max-w-xl text-lg text-white/75">
                Connect one QuickBooks client in under 10 minutes. We&apos;ll scan 12 months of vendor
                history and email you a risk report. Keep the report either way.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row sm:gap-4">
                <Link
                  href="/signup"
                  className="inline-flex min-w-[200px] items-center justify-center gap-2 rounded-xl bg-white px-10 py-4 text-base font-bold text-[#0b1c30] transition hover:bg-[#eff4ff]"
                >
                  Get my free audit <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex min-w-[200px] items-center justify-center rounded-xl border border-white/25 bg-transparent px-10 py-4 text-base font-bold text-white hover:bg-white/10"
                >
                  Start 30-day trial
                </Link>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 text-xs text-white/60">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#ffd666]" /> No credit card
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#ffd666]" /> Read-only access
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#ffd666]" /> Cancel anytime
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Pricing ──────────────────────────────────────────────────── */}
        <PricingSection />

        {/* ─── Disclaimer (honesty = trust) ─────────────────────────────── */}
        <section className="py-10">
          <p className="mx-auto max-w-2xl px-6 text-center text-xs leading-relaxed text-slate-400 md:px-8">
            Vantirs provides payment verification assistance and helps flag anomalies. It does not
            guarantee fraud detection. Always verify suspicious payments through direct phone
            contact with known vendor numbers.
          </p>
        </section>

        {/* ─── Footer ───────────────────────────────────────────────────── */}
        <footer className="border-t border-[#c3c5d9]/15 bg-[#f8f9ff] py-14">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-2 md:gap-12 lg:grid-cols-4 md:px-8">
            <div>
              <VantirsLogo
                href="/"
                className="inline-flex items-center"
                imageClassName="h-8 w-auto"
                width={142}
                height={48}
              />
              <p className="mt-4 text-xs leading-relaxed text-slate-500">
                Payment verification for accounting firms on QuickBooks Online — fingerprint
                vendors, flag anomalies, protect client cash.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <Mail className="h-3.5 w-3.5" />
                <a href="mailto:hello@vantirs.com" className="hover:text-[#003ec7]">
                  hello@vantirs.com
                </a>
              </div>
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
            <div className="flex flex-col gap-4 md:items-end">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#eff4ff] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#003ec7]">
                <FileSearch className="h-3.5 w-3.5" />
                Free vendor audit
              </div>
              <Link href="/signup" className="btn-primary-gradient text-sm px-5 py-2.5">
                Start free trial
              </Link>
              <p className="text-xs text-slate-400">
                © {new Date().getFullYear()} Vantirs. All rights reserved.
              </p>
            </div>
          </div>
        </footer>

        <ExitIntentPopup />
      </main>
    </div>
  )
}
