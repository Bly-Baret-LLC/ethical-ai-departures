// This runner can reach only the named LOCAL Docker database. All tests roll back.
import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')
const body = (sql) => sql.replace(/^BEGIN;\s*$/gm, '').replace(/^COMMIT;\s*$/gm, '')
const up = body(read('../migrations/20261028000001_add_irving_update_adler.sql'))
const down = body(read('../rollbacks/20261028000001_add_irving_update_adler.down.sql'))
const assertions = read('./irving_adler_records.sql')
const preserved = `
  IF EXISTS(SELECT 1 FROM before_profiles b LEFT JOIN profiles p USING(id)
    WHERE p.id IS NULL OR (p.slug <> 'steven-adler' AND to_jsonb(p)-'updated_at' <> b.row))
    OR EXISTS(SELECT 1 FROM before_sources b LEFT JOIN profile_sources s USING(id) WHERE s.id IS NULL OR to_jsonb(s)<>b.row)
    OR EXISTS(SELECT 1 FROM before_writings b LEFT JOIN publications w USING(id) WHERE w.id IS NULL OR to_jsonb(w)<>b.row)
    OR EXISTS(SELECT * FROM before_tags EXCEPT SELECT * FROM profile_concern_tags)
    OR EXISTS(SELECT 1 FROM before_predictions b LEFT JOIN predictions p USING(id) WHERE p.id IS NULL OR to_jsonb(p)<>b.row)
  THEN RAISE EXCEPTION 'Existing unrelated records changed'; END IF;
`
const sql = `
BEGIN;
CREATE TEMP TABLE before_profiles AS SELECT id,to_jsonb(p)-'updated_at' AS row FROM profiles p;
CREATE TEMP TABLE before_sources AS SELECT id,to_jsonb(s) AS row FROM profile_sources s;
CREATE TEMP TABLE before_writings AS SELECT id,to_jsonb(w) AS row FROM publications w;
CREATE TEMP TABLE before_predictions AS SELECT id,to_jsonb(p) AS row FROM predictions p;
CREATE TEMP TABLE before_tags AS SELECT * FROM profile_concern_tags;
CREATE TEMP TABLE before_counts AS SELECT
 count(*) FILTER(WHERE status='published') published,
 count(*) FILTER(WHERE status='published' AND headline_counted AND motive_evidence IN ('direct','reported')) headline,
 count(*) FILTER(WHERE status='published' AND motive_evidence='alleged') alleged,
 count(*) FILTER(WHERE status='published' AND headline_counted AND company='Google') google,
 count(*) FILTER(WHERE status='published' AND headline_counted AND company='OpenAI') openai FROM profiles;
SAVEPOINT pristine;
${up}
${assertions}
DO $$ BEGIN
 ${preserved}
 IF (SELECT count(*) FROM profiles WHERE status='published')<>(SELECT published+1 FROM before_counts)
 OR (SELECT count(*) FROM profiles WHERE status='published' AND headline_counted AND motive_evidence IN ('direct','reported'))<>(SELECT headline+1 FROM before_counts)
 OR (SELECT count(*) FROM profiles WHERE status='published' AND motive_evidence='alleged')<>(SELECT alleged FROM before_counts)
 OR (SELECT count(*) FROM profiles WHERE status='published' AND headline_counted AND company='Google')<>(SELECT google+1 FROM before_counts)
 OR (SELECT count(*) FROM profiles WHERE status='published' AND headline_counted AND company='OpenAI')<>(SELECT openai FROM before_counts)
 OR (SELECT count(*) FROM profile_sources)<>(SELECT count(*)+7 FROM before_sources)
 OR (SELECT count(*) FROM publications)<>(SELECT count(*)+2 FROM before_writings)
 THEN RAISE EXCEPTION 'Unexpected batch deltas'; END IF;
END $$;
DO $duplicate$ BEGIN
 BEGIN
  EXECUTE $repeat$${up}$repeat$;
  RAISE EXCEPTION 'Repeat unexpectedly succeeded';
 EXCEPTION WHEN raise_exception THEN
  IF SQLERRM <> 'Irving already exists; review all statuses before applying' THEN RAISE; END IF;
 END;
END $duplicate$;
SAVEPOINT before_drift;
UPDATE profiles SET stated_reason='Later editorial change' WHERE slug='steven-adler';
DO $drift$ BEGIN
 BEGIN
  EXECUTE $rollback$${down}$rollback$;
  RAISE EXCEPTION 'Rollback overwrote later change';
 EXCEPTION WHEN raise_exception THEN
  IF SQLERRM <> 'Adler changed; review rollback manually' THEN RAISE; END IF;
 END;
END $drift$;
ROLLBACK TO SAVEPOINT before_drift;
${down}
DO $$ BEGIN
 ${preserved}
 IF EXISTS(SELECT 1 FROM before_profiles b LEFT JOIN profiles p USING(id) WHERE p.id IS NULL OR to_jsonb(p)-'updated_at'<>b.row)
 OR NOT EXISTS(SELECT 1 FROM profiles WHERE slug='geoffrey-irving' AND status='archived' AND NOT headline_counted)
 OR (SELECT count(*) FROM profile_sources WHERE profile_id='f0de1028-0001-4000-8000-000000000001')<>5
 OR (SELECT count(*) FROM profiles WHERE status='published')<>(SELECT published FROM before_counts)
 THEN RAISE EXCEPTION 'Rollback did not restore baseline and preserve archive'; END IF;
END $$;
ROLLBACK TO SAVEPOINT pristine;
${up}
${assertions}
ROLLBACK;
`
const result = spawnSync('docker', ['exec','-i','supabase_db_warning-collective','psql','-X','-v','ON_ERROR_STOP=1','-U','postgres','-d','postgres'], {input:sql, encoding:'utf8'})
process.stdout.write(result.stdout || '')
process.stderr.write(result.stderr || '')
if (result.status !== 0) process.exit(result.status || 1)
console.log('PASS: apply, exact deltas, preservation, repeat rejection, rollback drift guard, archive rollback, baseline restore and reapply. No persistent writes.')
