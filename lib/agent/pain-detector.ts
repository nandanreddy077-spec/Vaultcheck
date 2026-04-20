import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export interface PainSignals {
  serves_construction: boolean
  serves_real_estate: boolean
  high_bec_risk: boolean
  pain_keywords: string[]
  reason: string
  score: number // 0-100
}

export async function detectPainSignals(lead: {
  first_name: string
  title: string
  company_name: string
  company_domain: string
  industry: string
  city: string
  state: string
}): Promise<PainSignals> {
  const prompt = `You are analyzing whether an accounting professional is a high-fit prospect for Vantirs — a payment verification tool that prevents BEC (Business Email Compromise) fraud and fake invoice schemes for accounting firms managing construction and real estate clients.

Lead info:
- Name: ${lead.first_name}
- Title: ${lead.title}
- Company: ${lead.company_name} (${lead.company_domain})
- Industry tag: ${lead.industry}
- Location: ${lead.city}, ${lead.state}

Analyze this lead and respond ONLY with a JSON object (no markdown, no explanation):
{
  "serves_construction": boolean,     // likely serves construction clients?
  "serves_real_estate": boolean,      // likely serves real estate clients?
  "high_bec_risk": boolean,           // high risk = construction OR real estate clients, smaller firm, owner/partner title
  "pain_keywords": string[],          // 1-3 specific pain triggers based on their profile (e.g., "lien waivers", "retainage invoices", "property management payments")
  "reason": string,                   // 1 sentence why they're a fit (or not)
  "score": number                     // 0-100 ICP fit score
}

Score guide:
- 80-100: Owner/Partner at CPA firm likely serving construction or real estate
- 60-79: Accountant/Controller at firm with some construction exposure
- 40-59: Accounting professional, industry unclear
- 0-39: Unlikely to serve construction/real estate clients`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : '{}'

  try {
    const parsed = JSON.parse(text.trim())
    return {
      serves_construction: parsed.serves_construction ?? false,
      serves_real_estate: parsed.serves_real_estate ?? false,
      high_bec_risk: parsed.high_bec_risk ?? false,
      pain_keywords: parsed.pain_keywords ?? [],
      reason: parsed.reason ?? '',
      score: Math.min(100, Math.max(0, parseInt(parsed.score) || 0)),
    }
  } catch {
    return {
      serves_construction: false,
      serves_real_estate: false,
      high_bec_risk: false,
      pain_keywords: [],
      reason: 'Parse error',
      score: 0,
    }
  }
}
