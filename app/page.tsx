import Link from 'next/link'
import { Shield, CheckCircle, AlertTriangle, TrendingUp, Lock } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-gray-900 text-lg">VaultCheck</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Sign in</Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
          <Shield className="w-4 h-4" />
          Payment verification for accounting firms
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Flag suspicious invoices<br />before money leaves the account
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          VaultCheck connects to QuickBooks Online, builds statistical profiles of every vendor, and
          helps flag anomalous invoices — before your clients pay them.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 text-base"
          >
            Start 30-day free trial
          </Link>
          <Link href="/login" className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 text-base">
            Sign in
          </Link>
        </div>
        <p className="text-sm text-gray-400 mt-4">No credit card required · Cancel anytime</p>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-16">
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
                desc: 'VaultCheck analyzes 12+ months of payment history to build statistical profiles for every vendor.',
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
            <div key={feature.title} className="flex gap-4 p-6 bg-gray-50 rounded-lg">
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
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Pricing</h2>
          <p className="text-gray-500 text-center mb-12">Per-client pricing. No hidden fees.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'Firm Starter', price: '$149', unit: '/mo per client', clients: 'Up to 10 clients', features: ['Multi-client dashboard', 'Email alerts', 'Vendor fingerprinting', 'Alert queue'] },
              { name: 'Firm Growth', price: '$129', unit: '/mo per client', clients: 'Up to 30 clients', features: ['Everything in Starter', 'Slack alerts', 'API access', 'Priority support'], popular: true },
              { name: 'Enterprise', price: '$99', unit: '/mo per client', clients: 'Unlimited clients', features: ['Everything in Growth', 'Custom rules', 'Dedicated onboarding', 'SLA guarantee'] },
            ].map(plan => (
              <div key={plan.name} className={`bg-white rounded-lg border p-6 ${plan.popular ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}`}>
                {plan.popular && (
                  <div className="text-xs font-medium text-blue-600 uppercase tracking-wider mb-2">Most popular</div>
                )}
                <h3 className="font-bold text-gray-900 text-lg">{plan.name}</h3>
                <div className="mt-2 mb-1">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-sm text-gray-500">{plan.unit}</span>
                </div>
                <p className="text-xs text-gray-400 mb-4">{plan.clients}</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`block w-full text-center py-2 px-4 rounded-md text-sm font-medium ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Start free trial
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <p className="text-xs text-gray-400 text-center leading-relaxed max-w-2xl mx-auto">
          VaultCheck provides payment verification assistance and helps flag anomalies. It does not guarantee fraud detection.
          Always verify suspicious payments through direct phone contact with known vendor numbers.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-900">VaultCheck</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-sm text-gray-400 hover:text-gray-600">Terms of Service</Link>
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-gray-600">Privacy Policy</Link>
            <p className="text-sm text-gray-400">© 2026 VaultCheck. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
