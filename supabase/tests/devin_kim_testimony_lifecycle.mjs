// Local-only transactional lifecycle test. No production URL or credentials accepted.
import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')
const body = (sql) => sql.replace(/^BEGIN;\s*$/gm, '').replace(/^COMMIT;\s*$/gm, '')
const up = body(read('../migrations/20261108000001_update_devin_kim_testimony.sql'))
const down = body(read('../rollbacks/20261108000001_update_devin_kim_testimony.down.sql'))
const assertions = read('./devin_kim_testimony.sql')
const tables = ['profiles', 'profile_sources', 'publications', 'profile_concern_tags', 'predictions', 'ticker_stats']
const snapshots = tables.map(t => `CREATE TEMP TABLE before_${t} AS SELECT to_jsonb(t)-'updated_at' AS row FROM public.${t} t;`).join('\n')
const unchanged = (table) => `
  IF EXISTS(SELECT row FROM before_${table} EXCEPT SELECT to_jsonb(t)-'updated_at' FROM public.${table} t)
    OR EXISTS(SELECT to_jsonb(t)-'updated_at' FROM public.${table} t EXCEPT SELECT row FROM before_${table})
  THEN RAISE EXCEPTION '${table} changed unexpectedly'; END IF;`
const preserved = `
  IF (SELECT count(*) FROM profiles) <> (SELECT count(*) FROM before_profiles)
    OR EXISTS(SELECT row FROM before_profiles WHERE row->>'slug' <> 'devin-kim'
      EXCEPT SELECT to_jsonb(p)-'updated_at' FROM profiles p WHERE slug <> 'devin-kim')
    OR EXISTS(SELECT row FROM before_profile_sources EXCEPT SELECT to_jsonb(s)-'updated_at' FROM profile_sources s)
    OR (SELECT count(*) FROM profile_sources) <> (SELECT count(*)+3 FROM before_profile_sources)
  THEN RAISE EXCEPTION 'Unrelated records or existing sources changed'; END IF;
  IF (SELECT to_jsonb(p)-ARRAY['updated_at','stated_reason','departure_context','departure_date','departure_date_note','seo_description','correction_note','last_reviewed_at','reviewer'] FROM profiles p WHERE slug='devin-kim')
    IS DISTINCT FROM (SELECT row-ARRAY['stated_reason','departure_context','departure_date','departure_date_note','seo_description','correction_note','last_reviewed_at','reviewer'] FROM before_profiles WHERE row->>'slug'='devin-kim')
  THEN RAISE EXCEPTION 'Kim identity, classification or unrelated fields changed'; END IF;
  ${tables.slice(2).map(unchanged).join('\n')}
  IF EXISTS(SELECT status, motive_evidence, headline_counted, company, count(*) FROM profiles
      GROUP BY status,motive_evidence,headline_counted,company
      EXCEPT SELECT row->>'status',row->>'motive_evidence',(row->>'headline_counted')::boolean,row->>'company',count(*)
      FROM before_profiles GROUP BY 1,2,3,4)
  THEN RAISE EXCEPTION 'Profile category/company counts changed'; END IF;`
const expectFailure = (sql, message, label) => `
DO $${label}$ BEGIN
  BEGIN
    EXECUTE $attempt$${sql}$attempt$;
    RAISE EXCEPTION 'Operation unexpectedly succeeded';
  EXCEPTION WHEN raise_exception THEN
    IF SQLERRM <> '${message}' THEN RAISE; END IF;
  END;
END $${label}$;`

const sql = `
BEGIN;
${snapshots}
SAVEPOINT pristine;
UPDATE profiles SET stated_reason='Unapproved later edit' WHERE slug='devin-kim';
${expectFailure(up, 'Kim baseline changed or update already applied; review before applying', 'forward_drift')}
ROLLBACK TO SAVEPOINT pristine;
${up}
${assertions}
DO $$ BEGIN ${preserved} END $$;
${expectFailure(up, 'Kim baseline changed or update already applied; review before applying', 'duplicate')}
SAVEPOINT applied;
UPDATE profiles SET departure_context='Later editorial update' WHERE slug='devin-kim';
${expectFailure(down, 'Kim changed after update; review rollback manually', 'profile_drift')}
ROLLBACK TO SAVEPOINT applied;
UPDATE profile_sources SET title='Later source edit' WHERE id='f0de1108-0002-4000-8000-000000000001';
${expectFailure(down, 'Kim added sources changed; review rollback manually', 'source_drift')}
ROLLBACK TO SAVEPOINT applied;
${down}
DO $$ BEGIN ${tables.map(unchanged).join('\n')} END $$;
${up}
${assertions}
DO $$ BEGIN ${preserved} END $$;
ROLLBACK;
`
const result = spawnSync('docker', ['exec','-i','supabase_db_warning-collective','psql','-X','-v','ON_ERROR_STOP=1','-U','postgres','-d','postgres'], {input:sql, encoding:'utf8'})
process.stdout.write(result.stdout || '')
process.stderr.write(result.stderr || '')
if (result.status !== 0) process.exit(result.status || 1)
console.log('PASS: apply, zero count deltas, preservation, repeat rejection, forward/rollback drift guards, exact rollback and reapply. No persistent writes.')
