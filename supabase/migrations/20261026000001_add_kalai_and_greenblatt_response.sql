-- Approved for local editorial preview on October 26; production requires a
-- separate publication approval. Sources reopened October 26, 2026.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';
LOCK TABLE public.profiles IN SHARE ROW EXCLUSIVE MODE;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.profiles WHERE slug = 'adam-tauman-kalai'
    OR lower(name) IN ('adam kalai', 'adam tauman kalai')) THEN
    RAISE EXCEPTION 'Kalai already exists; review all statuses before applying';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.concern_tags WHERE slug = 'alignment-research-gaps') THEN
    RAISE EXCEPTION 'Required alignment concern tag is missing';
  END IF;
  IF (SELECT count(*) FROM public.profiles WHERE slug IN ('mikita-balesni', 'tomek-korbak')
    AND status = 'published' AND company = 'OpenAI' AND departure_type = 'fired'
    AND motive_evidence = 'alleged' AND NOT headline_counted AND claim_status = 'contested'
    AND reviewer = 'NPR interview review (2026-10-25)' AND last_reviewed_at = '2026-10-25'
    AND departure_context LIKE '%OpenAI denies retaliation. In an October 23 NPR interview,%'
    AND departure_context NOT LIKE '%Greenblatt%') <> 2 THEN
    RAISE EXCEPTION 'Dismissal baseline changed; review before applying';
  END IF;
  IF EXISTS (SELECT 1 FROM public.profile_sources s JOIN public.profiles p ON p.id = s.profile_id
    WHERE p.slug IN ('mikita-balesni', 'tomek-korbak') AND s.url IN
      ('https://x.com/RyanGreenblatt/status/2113649836100931761',
       'https://sfstandard.com/2026/10/24/openai-firings-safety-signal-chats/')) THEN
    RAISE EXCEPTION 'Response sources already linked; review duplicates';
  END IF;
  IF EXISTS (SELECT 1 FROM public.publications WHERE url =
    'https://www.lesswrong.com/posts/BZHEczCfkD7ntC76t/launching-resi-the-institute-for-responsible') THEN
    RAISE EXCEPTION 'RESI essay already exists; review author linkage';
  END IF;
END $$;

INSERT INTO public.profiles (
  id, slug, name, photo_url, company, role, departure_date,
  departure_date_precision, departure_date_note, seo_description,
  stated_reason, departure_context, status, departure_type, motive_evidence,
  headline_counted, claim_status, last_reviewed_at, reviewer
) VALUES (
  'f0de1026-0001-4000-8000-000000000001', 'adam-tauman-kalai', 'Adam Tauman Kalai',
  NULL, 'OpenAI', 'Research Scientist, AI safety and ethics', '2026-01-01', 'year',
  'In a September 16, 2026 essay, Kalai said he had recently left OpenAI. The exact departure date is not publicly confirmed.',
  'Adam Tauman Kalai left OpenAI to pursue stronger scientific foundations for AI safety. Read his statement and relevant writing.',
  'Kalai left OpenAI to cofound the Institute for Responsible Superintelligence (RESI), linking his decision to the need for stronger scientific foundations for AI safety.',
  'In his September 16 essay announcing RESI, Kalai argued that relying on trial and error becomes more dangerous as AI systems grow more capable. He called for safety guarantees grounded in how systems are designed.',
  'published', 'resigned', 'direct', true, 'uncontested', '2026-10-26',
  'Source review for approved local preview (2026-10-26)'
);

INSERT INTO public.profile_sources (id, profile_id, url, title, platform, source_type, published_date)
VALUES
  ('f0de1026-0002-4000-8000-000000000001', 'f0de1026-0001-4000-8000-000000000001',
   'https://www.lesswrong.com/posts/BZHEczCfkD7ntC76t/launching-resi-the-institute-for-responsible',
   'Launching RESI, the Institute for Responsible Superintelligence', 'LessWrong — Adam Tauman Kalai', 'first_party', '2026-09-16'),
  ('f0de1026-0002-4000-8000-000000000002', 'f0de1026-0001-4000-8000-000000000001',
   'https://kal.ai/', 'Adam Tauman Kalai — professional biography', 'Adam Tauman Kalai', 'first_party', NULL);

