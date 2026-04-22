import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export type ReplyIntent = 'positive' | 'objection' | 'question' | 'not_interested' | 'out_of_office' | 'other'

export interface ReplyAnalysis {
  intent: ReplyIntent
  confidence: number         // 0-100
  summary: string            // one sentence
  objection_type?: string    // 'price' | 'timing' | 'trust' | 'already_have_solution' | 'not_relevant'
  question?: string          // what they asked
  suggested_action: 'auto_reply' | 'send_calendly' | 'mark_lost' | 'reschedule' | 'notify_human'
}

export async function analyzeReply(
  replyBody: string,
  lead: { first_name: string; company_name: string; sequence_step: number }
): Promise<ReplyAnalysis> {
  const prompt = `You are analyzing a reply to a cold email for Vantirs — a payment fraud prevention tool for accounting firms.

Lead: ${lead.first_name} at ${lead.company_name} (received email step ${lead.sequence_step} of 4)

Their reply:
"""
${replyBody.slice(0, 1500)}
"""

Classify this reply and decide what the AI agent should do next. Respond ONLY with JSON:
{
  "intent": "positive" | "objection" | "question" | "not_interested" | "out_of_office" | "other",
  "confidence": 0-100,
  "summary": "one sentence describing the reply",
  "objection_type": "price" | "timing" | "trust" | "already_have_solution" | "not_relevant" | null,
  "question": "what they asked, or null",
  "suggested_action": "auto_reply" | "send_calendly" | "mark_lost" | "reschedule" | "notify_human"
}

Rules:
- positive = they're interested, want to learn more, open to a call → suggested_action: send_calendly
- objection = pushback but not a hard no → suggested_action: auto_reply
- question = genuine question about the product → suggested_action: auto_reply
- not_interested = clear no → suggested_action: mark_lost
- out_of_office = OOO auto-reply → suggested_action: reschedule
- other = unclear → suggested_action: notify_human`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 400,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : '{}'

  try {
    const parsed = JSON.parse(text.trim())
    return {
      intent: parsed.intent ?? 'other',
      confidence: parsed.confidence ?? 50,
      summary: parsed.summary ?? '',
      objection_type: parsed.objection_type ?? undefined,
      question: parsed.question ?? undefined,
      suggested_action: parsed.suggested_action ?? 'notify_human',
    }
  } catch {
    return { intent: 'other', confidence: 0, summary: 'Parse error', suggested_action: 'notify_human' }
  }
}
