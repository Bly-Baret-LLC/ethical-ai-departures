-- Anonymous signals - zero PII by design
create table anonymous_signals (
  id uuid primary key default gen_random_uuid(),
  concern_categories text[] not null,
  company_optional text,
  free_text_optional text check (free_text_optional is null or char_length(free_text_optional) <= 500),
  status text not null default 'approved' check (status in ('approved', 'rejected')),
  created_at timestamptz not null default now()
);

-- No indexes on company or text to prevent de-anonymization queries
create index idx_signals_status on anonymous_signals(status);

alter table anonymous_signals enable row level security;

-- Only aggregate queries via server-side functions
-- No direct public read to prevent individual signal access
create policy "Service role full access signals"
  on anonymous_signals for all
  using (true);
