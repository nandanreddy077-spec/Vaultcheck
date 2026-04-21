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

export async function fetchLeadsFromApollo(limit = 20): Promise<ApolloLead[]> {
  const apiKey = process.env.APOLLO_API_KEY
  if (!apiKey) throw new Error('APOLLO_API_KEY not set')

  // Target: accounting leaders likely to serve construction/real-estate clients.
  // Apollo validates many filters strictly, so keep this payload conservative.
  const payload = {
    page: 1,
    per_page: Math.min(Math.max(limit, 1), 100),
    person_titles: [
      'QuickBooks ProAdvisor',
      'Certified QuickBooks ProAdvisor',
      'Owner',
      'Partner',
      'Managing Partner',
      'Principal',
      'CPA',
      'Controller',
      'Accounting Manager',
    ],
    person_locations: ['United States'],
    contact_email_status: ['verified'],
    q_keywords: 'accounting bookkeeping cpa quickbooks construction real estate',
    sort_by_field: 'last_activity_date',
    sort_ascending: false,
  }

  let res
  try {
    res = await axios.post(
      `${APOLLO_BASE}/mixed_people/api_search`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'x-api-key': apiKey,
        },
      }
    )
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const details = typeof error.response?.data === 'string'
        ? error.response.data
        : JSON.stringify(error.response?.data ?? {})
      throw new Error(`Apollo API ${error.response?.status ?? 'error'}: ${details}`)
    }
    throw error
  }

  const people: ApolloLead[] = (res.data?.people ?? []).map((p: Record<string, unknown>) => {
    const org = (p.organization ?? {}) as Record<string, unknown>
    return {
      apollo_id: p.id as string,
      first_name: (p.first_name as string) ?? '',
      last_name: (p.last_name as string) ?? '',
      email: (p.email as string) ?? '',
      title: (p.title as string) ?? '',
      company_name: (org.name as string) ?? '',
      company_domain: (org.website_url as string) ?? '',
      city: (p.city as string) ?? '',
      state: (p.state as string) ?? '',
      industry: (org.industry as string) ?? '',
      employee_count: (org.num_employees as number) ?? 0,
      linkedin_url: (p.linkedin_url as string) ?? '',
      phone: ((p.phone_numbers as Array<{ sanitized_number: string }>)?.[0]?.sanitized_number) ?? '',
    }
  }).filter((l: ApolloLead) => l.email && l.first_name)

  return people
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
