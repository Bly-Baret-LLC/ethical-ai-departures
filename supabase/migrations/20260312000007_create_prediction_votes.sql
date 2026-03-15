-- Prediction votes table for insider voting
create table prediction_votes (
  id uuid primary key default gen_random_uuid(),
  prediction_id uuid not null references predictions(id) on delete cascade,
  vote text not null check (vote in ('agree', 'disagree')),
  fingerprint_hash text not null,
  is_insider boolean not null default true,
  email text,
  created_at timestamptz not null default now()
);

-- Indexes
create index idx_prediction_votes_prediction on prediction_votes(prediction_id);
create index idx_prediction_votes_fingerprint on prediction_votes(fingerprint_hash);

-- Unique constraint: one vote per fingerprint per prediction
create unique index idx_prediction_votes_unique
  on prediction_votes(prediction_id, fingerprint_hash);

-- RLS
alter table prediction_votes enable row level security;

-- Public can read vote counts (aggregated)
create policy "Public read prediction votes"
  on prediction_votes for select
  using (true);

-- Anyone can insert votes (no auth required)
create policy "Public insert prediction votes"
  on prediction_votes for insert
  with check (true);
