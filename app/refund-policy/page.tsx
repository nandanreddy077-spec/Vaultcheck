import Link from 'next/link'
import VantirsLogo from '@/components/VantirsLogo'

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <VantirsLogo href="/" className="inline-flex items-center" imageClassName="h-8 w-auto" width={142} height={48} />
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Refund Policy</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: April 1, 2026</p>

        <div className="prose prose-gray max-w-none space-y-6 text-sm leading-relaxed text-gray-600">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Overview</h2>
            <p>
              This Refund Policy explains when refunds may be issued for paid Vantirs subscriptions. Vantirs is
              subscription software billed monthly through Paddle, our merchant of record.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Free Trial</h2>
            <p>
              New accounts may receive a free trial before any paid subscription begins. You may cancel during the
              trial period and you will not be charged.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Monthly Subscriptions</h2>
            <p>
              Paid plans are billed in advance on a monthly basis. You may cancel at any time, and your cancellation
              will take effect at the end of the current billing period unless otherwise required by law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Refund Eligibility</h2>
            <p>
              Subscription fees are generally non-refundable once a billing period has started. However, we may review
              refund requests on a case-by-case basis in situations such as duplicate charges, accidental purchases, or
              confirmed billing errors.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. How to Request a Refund</h2>
            <p>
              To request a refund, contact us at <strong>billing@vantirs.app</strong> within 14 days of the charge and
              include the account email, firm name, charge date, and reason for the request.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Chargebacks</h2>
            <p>
              If you believe you were charged in error, please contact us before initiating a chargeback so we can try
              to resolve the issue quickly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Contact</h2>
            <p>
              For billing and refund questions, contact <strong>billing@vantirs.app</strong>. For general legal terms,
              see our <Link href="/terms-of-service" className="text-blue-600 hover:underline">Terms of Service</Link>{' '}
              and <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
