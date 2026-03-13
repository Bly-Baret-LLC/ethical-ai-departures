-- Create concern_tags taxonomy table
CREATE TABLE concern_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create junction table for many-to-many profile ↔ concern_tag
CREATE TABLE profile_concern_tags (
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  concern_tag_id UUID NOT NULL REFERENCES concern_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (profile_id, concern_tag_id)
);

CREATE INDEX idx_profile_concern_tags_tag_id ON profile_concern_tags(concern_tag_id);
