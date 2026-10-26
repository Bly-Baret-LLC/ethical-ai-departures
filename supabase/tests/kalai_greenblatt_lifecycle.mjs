// Isolated LOCAL container only. Exercises the batch inside an outer rollback;
// never connects to a remote database or applies a persistent migration.
import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const read = (relative) => readFileSync(fileURLToPath(new URL(relative, import.meta.url)), 'utf8')
const body = (sql) => sql.replace(/^BEGIN;\s*$/gm, '').replace(/^COMMIT;\s*$/gm, '')
const up = body(read('../migrations/20261026000001_add_kalai_and_greenblatt_response.sql'))
const down = body(read('../rollbacks/20261026000001_add_kalai_and_greenblatt_response.down.sql'))
const assertions = read('./kalai_greenblatt_records.sql')
const sql = `
BEGIN;
CREATE TEMP TABLE before_profiles AS SELECT id, to_jsonb(p)-'updated_at' AS row FROM profiles p;
CREATE TEMP TABLE before_sources AS SELECT id, to_jsonb(s) AS row FROM profile_sources s;
CREATE TEMP TABLE before_writings AS SELECT id, to_jsonb(w) AS row FROM publications w;
CREATE TEMP TABLE before_counts AS SELECT
  count(*) FILTER(WHERE status='published') published,
  count(*) FILTER(WHERE status='published' AND headline_counted AND motive_evidence IN ('direct','reported')) headline,
  count(*) FILTER(WHERE status='published' AND motive_evidence='alleged') alleged,
  count(*) FILTER(WHERE status='published' AND headline_counted AND company='OpenAI') openai FROM profiles;
${up}
${assertions}
DO $$ BEGIN
  IF (SELECT count(*) FROM profiles WHERE status='published') <> (SELECT published+1 FROM before_counts)
    OR (SELECT count(*) FROM profiles WHERE status='published' AND headline_counted AND motive_evidence IN ('direct','reported')) <> (SELECT headline+1 FROM before_counts)
    OR (SELECT count(*) FROM profiles WHERE status='published' AND motive_evidence='alleged') <> (SELECT alleged FROM before_counts)
    OR (SELECT count(*) FROM profiles WHERE status='published' AND headline_counted AND company='OpenAI') <> (SELECT openai+1 FROM before_counts)
    OR (SELECT count(*) FROM publications) <> (SELECT count(*)+1 FROM before_writings)
    OR (SELECT count(*) FROM profile_sources) <> (SELECT count(*)+6 FROM before_sources) THEN
    RAISE EXCEPTION 'Unexpected batch deltas';
  END IF;
  IF EXISTS (SELECT 1 FROM before_profiles b LEFT JOIN profiles p ON p.id=b.id
    WHERE p.id IS NULL OR (p.slug NOT IN ('mikita-balesni','tomek-korbak') AND to_jsonb(p)-'updated_at' <> b.row))
    OR EXISTS (SELECT 1 FROM before_sources b LEFT JOIN profile_sources s ON s.id=b.id WHERE s.id IS NULL OR to_jsonb(s) <> b.row)
    OR EXISTS (SELECT 1 FROM before_writings b LEFT JOIN publications w ON w.id=b.id WHERE w.id IS NULL OR to_jsonb(w) <> b.row) THEN
    RAISE EXCEPTION 'Existing unrelated records modified';
  END IF;
END $$;
DO $duplicate$ BEGIN
  BEGIN
    EXECUTE $repeat$${up}$repeat$;
    RAISE EXCEPTION 'Reapply unexpectedly succeeded';
  EXCEPTION WHEN raise_exception THEN
    IF SQLERRM <> 'Kalai already exists; review all statuses before applying' THEN RAISE; END IF;
  END;
END $duplicate$;
${down}
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM before_profiles b LEFT JOIN profiles p ON p.id=b.id WHERE p.id IS NULL OR to_jsonb(p)-'updated_at' <> b.row)
    OR EXISTS (SELECT 1 FROM before_sources b LEFT JOIN profile_sources s ON s.id=b.id WHERE s.id IS NULL OR to_jsonb(s) <> b.row)
    OR EXISTS (SELECT 1 FROM before_writings b LEFT JOIN publications w ON w.id=b.id WHERE w.id IS NULL OR to_jsonb(w) <> b.row)
    OR (SELECT count(*) FROM profiles WHERE status='published') <> (SELECT published FROM before_counts)
    OR NOT EXISTS (SELECT 1 FROM profiles WHERE slug='adam-tauman-kalai' AND status='archived' AND NOT headline_counted)
    OR (SELECT count(*) FROM profile_sources WHERE profile_id='f0de1026-0001-4000-8000-000000000001') <> 2 THEN
    RAISE EXCEPTION 'Rollback failed to restore original records and preserve archive';
  END IF;
END $$;
ROLLBACK;
`
const result = spawnSync('docker', ['exec', '-i', 'supabase_db_warning-collective', 'psql', '-X', '-v', 'ON_ERROR_STOP=1', '-U', 'postgres', '-d', 'postgres'], { input: sql, encoding: 'utf8' })
process.stdout.write(result.stdout || '')
process.stderr.write(result.stderr || '')
if (result.status !== 0) process.exit(result.status || 1)
console.log('PASS: apply, exact deltas, preserved records, duplicate rejection, archive rollback; outer transaction restored local baseline.')
