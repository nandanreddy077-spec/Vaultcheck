'use client'

import { useState, useEffect } from 'react'
import { UserPlus, X, Mail, Clock } from 'lucide-react'

type TeamMember = { id: string; name: string; email: string; role: string }
type Invitation = { id: string; name: string; email: string; role: string; status: string }

export default function TeamPanel({
  members,
  currentUserId,
  isAdmin,
}: {
  members: TeamMember[]
  currentUserId: string
  isAdmin: boolean
}) {
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [showInvite, setShowInvite] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', role: 'staff' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!isAdmin) return
    fetch('/api/invitations')
      .then(r => r.json())
      .then(d => setInvitations(d.invitations || []))
      .catch(() => {})
  }, [isAdmin])

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const res = await fetch('/api/invitations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Failed to send invitation.')
    } else {
      setSuccess(`Invitation sent to ${form.email}`)
      setInvitations(prev => [data.invitation, ...prev])
      setForm({ name: '', email: '', role: 'staff' })
      setShowInvite(false)
    }
    setLoading(false)
  }

  async function revokeInvite(id: string) {
    await fetch(`/api/invitations/${id}`, { method: 'DELETE' })
    setInvitations(prev => prev.filter(i => i.id !== id))
  }

  return (
    <div className="px-6 py-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900">Team members</h2>
        {isAdmin && (
          <button
            onClick={() => setShowInvite(!showInvite)}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <UserPlus className="w-4 h-4" />
            Invite
          </button>
        )}
      </div>

      {/* Invite form */}
      {showInvite && (
        <form onSubmit={handleInvite} className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="email"
              required
              placeholder="Email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send invite'}
            </button>
            <button
              type="button"
              onClick={() => setShowInvite(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      {success && <p className="text-sm text-green-600 mb-3">{success}</p>}

      {/* Members list */}
      <div className="space-y-2">
        {members.map(m => (
          <div key={m.id} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
                {m.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {m.name} {m.id === currentUserId && <span className="text-gray-400">(you)</span>}
                </p>
                <p className="text-xs text-gray-500">{m.email}</p>
              </div>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 capitalize">
              {m.role}
            </span>
          </div>
        ))}
      </div>

      {/* Pending invitations */}
      {invitations.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Pending invitations</p>
          {invitations.map(inv => (
            <div key={inv.id} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{inv.name}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {inv.email}
                  </p>
                </div>
              </div>
              {isAdmin && (
                <button
                  onClick={() => revokeInvite(inv.id)}
                  className="text-gray-400 hover:text-red-500"
                  title="Revoke invitation"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
