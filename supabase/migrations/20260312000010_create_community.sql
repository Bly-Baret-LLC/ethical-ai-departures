-- Fan letters / notes of support
create table fan_letters (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  text text not null check (char_length(text) <= 500),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create index idx_fan_letters_profile on fan_letters(profile_id);
create index idx_fan_letters_status on fan_letters(status);

alter table fan_letters enable row level security;

create policy "Public read approved fan letters"
  on fan_letters for select
  using (status = 'approved');

create policy "Public insert fan letters"
  on fan_letters for insert
  with check (true);

-- Kudos counter
create table kudos (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  fingerprint_hash text not null,
  created_at timestamptz not null default now()
);

create unique index idx_kudos_unique
  on kudos(profile_id, fingerprint_hash);

alter table kudos enable row level security;

create policy "Public read kudos"
  on kudos for select using (true);

create policy "Public insert kudos"
  on kudos for insert with check (true);

-- Discussion threads
create table discussions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  parent_id uuid references discussions(id) on delete cascade,
  display_name text not null default 'Anonymous',
  text text not null check (char_length(text) <= 1000),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'flagged')),
  created_at timestamptz not null default now()
);

create index idx_discussions_profile on discussions(profile_id);
create index idx_discussions_status on discussions(status);
create index idx_discussions_parent on discussions(parent_id);

alter table discussions enable row level security;

create policy "Public read approved discussions"
  on discussions for select
  using (status = 'approved');

create policy "Public insert discussions"
  on discussions for insert
  with check (true);
