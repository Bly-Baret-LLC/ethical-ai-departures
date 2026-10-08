-- Restore only this release's editorial changes. Stop if the records were edited later.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';
LOCK TABLE public.profiles IN SHARE ROW EXCLUSIVE MODE;
DO $$
BEGIN
  IF (SELECT count(*) FROM public.profiles WHERE slug IN ('pamela-mishkin','jeffrey-wu')
    AND reviewer = 'editorial review (2026-10-08)' AND last_reviewed_at = '2026-10-08'
    AND motive_evidence = 'direct' AND departure_date_precision = 'year') <> 2 THEN
    RAISE EXCEPTION 'Release records differ; manual rollback review required';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE slug = 'pamela-mishkin'
    AND id = 'f0de1008-0000-4000-8000-000000000001'
    AND departure_date = '2026-01-01' AND status = 'published'
    AND stated_reason = 'Mishkin left OpenAI believing her work on AI’s effects on people and jobs would be more useful outside the company. She does not argue that everyone should leave.'
    AND departure_context IS NULL) THEN
    RAISE EXCEPTION 'Pamela identity or content changed';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE slug = 'jeffrey-wu'
    AND departure_date = '2024-01-01' AND status = 'published'
    AND stated_reason = 'Wu says OpenAI’s focus on more powerful models made his work harder to pursue.'
    AND departure_context = 'He later left Anthropic to work on slowing AI development and strengthening oversight. He distinguishes his OpenAI departure from its team dissolution.') THEN
    RAISE EXCEPTION 'Wu content changed';
  END IF;
  IF (SELECT count(*) FROM public.profile_sources WHERE profile_id =
    'f0de1008-0000-4000-8000-000000000001') <> 1 OR
    NOT EXISTS (SELECT 1 FROM public.profile_sources WHERE id =
    'f0de1008-0000-4000-8000-000000000002' AND profile_id =
    'f0de1008-0000-4000-8000-000000000001') THEN
    RAISE EXCEPTION 'Pamela sources changed';
  END IF;
  IF (SELECT array_agg(t.slug ORDER BY t.slug) FROM public.profile_concern_tags pt
    JOIN public.concern_tags t ON t.id = pt.concern_tag_id
    JOIN public.profiles p ON p.id = pt.profile_id WHERE p.slug = 'jeffrey-wu')
    IS DISTINCT FROM ARRAY['safety-deprioritization']::text[] OR
    (SELECT array_agg(t.slug ORDER BY t.slug) FROM public.profile_concern_tags pt
    JOIN public.concern_tags t ON t.id = pt.concern_tag_id
    JOIN public.profiles p ON p.id = pt.profile_id WHERE p.slug = 'pamela-mishkin')
    IS DISTINCT FROM ARRAY['workforce-displacement']::text[] THEN
    RAISE EXCEPTION 'Release concern tags changed';
  END IF;
END $$;

DELETE FROM public.profile_sources WHERE id IN
  ('f0de1008-0000-4000-8000-000000000002','f0de1008-0000-4000-8000-000000000003');
DELETE FROM public.profile_concern_tags WHERE profile_id = 'f0de1008-0000-4000-8000-000000000001';
DELETE FROM public.profiles WHERE id = 'f0de1008-0000-4000-8000-000000000001' AND slug = 'pamela-mishkin';

UPDATE public.profiles SET
  stated_reason = 'The Information reported that Wu was among researchers who departed because of safety concerns and a lack of trust in OpenAI leadership, citing a source who had spoken with him.',
  departure_context = 'The Information explicitly named Jeffrey Wu in its reporting on researchers who left amid safety concerns and diminished trust in leadership. This is a reported connection, not a public statement from Wu.',
  motive_evidence = 'reported', departure_date = '2024-05-20', departure_date_precision = 'day',
  departure_date_note = NULL,
  correction_note = 'Promoted from Context only to Reported connection on 2026-09-10 based on person-specific reporting by The Information.',
  last_reviewed_at = '2026-09-10', reviewer = 'editorial context audit (2026-09-10)'
WHERE slug = 'jeffrey-wu';
DELETE FROM public.profile_concern_tags pt USING public.profiles p, public.concern_tags t
WHERE pt.profile_id = p.id AND pt.concern_tag_id = t.id AND p.slug = 'jeffrey-wu'
  AND t.slug = 'safety-deprioritization';
INSERT INTO public.profile_concern_tags (profile_id, concern_tag_id)
SELECT p.id, t.id FROM public.profiles p CROSS JOIN public.concern_tags t
WHERE p.slug = 'jeffrey-wu' AND t.slug IN ('alignment-research-gaps','team-dissolution')
ON CONFLICT DO NOTHING;
UPDATE public.ticker_stats SET
  total_count = (SELECT count(*) FROM public.profiles WHERE status = 'published'
    AND headline_counted AND motive_evidence IN ('direct','reported')),
  ninety_day_count = (SELECT count(*) FROM public.profiles WHERE status = 'published'
    AND headline_counted AND motive_evidence IN ('direct','reported')
    AND (CASE departure_date_precision WHEN 'year' THEN date_trunc('year', departure_date)::date
      WHEN 'month' THEN date_trunc('month', departure_date)::date ELSE departure_date END)
      BETWEEN current_date - 90 AND current_date),
  updated_at = now();
COMMIT;
