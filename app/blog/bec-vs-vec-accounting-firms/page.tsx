import type { Metadata } from 'next'
import Link from 'next/link'
import MarketingSeoShell from '@/components/MarketingSeoShell'
import { BlogPostingJsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'BEC vs VEC for Accounting Firms: Key Differences and Controls | Vantirs',
  description:
    'Understand business email compromise (BEC) vs vendor email compromise (VEC) and the controls accounting firms should deploy to prevent payment fraud.',
  alternates: { canonical: '/blog/bec-vs-vec-accounting-firms' },
  keywords: [
    'business email compromise vs vendor email compromise',
    'BEC fraud prevention accounting firms',
    'VEC payment fraud controls',
  ],
}

export default function BecVsVecPost() {
  return (
    <MarketingSeoShell>
      <BlogPostingJsonLd
        headline="BEC vs VEC for Accounting Firms: What Changes in Your Fraud Controls"
        description="Understand business email compromise vs vendor email compromise and the controls accounting firms should deploy to prevent payment fraud."
        path="/blog/bec-vs-vec-accounting-firms"
        datePublished="2026-04-13"
        keywords={[
          'business email compromise vs vendor email compromise',
          'BEC fraud prevention accounting firms',
          'VEC payment fraud controls',
        ]}
      />
      <article className="mx-auto max-w-4xl px-6 py-16 md:px-8 md:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">Explainer</p>
        <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30]">
          BEC vs VEC for accounting firms: what changes in your fraud controls
        </h1>
        <p className="mt-3 text-sm text-slate-500">Published Apr 13, 2026 · About 7 min read</p>
        <p className="mt-5 text-lg leading-relaxed text-slate-600">
          BEC and VEC are often grouped together, but they are not the same attack. If your team treats them as one
          category, your controls can miss the highest-risk scenario: fraudulent payment changes sent from a real vendor
          mailbox.
        </p>

        <section className="mt-10">
          <h2 className="font-manrope text-2xl font-bold text-[#0b1c30]">Quick definitions</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
            <li>
              <strong className="text-[#0b1c30]">BEC (Business Email Compromise):</strong> attacker impersonates an
              executive, employee, or financial contact to trigger fraudulent payment action.
            </li>
            <li>
              <strong className="text-[#0b1c30]">VEC (Vendor Email Compromise):</strong> attacker uses a compromised or
              impersonated vendor identity to request payment-detail changes or reroute funds.
            </li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="font-manrope text-2xl font-bold text-[#0b1c30]">Why VEC is often more dangerous in AP workflows</h2>
          <p className="mt-3 text-slate-700">
            BEC messages can sometimes be caught through sender anomalies or policy controls. VEC attacks are harder
            because the request appears to come from a trusted vendor relationship. The payment context is valid. The
            invoice can look normal. Only the routing outcome is fraudulent.
          </p>
          <p className="mt-4 text-slate-700">
            This is why vendor bank-detail changes should be treated as high-risk events, even when communication feels
            routine.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-manrope text-2xl font-bold text-[#0b1c30]">Controls that map to each attack type</h2>
          <div className="mt-6 overflow-x-auto rounded-2xl ring-1 ring-[#c3c5d9]/20">
            <table className="min-w-full bg-white text-sm">
              <thead className="bg-[#eff4ff] text-left text-[#0b1c30]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Attack type</th>
                  <th className="px-4 py-3 font-semibold">Primary risk</th>
                  <th className="px-4 py-3 font-semibold">Best control</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-t border-[#c3c5d9]/20">
                  <td className="px-4 py-3">BEC</td>
                  <td className="px-4 py-3">Impersonated authority and urgent request</td>
                  <td className="px-4 py-3">Escalation policy plus role-based approval controls</td>
                </tr>
                <tr className="border-t border-[#c3c5d9]/20">
                  <td className="px-4 py-3">VEC</td>
                  <td className="px-4 py-3">Fraudulent beneficiary or account update</td>
                  <td className="px-4 py-3">Out-of-band bank verification plus behavior-based anomaly detection</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-slate-700">
            For a deeper workflow model, see{' '}
            <Link href="/blog/pre-approved-fraud-accounts-payable" className="font-semibold text-[#003ec7] underline-offset-2 hover:underline">
              how pre-approved fraud passes AP controls
            </Link>
            .
          </p>
        </section>

        <section className="mt-10 rounded-[2rem] bg-[#eff4ff] p-8 ring-1 ring-[#c3c5d9]/15">
          <h2 className="font-manrope text-2xl font-bold text-[#0b1c30]">Build BEC and VEC controls into one AP workflow</h2>
          <p className="mt-3 text-slate-700">
            Vantirs helps accounting firms verify vendor payment instructions and flag suspicious changes before payment
            release.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/bec-fraud-prevention" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
              BEC prevention
            </Link>
            <Link
              href="/vendor-verification-software"
              className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-semibold text-[#003ec7] ring-1 ring-[#c3c5d9]/20 hover:bg-[#f8f9ff]"
            >
              Vendor verification software
            </Link>
          </div>
        </section>
      </article>
    </MarketingSeoShell>
  )
}
