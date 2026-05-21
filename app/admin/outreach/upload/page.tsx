'use client'

import { useState } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────

interface EmailStep { step: number; subject: string; body: string }

interface SequenceLead {
  first_name: string
  last_name: string
  email: string
  firm: string
  state: string
  city: string
  firm_type: string
  emails: EmailStep[]
}

interface StandardLead {
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

type ParsedFile =
  | { format: 'sequence'; leads: SequenceLead[] }
  | { format: 'standard'; leads: StandardLead[] }

// ── CSV parser (handles quoted multi-line fields) ─────────────────────────────

function parseCSVRobust(text: string): Array<Record<string, string>> {
  const rows: Array<Record<string, string>> = []
  let pos = 0
  const n = text.length

  function parseField(): string {
    if (pos >= n) return ''
    if (text[pos] === '"') {
      pos++ // skip opening quote
      let field = ''
      while (pos < n) {
        if (text[pos] === '"') {
          if (text[pos + 1] === '"') { field += '"'; pos += 2 }
          else { pos++; break }
        } else {
          field += text[pos++]
        }
      }
      return field
    } else {
      let field = ''
      while (pos < n && text[pos] !== ',' && text[pos] !== '\r' && text[pos] !== '\n') {
        field += text[pos++]
      }
      return field
    }
  }

  function parseRow(): string[] | null {
    if (pos >= n) return null
    const fields: string[] = []
    while (pos < n) {
      fields.push(parseField())
      if (pos < n && text[pos] === ',') { pos++ }
      else if (pos < n && (text[pos] === '\r' || text[pos] === '\n')) {
        if (text[pos] === '\r' && text[pos + 1] === '\n') pos++
        pos++
        break
      } else { break }
    }
    return fields
  }

  const headerRow = parseRow()
  if (!headerRow) return []
  const headers = headerRow.map(h => h.trim().toLowerCase().replace(/\s+/g, '_'))

  while (pos < n) {
    if (text[pos] === '\r' || text[pos] === '\n') {
      if (text[pos] === '\r' && text[pos + 1] === '\n') pos++
      pos++
      continue
    }
    const fields = parseRow()
    if (!fields) break
    const row: Record<string, string> = {}
    headers.forEach((h, i) => { row[h] = fields[i] ?? '' })
    rows.push(row)
  }

  return rows
}

// ── Format detection & row parsers ───────────────────────────────────────────

function detectFormat(rows: Array<Record<string, string>>): 'sequence' | 'standard' {
  if (rows.length === 0) return 'standard'
  const keys = Object.keys(rows[0])
  return keys.some(k => k === 'e1_subject' || k === 'e1_body') ? 'sequence' : 'standard'
}

function extractDomain(url: string): string {
  if (!url) return ''
  try { return new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace(/^www\./, '') } catch { return '' }
}

function toSequenceLead(row: Record<string, string>): SequenceLead | null {
  const email = (row['email'] ?? '').trim().toLowerCase()
  const first = (row['first'] ?? row['first_name'] ?? '').trim()
  const name = (row['name'] ?? '').trim()
  const first_name = first || name.split(/\s+/)[0] || ''
  const last_name = first ? (name.split(/\s+/).slice(1).join(' ')) : (name.split(/\s+/).slice(1).join(' '))
  if (!email || !first_name) return null

  const emails: EmailStep[] = []
  for (let s = 1; s <= 4; s++) {
    const subject = (row[`e${s}_subject`] ?? '').trim()
    const body = (row[`e${s}_body`] ?? '').trim()
    if (subject && body) emails.push({ step: s, subject, body })
  }
  if (emails.length === 0) return null

  return {
    first_name,
    last_name,
    email,
    firm: (row['firm'] ?? row['company_name'] ?? '').trim(),
    state: (row['state'] ?? '').trim(),
    city: (row['city'] ?? '').trim(),
    firm_type: (row['firm_type'] ?? '').trim(),
    emails,
  }
}

function toStandardLead(row: Record<string, string>): StandardLead | null {
  const get = (...keys: string[]) => {
    for (const k of keys) { const v = row[k]?.trim(); if (v) return v }
    return ''
  }
  let first_name = get('first_name', 'firstname', 'first')
  let last_name = get('last_name', 'lastname', 'last')
  if (!first_name) {
    const raw = get('name', 'full_name', 'contact')
    const parts = raw.split(/\s+/)
    first_name = parts[0] ?? ''
    last_name = parts.slice(1).join(' ')
  }
  const email = get('email', 'email_address', 'e-mail').toLowerCase()
  if (!email || !first_name) return null
  return {
    first_name, last_name, email,
    title: get('title', 'job_title', 'role') || 'QuickBooks ProAdvisor',
    company_name: get('firm', 'company', 'company_name', 'organization', 'account'),
    company_domain: extractDomain(get('website', 'url', 'company_domain', 'domain')),
    city: get('city', 'location'),
    state: get('state', 'province'),
    linkedin_url: get('linkedin', 'linkedin_url', 'linkedin url'),
  }
}

function parseFile(text: string): ParsedFile {
  const rows = parseCSVRobust(text)
  const format = detectFormat(rows)
  if (format === 'sequence') {
    return { format, leads: rows.flatMap(r => { const l = toSequenceLead(r); return l ? [l] : [] }) }
  }
  return { format, leads: rows.flatMap(r => { const l = toStandardLead(r); return l ? [l] : [] }) }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function UploadLeadsPage() {
  const [parsed, setParsed] = useState<ParsedFile | null>(null)
  const [status, setStatus] = useState<'idle' | 'parsing' | 'uploading' | 'done' | 'error'>('idle')
  const [result, setResult] = useState<{ saved: number; skipped: number; total: number } | null>(null)
  const [error, setError] = useState('')
  const [cronSecret, setCronSecret] = useState('')
  const [previewStep, setPreviewStep] = useState(1)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setStatus('parsing')
    setParsed(null)
    setResult(null)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const p = parseFile(ev.target?.result as string)
      setParsed(p)
      setStatus('idle')
    }
    reader.readAsText(file)
  }

