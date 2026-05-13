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

// Apollo's mixed_people/api_search returns preview-mode contacts (no email).
// To get emails we must call /v1/people/match per person — costs 1 export credit each.
// With 2520 credits/month and 20 leads/day target (~600/month) this is within budget.

interface ApolloPreviewPerson {
  id: string
  first_name: string
  last_name_obfuscated: string
  title: string
  has_email: boolean
  has_city: boolean
  has_state: boolean
  has_country: boolean
  last_refreshed_at: string
  organization: {
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
  email_status: string | null
  title: string
  city: string | null
  state: string | null
  country: string | null
  linkedin_url: string | null
  phone_numbers: Array<{ sanitized_number: string }>
  organization: {
    name?: string
    website_url?: string
    industry?: string
    num_employees?: number
  } | null
}

async function revealContactEmail(
  apiKey: string,
  apolloId: string
): Promise<ApolloEnrichedPerson | null> {
  try {
    const res = await axios.post(
      `${APOLLO_BASE}/people/match`,
      { id: apolloId, reveal_personal_emails: true, reveal_phone_number: false },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Api-Key': apiKey,
        },
        timeout: 8000, // 8s max per enrichment call
      }
    )
    // Response is { person: {...} } or { match: {...} }
    return (res.data?.person ?? res.data?.match ?? null) as ApolloEnrichedPerson | null
  } catch {
    return null
  }
}

export async function fetchLeadsFromApollo(limit = 20): Promise<ApolloLead[]> {
  const apiKey = process.env.APOLLO_API_KEY
  if (!apiKey) throw new Error('APOLLO_API_KEY not set')

  // Step 1 — Search: find candidates matching our ICP (no credits consumed)
  // ICP: owners/operators of virtual CFO and outsourced bookkeeping firms in the US,
  // actively managing AP for SMB clients. Exclude tax-only CPAs.
  // Note: keep per_page tight (limit * 2) — enrichment takes ~5s/person, so
  // budget = limit × 8s timeout + overhead must stay well under Vercel's 300s maxDuration.
  const searchPayload = {
    page: 1,
    per_page: Math.min(limit * 2, 50), // max 50 search candidates for 25 target leads
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
    .filter((p: ApolloPreviewPerson) => p.has_email && p.first_name)

  console.log(`[apollo] search returned ${searchRes.data?.people?.length ?? 0} people, ${previews.length} with email`)

  if (previews.length === 0) {
    throw new Error(`Apollo search returned ${searchRes.data?.people?.length ?? 0} people but none have email. This may be a plan limitation.`)
  }

  // Step 2 — Enrich: reveal emails for candidates (costs 1 credit per person).
  // Budget: each call has an 8s timeout. With limit=20 and ~50% hit rate we'll make
  // up to 40 calls × 8s = 320s — right at the edge. We add a wall-clock guard to stop
  // enrichment at 200s so there's still headroom for pain scoring + email generation.
  const results: ApolloLead[] = []
  const enrichmentDeadline = Date.now() + 200_000 // 200s from now

  for (const preview of previews) {
    if (results.length >= limit) break
    if (Date.now() > enrichmentDeadline) {
      console.log('[apollo] enrichment deadline reached, stopping early')
      break
    }

    const enriched = await revealContactEmail(apiKey, preview.id)
    if (!enriched?.email) continue // no email unlocked

    const org = enriched.organization ?? preview.organization ?? {}
    results.push({
      apollo_id: enriched.id ?? preview.id,
      first_name: enriched.first_name ?? preview.first_name,
      last_name: enriched.last_name ?? '',
      email: enriched.email,
      title: enriched.title ?? preview.title ?? '',
      company_name: (org as { name?: string }).name ?? '',
      company_domain: (org as { website_url?: string }).website_url ?? '',
      city: enriched.city ?? '',
      state: enriched.state ?? '',
      industry: (org as { industry?: string }).industry ?? '',
      employee_count: (org as { num_employees?: number }).num_employees ?? 0,
      linkedin_url: enriched.linkedin_url ?? '',
      phone: enriched.phone_numbers?.[0]?.sanitized_number ?? '',
    })
  }

  console.log(`[apollo] enriched ${results.length} leads with emails (used ${results.length} credits)`)
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

    // Upsert — skip if we already have this person
    const { error } = await db
      .from('outreach_leads')
      .upsert(
        { ...lead, status: 'new' },
        { onConflict: 'email', ignoreDuplicates: true }
      )

    if (error) { skipped++; continue }
    saved++
  }

  return { saved, skipped }
}
