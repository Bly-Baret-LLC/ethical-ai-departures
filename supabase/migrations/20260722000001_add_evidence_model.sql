-- Evidence model (Content Accuracy & Editorial Remediation Brief, 2026-07-22)
-- Distinguishes explicit statements, reported connections, allegations, and
-- contextual departures; separates claims from predictions; widens publication
-- types so records can be labeled accurately. Backward compatible: all new
-- columns are nullable or defaulted; no existing column changes shape.

-- 1. Profiles: evidence classification
ALTER TABLE profiles
  ADD COLUMN departure_type TEXT NOT NULL DEFAULT 'unknown'
    CHECK (departure_type IN ('resigned', 'fired', 'laid_off', 'team_eliminated', 'unknown')),
  ADD COLUMN motive_evidence TEXT NOT NULL DEFAULT 'contextual'
    CHECK (motive_evidence IN ('direct', 'reported', 'alleged', 'contextual')),
  ADD COLUMN headline_counted BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN motive_quote TEXT,
  ADD COLUMN claim_status TEXT
    CHECK (claim_status IN ('uncontested', 'contested', 'pending')),
  ADD COLUMN last_reviewed_at DATE,
  ADD COLUMN reviewer TEXT,
  ADD COLUMN correction_note TEXT;

-- Contextual records can never be headline-counted (enforced at the database).
ALTER TABLE profiles
  ADD CONSTRAINT profiles_contextual_not_counted
    CHECK (NOT (motive_evidence = 'contextual' AND headline_counted));

CREATE INDEX idx_profiles_headline_counted ON profiles(headline_counted);
CREATE INDEX idx_profiles_motive_evidence ON profiles(motive_evidence);

-- 2. Profile sources: visible source typing
ALTER TABLE profile_sources
  ADD COLUMN source_type TEXT
    CHECK (source_type IN ('first_party', 'reporting', 'legal_filing', 'official_document', 'organization', 'reference'));

-- 3. Publications: accurate content-type labels
ALTER TABLE publications DROP CONSTRAINT publications_publication_type_check;
ALTER TABLE publications ADD CONSTRAINT publications_publication_type_check
  CHECK (publication_type IN ('paper', 'white_paper', 'report', 'preprint',
                              'essay', 'resignation_letter', 'legal_analysis',
                              'forecast_essay', 'testimony'));

-- 4. Predictions: separate contemporaneous claims from forward predictions,
--    support an under-review state, and record event dates distinct from
--    review/resolution dates.
ALTER TABLE predictions
  ADD COLUMN record_kind TEXT NOT NULL DEFAULT 'prediction'
    CHECK (record_kind IN ('prediction', 'claim')),
  ADD COLUMN under_review BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN event_date DATE;
