-- Policy proposals extracted from researcher statements
create table proposals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  type_tags text[] not null default '{}',
  source_profile_ids uuid[] not null default '{}',
  source_url text,
  country_applicability text[] not null default '{}',
  in_legislation boolean not null default false,
  vote_count integer not null default 0,
  status text not null default 'published' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_proposals_status on proposals(status);
create index idx_proposals_vote on proposals(vote_count desc);

create trigger set_proposals_updated_at
  before update on proposals
  for each row execute function update_updated_at();

alter table proposals enable row level security;

create policy "Public read published proposals"
  on proposals for select
  using (status = 'published');

-- Proposal votes
create table proposal_votes (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references proposals(id) on delete cascade,
  fingerprint_hash text not null,
  created_at timestamptz not null default now()
);

create unique index idx_proposal_votes_unique
  on proposal_votes(proposal_id, fingerprint_hash);

alter table proposal_votes enable row level security;

create policy "Public read proposal votes"
  on proposal_votes for select using (true);

create policy "Public insert proposal votes"
  on proposal_votes for insert with check (true);
