-- Agent activity logs for pipeline monitoring and auditability
create table agent_logs (
  id uuid primary key default gen_random_uuid(),
  agent_name text not null check (agent_name in ('scout', 'verification', 'synthesis', 'predictions_tracker', 'orchestrator')),
  action_type text not null,
  status text not null default 'running' check (status in ('running', 'success', 'error')),
  input_summary text,
  output_summary text,
  confidence_score numeric(3,2) check (confidence_score >= 0 and confidence_score <= 1),
  error_detail text,
  duration_ms integer,
  created_at timestamptz not null default now()
);

-- Indexes
create index idx_agent_logs_agent on agent_logs(agent_name);
create index idx_agent_logs_status on agent_logs(status);
create index idx_agent_logs_created on agent_logs(created_at desc);

-- RLS
alter table agent_logs enable row level security;

-- Only authenticated editors can read agent logs
create policy "Editors read agent logs"
  on agent_logs for select
  using (auth.role() = 'authenticated');

-- Service role (agents) can insert logs
create policy "Service role insert agent logs"
  on agent_logs for insert
  with check (true);
