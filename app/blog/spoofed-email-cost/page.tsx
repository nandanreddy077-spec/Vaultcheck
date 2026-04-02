import type { Metadata } from 'next'
import Link from 'next/link'
import MarketingSeoShell from '@/components/MarketingSeoShell'

export const metadata: Metadata = {
  title: 'How One Spoofed Email Can Cost Your Client $250K (And Your Firm Its Reputation) | Vantirs',
  description:
    'A realistic BEC scenario for accounting firms: spoofed vendor email, urgent bank change, wire fraud aftermath, and how vendor email spoofing drives accounting fraud losses.',
  alternates: { canonical: '/blog/spoofed-email-cost' },
}

export default function SpoofedEmailCostPost() {
  return (
    <MarketingSeoShell>
      <article className="mx-auto max-w-4xl px-6 py-16 md:px-8 md:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">Blog</p>
        <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30]">
          How one spoofed email can cost your client $250K (and your firm its reputation)
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-600">
          Vendor email spoofing remains one of the fastest paths to accounting fraud losses because it exploits trust, not firewalls. The scenario below is composite but faithful to real cases: one plausible message, one rushed approval, and a wire that cannot be recalled.
        </p>

        <section className="mt-10">
          <h2 className="font-manrope text-2xl font-bold text-[#0b1c30]">The setup: a trusted vendor—or a convincing forgery</h2>
          <p className="mt-3 text-slate-700">
            Your client’s AP contact receives email from a display name they recognize: a long-time materials supplier. The body references an open PO and an “updated remittance account” effective immediately due to a treasury consolidation. The tone is calm, professional, and specific enough to feel legitimate.
          </p>
          <p className="mt-4 text-slate-700">
            In reality, the sender domain is a look-alike or the thread was injected after a mailbox compromise. This is classic vendor email spoofing: the fraud lives in the message, not in your firewall logs.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-manrope text-2xl font-bold text-[#0b1c30]">The urgent bank change request</h2>
          <p className="mt-3 text-slate-700">
            The email includes new ACH instructions and asks that the next scheduled $250,000 payment use the updated account “to avoid delays.” A junior staffer updates the vendor record in QuickBooks and routes for approval. The approver, juggling month-end, sees a known vendor name and signs off.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
            <li>No call-back to a phone number on file</li>
            <li>No comparison to prior successful payments</li>
            <li>No hold on first-payment-to-new-account scenarios</li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="font-manrope text-2xl font-bold text-[#0b1c30]">The wire goes out</h2>
          <p className="mt-3 text-slate-700">
            Funds leave the client’s account and settle into a mule account domestically or abroad. By the time the real vendor asks about the missing payment, the money is layered through other accounts. Recovery is uncertain; law enforcement timelines do not match payroll and supplier deadlines.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-manrope text-2xl font-bold text-[#0b1c30]">Post-incident: blame, insurance, and lost trust</h2>
          <p className="mt-3 text-slate-700">
            The client asks why the firm’s process allowed the change. Finger-pointing spans email policy, QBO permissions, and who “owned” vendor verification. An E&O claim may follow; crime policies may dispute coverage for voluntary payment to a fraudster. Even when insurance pays partially, the relationship often does not recover—referrals stop, and the firm’s name is tied to the loss in local markets.
          </p>
          <p className="mt-4 text-slate-700">
            Learn control patterns on{' '}
            <Link href="/bec-fraud-prevention" className="font-semibold text-[#003ec7] underline-offset-2 hover:underline">
              BEC fraud prevention
            </Link>{' '}
            and firm-specific guidance on{' '}
            <Link href="/for-accounting-firms" className="font-semibold text-[#003ec7] underline-offset-2 hover:underline">
              for accounting firms
            </Link>
            .
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-manrope text-2xl font-bold text-[#0b1c30]">Prevention timeline: what should have happened</h2>
          <p className="mt-3 text-slate-700">
            Before any bank change pays: verify out-of-band, compare to historical payee fingerprints, and require dual control for high-dollar first payments to new accounts. Automated alerts on vendor master changes close the gap between policy and daily execution—so spoofed email does not become spoofed banking details.
          </p>
        </section>

        <section className="mt-10 rounded-[2rem] bg-[#eff4ff] p-8 ring-1 ring-[#c3c5d9]/15">
          <h2 className="font-manrope text-2xl font-bold text-[#0b1c30]">Stop BEC before the wire</h2>
          <p className="mt-3 text-slate-700">
            Layer email hygiene with vendor verification and invoice anomaly detection so urgency cannot bypass evidence.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/bec-fraud-prevention" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
              BEC fraud prevention
            </Link>
            <Link href="/for-accounting-firms" className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-semibold text-[#003ec7] ring-1 ring-[#c3c5d9]/20 hover:bg-[#f8f9ff]">
              For accounting firms
            </Link>
          </div>
        </section>
      </article>
    </MarketingSeoShell>
  )
}
