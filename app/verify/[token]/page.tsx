'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Shield, Loader2 } from 'lucide-react'
import VantirsLogo from '@/components/VantirsLogo'

interface VerificationInfo {
  status: 'pending' | 'completed' | 'expired' | 'invalid'
  vendorName?: string
  clientName?: string
  vendorEmail?: string
}

export default function VendorVerifyPage({ params }: { params: { token: string } }) {
  const { token } = params
  const [info, setInfo] = useState<VerificationInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    bankAccount: '',
    routingNumber: '',
    phone: '',
    notes: '',
  })

  useEffect(() => {
    fetch(`/api/vendor-verification/${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          setInfo({ status: 'invalid' })
        } else {
          setInfo(data)
          if (data.vendorEmail) setForm(f => ({ ...f, email: data.vendorEmail }))
          if (data.vendorName) setForm(f => ({ ...f, name: data.vendorName }))
        }
      })
      .catch(() => setInfo({ status: 'invalid' }))
      .finally(() => setLoading(false))
  }, [token])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email) {
      setError('Name and email are required.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`/api/vendor-verification/${token}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Submission failed')
      }
      setDone(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#003ec7] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <VantirsLogo href="/" imageClassName="h-8 w-auto" width={140} height={47} />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header bar */}
          <div className="bg-gradient-to-r from-[#003ec7] to-[#0052ff] px-8 py-5">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-white/80" />
              <div>
                <h1 className="text-lg font-semibold text-white">Vendor Verification</h1>
                {info?.clientName && (
                  <p className="text-sm text-white/70 mt-0.5">Requested by {info.clientName}'s accounting firm</p>
                )}
              </div>
            </div>
          </div>

          <div className="px-8 py-6">
            {/* States */}
            {info?.status === 'invalid' && (
              <div className="flex flex-col items-center py-8 text-center">
                <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                <h2 className="text-lg font-semibold text-gray-800">Invalid Link</h2>
                <p className="text-sm text-gray-500 mt-2">This verification link is invalid. Please contact the firm that sent it.</p>
              </div>
            )}

            {info?.status === 'expired' && (
              <div className="flex flex-col items-center py-8 text-center">
                <AlertCircle className="w-12 h-12 text-orange-400 mb-4" />
                <h2 className="text-lg font-semibold text-gray-800">Link Expired</h2>
                <p className="text-sm text-gray-500 mt-2">This verification link has expired (links are valid for 7 days). Please ask the firm to send a new one.</p>
              </div>
            )}

            {info?.status === 'completed' && !done && (
              <div className="flex flex-col items-center py-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                <h2 className="text-lg font-semibold text-gray-800">Already Verified</h2>
                <p className="text-sm text-gray-500 mt-2">This verification has already been completed. No action needed.</p>
              </div>
            )}

            {done && (
              <div className="flex flex-col items-center py-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                <h2 className="text-lg font-semibold text-gray-800">Verification Complete</h2>
                <p className="text-sm text-gray-500 mt-2 max-w-sm">
                  Thank you. Your payment details have been securely recorded. The accounting firm will use this to verify your information on file.
                </p>
              </div>
            )}

            {info?.status === 'pending' && !done && (
              <>
                <p className="text-sm text-gray-600 mb-6">
                  Please confirm your business name, contact details, and bank account information below. This creates a secure record that protects both you and {info.clientName}.
                </p>

                {error && (
                  <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Business / Contact Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="e.g. Acme Supplies LLC"
                        required
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003ec7]/30 focus:border-[#003ec7]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Contact Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="billing@yourcompany.com"
                        required
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003ec7]/30 focus:border-[#003ec7]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="(555) 000-0000"
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003ec7]/30 focus:border-[#003ec7]"
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Bank Account Details</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Routing Number</label>
                        <input
                          type="text"
                          value={form.routingNumber}
                          onChange={e => setForm(f => ({ ...f, routingNumber: e.target.value }))}
                          placeholder="9 digits"
                          maxLength={9}
                          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003ec7]/30 focus:border-[#003ec7] font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Account Number</label>
                        <input
                          type="text"
                          value={form.bankAccount}
                          onChange={e => setForm(f => ({ ...f, bankAccount: e.target.value }))}
                          placeholder="Account number"
                          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003ec7]/30 focus:border-[#003ec7] font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Notes (optional)</label>
                    <textarea
                      value={form.notes}
                      onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                      placeholder="Any changes to your banking information or contact details..."
                      rows={2}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003ec7]/30 focus:border-[#003ec7] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-gradient-to-br from-[#003ec7] to-[#0052ff] rounded-lg hover:opacity-90 disabled:opacity-60 shadow-lg shadow-blue-500/20"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                    {submitting ? 'Submitting...' : 'Confirm My Details'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Secured by Vantirs · Your information is encrypted and only shared with the requesting accounting firm.
        </p>
      </div>
    </div>
  )
}
