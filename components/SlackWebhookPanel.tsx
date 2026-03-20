'use client'

import { useState } from 'react'

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

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error || 'Failed to save Slack webhook.')
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
      <h2 className="text-base font-semibold text-gray-900 mb-4">Slack alerts</h2>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider">Webhook URL</label>
          <textarea
            className="mt-2 block w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900"
            rows={3}
            value={slackWebhookUrl}
            onChange={e => setSlackWebhookUrl(e.target.value)}
            placeholder="https://hooks.slack.com/services/..."
          />
          <p className="mt-1 text-xs text-gray-500">
            Used for critical/high alerts. Leave blank to disable.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSave}
            disabled={loading}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
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

