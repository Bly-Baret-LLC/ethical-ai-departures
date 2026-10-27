BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';
DO $$ BEGIN
  IF (SELECT count(*) FROM public.forecast_criteria_backup_20261026) <> 1 THEN
    RAISE EXCEPTION 'Expected exactly one criteria backup';
  END IF;
  PERFORM p.id FROM public.predictions p JOIN public.forecast_criteria_backup_20261026 b USING(id) FOR UPDATE OF p;
  IF (SELECT count(*) FROM public.predictions p JOIN public.forecast_criteria_backup_20261026 b USING(id)
      WHERE p.record_kind='probabilistic_forecast' AND p.status='open' AND NOT p.under_review
      AND p.criteria_adopted_at='2026-10-26'
      AND p.resolution_criteria='The forecast concerns AI-caused human extinction within 30 years of the December 2024 statement. Capability gains, safety incidents and near misses do not meet that outcome. Retain the 10–20% probability estimate; a single outcome cannot establish whether that probability was well calibrated. Excluded from binary accuracy scores.') <> 1 THEN
    RAISE EXCEPTION 'Criteria or adjudication changed since correction; manual rollback review required';
  END IF;
  UPDATE public.predictions p SET resolution_criteria=b.resolution_criteria,
    criteria_adopted_at=b.criteria_adopted_at
    FROM public.forecast_criteria_backup_20261026 b WHERE p.id=b.id;
END $$;
DROP TABLE public.forecast_criteria_backup_20261026;
COMMIT;
