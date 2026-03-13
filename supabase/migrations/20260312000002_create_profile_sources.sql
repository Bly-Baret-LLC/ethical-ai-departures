-- Create profile_sources table for sourced citations
CREATE TABLE profile_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT,
  platform TEXT,
  published_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_profile_sources_profile_id ON profile_sources(profile_id);
