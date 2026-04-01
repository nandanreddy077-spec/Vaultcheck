import Link from 'next/link'
import VantirsLogo from '@/components/VantirsLogo'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <VantirsLogo href="/" className="inline-flex items-center" imageClassName="h-8 w-auto" width={142} height={48} />
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: March 21, 2026</p>

        <div className="prose prose-gray max-w-none space-y-6 text-sm leading-relaxed text-gray-600">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Vantirs (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the Service. The Service is provided by Vantirs (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Description of Service</h2>
            <p>
              Vantirs is a payment verification assistance tool that connects to QuickBooks Online, analyzes vendor payment history, and flags anomalous invoices for your review. The Service is designed to help identify potential anomalies in vendor invoices. <strong>The Service does not guarantee fraud detection or prevention.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Advisory Nature of Service</h2>
            <p>
              Vantirs is advisory only. The Service provides recommendations and flags anomalies based on statistical analysis. <strong>Vantirs does not make payment decisions, block transactions, or guarantee the accuracy of its analysis.</strong> All payment decisions remain the sole responsibility of the user. You should always verify suspicious payments through direct phone contact with known vendor numbers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. User Accounts and Multi-Tenancy</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials. Firm administrators are responsible for managing access to their firm&apos;s data, including inviting and removing team members. Each user may only access data belonging to their associated firm.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. QuickBooks Online Integration</h2>
            <p>
              By connecting your QuickBooks Online account, you authorize Vantirs to access vendor, bill, and bill payment data from the connected company file. Vantirs accesses data in read-only mode. We do not modify, delete, or create records in your QuickBooks account. You may disconnect access at any time through the Vantirs dashboard or your Intuit account settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Data Handling and Security</h2>
            <p>
              We encrypt all QuickBooks OAuth tokens at rest using AES-256-GCM encryption. Bank account information is stored only as salted cryptographic hashes — we never store raw bank account numbers. All data is transmitted over TLS. We implement row-level security to ensure firm data isolation. See our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link> for full details on data handling.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Subscription and Billing</h2>
            <p>
              Paid subscriptions are billed monthly through Paddle. You may cancel at any time. Cancellation takes effect at the end of the current billing period. Free trial periods last 30 days. No credit card is required for the trial. Pricing is per-client for firm plans.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Limitation of Liability</h2>
            <p>
              <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW, VANTIRS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Your use of or inability to use the Service;</li>
              <li>Any unauthorized access to or use of our servers and/or any personal information stored therein;</li>
              <li>Any failure of the Service to detect fraudulent, anomalous, or suspicious activity;</li>
              <li>Any payment made based on or despite Vantirs&apos;s analysis or recommendations;</li>
              <li>Any errors, inaccuracies, or omissions in the Service&apos;s analysis or alerts.</li>
            </ul>
            <p className="mt-3">
              <strong>Vantirs&apos;s total liability to you for all claims arising from the Service shall not exceed the amount you paid to us in the twelve (12) months preceding the claim.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. We do not warrant that the Service will be uninterrupted, error-free, or that it will detect all fraudulent or anomalous activity.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to the Service at any time for violation of these terms. Upon termination, your right to use the Service ceases immediately. We will provide reasonable notice when possible.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">11. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. We will notify you of material changes via email or through the Service. Your continued use of the Service after changes take effect constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">12. Contact</h2>
            <p>
              For questions about these Terms, contact us at <strong>legal@vantirs.app</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
