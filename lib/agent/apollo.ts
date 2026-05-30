import axios from 'axios'
import { getServiceClient } from './supabase'

const APOLLO_BASE = 'https://api.apollo.io/v1'

export interface ApolloLead {
  apollo_id: string
  first_name: string
  last_name: string
  email: string
  title: string
  company_name: string
  company_domain: string
  city: string
  state: string
  industry: string
  employee_count: number
  linkedin_url: string
  phone: string
}

// Apollo search returns preview-mode (no email). Enrichment via bulk_match
// reveals emails in batches of 10, costing 1 credit per matched person.
// With 2520 credits/month and default 10 leads/day (~300/month) we're well within budget.

interface ApolloPreviewPerson {
  id: string
  first_name: string
  last_name_obfuscated?: string
  title?: string
  has_email?: boolean
  organization?: {
    id?: string
    name?: string
    website_url?: string
    industry?: string
    num_employees?: number
  } | null
}

interface ApolloEnrichedPerson {
  id: string
  first_name: string
  last_name: string
  email: string | null
  email_status?: string | null
  title?: string | null
  city?: string | null
  state?: string | null
  linkedin_url?: string | null
  phone_numbers?: Array<{ sanitized_number: string }>
  organization?: {
    name?: string
    website_url?: string
    industry?: string
    num_employees?: number
  } | null
}

async function bulkRevealEmails(
  apiKey: string,
  apolloIds: string[]
): Promise<ApolloEnrichedPerson[]> {
  if (apolloIds.length === 0) return []

  // Apollo bulk_match accepts details array; each item needs at least one identifier.
  const details = apolloIds.map(id => ({ id, reveal_personal_emails: true }))

  try {
    const res = await axios.post(
      `${APOLLO_BASE}/people/bulk_match`,
      { details, reveal_phone_number: false },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Api-Key': apiKey,
        },
        timeout: 30_000, // 30s for up to 10 people
      }
    )
    // Response: { matches: [...] } where each match is a person object or null
    const matches = res.data?.matches ?? []
    return matches.filter(Boolean) as ApolloEnrichedPerson[]
  } catch (err) {
    console.warn('[apollo] bulk_match failed:', err instanceof Error ? err.message : String(err))
    return []
  }
}

// Rotate Apollo search pages so each daily run fetches a different slice of results.
// We derive the page from the day-of-year so it advances once per day automatically.
function getDailyPage(): number {
  const now = new Date()
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86_400_000)
  // Cycle through pages 1-50 (Apollo basic plan supports ~1000 results = 25 pages of 40)
  return (dayOfYear % 25) + 1
}