  async function handleUpload() {
    if (!parsed || parsed.leads.length === 0 || !cronSecret) return
    setStatus('uploading')
    setError('')
    try {
      const url = parsed.format === 'sequence'
        ? '/api/agent/import-sequence'
        : '/api/agent/upload-leads'
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${cronSecret}` },
        body: JSON.stringify({ leads: parsed.leads }),
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

  const sequenceLeads = parsed?.format === 'sequence' ? parsed.leads as SequenceLead[] : []
  const standardLeads = parsed?.format === 'standard' ? parsed.leads as StandardLead[] : []
  const previewLead = sequenceLeads[0]
  const previewEmail = previewLead?.emails.find(e => e.step === previewStep)

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Upload Lead Sequence</h1>
          <p className="text-gray-400 text-sm mt-1">
            Supports two formats: <span className="text-blue-400">Sequence CSV</span> (Name, Firm, Email, E1_Subject, E1_Body … E4_Body) — emails are pre-written and scheduled immediately.
            Or <span className="text-gray-400">Standard CSV</span> — qualify-leads scores and generates emails via Claude.
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
              {status === 'parsing'
                ? 'Parsing…'
                : parsed
                  ? <span className="text-green-400 font-medium">
                      {parsed.leads.length} leads parsed ✓
                      <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-blue-900 text-blue-300">
                        {parsed.format === 'sequence' ? 'Sequence CSV' : 'Standard CSV'}
                      </span>
                    </span>
                  : 'Click to upload CSV'}
            </div>
          </label>
        </div>

        {/* Sequence format: show email preview */}
        {parsed?.format === 'sequence' && previewLead && (
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-400">Email preview — {previewLead.first_name} at {previewLead.firm}</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(s => (
                    <button
                      key={s}
                      onClick={() => setPreviewStep(s)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        previewStep === s ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      E{s} {s === 1 ? '(today)' : `(+${(s - 1) * 3}d)`}
                    </button>
                  ))}
                </div>
              </div>
              {previewEmail ? (
                <>
                  <div className="text-xs text-gray-500 mb-1">Subject</div>
                  <div className="text-sm text-white font-medium mb-3">{previewEmail.subject}</div>
                  <div className="text-xs text-gray-500 mb-1">Body</div>
                  <pre className="text-xs text-gray-300 whitespace-pre-wrap font-sans leading-relaxed max-h-48 overflow-y-auto">
                    {previewEmail.body}
                  </pre>
                </>
              ) : (
                <p className="text-xs text-gray-500">No email for this step</p>
              )}
            </div>

            <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-x-auto">
              <div className="px-4 py-3 border-b border-gray-800 text-xs text-gray-400">
                First 5 of {sequenceLeads.length} leads
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs">
                    {['Name', 'Email', 'Firm', 'State', 'Steps'].map(h => (
                      <th key={h} className="px-4 py-2 text-left font-normal">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {sequenceLeads.slice(0, 5).map((l, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2 whitespace-nowrap">{l.first_name} {l.last_name}</td>
                      <td className="px-4 py-2 text-gray-400 whitespace-nowrap">{l.email}</td>
                      <td className="px-4 py-2 text-gray-400">{l.firm}</td>
                      <td className="px-4 py-2 text-gray-400">{l.state}</td>
                      <td className="px-4 py-2 text-gray-400">{l.emails.length} emails</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Standard format: show leads table */}
        {parsed?.format === 'standard' && standardLeads.length > 0 && (
          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-x-auto">
            <div className="px-4 py-3 border-b border-gray-800 text-xs text-gray-400">Preview — first 5 of {standardLeads.length}</div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-xs">
                  {['Name', 'Email', 'Company', 'State', 'Domain'].map(h => (
                    <th key={h} className="px-4 py-2 text-left font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {standardLeads.slice(0, 5).map((l, i) => (
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
          disabled={!parsed || parsed.leads.length === 0 || !cronSecret || status === 'uploading'}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-600 text-white font-medium py-3 rounded-lg text-sm transition-colors"
        >
          {status === 'uploading'
            ? `Saving ${parsed?.leads.length ?? 0} leads…`
            : parsed?.format === 'sequence'
              ? `Schedule ${parsed.leads.length} leads → emails go out every 3 days`
              : `Save ${parsed?.leads.length ?? 0} leads → qualify-leads will generate emails`}
        </button>

        {status === 'done' && result && (
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-6 space-y-2">
            <div className="text-green-400 font-semibold">
              {parsed?.format === 'sequence' ? 'Sequences scheduled ✓' : 'Leads saved ✓'}
            </div>
            <div className="text-sm text-gray-300 space-y-1">
              <div>📥 {result.saved} new leads added</div>
              <div>✗ {result.skipped} skipped (already in system, unsubscribed, or missing email)</div>
              {parsed?.format === 'sequence' && (
                <div className="text-gray-500 pt-1">
                  E1 sends today at 10am EDT. E2 in 3 days, E3 in 6, E4 in 9.
                  send-emails cron picks them up automatically.
                </div>
              )}
              {parsed?.format === 'standard' && (
                <div className="text-gray-500 pt-1">
                  qualify-leads runs at 9am UTC and will score + schedule emails via Claude.
                </div>
              )}
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
