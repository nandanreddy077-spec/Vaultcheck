import Link from 'next/link'
import { Mail } from 'lucide-react'
import VantirsLogo from '@/components/VantirsLogo'

export default function GuaranteePage() {
  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col">
      <header className="fixed top-0 z-50 w-full border-b border-transparent bg-[#f8f9ff]/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <VantirsLogo href="/" className="inline-flex items-center" imageClassName="h-9 w-auto" width={160} height={54} />
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-[#0b1c30]">Sign in</Link>
            <Link href="/signup" className="btn-primary-gradient text-sm px-5 py-2.5">Start free trial</Link>
          </div>
        </nav>
      </header>

      <main className="flex flex-1 items-center justify-center pt-24 pb-16 px-6">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eff4ff]">
            <Mail className="h-8 w-8 text-[#003ec7]" />
          </div>
          <h1 className="font-manrope text-2xl font-bold text-[#0b1c30]">Have a question?</h1>
          <p className="mt-3 text-slate-500">Reach out to our team directly.</p>
          <a
            href="mailto:team@vantirs.com"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#003ec7] px-8 py-4 text-base font-semibold text-white hover:bg-[#0032a0] transition"
          >
            <Mail className="h-4 w-4" />
            team@vantirs.com
          </a>
        </div>
      </main>
    </div>
  )
}
