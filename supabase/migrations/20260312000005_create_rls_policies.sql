-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE concern_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_concern_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticker_stats ENABLE ROW LEVEL SECURITY;

-- profiles: Public can read only published profiles
CREATE POLICY "Public can read published profiles"
  ON profiles FOR SELECT
  USING (status = 'published');

-- profile_sources: Public can read sources linked to published profiles
CREATE POLICY "Public can read sources for published profiles"
  ON profile_sources FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = profile_sources.profile_id
      AND profiles.status = 'published'
    )
  );

-- concern_tags: Public can read all tags (taxonomy is public)
CREATE POLICY "Public can read all concern tags"
  ON concern_tags FOR SELECT
  USING (true);

-- profile_concern_tags: Public can read tags linked to published profiles
CREATE POLICY "Public can read tags for published profiles"
  ON profile_concern_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = profile_concern_tags.profile_id
      AND profiles.status = 'published'
    )
  );

-- ticker_stats: Public can read all stats
CREATE POLICY "Public can read ticker stats"
  ON ticker_stats FOR SELECT
  USING (true);
