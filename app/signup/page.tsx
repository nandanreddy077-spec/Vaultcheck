'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Shield } from 'lucide-react'

export default function SignupPage() {
  const [form, setForm] = useState({ firmName: '', name: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Sign up via magic link — firm + user created in /auth/callback
    const { error } = await supabase.auth.signInWithOtp({
      email: form.email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { name: form.name, firmName: form.firmName },
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center gap-2 text-blue-600">
            <Shield className="w-8 h-8" />
            <span className="text-2xl font-bold text-gray-900">VaultCheck</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Start your free trial
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          30 days free. No credit card required.{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Already have an account?
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Check your email</h3>
              <p className="mt-2 text-sm text-gray-600">
                We sent a sign-in link to <strong>{form.email}</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">Accounting firm name</label>
                <input
                  type="text"
                  required
                  value={form.firmName}
                  onChange={e => setForm(f => ({ ...f, firmName: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Smith & Partners CPA"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Your name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Jane Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Work email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="jane@smithcpa.com"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Create account & send link'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
