'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewClientPage() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Failed to create client')
      setLoading(false)
      return
    }

    router.push(`/dashboard/clients/${data.id}`)
  }

  return (
    <div className="p-8 max-w-lg">
      <Link href="/dashboard/clients" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to clients
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Add a new client</h1>
      <p className="text-sm text-gray-500 mb-8">
        After creating the client you&apos;ll be able to connect their QuickBooks account.
      </p>

      <form onSubmit={handleCreate} className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Acme Corp"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create client'}
        </button>
      </form>
    </div>
  )
}
