import type { ReactNode } from 'react'
import Link from 'next/link'
import VantirsLogo from '@/components/VantirsLogo'

export default function MarketingSeoShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--surface)] text-[#0b1c30]">
      <header className="sticky top-0 z-50 w-full border-b border-transparent bg-[#f8f9ff]/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <VantirsLogo href="/" className="inline-flex items-center" imageClassName="h-9 w-auto" width={160} height={54} />
          <div className="hidden items-center gap-10 md:flex">
            <Link href="/quickbooks-fraud-prevention" className="text-sm font-medium text-slate-600 transition-colors hover:text-[#003ec7]">
              Platform
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium text-slate-600 transition-colors hover:text-[#003ec7]">
              How it works
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-slate-600 transition-colors hover:text-[#003ec7]">
              Pricing
            </Link>
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

      <main>{children}</main>

      <footer className="border-t border-[#c3c5d9]/15 bg-[#f8f9ff] py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-2 md:gap-12 lg:grid-cols-4 md:px-8">
          <div>
            <VantirsLogo href="/" className="inline-flex items-center" imageClassName="h-8 w-auto" width={142} height={48} />
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              Payment verification for accounting firms on QuickBooks Online—fingerprint vendors, flag anomalies, protect client cash.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Product</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/quickbooks-fraud-prevention" className="hover:text-[#003ec7]">
                  Platform
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[#003ec7]">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#003ec7]">
                  Pricing
                </Link>
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
    </div>
  )
}

