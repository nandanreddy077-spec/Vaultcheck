import Anthropic from '@anthropic-ai/sdk'
import type { ReplyAnalysis } from './reply-handler'
import { sendEmail } from './email-sender'
import { getServiceClient } from './supabase'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const CALENDLY_URL = process.env.CALENDLY_URL ?? 'https://calendly.com/nandan-vantirs/15min'

export async function generateAutoResponse(
  replyBody: string,
  analysis: ReplyAnalysis,
  lead: { first_name: string; company_name: string; city: string; state: string }
): Promise<string> {

  const contextMap: Record<string, string> = {
    send_calendly: `They're interested. Write a warm, 2-sentence reply. Confirm you'd love to show them how it works, then drop the Calendly link naturally: ${CALENDLY_URL}. No pitch. Just move to the call.`,
    auto_reply: analysis.objection_type
      ? `They have a ${analysis.objection_type} objection: "${analysis.summary}". Address it directly in 2-3 sentences without being defensive. Then invite them to a quick call to see it for themselves. Link: ${CALENDLY_URL}`
      : `They asked: "${analysis.question}". Answer it in 1-2 sentences specifically about Vantirs. Then offer a quick call to show them live. Link: ${CALENDLY_URL}`,
  }

  const instruction = contextMap[analysis.suggested_action] ?? contextMap['auto_reply']

  const prompt = `You are replying on behalf of Nandan at Vantirs (payment fraud prevention for accounting firms).

Lead: ${lead.first_name} at ${lead.company_name}, ${lead.city}, ${lead.state}

Their reply:
"""
${replyBody.slice(0, 800)}
"""

Task: ${instruction}

Rules:
- Sound like a human, not a salesperson
- Max 3 sentences total
- Never use: "I hope this finds you well", "touch base", "circle back", "excited"
- Sign off as: — Nandan
- No subject line needed, just the body`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    messages: [{ role: 'user', content: prompt }],
  })

  return message.content[0].type === 'text' ? message.content[0].text.trim() : ''
}

export async function sendAutoResponse(opts: {
  leadId: string
  toEmail: string
  toFirstName: string
  subject: string
  replyBody: string
  analysis: ReplyAnalysis
  lead: { first_name: string; company_name: string; city: string; state: string }
  gmailAccount: { user: string; password: string; label: 'A' | 'B' }
  conversationId: string
}): Promise<boolean> {
  const db = getServiceClient()

  const responseBody = await generateAutoResponse(opts.replyBody, opts.analysis, opts.lead)
  if (!responseBody) return false

  const result = await sendEmail({
    to: opts.toEmail,
    subject: `Re: ${opts.subject}`,
    body: responseBody,
    account: opts.gmailAccount,
  })

  if (result.success) {
    // Log the outbound auto-response
    await db.from('outreach_conversations').insert({
      lead_id: opts.leadId,
      direction: 'outbound',
      subject: `Re: ${opts.subject}`,
      body: responseBody,
      auto_replied: true,
      gmail_account: opts.gmailAccount.user,
      gmail_message_id: result.messageId,
    })

    // Mark the original inbound message as auto-replied
    await db.from('outreach_conversations')
      .update({ auto_replied: true, auto_reply_body: responseBody, auto_reply_sent_at: new Date().toISOString() })
      .eq('id', opts.conversationId)

    // Update lead funnel stage
    const stage = opts.analysis.suggested_action === 'send_calendly' ? 'engaged' : 'engaged'
    await db.from('outreach_leads')
      .update({ funnel_stage: stage })
      .eq('id', opts.leadId)
  }

  return result.success
}
