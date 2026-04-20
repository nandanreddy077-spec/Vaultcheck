-- Vantirs Outreach Agent Schema
-- Run this in Supabase SQL Editor

create table if not exists outreach_leads (
  id uuid primary key default gen_random_uuid(),
  apollo_id text unique,
  first_name text not null,
  last_name text not null,
  email text not null unique,
  title text,
  company_name text,
  company_domain text,
  city text,
  state text,
  industry text,
  employee_count integer,
  linkedin_url text,
  phone text,
  -- Pain signal analysis from Claude
  pain_signals jsonb default '{}',
  pain_score integer default 0 check (pain_score between 0 and 100),
  -- Outreach state
  status text not null default 'new' check (status in ('new', 'queued', 'active', 'replied', 'unsubscribed', 'bounced', 'finished')),
  sequence_step integer not null default 0,
  next_email_at timestamptz,
  last_emailed_at timestamptz,
  replied_at timestamptz,
  -- Meta
  source text default 'apollo',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists outreach_emails (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references outreach_leads(id) on delete cascade,
  step integer not null,
  subject text not null,
  body text not null,
  psychology_angle text,
  -- Sending state
  status text not null default 'scheduled' check (status in ('scheduled', 'sent', 'failed', 'cancelled')),
  scheduled_at timestamptz not null,
  sent_at timestamptz,
  error text,
  -- Gmail metadata
  gmail_account text,
  gmail_message_id text,
  thread_id text,
  -- Meta
  created_at timestamptz default now()
);

create table if not exists agent_runs (
  id uuid primary key default gen_random_uuid(),
  run_type text not null check (run_type in ('source-leads', 'send-emails', 'check-replies')),
  status text not null default 'running' check (status in ('running', 'success', 'error')),
  leads_fetched integer default 0,
  leads_qualified integer default 0,
  emails_sent integer default 0,
  replies_found integer default 0,
  error text,
  details jsonb default '{}',
  started_at timestamptz default now(),
  finished_at timestamptz
);

create table if not exists outreach_unsubscribes (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  reason text,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_outreach_leads_status on outreach_leads(status);
create index if not exists idx_outreach_leads_next_email on outreach_leads(next_email_at) where status = 'active';
create index if not exists idx_outreach_leads_email on outreach_leads(email);
create index if not exists idx_outreach_emails_status_scheduled on outreach_emails(status, scheduled_at) where status = 'scheduled';
create index if not exists idx_outreach_emails_lead_id on outreach_emails(lead_id);
create index if not exists idx_agent_runs_type on agent_runs(run_type, started_at desc);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_outreach_leads_updated_at on outreach_leads;
create trigger trg_outreach_leads_updated_at
  before update on outreach_leads
  for each row execute function update_updated_at();

-- RLS: service role bypasses, disable for agent tables (server-only access)
alter table outreach_leads enable row level security;
alter table outreach_emails enable row level security;
alter table agent_runs enable row level security;
alter table outreach_unsubscribes enable row level security;

-- Only service role can access (no anon/user access needed)
create policy "service_role_all_leads" on outreach_leads for all using (auth.role() = 'service_role');
create policy "service_role_all_emails" on outreach_emails for all using (auth.role() = 'service_role');
create policy "service_role_all_runs" on agent_runs for all using (auth.role() = 'service_role');
create policy "service_role_all_unsubs" on outreach_unsubscribes for all using (auth.role() = 'service_role');
