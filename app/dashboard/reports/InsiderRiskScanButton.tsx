'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'

export default function InsiderRiskScanButton() {
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function run() {
    setScanning(true)
    setResult(null)
    try {
      const res = await fetch('/api/insider-risk/scan', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data.totalFlags > 0 ? `${data.totalFlags} new flag${data.totalFlags !== 1 ? 's' : ''} found` : 'No new issues')
    } catch {
      setResult('Scan failed')
    } finally {
      setScanning(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {result && (
        <span className="text-xs text-slate-600">{result}</span>
      )}
      <button
        onClick={run}
        disabled={scanning}
        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-gradient-to-br from-[#003ec7] to-[#0052ff] rounded-xl hover:opacity-90 disabled:opacity-60 shadow-lg shadow-blue-500/20"
      >
        <RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
        {scanning ? 'Scanning...' : 'Run Insider Scan'}
      </button>
    </div>
  )
}
