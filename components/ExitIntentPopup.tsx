'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

const SESSION_KEY = 'vantirs_exit_intent_popup_shown'

export default function ExitIntentPopup() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const router = useRouter()

  useEffect(() => {
    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY >= 0) return
      if (typeof window === 'undefined' || sessionStorage.getItem(SESSION_KEY)) return
      sessionStorage.setItem(SESSION_KEY, '1')
      setOpen(true)
    }

    document.addEventListener('mouseout', onMouseOut)
    return () => document.removeEventListener('mouseout', onMouseOut)
  }, [])

  const close = () => setOpen(false)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams({ lead: 'checklist' })
    const trimmed = email.trim()
    if (trimmed) params.set('email', trimmed)
    router.push(`/signup?${params.toString()}`)
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b1c30]/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-title"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_24px_80px_rgba(11,28,48,0.2)] ring-1 ring-[#c3c5d9]/20">
        <button
          type="button"
          onClick={close}
          className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition-colors hover:bg-[#eff4ff] hover:text-[#003ec7]"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 id="exit-intent-title" className="pr-10 font-manrope text-xl font-bold text-[#003ec7]">
          Before you go — download the free Vendor Verification Checklist
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          The 12-point checklist accounting firms use to verify vendors before payment.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label htmlFor="exit-intent-email" className="sr-only">
            Email
          </label>
          <input
            id="exit-intent-email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Work email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full rounded-xl border border-[#c3c5d9]/40 bg-[#f8f9ff] px-4 py-3 text-sm text-[#0b1c30] placeholder:text-slate-400 outline-none ring-[#003ec7]/0 transition focus:border-[#003ec7]/40 focus:bg-white focus:ring-2 focus:ring-[#003ec7]/20"
          />
          <button
            type="submit"
            className="btn-primary-gradient w-full px-6 py-3 text-sm font-semibold text-white"
          >
            Download checklist
          </button>
        </form>
      </div>
    </div>
  )
}
