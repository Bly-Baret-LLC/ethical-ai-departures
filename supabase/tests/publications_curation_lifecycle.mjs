// Local container only. Entire lifecycle runs inside an outer rollback.
import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')
const body = (sql) => sql.replace(/^BEGIN;\s*$/gm, '').replace(/^COMMIT;\s*$/gm, '')
const up = body(read('../migrations/20261026000002_curate_publications.sql'))
const down = body(read('../rollbacks/20261026000002_curate_publications.down.sql'))
const assertions = read('./publications_curation_records.sql')
const sql = `BEGIN;
DO $initial$ BEGIN
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='publications' AND column_name='listed_in_publications') THEN
    EXECUTE $undo$${down}$undo$;
    DROP TABLE publication_edits;
  END IF;
END $initial$;
CREATE TEMP TABLE before_writings AS SELECT id,to_jsonb(w)-'updated_at' AS row FROM publications w;
CREATE TEMP TABLE before_profiles AS SELECT id,to_jsonb(p) AS row FROM profiles p;
CREATE TEMP TABLE before_sources AS SELECT id,to_jsonb(s) AS row FROM profile_sources s;
CREATE TEMP TABLE before_predictions AS SELECT id,to_jsonb(p) AS row FROM predictions p;
CREATE TEMP TABLE before_links AS SELECT to_jsonb(l) AS row FROM publication_predictions l;
${up}
${assertions}
DO $$ BEGIN
  IF (SELECT count(*) FROM publications) <> (SELECT count(*)+3 FROM before_writings) THEN RAISE EXCEPTION 'Unexpected writings delta'; END IF;
  IF EXISTS(SELECT 1 FROM before_writings b LEFT JOIN publications w USING(id) WHERE w.id IS NULL OR to_jsonb(w)-'abstract'-'updated_at'-'listed_in_publications' <> b.row-'abstract') THEN RAISE EXCEPTION 'Existing writing metadata/relationships modified'; END IF;
  IF EXISTS(SELECT row FROM before_profiles EXCEPT SELECT to_jsonb(p) FROM profiles p)
    OR EXISTS(SELECT to_jsonb(p) FROM profiles p EXCEPT SELECT row FROM before_profiles)
    OR EXISTS(SELECT row FROM before_sources EXCEPT SELECT to_jsonb(s) FROM profile_sources s)
    OR EXISTS(SELECT to_jsonb(s) FROM profile_sources s EXCEPT SELECT row FROM before_sources)
    OR EXISTS(SELECT row FROM before_predictions EXCEPT SELECT to_jsonb(p) FROM predictions p)
    OR EXISTS(SELECT to_jsonb(p) FROM predictions p EXCEPT SELECT row FROM before_predictions)
    OR EXISTS(SELECT row FROM before_links EXCEPT SELECT to_jsonb(l) FROM publication_predictions l)
    OR EXISTS(SELECT to_jsonb(l) FROM publication_predictions l EXCEPT SELECT row FROM before_links)
  THEN RAISE EXCEPTION 'Unrelated editorial records changed'; END IF;
END $$;
DO $duplicate$ BEGIN
  BEGIN
    EXECUTE $repeat$${up}$repeat$;
    RAISE EXCEPTION 'Reapply unexpectedly succeeded';
  EXCEPTION WHEN duplicate_column THEN NULL;
  END;
END $duplicate$;
DROP TABLE publication_edits;
${down}
DO $$ BEGIN
  IF EXISTS(SELECT row FROM before_writings EXCEPT SELECT to_jsonb(w)-'updated_at' FROM publications w)
    OR EXISTS(SELECT to_jsonb(w)-'updated_at' FROM publications w EXCEPT SELECT row FROM before_writings)
  THEN RAISE EXCEPTION 'Rollback failed to restore original records'; END IF;
END $$;
DROP TABLE publication_edits;
${up}
${assertions}
ROLLBACK;`
const result = spawnSync('docker', ['exec', '-i', 'supabase_db_warning-collective', 'psql', '-X', '-v', 'ON_ERROR_STOP=1', '-U', 'postgres', '-d', 'postgres'], { input: sql, encoding: 'utf8' })
process.stdout.write(result.stdout || '')
process.stderr.write(result.stderr || '')
if (result.status !== 0) process.exit(result.status || 1)
console.log('PASS: apply, assertions, exact deltas, preserved records, duplicate rejection, rollback, reapply; local baseline restored.')
