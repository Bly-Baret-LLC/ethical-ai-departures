// Isolated local database only; test changes are rolled back.
import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
const body = path => readFileSync(new URL(path, import.meta.url), 'utf8')
  .replace(/^BEGIN;\s*$/gm, '').replace(/^COMMIT;\s*$/gm, '')
const up = body('../migrations/20261026000003_correct_hinton_forecast_criteria.sql')
const down = body('../rollbacks/20261026000003_correct_hinton_forecast_criteria.down.sql')
const assertions = `DO $$ BEGIN
  IF (SELECT count(*) FROM public.forecast_criteria_backup_20261026) <> 1 THEN RAISE EXCEPTION 'Wrong correction count'; END IF;
  IF NOT EXISTS (SELECT 1 FROM predictions p JOIN public.forecast_criteria_backup_20261026 b USING(id)
    WHERE p.resolution_criteria LIKE 'The forecast concerns AI-caused human extinction%'
      AND p.criteria_adopted_at='2026-10-26' AND p.record_kind='probabilistic_forecast' AND p.status='open')
    THEN RAISE EXCEPTION 'Incorrect criteria or scoring kind'; END IF;
  IF EXISTS (SELECT row FROM before_predictions EXCEPT SELECT to_jsonb(p)-'updated_at'-'resolution_criteria'-'criteria_adopted_at' FROM predictions p)
    OR EXISTS (SELECT to_jsonb(p)-'updated_at'-'resolution_criteria'-'criteria_adopted_at' FROM predictions p EXCEPT SELECT row FROM before_predictions)
    THEN RAISE EXCEPTION 'Prediction metadata or count changed'; END IF;
  IF EXISTS (SELECT row FROM before_other_criteria EXCEPT SELECT to_jsonb(p)-'updated_at' FROM predictions p WHERE id NOT IN (SELECT id FROM public.forecast_criteria_backup_20261026))
    THEN RAISE EXCEPTION 'Other criteria changed'; END IF;
  IF has_table_privilege('anon','public.forecast_criteria_backup_20261026','SELECT')
    OR has_table_privilege('authenticated','public.forecast_criteria_backup_20261026','SELECT')
    THEN RAISE EXCEPTION 'Backup exposed'; END IF;
END $$;`
const sql = `BEGIN;
DO $initial$ BEGIN
  IF to_regclass('public.forecast_criteria_backup_20261026') IS NOT NULL THEN EXECUTE $undo$${down}$undo$; END IF;
END $initial$;
CREATE TEMP TABLE before_predictions AS SELECT to_jsonb(p)-'updated_at'-'resolution_criteria'-'criteria_adopted_at' AS row FROM predictions p;
CREATE TEMP TABLE before_full AS SELECT to_jsonb(p)-'updated_at' AS row FROM predictions p;
CREATE TEMP TABLE before_other_criteria AS SELECT to_jsonb(p)-'updated_at' AS row FROM predictions p WHERE title <> 'Geoffrey Hinton estimated a 10-20% chance of AI-caused human extinction within 30 years';
${up}
${assertions}
DO $duplicate$ BEGIN
  BEGIN
    EXECUTE $repeat$${up}$repeat$;
    RAISE EXCEPTION 'Duplicate unexpectedly succeeded';
  EXCEPTION WHEN duplicate_table THEN NULL;
  END;
END $duplicate$;
DO $drift$ BEGIN
  BEGIN
    UPDATE predictions SET resolution_criteria='Later editorial change' WHERE id IN (SELECT id FROM public.forecast_criteria_backup_20261026);
    EXECUTE $undo$${down}$undo$;
    RAISE EXCEPTION 'Drift rollback unexpectedly succeeded';
  EXCEPTION WHEN raise_exception THEN
    IF SQLERRM <> 'Criteria or adjudication changed since correction; manual rollback review required' THEN RAISE; END IF;
  END;
END $drift$;
${down}
DO $$ BEGIN
  IF EXISTS(SELECT row FROM before_full EXCEPT SELECT to_jsonb(p)-'updated_at' FROM predictions p)
    OR EXISTS(SELECT to_jsonb(p)-'updated_at' FROM predictions p EXCEPT SELECT row FROM before_full)
    THEN RAISE EXCEPTION 'Rollback did not restore original'; END IF;
END $$;
${up}
${assertions}
ROLLBACK;`
const result = spawnSync('docker', ['exec','-i','supabase_db_warning-collective','psql','-X','-v','ON_ERROR_STOP=1','-U','postgres','-d','postgres'], { input: sql, encoding: 'utf8' })
process.stdout.write(result.stdout || '')
process.stderr.write(result.stderr || '')
if (result.status !== 0) process.exit(result.status || 1)
console.log('PASS: local correction, duplicate rejection, drift protection, exact rollback and reapply.')
