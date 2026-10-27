-- Editorial correction only: a risk/near miss is not the forecast event.
-- Keep the original probability, source, horizon, status and relationships.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

CREATE TABLE public.forecast_criteria_backup_20261026 (
  id uuid PRIMARY KEY,
  resolution_criteria text NOT NULL,
  criteria_adopted_at date
);
ALTER TABLE public.forecast_criteria_backup_20261026 ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.forecast_criteria_backup_20261026 FROM anon, authenticated;

DO $$
DECLARE n integer;
BEGIN
  PERFORM p.id FROM public.predictions p JOIN public.profiles pr ON pr.id=p.profile_id
    WHERE pr.slug='geoffrey-hinton'
      AND p.title='Geoffrey Hinton estimated a 10-20% chance of AI-caused human extinction within 30 years'
    FOR UPDATE OF p;
  IF (SELECT count(*) FROM public.predictions p JOIN public.profiles pr ON pr.id=p.profile_id
      WHERE pr.slug='geoffrey-hinton'
      AND p.title='Geoffrey Hinton estimated a 10-20% chance of AI-caused human extinction within 30 years') <> 1
  THEN RAISE EXCEPTION 'Expected exactly one Hinton probability record'; END IF;

  INSERT INTO public.forecast_criteria_backup_20261026
    SELECT p.id,p.resolution_criteria,p.criteria_adopted_at
    FROM public.predictions p JOIN public.profiles pr ON pr.id=p.profile_id
    WHERE pr.slug='geoffrey-hinton'
      AND p.title='Geoffrey Hinton estimated a 10-20% chance of AI-caused human extinction within 30 years'
      AND p.record_kind='probabilistic_forecast' AND p.status='open' AND NOT p.under_review
      AND p.resolution_criteria IN (
        'Evidence of AI systems demonstrating autonomous capability that poses genuine existential-scale risk, or credible near-miss events.',
        'Evidence of AI systems demonstrating autonomous capability that poses genuine existential-scale risk.'
      );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'Hinton criteria baseline drifted; review before applying'; END IF;

  UPDATE public.predictions SET
    resolution_criteria='The forecast concerns AI-caused human extinction within 30 years of the December 2024 statement. Capability gains, safety incidents and near misses do not meet that outcome. Retain the 10–20% probability estimate; a single outcome cannot establish whether that probability was well calibrated. Excluded from binary accuracy scores.',
    criteria_adopted_at='2026-10-26'
  WHERE id IN (SELECT id FROM public.forecast_criteria_backup_20261026);
END $$;
COMMIT;
