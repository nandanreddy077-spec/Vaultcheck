-- Vantirs Sales Funnel Schema (add-on to outreach-schema.sql)
-- Run this in Supabase SQL Editor

-- Add funnel stage tracking to leads
alter table outreach_leads
  add column if not exists funnel_stage text not null default 'cold'
    check (funnel_stage in ('cold','sequence','replied','engaged','objection','meeting_scheduled','meeting_done','trial','customer','lost')),
  add column if not exists calendly_booked_at timestamptz,
  add column if not exists trial_started_at timestamptz,
  add column if not exists converted_at timestamptz,
  add column if not exists lost_reason text,
  add column if not exists notes text;

-- Full conversation thread (every email in/out per lead)
create table if not exists outreach_conversations (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references outreach_leads(id) on delete cascade,
  direction text not null check (direction in ('outbound','inbound')),
  subject text,
  body text not null,
  -- Classification of inbound messages
  intent text check (intent in ('positive','objection','question','not_interested','out_of_office','other')),
  intent_confidence integer,
  -- AI auto-response
  auto_replied boolean default false,
  auto_reply_body text,
  auto_reply_sent_at timestamptz,
  -- Gmail metadata
  gmail_message_id text,
  gmail_thread_id text,
  gmail_account text,
  received_at timestamptz default now(),
  created_at timestamptz default now()
);

create index if not exists idx_conversations_lead on outreach_conversations(lead_id, received_at desc);
create index if not exists idx_conversations_intent on outreach_conversations(intent) where direction = 'inbound';
create index if not exists idx_leads_funnel_stage on outreach_leads(funnel_stage);

-- RLS
alter table outreach_conversations enable row level security;
create policy "service_role_all_conversations" on outreach_conversations for all using (auth.role() = 'service_role');
