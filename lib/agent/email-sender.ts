import nodemailer from 'nodemailer'
import { getServiceClient } from './supabase'

interface GmailAccount {
  user: string
  password: string
  label: 'A' | 'B'
}

function getAccounts(): GmailAccount[] {
  const accounts: GmailAccount[] = []
  if (process.env.GMAIL_A_USER && process.env.GMAIL_A_APP_PASSWORD) {
    accounts.push({ user: process.env.GMAIL_A_USER, password: process.env.GMAIL_A_APP_PASSWORD, label: 'A' })
  }
  if (process.env.GMAIL_B_USER && process.env.GMAIL_B_APP_PASSWORD) {
    accounts.push({ user: process.env.GMAIL_B_USER, password: process.env.GMAIL_B_APP_PASSWORD, label: 'B' })
  }
  if (accounts.length === 0) throw new Error('No Gmail accounts configured')
  return accounts
}

function createTransport(account: GmailAccount) {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: account.user, pass: account.password },
  })
}

const MAX_PER_ACCOUNT = parseInt(process.env.MAX_EMAILS_PER_DAY_PER_ACCOUNT ?? '35')

export async function getSendCounts(): Promise<Record<string, number>> {
  const db = getServiceClient()
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const { data } = await db
    .from('outreach_emails')
    .select('gmail_account')
    .eq('status', 'sent')
    .gte('sent_at', todayStart.toISOString())

  const counts: Record<string, number> = {}
  for (const row of data ?? []) {
    const acct = row.gmail_account as string
    counts[acct] = (counts[acct] ?? 0) + 1
  }
  return counts
}

export async function pickAvailableAccount(
  counts: Record<string, number>
): Promise<GmailAccount | null> {
  const accounts = getAccounts()
  for (const account of accounts) {
    const sent = counts[account.user] ?? 0
    if (sent < MAX_PER_ACCOUNT) return account
  }
  return null
}

export interface SendResult {
  success: boolean
  messageId?: string
  error?: string
}

export async function sendEmail(opts: {
  to: string
  subject: string
  body: string
  account: GmailAccount
  replyToThreadId?: string
}): Promise<SendResult> {
  const transport = createTransport(opts.account)

  try {
    const info = await transport.sendMail({
      from: `Nandan <${opts.account.user}>`,
      to: opts.to,
      subject: opts.subject,
      text: opts.body,
      // Plain text only — HTML emails get flagged as marketing
    })

    return { success: true, messageId: info.messageId }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}

// 2-second delay between sends to avoid rate limits
export function delay(ms = 2000) {
  return new Promise((res) => setTimeout(res, ms))
}

export async function isUnsubscribed(email: string): Promise<boolean> {
  const db = getServiceClient()
  const { data } = await db
    .from('outreach_unsubscribes')
    .select('id')
    .eq('email', email)
    .single()
  return !!data
}
