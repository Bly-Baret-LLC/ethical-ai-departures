-- Publications table for key research authored by departed researchers
CREATE TABLE publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT,
  publication_type TEXT CHECK (publication_type IN ('paper', 'white_paper', 'report', 'preprint')),
  publisher TEXT,
  published_date DATE,
  abstract TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_publications_profile ON publications(profile_id);
CREATE INDEX idx_publications_type ON publications(publication_type);

-- Auto-update updated_at (reuses existing function from profiles migration)
CREATE TRIGGER set_publications_updated_at
  BEFORE UPDATE ON publications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Junction table linking publications to predictions they support
CREATE TABLE publication_predictions (
  publication_id UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
  prediction_id UUID NOT NULL REFERENCES predictions(id) ON DELETE CASCADE,
  UNIQUE (publication_id, prediction_id)
);

CREATE INDEX idx_pub_pred_publication ON publication_predictions(publication_id);
CREATE INDEX idx_pub_pred_prediction ON publication_predictions(prediction_id);

-- RLS
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE publication_predictions ENABLE ROW LEVEL SECURITY;

-- Public can read publications for published profiles
CREATE POLICY "Public can read publications for published profiles"
  ON publications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = publications.profile_id
      AND profiles.status = 'published'
    )
  );

-- Public can read all publication-prediction links
CREATE POLICY "Public can read publication prediction links"
  ON publication_predictions FOR SELECT
  USING (true);
