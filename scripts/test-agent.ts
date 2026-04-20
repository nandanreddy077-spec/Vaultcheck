/**
 * Test script: run with `npx tsx scripts/test-agent.ts`
 * Tests each component of the outreach agent without sending real emails.
 */
import 'dotenv/config'
import { fetchLeadsFromApollo, saveLeadsToDb } from '../lib/agent/apollo'
import { detectPainSignals } from '../lib/agent/pain-detector'
import { generateEmail } from '../lib/agent/email-generator'
import { getServiceClient } from '../lib/agent/supabase'

async function checkEnv() {
  console.log('\n── Environment check ──')
  const required = [
    'ANTHROPIC_API_KEY',
    'APOLLO_API_KEY',
    'GMAIL_A_USER',
    'GMAIL_A_APP_PASSWORD',
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'CRON_SECRET',
  ]
  let ok = true
  for (const key of required) {
    const val = process.env[key]
    if (val) {
      console.log(`  ✓ ${key} = ${val.slice(0, 6)}...`)
    } else {
      console.log(`  ✗ ${key} — MISSING`)
      ok = false
    }
  }
  return ok
}

async function testSupabase() {
  console.log('\n── Supabase connection ──')
  try {
    const db = getServiceClient()
    const { error } = await db.from('outreach_leads').select('id').limit(1)
    if (error) {
      console.log(`  ✗ Query failed: ${error.message}`)
      console.log('    → Did you run the schema migration? (supabase/outreach-schema.sql)')
      return false
    }
    console.log('  ✓ Connected and outreach_leads table exists')
    return true
  } catch (e) {
    console.log(`  ✗ Error: ${e}`)
    return false
  }
}

async function testPainDetector() {
  console.log('\n── Pain detector (Claude) ──')
  try {
    const signals = await detectPainSignals({
      first_name: 'Sarah',
      title: 'Owner & QuickBooks ProAdvisor',
      company_name: 'Reynolds CPA Group',
      company_domain: 'reynoldscpa.com',
      industry: 'accounting',
      city: 'Austin',
      state: 'TX',
    })
    console.log('  ✓ Pain signals:', JSON.stringify(signals, null, 4).replace(/\n/g, '\n  '))
    return true
  } catch (e) {
    console.log(`  ✗ Error: ${e}`)
    return false
  }
}

async function testEmailGenerator() {
  console.log('\n── Email generator (Claude) ──')
  const mockPain = {
    serves_construction: true,
    serves_real_estate: false,
    high_bec_risk: true,
    pain_keywords: ['lien waiver payments', 'subcontractor invoices'],
    reason: 'Owner of CPA firm serving construction GCs',
    score: 85,
  }

  const lead = { first_name: 'Sarah', title: 'Owner & CPA', company_name: 'Reynolds CPA Group', city: 'Austin', state: 'TX' }

  for (const step of [1, 2, 3, 4]) {
    try {
      const email = await generateEmail(lead, step, mockPain)
      console.log(`\n  Step ${step} (${email.psychology_angle}):`)
      console.log(`  Subject: ${email.subject}`)
      console.log(`  Body:\n${email.body.split('\n').map(l => '    ' + l).join('\n')}`)
    } catch (e) {
      console.log(`  ✗ Step ${step} failed: ${e}`)
      return false
    }
  }
  return true
}

async function testApollo() {
  console.log('\n── Apollo lead fetch ──')
  try {
    const leads = await fetchLeadsFromApollo(3)
    if (leads.length === 0) {
      console.log('  ⚠ Apollo returned 0 leads — check your API key and search filters')
      return true // Not a hard failure
    }
    console.log(`  ✓ Fetched ${leads.length} leads`)
    console.log('  Sample lead:', JSON.stringify(leads[0], null, 4).replace(/\n/g, '\n  '))
    return true
  } catch (e) {
    console.log(`  ✗ Apollo error: ${e}`)
    console.log('    → Verify your APOLLO_API_KEY and that you have People Search access')
    return false
  }
}

async function main() {
  console.log('Vantirs Outreach Agent — Test Suite\n')

  const envOk = await checkEnv()
  if (!envOk) {
    console.log('\n⚠  Fix missing env vars before continuing.\n')
    process.exit(1)
  }

  const supabaseOk = await testSupabase()
  if (!supabaseOk) {
    console.log('\n⚠  Run the schema migration first:\n  supabase/outreach-schema.sql\n')
    process.exit(1)
  }

  await testPainDetector()
  await testEmailGenerator()
  await testApollo()

  console.log('\n── Done ──')
  console.log('If all checks pass, trigger the first cron manually:')
  console.log('  curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/source-leads\n')
}

main().catch(console.error)
