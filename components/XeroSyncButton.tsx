'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function XeroSyncButton({ clientId }: { clientId: string }) {
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSync() {
    setSyncing(true)
    setError(null)
    try {
      const res = await fetch(`/api/xero/sync/${clientId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'incremental' }),
      })
      if (!res.ok) {
        const text = await res.text()
        const data = text ? JSON.parse(text) : null
        throw new Error(data?.error || 'Sync failed')
      }
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sync failed')
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handleSync}
        disabled={syncing}
        className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 text-sm font-medium rounded-lg hover:bg-[#eff4ff] disabled:opacity-50 shadow-[0_4px_20px_rgba(11,28,48,0.06)]"
      >
        <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
        {syncing ? 'Syncing...' : 'Sync Xero'}
      </button>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  )
}
