import Anthropic from '@anthropic-ai/sdk'
import type { PainSignals } from './pain-detector'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export type PsychAngle = 'loss_aversion' | 'social_proof' | 'reciprocity' | 'bump' | 'value' | 'breakup'

export interface GeneratedEmail {
  subject: string
  body: string
  psychology_angle: string
}

function extractJson(text: string): string {
  // Strip markdown code fences if Claude wraps response
  return text
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()
}

const ANGLE_INSTRUCTIONS: Record<PsychAngle, string> = {
  loss_aversion: `Frame around two real risks they haven't thought about:
(1) A client's vendor bank change turns out to be a BEC scam — the bookkeeper processes it and now owns the liability conversation. Name a real dollar amount ($50k-$200k typical for SMB AP fraud).
(2) NACHA Phase 2 goes live June 22, 2026 — firms that originate ACH payments for clients may need documented fraud monitoring controls depending on their ODFI relationship and ACH origination volume. Worth verifying with their bank. Not "soon" — June 22, 2026.
Then in ONE sentence: Vantirs auto-verifies vendor bank details against live business registries and flags mismatches before ACH is submitted.
CTA: not a demo, just "is this something your firm currently has covered?" — let them say no.`,

  social_proof: `Open with something specific to their geography or client type. E.g. if they're in Texas mention Texas construction firms; if healthcare mention healthcare AP fraud trends.
1-2 sentences about what similar firms are doing: outsourced CFO and bookkeeping firms are quietly adding Vantirs as their vendor payment checkpoint — not because clients ask, but because one $80k fraud claim changes your E&O situation.
Then one line: Vantirs takes 90 seconds per vendor change and catches mismatches before the ACH goes out.
CTA: soft — "curious if it's something you've looked at."`,

  reciprocity: `Lead with free value — no strings attached. Offer them a 5-question vendor payment checklist your team built for ACH fraud monitoring (useful regardless of NACHA Phase 2 applicability — many firms originating ACH for clients benefit from documented controls). Tell them you'll send it over, no opt-in required.
Then very naturally: Vantirs was built around the same verification logic — live registry checks + bank routing validation before each ACH.
CTA: almost as an afterthought — "happy to send the checklist either way."`,

  bump: `1-2 sentences only. Casual. Reference your first email briefly. Don't re-pitch.
Sound like a real human checking in, not a sequence. Something like "wanted to make sure this didn't get buried — the NACHA June deadline is coming up and I know inboxes are brutal."
No bullet points. No features. Just human.`,

  value: `Lead with a stat that's specific and real: BEC fraud targeting construction and real estate AP is up 45% since 2023, average loss $130k per incident (FBI IC3 2024 data). Frame it for their world: that's a client relationship, an E&O claim, and a potential regulatory conversation landing on the same week.
One sentence on Vantirs: we run a 30-second verification on every vendor bank change before ACH submission — flags mismatches against live state business registries and banking rails.
CTA: direct — "worth a look before June 22?"`,

  breakup: `Short, warm, no hard feelings. Tell them you're removing them from your list and won't reach out again. If they ever run into a vendor payment situation, they know where to find Vantirs. Leave the door fully open. One short paragraph. Very human. Not passive-aggressive.`,
}

