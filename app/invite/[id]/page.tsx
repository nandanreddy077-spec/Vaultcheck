'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import VantirsLogo from '@/components/VantirsLogo'

export default function InvitePage({ params }: { params: Promise<{ id: string }> }) {
  const [inviteId, setInviteId] = useState<string | null>(null)
  const [invite, setInvite] = useState<{
    id: string
    email: string
    name: string
    role: string
    firmName: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    params.then(p => setInviteId(p.id))
  }, [params])

  useEffect(() => {
    if (!inviteId) return
    fetch(`/api/invitations/${inviteId}/accept`)
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else {
          setInvite(data.invitation)
        }
      })
      .catch(() => setError('Failed to load invitation.'))
      .finally(() => setLoading(false))
  }, [inviteId])

  const supabase = createClient()

  async function handleAccept() {
    if (!invite) return
    setAccepting(true)
    setError('')

    const { error: authError } = await supabase.auth.signInWithOtp({
      email: invite.email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard&inviteId=${invite.id}`,
        data: { name: invite.name, inviteId: invite.id },
      },
    })

    if (authError) {
      setError(authError.message)
    } else {
      setSent(true)
    }
    setAccepting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading invitation...</div>
      </div>
    )
  }

  if (error && !invite) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <VantirsLogo href="/" className="inline-flex items-center justify-center mx-auto mb-4" imageClassName="h-10 w-auto opacity-30" width={132} height={44} />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid invitation</h2>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <VantirsLogo href="/" className="inline-flex items-center" imageClassName="h-10 w-auto" width={160} height={54} />
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Check your email</h3>
              <p className="mt-2 text-sm text-gray-600">
                We sent a sign-in link to <strong>{invite?.email}</strong>.
                Click it to join <strong>{invite?.firmName}</strong>.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
                You&apos;re invited
              </h2>
              <p className="text-sm text-gray-500 text-center mb-6">
                Join <strong>{invite?.firmName}</strong> on Vantirs as {invite?.role === 'admin' ? 'an admin' : 'a staff member'}.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Name</span>
                  <span className="text-gray-900 font-medium">{invite?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Email</span>
                  <span className="text-gray-900 font-medium">{invite?.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Role</span>
                  <span className="text-gray-900 font-medium capitalize">{invite?.role}</span>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2 mb-4">{error}</p>
              )}

              <button
                onClick={handleAccept}
                disabled={accepting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {accepting ? 'Sending...' : 'Accept invitation'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
