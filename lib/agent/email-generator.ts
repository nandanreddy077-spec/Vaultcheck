import Anthropic from '@anthropic-ai/sdk'
import type { PainSignals } from './pain-detector'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export type PsychAngle = 'loss_aversion' | 'social_proof' | 'reciprocity' | 'bump' | 'value' | 'breakup'

export interface GeneratedEmail {
  subject: string
  body: string
  psychology_angle: string
}

const ANGLE_INSTRUCTIONS: Record<PsychAngle, string> = {
  loss_aversion: `Use loss aversion + NACHA 2026 compliance urgency. The NACHA Phase 2 deadline is June 22, 2026 — every firm that originates ACH payments for clients (including bookkeepers and virtual CFOs) now legally needs documented, risk-based fraud monitoring or faces fines and corrective action plans. Frame around two things they stand to lose: (1) a client relationship when a fake vendor bank change goes through on their watch, and (2) NACHA compliance exposure if they have no documented controls. Make the deadline feel real and specific — "June 22" not "soon". Never use the word "unfortunately".`,

  social_proof: `Use social proof. Reference that other bookkeeping and virtual CFO firms in their region (mention their state or a nearby major city) are already using this to stay NACHA 2026 compliant. Specificity beats volume — "3 outsourced CFO firms in Texas" beats "hundreds of firms". Keep it believable, not braggy.`,

  reciprocity: `Use reciprocity. Lead with giving — offer a free vendor payment verification checklist (5 questions every bookkeeping firm should ask before processing a vendor bank change). Mention it was built specifically for the NACHA 2026 ACH monitoring requirement. Ask for nothing in return except 2 minutes. The ask (a call) comes at the end, almost as an afterthought.`,

  bump: `This is a follow-up bump. 1-2 sentences max. Casual. No pitch. Just checking if the first email landed. Sound like a human who actually cares, not a bot. Don't re-pitch.`,

  value: `Share a specific, concrete BEC fraud stat relevant to construction/real estate. Then connect it to their world. No fluff. Re-pitch Vantirs in one sentence at the end.`,

  breakup: `This is the last email. Tell them you're closing their file. No hard feelings. Leave the door open warmly. Short. Human. Never desperate.`,
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
  const painContext = painSignals.pain_keywords.length > 0
    ? `Their clients likely deal with: ${painSignals.pain_keywords.join(', ')}.`
    : ''

  const prompt = `You are writing a cold outreach email for Vantirs — a payment verification SaaS that prevents fake invoice fraud and BEC attacks for accounting firms managing construction and real estate clients.

PROSPECT:
- First name: ${lead.first_name}
- Title: ${lead.title}
- Company: ${lead.company_name}
- Location: ${lead.city}, ${lead.state}
${painContext}

EMAIL STEP: ${step} of 4
PSYCHOLOGY ANGLE: ${angle}
INSTRUCTIONS: ${angleInstructions}

RULES (non-negotiable):
1. Sound like a human, not marketing copy
2. Step 1: max 3 sentences in body. Steps 2-4: even shorter
3. Use ${lead.first_name}'s first name once at the start only
4. Mention their specific city or state naturally if it makes the email feel less generic
5. Never use: "I hope this finds you well", "touch base", "circle back", "synergy", "game-changer", "revolutionary", "excited to share"
6. No bullet points. Plain prose only.
7. Sign off as: "— Nandan, Vantirs"
8. Subject line: max 8 words, no clickbait, sounds like it came from a real person
9. End the body (after the sign-off) with exactly this line on its own: "To opt out, reply with 'unsubscribe' and I'll remove you immediately."

Respond ONLY with JSON (no markdown):
{
  "subject": "...",
  "body": "..."
}`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 600,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : '{}'

  try {
    const parsed = JSON.parse(text.trim())
    return {
      subject: parsed.subject ?? 'Quick question',
      body: parsed.body ?? '',
      psychology_angle: angle,
    }
  } catch {
    return {
      subject: 'Quick question for you',
      body: `${lead.first_name}, had a quick thought about your firm. Worth a 15-min call?\n\n— Nandan, Vantirs`,
      psychology_angle: angle,
    }
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
  1: 0,   // send immediately
  2: 4,   // day 4
  3: 9,   // day 9
  4: 16,  // day 16
}