export async function generateEmail(
  lead: {
    first_name: string
    title: string
    company_name: string
    city: string
    state: string
  },
  step: number,
  painSignals: PainSignals
): Promise<GeneratedEmail> {
  const angle = getAngleForStep(step)
  const angleInstructions = ANGLE_INSTRUCTIONS[angle]

  // Build rich pain context from detection results
  const painParts: string[] = []
  if (painSignals.serves_construction) painParts.push('likely serves construction clients')
  if (painSignals.serves_real_estate) painParts.push('likely serves real estate clients')
  if (painSignals.high_bec_risk) painParts.push('high BEC risk profile')
  if (painSignals.pain_keywords.length > 0) painParts.push(`pain triggers: ${painSignals.pain_keywords.join(', ')}`)
  if (painSignals.reason) painParts.push(`fit reason: ${painSignals.reason}`)
  const painContext = painParts.length > 0 ? `\nINTELLIGENCE ON THIS LEAD:\n${painParts.map(p => `- ${p}`).join('\n')}` : ''

  const prompt = `You are writing a highly personalized cold email on behalf of Nandan at Vantirs.

WHAT VANTIRS DOES (use this, don't make things up):
Vantirs is a payment fraud prevention tool for accounting firms. It auto-verifies vendor bank account changes against live state business registries and banking rails before ACH is submitted. Catches fake vendor fraud and BEC bank-change scams in 30–90 seconds. Built specifically for outsourced bookkeeping firms and virtual CFO practices that process AP for construction, real estate, and healthcare clients.
NACHA 2026 context: NACHA Phase 2 (effective June 22, 2026) may apply to firms that originate ACH payments for clients, depending on their ODFI relationship and role as a Third-Party Sender. Many bookkeeping and CFO firms are checking with their bank whether this applies to them — worth raising as a question, not stating as a fact.

PROSPECT:
- Name: ${lead.first_name}
- Title: ${lead.title}
- Company: ${lead.company_name}
- Location: ${lead.city}, ${lead.state}
${painContext}

EMAIL STEP: ${step} of 4
PSYCHOLOGY ANGLE: ${angle}
WHAT TO DO: ${angleInstructions}

NON-NEGOTIABLE RULES:
1. Sound like one human emailing another — NOT marketing copy, NOT a template
2. Step 1: max 4 sentences in body. Steps 2-4: shorter.
3. Use ${lead.first_name}'s first name ONCE at the very start
4. Reference their company name (${lead.company_name}) or city/state (${lead.city}, ${lead.state}) naturally to make it feel personal
5. Use the intelligence above — if they serve construction, mention construction; if real estate, mention real estate
6. NEVER say: "I hope this finds you well", "touch base", "circle back", "synergy", "game-changer", "revolutionary", "excited to share", "just wanted to", "reach out", "checking in to see if"
7. No bullet points in the email body. Plain prose only.
8. Sign off as: "— Nandan, Vantirs"
9. After the sign-off, on its own line: "To opt out, reply 'unsubscribe' and I'll remove you right away."
10. Subject line: max 7 words, sounds like it came from a real person, NOT clickbait

Output ONLY valid JSON with no markdown, no code fences, no explanation:
{"subject": "...", "body": "..."}`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 700,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text : '{}'

  try {
    const parsed = JSON.parse(extractJson(raw))
    return {
      subject: parsed.subject ?? 'Quick question',
      body: parsed.body ?? '',
      psychology_angle: angle,
    }
  } catch {
    // Log the raw response so we can debug parse failures
    console.error('[email-generator] JSON parse failed. Raw response:', raw.slice(0, 300))
    // Fallback: still try to extract subject/body manually
    const subjectMatch = raw.match(/"subject"\s*:\s*"([^"]+)"/)
    const bodyMatch = raw.match(/"body"\s*:\s*"([\s\S]+?)"(?:\s*[,}])/)
    if (subjectMatch && bodyMatch) {
      return {
        subject: subjectMatch[1],
        body: bodyMatch[1].replace(/\\n/g, '\n'),
        psychology_angle: angle,
      }
    }
    throw new Error(`Email generation parse failed for step ${step}: ${raw.slice(0, 200)}`)
  }
}

function getAngleForStep(step: number): PsychAngle {
  const map: Record<number, PsychAngle> = {
    1: pickOpeningAngle(),
    2: 'bump',
    3: 'value',
    4: 'breakup',
  }
  return map[step] ?? 'bump'
}

// Rotate opening angle across sends
let _angleIndex = 0
const OPENING_ANGLES: PsychAngle[] = ['loss_aversion', 'social_proof', 'reciprocity']

function pickOpeningAngle(): PsychAngle {
  const angle = OPENING_ANGLES[_angleIndex % OPENING_ANGLES.length]
  _angleIndex++
  return angle
}

// Schedule helpers — day offsets for each step
export const SEQUENCE_DELAYS_DAYS: Record<number, number> = {
  1: 0,   // send immediately (same day)
  2: 4,   // day 4
  3: 9,   // day 9
  4: 16,  // day 16
}
