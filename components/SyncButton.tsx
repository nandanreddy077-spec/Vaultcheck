'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SyncButton({ clientId }: { clientId: string }) {
  const [syncing, setSyncing] = useState(false)
  const router = useRouter()

  async function handleSync() {
    setSyncing(true)
    await fetch(`/api/qbo/sync/${clientId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'incremental' }),
    })
    router.refresh()
    setSyncing(false)
  }

  return (
    <button
      onClick={handleSync}
      disabled={syncing}
      className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 disabled:opacity-50"
    >
      <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
      {syncing ? 'Syncing...' : 'Sync QBO'}
    </button>
  )
}
