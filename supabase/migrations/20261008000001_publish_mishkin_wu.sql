-- Owner-approved profile copy from the October 8 review.
-- Primary source: https://nymag.com/intelligencer/article/ai-researchers-quit-openai-anthropic.html
-- January 1 values below are sorting anchors, NOT asserted departure days.
-- Public rendering, exports, and recent counts must respect year precision.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';
LOCK TABLE public.profiles IN SHARE ROW EXCLUSIVE MODE;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.profiles WHERE slug IN ('pamela-mishkin','jeff-wu')
    OR lower(name) IN ('pamela mishkin','jeff wu')) THEN
    RAISE EXCEPTION 'Candidate or alias already exists; stop for duplicate review';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE slug = 'jeffrey-wu'
    AND status = 'published' AND motive_evidence = 'reported' AND headline_counted
    AND departure_date = '2024-05-20' AND departure_date_precision = 'day'
    AND departure_date_note IS NULL AND effective_departure_date IS NULL
    AND last_reviewed_at = '2026-09-10'
    AND reviewer = 'editorial context audit (2026-09-10)'
    AND stated_reason = 'The Information reported that Wu was among researchers who departed because of safety concerns and a lack of trust in OpenAI leadership, citing a source who had spoken with him.'
    AND departure_context = 'The Information explicitly named Jeffrey Wu in its reporting on researchers who left amid safety concerns and diminished trust in leadership. This is a reported connection, not a public statement from Wu.'
    AND correction_note = 'Promoted from Context only to Reported connection on 2026-09-10 based on person-specific reporting by The Information.') THEN
    RAISE EXCEPTION 'Jeffrey Wu differs from reviewed baseline; stop rather than overwrite';
  END IF;
  IF (SELECT count(*) FROM public.concern_tags WHERE slug IN
    ('workforce-displacement','safety-deprioritization')) <> 2 THEN
    RAISE EXCEPTION 'Required concern tags are missing';
  END IF;
  IF (SELECT array_agg(t.slug ORDER BY t.slug) FROM public.profile_concern_tags pt
    JOIN public.concern_tags t ON t.id = pt.concern_tag_id
    JOIN public.profiles p ON p.id = pt.profile_id WHERE p.slug = 'jeffrey-wu')
    IS DISTINCT FROM ARRAY['alignment-research-gaps','team-dissolution']::text[] THEN
    RAISE EXCEPTION 'Wu concern tags changed since review';
  END IF;
END $$;

INSERT INTO public.profiles (
  id, slug, name, company, role, departure_date, departure_date_precision,
  departure_date_note, stated_reason, status, departure_type,
  motive_evidence, headline_counted, claim_status, last_reviewed_at, reviewer
) VALUES (
  'f0de1008-0000-4000-8000-000000000001', 'pamela-mishkin', 'Pamela Mishkin',
  'OpenAI', 'Economics research team lead', '2026-01-01', 'year',
  'The departure year is confirmed; the month and day are not.',
  'Mishkin left OpenAI believing her work on AI’s effects on people and jobs would be more useful outside the company. She does not argue that everyone should leave.',
  'published', 'resigned', 'direct', true, 'uncontested', '2026-10-08',
  'editorial review (2026-10-08)'
);

UPDATE public.profiles SET
  stated_reason = 'Wu says OpenAI’s focus on more powerful models made his work harder to pursue.',
  departure_context = 'He later left Anthropic to work on slowing AI development and strengthening oversight. He distinguishes his OpenAI departure from its team dissolution.',
  motive_evidence = 'direct',
  departure_date = '2024-01-01',
  departure_date_precision = 'year',
  departure_date_note = 'Only the departure year is shown because the sources do not agree on a more precise date.',
  correction_note = correction_note || ' October 8, 2026: added a first-person account, changed the evidence classification to Direct, and revised the concern tags. Reduced the departure date to year precision; the previous exact date is not treated as verified.',
  last_reviewed_at = '2026-10-08',
  reviewer = 'editorial review (2026-10-08)'
WHERE slug = 'jeffrey-wu';

INSERT INTO public.profile_sources (id, profile_id, url, title, platform, source_type, published_date)
SELECT v.source_id::uuid, p.id,
  'https://nymag.com/intelligencer/article/ai-researchers-quit-openai-anthropic.html',
  'What Would You Do If Your Employer Could Destroy the World?',
  'New York / Asterisk', 'first_party', '2026-10-05'
FROM (VALUES
  ('pamela-mishkin','f0de1008-0000-4000-8000-000000000002'),
  ('jeffrey-wu','f0de1008-0000-4000-8000-000000000003')
) AS v(slug, source_id) JOIN public.profiles p ON p.slug = v.slug;

DELETE FROM public.profile_concern_tags pt USING public.profiles p, public.concern_tags t
WHERE pt.profile_id = p.id AND pt.concern_tag_id = t.id AND p.slug = 'jeffrey-wu'
  AND t.slug IN ('team-dissolution','alignment-research-gaps');

INSERT INTO public.profile_concern_tags (profile_id, concern_tag_id)
SELECT p.id, t.id FROM (VALUES
  ('pamela-mishkin','workforce-displacement'),
  ('jeffrey-wu','safety-deprioritization')
) AS v(person, concern) JOIN public.profiles p ON p.slug = v.person
JOIN public.concern_tags t ON t.slug = v.concern;

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
