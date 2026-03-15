-- Predictions table for tracking falsifiable claims from researcher statements
create table predictions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text,
  source_quote text not null,
  resolution_criteria text not null,
  status text not null default 'open' check (status in ('open', 'pending_review', 'confirmed', 'disproven', 'partially_resolved')),
  resolution_date date,
  resolution_outcome text check (resolution_outcome in ('true', 'false', 'partial')),
  resolution_rationale text,
  resolution_evidence_url text,
  resolved_by text,
  reviewed_by text,
  review_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes
create index idx_predictions_profile on predictions(profile_id);
create index idx_predictions_status on predictions(status);

-- Auto-update updated_at
create trigger set_predictions_updated_at
  before update on predictions
  for each row execute function update_updated_at();

-- RLS
alter table predictions enable row level security;

-- Public can read non-draft predictions
create policy "Public read open/resolved predictions"
  on predictions for select
  using (status != 'pending_review');
