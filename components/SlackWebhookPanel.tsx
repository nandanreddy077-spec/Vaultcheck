'use client'

import { useState } from 'react'
import { parseJsonResponse } from '@/lib/parse-json-response'

export default function SlackWebhookPanel({ initialUrl }: { initialUrl?: string | null }) {
  const [slackWebhookUrl, setSlackWebhookUrl] = useState(initialUrl ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  async function onSave() {
    setLoading(true)
    setError(null)
    setSaved(false)

    try {
      const res = await fetch('/api/firms/slack-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slackWebhookUrl }),
      })

      const data = await parseJsonResponse<{ error?: string; ok?: boolean }>(res)
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to save Slack webhook.')
      }

      setSaved(true)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to save Slack webhook.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-6 py-5">
      <h2 className="text-xl font-semibold text-[#0b1c30] mb-4">Slack alerts</h2>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-slate-500 uppercase tracking-wider">Webhook URL</label>
          <textarea
            className="mt-2 block w-full rounded-xl bg-[#eff4ff] px-3 py-2 text-sm text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-blue-200"
            rows={3}
            value={slackWebhookUrl}
            onChange={e => setSlackWebhookUrl(e.target.value)}
            placeholder="https://hooks.slack.com/services/..."
          />
          <p className="mt-1 text-xs text-slate-500">
            Used for critical/high alerts. Leave blank to disable.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSave}
            disabled={loading}
            className="btn-primary-gradient text-sm disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
          {saved ? <span className="text-sm text-green-700">Saved.</span> : null}
        </div>

        {error ? <p className="text-sm text-red-700">{error}</p> : null}
      </div>
    </div>
  )
}

