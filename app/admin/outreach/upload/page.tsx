'use client'

import { useState } from 'react'

interface LeadRow {
  first_name: string
  last_name: string
  email: string
  title?: string
  company_name?: string
  city?: string
  state?: string
}

function parseCSV(text: string): LeadRow[] {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_').replace(/['"]/g, ''))

  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''))
    const row: Record<string, string> = {}
    headers.forEach((h, i) => { row[h] = values[i] ?? '' })

    return {
      first_name: row['first_name'] || row['firstname'] || row['first'] || '',
      last_name: row['last_name'] || row['lastname'] || row['last'] || '',
      email: row['email'] || row['email_address'] || '',
      title: row['title'] || row['job_title'] || '',
      company_name: row['company'] || row['company_name'] || row['organization'] || '',
      city: row['city'] || '',
      state: row['state'] || '',
    }
  }).filter(r => r.email && r.first_name)
}

export default function UploadLeadsPage() {
  const [leads, setLeads] = useState<LeadRow[]>([])
  const [status, setStatus] = useState<'idle' | 'parsing' | 'uploading' | 'done' | 'error'>('idle')
  const [result, setResult] = useState<{ saved: number; qualified: number; skipped: number } | null>(null)
  const [error, setError] = useState('')
  const [cronSecret, setCronSecret] = useState('')

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setStatus('parsing')
    const reader = new FileReader()
    reader.onload = (ev) => {
      const parsed = parseCSV(ev.target?.result as string)
      setLeads(parsed)
      setStatus('idle')
    }
    reader.readAsText(file)
  }

  async function handleUpload() {
    if (!leads.length || !cronSecret) return
    setStatus('uploading')
    setError('')
    try {
      const res = await fetch('/api/agent/upload-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${cronSecret}` },
        body: JSON.stringify({ leads }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Upload failed')
      setResult(data)
      setStatus('done')
    } catch (err) {
      setError(String(err))
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Upload Lead List</h1>
          <p className="text-gray-400 text-sm mt-1">
            CSV with columns: first_name, last_name, email, title, company_name, city, state
          </p>
        </div>

        {/* Secret */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">CRON_SECRET</label>
          <input
            type="password"
            value={cronSecret}
            onChange={e => setCronSecret(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-white"
            placeholder="Your CRON_SECRET from Vercel env vars"
          />
        </div>

        {/* File upload */}
        <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
          <input type="file" accept=".csv" onChange={handleFile} className="hidden" id="csv-upload" />
          <label htmlFor="csv-upload" className="cursor-pointer">
            <div className="text-gray-400 text-sm">
              {leads.length > 0
                ? <span className="text-green-400 font-medium">{leads.length} leads parsed ✓</span>
                : 'Click to upload CSV'}
            </div>
          </label>
        </div>

        {/* Preview */}
        {leads.length > 0 && (
          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-800 text-xs text-gray-400">Preview (first 5)</div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-xs">
                  {['Name', 'Email', 'Title', 'Company', 'Location'].map(h => (
                    <th key={h} className="px-4 py-2 text-left font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {leads.slice(0, 5).map((l, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2">{l.first_name} {l.last_name}</td>
                    <td className="px-4 py-2 text-gray-400">{l.email}</td>
                    <td className="px-4 py-2 text-gray-400">{l.title}</td>
                    <td className="px-4 py-2 text-gray-400">{l.company_name}</td>
                    <td className="px-4 py-2 text-gray-400">{l.city}, {l.state}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Upload button */}
        <button
          onClick={handleUpload}
          disabled={!leads.length || !cronSecret || status === 'uploading'}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-600 text-white font-medium py-3 rounded-lg text-sm transition-colors"
        >
          {status === 'uploading'
            ? `Scoring & scheduling ${leads.length} leads with Claude...`
            : `Upload & launch sequences for ${leads.length} leads`}
        </button>

        {/* Result */}
        {status === 'done' && result && (
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-6 space-y-2">
            <div className="text-green-400 font-semibold">Sequences launched ✓</div>
            <div className="text-sm text-gray-300 space-y-1">
              <div>📥 {result.saved} leads saved</div>
              <div>✓ {result.qualified} qualified (score ≥ 40) — emails scheduled</div>
              <div>✗ {result.skipped} skipped (duplicates, unsubscribed, or low score)</div>
            </div>
            <a href="/admin/outreach" className="inline-block mt-2 text-blue-400 text-sm hover:underline">
              View in dashboard →
            </a>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300 text-sm">{error}</div>
        )}

        {/* CSV template */}
        <div className="text-xs text-gray-600">
          <div className="mb-1">Expected CSV format:</div>
          <code className="block bg-gray-900 p-3 rounded text-gray-400">
            first_name,last_name,email,title,company_name,city,state<br/>
            Sarah,Reynolds,sarah@reynoldscpa.com,Owner,Reynolds CPA Group,Austin,TX
          </code>
        </div>
      </div>
    </div>
  )
}
