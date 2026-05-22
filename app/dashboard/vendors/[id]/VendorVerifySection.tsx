'use client'

import { useState } from 'react'
import { Shield, CheckCircle, Clock, Send, Copy } from 'lucide-react'

interface Verification {
  id: string
  status: string
  requestedAt: string
  completedAt: string | null
  confirmedEmail: string | null
  confirmedName: string | null
}

interface Props {
  vendorId: string
  vendorEmail: string | null
  verifications: Verification[]
}

export default function VendorVerifySection({ vendorId, vendorEmail, verifications: initial }: Props) {
  const [verifications, setVerifications] = useState(initial)
  const [sending, setSending] = useState(false)
  const [sentUrl, setSentUrl] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function sendVerification() {
    setSending(true)
    setError(null)
    setSentUrl(null)
    try {
      const res = await fetch('/api/vendor-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorId, message: message.trim() || undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send')
      setSentUrl(data.verifyUrl)
      setVerifications(v => [{
        id: data.verificationId,
        status: 'pending',
        requestedAt: new Date().toISOString(),
        completedAt: null,
        confirmedEmail: null,
        confirmedName: null,
      }, ...v].slice(0, 5))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to send')
    } finally {
      setSending(false)
    }
  }

  async function copyLink(url: string) {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const hasPending = verifications.some(v => v.status === 'pending')

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-500" />
          Bank Detail Verification
        </h2>
        {!vendorEmail && (
          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">No email on file</span>
        )}
      </div>

      {/* Recent verifications */}
      {verifications.length > 0 && (
        <div className="mb-4 space-y-2">
          {verifications.map(v => (
            <div key={v.id} className="flex items-center justify-between text-xs py-1.5 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-2 text-gray-500">
                {v.status === 'completed'
                  ? <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  : <Clock className="w-3.5 h-3.5 text-amber-400" />
                }
                <span className="text-gray-600">{new Date(v.requestedAt).toLocaleDateString()}</span>
                {v.confirmedName && <span className="text-gray-400">· {v.confirmedName}</span>}
                {v.confirmedEmail && <span className="text-gray-400">· {v.confirmedEmail}</span>}
              </div>
              <span className={`font-medium px-2 py-0.5 rounded-full ${
                v.status === 'completed' ? 'bg-green-100 text-green-700' :
                v.status === 'expired' ? 'bg-gray-100 text-gray-500' :
                'bg-amber-100 text-amber-700'
              }`}>
                {v.status === 'completed' ? 'Verified' : v.status === 'expired' ? 'Expired' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Send new verification */}
      {error && (
        <div className="mb-3 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>
      )}

      {sentUrl ? (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
          <p className="text-xs font-medium text-green-800 mb-2">
            {vendorEmail ? `Verification email sent to ${vendorEmail}` : 'Verification link created — share manually:'}
          </p>
          <div className="flex items-center gap-2">
            <code className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded flex-1 truncate">{sentUrl}</code>
            <button
              onClick={() => copyLink(sentUrl)}
              className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-lg"
            >
              <Copy className="w-3 h-3" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Optional custom message to the vendor..."
              rows={2}
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003ec7]/20 focus:border-[#003ec7] resize-none text-gray-700 placeholder-gray-400"
            />
          </div>
          <button
            onClick={sendVerification}
            disabled={sending || (!vendorEmail && false)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-br from-[#003ec7] to-[#0052ff] rounded-lg hover:opacity-90 disabled:opacity-60 shadow shadow-blue-500/20"
          >
            <Send className="w-3.5 h-3.5" />
            {sending ? 'Sending...' : hasPending ? 'Send New Verification Request' : 'Send Verification Request'}
          </button>
          {!vendorEmail && (
            <p className="text-xs text-gray-400">No email on file — a shareable link will be created instead.</p>
          )}
        </div>
      )}
    </div>
  )
}