export async function fetchLeadsFromApollo(limit = 10): Promise<ApolloLead[]> {
  const apiKey = process.env.APOLLO_API_KEY
  if (!apiKey) throw new Error('APOLLO_API_KEY not set')

  // Step 1 — Search: find candidates (free, no credits).
  // Fetch limit * 2 so we have buffer for people whose email doesn't unlock.
  const per_page = Math.min(limit * 2, 40)
  const page = getDailyPage()
  const searchPayload = {
    page,
    per_page,
    person_titles: [
      'Virtual CFO',
      'Outsourced CFO',
      'Fractional CFO',
      'Controller',
      'Bookkeeper',
      'Accounting Manager',
      'Owner',
      'Managing Partner',
      'Principal',
    ],
    person_locations: ['United States'],
    // Industry filter targeting accounting firms specifically.
    // SPIKE VERIFIED: Apollo /mixed_people endpoint uses organization_industries (label-based string array).
    // If this yields 0 results, check plan tier — filter may require a paid Apollo plan.
    // Fallback: remove this filter and add manual outreach via LinkedIn/G2/Clutch.
    organization_industries: ['accounting', 'accounting services'],
    sort_by_field: '[none]',
    sort_ascending: false,
  }

  let searchRes
  try {
    searchRes = await axios.post(
      `${APOLLO_BASE}/mixed_people/api_search`,
      searchPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Api-Key': apiKey,
        },
        timeout: 15_000,
      }
    )
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const details = typeof error.response?.data === 'string'
        ? error.response.data
        : JSON.stringify(error.response?.data ?? {})
      throw new Error(`Apollo search ${error.response?.status ?? 'error'}: ${details}`)
    }
    throw error
  }

  const previews: ApolloPreviewPerson[] = (searchRes.data?.people ?? [])
    .filter((p: ApolloPreviewPerson) => p.has_email !== false && p.first_name)

  console.log(`[apollo] search page ${page}: ${searchRes.data?.people?.length ?? 0} total, ${previews.length} with possible email`)

  if (previews.length === 0) {
    throw new Error(`Apollo search returned ${searchRes.data?.people?.length ?? 0} people but none have email flag.`)
  }

  // Pre-filter: skip Apollo IDs already in the DB to avoid spending credits on duplicates.
  // This is critical for re-runs — Apollo search returns the same people repeatedly.
  const db = getServiceClient()
  const previewIds = previews.map(p => p.id)
  const { data: existingRows } = await db
    .from('outreach_leads')
    .select('apollo_id')
    .in('apollo_id', previewIds)
  const existingIds = new Set((existingRows ?? []).map((r: { apollo_id: string }) => r.apollo_id))
  const newPreviews = previews.filter(p => !existingIds.has(p.id))
  console.log(`[apollo] dedup: ${previews.length} candidates, ${existingIds.size} already in DB, ${newPreviews.length} new`)

  if (newPreviews.length === 0) {
    console.log('[apollo] all candidates already in DB — no credits spent')
    return []
  }

  // Step 2 — Enrich in batches of 10 (bulk_match is 1 round-trip vs N individual calls).
  // Each batch costs up to 10 credits.
  const BATCH_SIZE = 10
  const results: ApolloLead[] = []

  for (let i = 0; i < newPreviews.length && results.length < limit; i += BATCH_SIZE) {
    const batch = newPreviews.slice(i, i + BATCH_SIZE)
    const enriched = await bulkRevealEmails(apiKey, batch.map(p => p.id))

    for (const person of enriched) {
      if (results.length >= limit) break
      if (!person.email) continue

      // Find matching preview for org fallback
      const preview = newPreviews.find(p => p.id === person.id)
      const org = person.organization ?? preview?.organization ?? {}

      results.push({
        apollo_id: person.id,
        first_name: person.first_name,
        last_name: person.last_name ?? '',
        email: person.email,
        title: person.title ?? preview?.title ?? '',
        company_name: (org as { name?: string }).name ?? '',
        company_domain: (org as { website_url?: string }).website_url ?? '',
        city: person.city ?? '',
        state: person.state ?? '',
        industry: (org as { industry?: string }).industry ?? '',
        employee_count: (org as { num_employees?: number }).num_employees ?? 0,
        linkedin_url: person.linkedin_url ?? '',
        phone: person.phone_numbers?.[0]?.sanitized_number ?? '',
      })
    }

    console.log(`[apollo] batch ${Math.floor(i / BATCH_SIZE) + 1}: ${enriched.length} enriched, ${results.length}/${limit} collected`)
  }

  if (results.length === 0) {
    throw new Error(`Apollo enrichment returned 0 emails from ${previews.length} candidates. Check plan credits.`)
  }

  console.log(`[apollo] done — ${results.length} leads with emails (used ~${results.length} credits)`)
  return results
}

export async function saveLeadsToDb(leads: ApolloLead[]): Promise<{ saved: number; skipped: number }> {
  const db = getServiceClient()
  let saved = 0
  let skipped = 0

  for (const lead of leads) {
    // Check unsubscribes first
    const { data: unsub } = await db
      .from('outreach_unsubscribes')
      .select('id')
      .eq('email', lead.email)
      .single()

    if (unsub) { skipped++; continue }

    // Check if already exists before inserting so we get an accurate saved count.
    // ignoreDuplicates:true returns no error on conflict, making saved/skipped indistinguishable.
    const { data: existing } = await db
      .from('outreach_leads')
      .select('id')
      .eq('email', lead.email)
      .single()

    if (existing) { skipped++; continue }

    const { error } = await db
      .from('outreach_leads')
      .insert({ ...lead, status: 'new' })

    if (error) { skipped++; continue }
    saved++
  }

  return { saved, skipped }
}
