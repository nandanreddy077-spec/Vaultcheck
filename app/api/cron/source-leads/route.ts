import { NextResponse } from 'next/server'
import { fetchLeadsFromApollo, saveLeadsToDb } from '@/lib/agent/apollo'
import { getServiceClient } from '@/lib/agent/supabase'
import { verifyCronAuthorization } from '@/lib/cron-auth'

// source-leads: ONLY fetch from Apollo + save to DB.
// Pain scoring + email generation moved to /api/cron/qualify-leads (runs 1h later).
// This keeps source-leads fast (< 60s) — Apollo search + bulk_match only.
export const maxDuration = 60

const DAILY_LIMIT = parseInt(process.env.DAILY_LEAD_LIMIT ?? '10')

export async function GET(req: Request) {
  const cronAuth = verifyCronAuthorization(req)
  if (cronAuth !== 'ok') {
    const status = cronAuth === 'misconfigured' ? 503 : 401
    const error = cronAuth === 'misconfigured' ? 'Server misconfigured' : 'Unauthorized'
    return NextResponse.json({ error }, { status })
  }

  const db: any = getServiceClient()

  const { data: run } = await db
    .from('agent_runs')
    .insert({ run_type: 'source-leads', status: 'running' })
    .select()
    .single()

  const runId = run?.id

  try {
    let rawLeads: Awaited<ReturnType<typeof fetchLeadsFromApollo>> = []
    let sourceWarning: string | null = null

    try {
      rawLeads = await fetchLeadsFromApollo(DAILY_LIMIT)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      sourceWarning = `Apollo unavailable — qualify-leads will process any existing queued leads. Reason: ${message}`
      console.warn('[source-leads]', sourceWarning)
    }

    const { saved, skipped } = await saveLeadsToDb(rawLeads)

    await db
      .from('agent_runs')
      .update({
        status: 'success',
        leads_fetched: rawLeads.length,
        details: { saved, skipped, sourceWarning },
        finished_at: new Date().toISOString(),
      })
      .eq('id', runId)

    return NextResponse.json({ ok: true, fetched: rawLeads.length, saved, skipped, sourceWarning })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    await db
      .from('agent_runs')
      .update({ status: 'error', error: message, finished_at: new Date().toISOString() })
      .eq('id', runId)
    console.error('[source-leads]', message)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
