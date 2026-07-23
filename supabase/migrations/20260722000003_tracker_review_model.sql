-- Prediction Tracker Review model (adjudication addendum, 2026-07-22).
-- Item types distinguish forecasts from warnings/claims; statuses gain
-- not_applicable/contradicted/unresolvable; quotes carry verbatim flags and
-- criteria carry adoption dates (disclosed when written after the statement).

-- 1. Widen item types (record_kind): migrate legacy 'claim' first.
ALTER TABLE predictions DROP CONSTRAINT predictions_record_kind_check;
UPDATE predictions SET record_kind = 'contemporaneous_claim' WHERE record_kind = 'claim';
ALTER TABLE predictions ADD CONSTRAINT predictions_record_kind_check
  CHECK (record_kind IN ('prediction', 'probabilistic_forecast', 'warning',
                         'contemporaneous_claim', 'editorial_synthesis'));

-- 2. Widen statuses.
ALTER TABLE predictions DROP CONSTRAINT predictions_status_check;
ALTER TABLE predictions ADD CONSTRAINT predictions_status_check
  CHECK (status IN ('open', 'pending_review', 'confirmed', 'disproven',
                    'partially_resolved', 'contradicted', 'unresolvable',
                    'not_applicable'));

-- 3. Quote fidelity, sourcing, and criteria metadata.
ALTER TABLE predictions
  ADD COLUMN is_verbatim_quote BOOLEAN,
  ADD COLUMN source_url TEXT,
  ADD COLUMN criteria_adopted_at DATE,
  ADD COLUMN resolution_deadline DATE;

-- NOTE: acceptance-check guard constraints are added at the end of the
-- companion data migration (20260722000004), after existing rows are
-- corrected to satisfy them.
