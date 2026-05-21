'use client'

import { useState } from 'react'

interface LeadRow {
  first_name: string
  last_name: string
  email: string
  title: string
  company_name: string
  company_domain: string
  city: string
  state: string
  linkedin_url: string
}

function extractDomain(url: string): string {
  if (!url) return ''
  try { return new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace(/^www\./, '') } catch { return '' }
}

function splitName(name: string): { first: string; last: string } {
  const parts = name.trim().split(/\s+/)
  return { first: parts[0] ?? '', last: parts.slice(1).join(' ') }
}

function parseCSV(text: string): LeadRow[] {
  const lines = text.trim().split('\n').filter(l => l.trim())
  if (lines.length < 2) return []

  const rawHeaders = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase())

  const get = (row: Record<string, string>, ...keys: string[]) => {
    for (const k of keys) {
      const val = row[k]?.trim().replace(/^["']|["']$/g, '')
      if (val) return val
    }
    return ''
  }

  return lines.slice(1).flatMap(line => {
    const values: string[] = []
    let cur = '', inQ = false
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ }
      else if (ch === ',' && !inQ) { values.push(cur.trim()); cur = '' }
      else { cur += ch }
    }
    values.push(cur.trim())

    const row: Record<string, string> = {}
    rawHeaders.forEach((h, i) => { row[h] = values[i] ?? '' })

    // Support "Name/Firm/Website" (ProAdvisor export) and "first_name/last_name" (standard)
    let first_name = get(row, 'first_name', 'firstname', 'first')
    let last_name = get(row, 'last_name', 'lastname', 'last')
    if (!first_name) {
      const raw = get(row, 'name', 'full_name', 'contact')
      if (raw) { const s = splitName(raw); first_name = s.first; last_name = s.last }
    }

    const email = get(row, 'email', 'email_address', 'e-mail')
    const company_name = get(row, 'firm', 'company', 'company_name', 'organization', 'account')
    const website = get(row, 'website', 'url', 'company_domain', 'domain')
    const company_domain = extractDomain(website)
    const state = get(row, 'state', 'province')
    const city = get(row, 'city', 'location')
    const linkedin_url = get(row, 'linkedin', 'linkedin_url', 'linkedin url')
    const title = get(row, 'title', 'job_title', 'role') || 'QuickBooks ProAdvisor'

    if (!email || !first_name) return []
    return [{ first_name, last_name, email, title, company_name, company_domain, city, state, linkedin_url }]
  })
}

export default function UploadLeadsPage() {
  const [leads, setLeads] = useState<LeadRow[]>([])
  const [status, setStatus] = useState<'idle' | 'parsing' | 'uploading' | 'done' | 'error'>('idle')
  const [result, setResult] = useState<{ saved: number; skipped: number; total: number } | null>(null)
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
            Supports ProAdvisor format (Name, Firm, Email, Website, State) or standard CSV.
            Leads are saved instantly — qualify-leads scores and schedules emails at 9am UTC daily.
          </p>
        </div>

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

        {leads.length > 0 && (
          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-x-auto">
            <div className="px-4 py-3 border-b border-gray-800 text-xs text-gray-400">Preview — first 5 of {leads.length}</div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-xs">
                  {['Name', 'Email', 'Company', 'State', 'Domain'].map(h => (
                    <th key={h} className="px-4 py-2 text-left font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {leads.slice(0, 5).map((l, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2 whitespace-nowrap">{l.first_name} {l.last_name}</td>
                    <td className="px-4 py-2 text-gray-400 whitespace-nowrap">{l.email}</td>
                    <td className="px-4 py-2 text-gray-400">{l.company_name}</td>
                    <td className="px-4 py-2 text-gray-400">{l.state}</td>
                    <td className="px-4 py-2 text-gray-400">{l.company_domain}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!leads.length || !cronSecret || status === 'uploading'}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-600 text-white font-medium py-3 rounded-lg text-sm transition-colors"
        >
          {status === 'uploading'
            ? `Saving ${leads.length} leads...`
            : `Save ${leads.length} leads → agent will score & email automatically`}
        </button>

        {status === 'done' && result && (
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-6 space-y-2">
            <div className="text-green-400 font-semibold">Leads saved ✓</div>
            <div className="text-sm text-gray-300 space-y-1">
              <div>📥 {result.saved} new leads added</div>
              <div>✗ {result.skipped} skipped (already in system or missing email)</div>
              <div className="text-gray-500 pt-1">
                qualify-leads runs at 9am UTC and will score + schedule emails. Step-1 emails go out same day they&apos;re qualified.
              </div>
            </div>
            <a href="/admin/outreach" className="inline-block mt-2 text-blue-400 text-sm hover:underline">
              View in dashboard →
            </a>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300 text-sm">{error}</div>
        )}
      </div>
    </div>
  )
}
