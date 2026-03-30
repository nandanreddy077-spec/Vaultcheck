import Link from 'next/link'
import { Shield, CheckCircle, AlertTriangle, TrendingUp, Lock } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      {/* Nav */}
      <nav className="bg-[#f8f9ff]/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-gray-900 text-lg">Vantirs</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Sign in</Link>
            <Link
              href="/signup"
              className="btn-primary-gradient text-sm"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e5eeff] text-[#003ec7] rounded-full text-sm font-medium mb-6">
          <Shield className="w-4 h-4" />
          Payment verification for accounting firms
        </div>
        <h1 className="text-5xl font-semibold text-[#0b1c30] mb-6 leading-tight">
          Flag suspicious invoices<br />before money leaves the account
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          Vantirs connects to QuickBooks Online, builds statistical profiles of every vendor, and
          helps flag anomalous invoices — before your clients pay them.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="btn-primary-gradient px-6 py-3 text-base"
          >
            Start 30-day free trial
          </Link>
          <Link href="/login" className="px-6 py-3 bg-white text-slate-700 font-medium rounded-lg hover:bg-[#eff4ff] text-base shadow-[0_4px_20px_rgba(11,28,48,0.06)]">
            Sign in
          </Link>
        </div>
        <p className="text-sm text-gray-400 mt-4">No credit card required · Cancel anytime</p>
      </section>

      {/* How it works */}
      <section className="bg-[#eff4ff] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Connect QuickBooks',
                desc: 'OAuth connect to your client\'s QuickBooks Online in one click. We sync vendor and invoice history.',
              },
              {
                step: '2',
                title: 'We build vendor fingerprints',
                desc: 'Vantirs analyzes 12+ months of payment history to build statistical profiles for every vendor.',
              },
              {
                step: '3',
                title: 'Anomalous invoices are flagged',
                desc: 'Every new invoice is scored against the vendor\'s fingerprint. High-risk anomalies trigger instant alerts for your review.',
              },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What we detect</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
              title: 'Bank account changes',
              desc: 'Instantly flags when an invoice arrives with a different bank account than any previously paid to this vendor. #1 indicator of BEC fraud.',
            },
            {
              icon: <Lock className="w-5 h-5 text-orange-500" />,
              title: 'Email domain spoofing',
              desc: 'Detects when the sender\'s email domain doesn\'t match known vendor domains — even subtle look-alike domains.',
            },
            {
              icon: <TrendingUp className="w-5 h-5 text-yellow-500" />,
              title: 'Statistical amount anomalies',
              desc: 'Flags invoices that are statistically unusual compared to the vendor\'s payment history using z-score analysis.',
            },
            {
              icon: <CheckCircle className="w-5 h-5 text-blue-500" />,
              title: 'New vendor verification',
              desc: 'Every invoice from a first-time vendor is flagged for manual review. No payment history = no trust.',
            },
          ].map(feature => (
              <div key={feature.title} className="flex gap-4 p-6 bg-white rounded-xl shadow-[0_4px_20px_rgba(11,28,48,0.06)]">
              <div className="mt-0.5 shrink-0">{feature.icon}</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gray-50 py-16" id="pricing">
        <div className="max-w-6xl mx-auto px-6">

          {/* Free audit CTA — always first */}
          <div className="bg-blue-600 rounded-xl p-8 mb-12 max-w-3xl mx-auto text-center">
            <div className="inline-block bg-blue-500 text-blue-100 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3">Start here</div>
            <h2 className="text-2xl font-bold text-white mb-2">Run a free vendor audit — no commitment</h2>
            <p className="text-blue-100 text-sm mb-6 max-w-lg mx-auto">
              We connect to your QuickBooks Online, scan 12 months of payment history, and deliver a risk report.
              If we find nothing, there&apos;s nothing to buy. If we find anomalies, we&apos;ll show you exactly what to do next.
            </p>
            <Link
              href="/signup"
              className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-md hover:bg-blue-50 transition-colors text-sm"
            >
              Request your free audit →
            </Link>
            <p className="text-blue-200 text-xs mt-3">No credit card. No sales call. Just the data.</p>
          </div>

          {/* Founding Firm banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-6 py-4 mb-10 max-w-3xl mx-auto flex items-start gap-4">
            <span className="text-2xl">🔒</span>
            <div>
              <p className="font-semibold text-amber-900 text-sm">Founding Firm pricing — 7 spots remaining</p>
              <p className="text-amber-700 text-sm mt-0.5">
                The first 10 firms lock in <strong>$49/client/month for life</strong>. Price never goes up, ever.
                Once we hit 10 firms, this offer is gone and standard pricing applies.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">Pricing</h2>
          <p className="text-gray-500 text-center mb-3">Per-client pricing — your incentives and ours are aligned.</p>
          <p className="text-center text-sm text-gray-400 mb-10">
            Save 20% with annual billing &nbsp;·&nbsp; All plans include a 30-day free trial
          </p>

          {/* 4-tier grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {[
              {
                name: 'Founding Firm',
                badge: '🔒 Locked for life',
                badgeColor: 'text-amber-600 bg-amber-50',
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
                badgeColor: 'text-gray-500 bg-gray-100',
                price: '$79',
                unit: '/client/mo',
                clients: '5-client firm = $395/mo',
                note: 'Less than 1 hour of CPA time',
                features: ['Multi-client dashboard', 'Email alerts', 'Vendor fingerprinting', 'Alert queue', '30-day free trial'],
                cta: 'Start free trial',
                ctaStyle: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
              },
              {
                name: 'Firm Growth',
                badge: '6–20 clients',
                badgeColor: 'text-blue-600 bg-blue-50',
                price: '$69',
                unit: '/client/mo',
                clients: '15-client firm = $1,035/mo',
                note: 'Volume discount kicks in',
                features: ['Everything in Starter', 'Slack alerts', 'API access', 'Priority support', 'Quarterly business review'],
                cta: 'Start free trial',
                ctaStyle: 'bg-blue-600 text-white hover:bg-blue-700',
                popular: true,
              },
              {
                name: 'Firm Pro',
                badge: '21+ clients',
                badgeColor: 'text-gray-500 bg-gray-100',
                price: '$49',
                unit: '/client/mo',
                clients: '30-client firm = $1,470/mo',
                note: 'Best rate for largest firms',
                features: ['Everything in Growth', 'Custom detection rules', 'Dedicated onboarding', 'SLA guarantee', 'White-label reports'],
                cta: 'Start free trial',
                ctaStyle: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
              },
            ].map(plan => (
              <div key={plan.name} className={`bg-white rounded-lg border p-5 flex flex-col ${plan.popular ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}`}>
                {plan.popular && (
                  <div className="text-xs font-medium text-blue-600 uppercase tracking-wider mb-2">Most popular</div>
                )}
                <span className={`self-start text-xs font-medium px-2 py-0.5 rounded-full mb-3 ${plan.badgeColor}`}>{plan.badge}</span>
                <h3 className="font-bold text-gray-900 text-base">{plan.name}</h3>
                <div className="mt-2 mb-0.5">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-xs text-gray-500">{plan.unit}</span>
                </div>
                <p className="text-xs text-gray-500 font-medium">{plan.clients}</p>
                <p className="text-xs text-gray-400 mb-4">{plan.note}</p>
                <ul className="space-y-1.5 mb-6 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`block w-full text-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Annual callout */}
          <p className="text-center text-sm text-gray-400 mt-8">
            💡 <strong className="text-gray-600">Annual billing saves 20%</strong> — and locks in your rate so you never worry about price increases.
            <Link href="/signup" className="text-blue-600 hover:underline ml-1">Switch to annual →</Link>
          </p>

        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <p className="text-xs text-gray-400 text-center leading-relaxed max-w-2xl mx-auto">
          Vantirs provides payment verification assistance and helps flag anomalies. It does not guarantee fraud detection.
          Always verify suspicious payments through direct phone contact with known vendor numbers.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-900">Vantirs</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-sm text-gray-400 hover:text-gray-600">Terms of Service</Link>
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-gray-600">Privacy Policy</Link>
            <p className="text-sm text-gray-400">© 2026 Vantirs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