INSERT INTO public.profile_concern_tags (profile_id, concern_tag_id)
SELECT 'f0de1026-0001-4000-8000-000000000001'::uuid, id
FROM public.concern_tags WHERE slug = 'alignment-research-gaps';

INSERT INTO public.publications (id, profile_id, title, url, publication_type,
  publisher, published_date, published_date_precision, abstract)
VALUES ('f0de1026-0003-4000-8000-000000000001', 'f0de1026-0001-4000-8000-000000000001',
  'Launching RESI, the Institute for Responsible Superintelligence',
  'https://www.lesswrong.com/posts/BZHEczCfkD7ntC76t/launching-resi-the-institute-for-responsible',
  'essay', 'LessWrong', '2026-09-16', 'day',
  'Kalai explains his departure from OpenAI and the founding of RESI. He argues for scientific foundations and design-based safety guarantees rather than relying on trial and error as AI systems become more capable.');

-- Add evidence, not another departure or an authored publication.
INSERT INTO public.profile_sources (id, profile_id, url, title, platform, source_type, published_date)
SELECT s.id::uuid, p.id, s.url, s.title, s.platform, s.source_type, s.date::date
FROM (VALUES
  ('f0de1026-0002-4000-8000-000000000003', 'mikita-balesni',
   'https://x.com/RyanGreenblatt/status/2113649836100931761',
   'Ryan Greenblatt — response to reported leak allegations', 'X', 'first_party', '2026-10-23'),
  ('f0de1026-0002-4000-8000-000000000004', 'tomek-korbak',
   'https://x.com/RyanGreenblatt/status/2113649836100931761',
   'Ryan Greenblatt — response to reported leak allegations', 'X', 'first_party', '2026-10-23'),
  ('f0de1026-0002-4000-8000-000000000005', 'mikita-balesni',
   'https://sfstandard.com/2026/10/24/openai-firings-safety-signal-chats/',
   'OpenAI dismissals — Signal chats, leak allegations, and responses', 'The San Francisco Standard', 'reporting', '2026-10-24'),
  ('f0de1026-0002-4000-8000-000000000006', 'tomek-korbak',
   'https://sfstandard.com/2026/10/24/openai-firings-safety-signal-chats/',
   'OpenAI dismissals — Signal chats, leak allegations, and responses', 'The San Francisco Standard', 'reporting', '2026-10-24')
) AS s(id, slug, url, title, platform, source_type, date)
JOIN public.profiles p ON p.slug = s.slug;

UPDATE public.profiles
SET departure_context = departure_context || ' In an October 23 response, external researcher Ryan Greenblatt denied facilitating architecture leaks or receiving proprietary information from the three dismissed researchers. The San Francisco Standard reported that OpenAI said unapproved Signal use was not the only reason for the dismissals.',
  last_reviewed_at = '2026-10-26', reviewer = 'Greenblatt response review (2026-10-26)'
WHERE slug IN ('mikita-balesni', 'tomek-korbak');

-- Legacy counter only; current UI derives its totals from canonical profiles.
-- Partial dates use the earliest possible date, matching isDepartureInWindow.
UPDATE public.ticker_stats SET
  total_count = (SELECT count(*) FROM public.profiles WHERE status = 'published'
    AND headline_counted AND motive_evidence IN ('direct', 'reported')),
  ninety_day_count = (SELECT count(*) FROM public.profiles WHERE status = 'published'
    AND headline_counted AND motive_evidence IN ('direct', 'reported')
    AND (CASE departure_date_precision WHEN 'year' THEN date_trunc('year', departure_date)::date
      WHEN 'month' THEN date_trunc('month', departure_date)::date ELSE departure_date END)
      BETWEEN current_date - 90 AND current_date),
  updated_at = now();
COMMIT;
