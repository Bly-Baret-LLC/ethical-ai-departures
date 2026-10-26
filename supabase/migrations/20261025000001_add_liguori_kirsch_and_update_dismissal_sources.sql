-- Editorial review: first-party departure statements, BBC interviews (Oct 21),
-- and NPR's Korbak/Balesni interview (Oct 23). No inferred departure days.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';
LOCK TABLE public.profiles IN SHARE ROW EXCLUSIVE MODE;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.profiles WHERE
    slug IN ('sofia-liguori', 'andreas-kirsch') OR
    lower(name) IN ('sofia liguori', 'andreas kirsch')) THEN
    RAISE EXCEPTION 'Candidate already exists; stop for duplicate review';
  END IF;
  IF (SELECT count(*) FROM public.concern_tags WHERE slug IN
    ('military-applications', 'inadequate-oversight', 'lack-of-transparency')) <> 3 THEN
    RAISE EXCEPTION 'Required concern tags are missing';
  END IF;
  IF (SELECT count(*) FROM public.profiles WHERE slug IN ('tomek-korbak', 'mikita-balesni')
    AND status = 'published' AND motive_evidence = 'alleged'
    AND NOT headline_counted AND claim_status = 'contested'
    AND reviewer = 'OpenAI dismissal review (2026-10-08)'
    AND last_reviewed_at = '2026-10-08'
    AND departure_context LIKE '%OpenAI denies retaliation.') <> 2 THEN
    RAISE EXCEPTION 'Existing dismissal records changed; review before applying';
  END IF;
  IF EXISTS (SELECT 1 FROM public.profile_sources s JOIN public.profiles p ON p.id = s.profile_id
    WHERE p.slug IN ('tomek-korbak', 'mikita-balesni')
    AND s.url = 'https://news.wjct.org/tech/2026-10-23/fired-openai-researchers-say-independent-safety-audits-arent-going-well') THEN
    RAISE EXCEPTION 'NPR interview is already linked';
  END IF;
END $$;

INSERT INTO public.profiles (
  id, slug, name, photo_url, company, role, departure_date,
  departure_date_precision, departure_date_note, seo_description,
  stated_reason, departure_context, status, departure_type, motive_evidence,
  headline_counted, claim_status, last_reviewed_at, reviewer
)
SELECT v.id::uuid, v.slug, v.name, NULL, 'Google', v.role, v.departure_date::date,
  v.precision, v.date_note, v.seo_description, v.reason,
  v.context || ' Google told the BBC that its public-sector contracts undergo review against its acceptable-use policies and AI principles, and that employees have channels to raise concerns and protections against retaliation.',
  'published', 'resigned', 'direct', true, 'uncontested', '2026-10-25',
  'DeepMind departure review (2026-10-25)'
FROM (VALUES
  ('f0de1025-0001-4000-8000-000000000001', 'sofia-liguori', 'Sofia Liguori',
   'Research Engineer (Google DeepMind)', '2026-10-20', 'day',
   'Liguori published her resignation letter on October 20, 2026, identifying that day as her last at Google DeepMind.',
   'Sofia Liguori resigned from Google DeepMind over Google’s military and surveillance work. Read her statement and the company’s response.',
   'Liguori resigned from Google DeepMind over Google’s expanding military and surveillance work, saying she no longer trusted the company to uphold its stated ethical commitments.',
   'In her resignation letter, Liguori connected her decision to Google’s Pentagon agreement and the integration of AI into military and surveillance systems. She said she had been on leave since the Pentagon agreement and that her own project was not directly related to warfare.'),
  ('f0de1025-0001-4000-8000-000000000002', 'andreas-kirsch', 'Andreas Kirsch',
   'Senior Research Scientist (Google DeepMind)', '2026-09-01', 'month',
   'Kirsch announced his departure on October 1, 2026, saying he had left at the end of the previous week. The exact September departure date is not confirmed.',
   'Andreas Kirsch left Google DeepMind citing inadequate independent governance and oversight for developing superintelligence safely.',
   'Kirsch left Google DeepMind, saying Google lacked the binding, independent governance and oversight needed to develop superintelligence safely. He said he preferred not to contribute without those safeguards.',
   'Kirsch worked on Gemini and the International Mathematical Olympiad project. His departure statement called for enforceable safeguards rather than reliance on voluntary commitments. In an October 21 BBC interview, he also questioned Google’s oversight of military AI deployments.')
) AS v(id, slug, name, role, departure_date, precision, date_note, seo_description, reason, context);

INSERT INTO public.profile_sources (profile_id, url, title, platform, source_type, published_date)
SELECT p.id, s.url, s.title, s.platform, s.source_type, s.published_date::date
FROM (VALUES
  ('sofia-liguori', 'https://stay-human.sofialiguori.com/',
   'Stay Human.', 'Sofia Liguori', 'first_party', '2026-10-20'),
  ('andreas-kirsch', 'https://x.com/BlackHC/status/2105639635783479378',
   'Andreas Kirsch — departure statement and thread', 'X', 'first_party', '2026-10-01'),
  ('andreas-kirsch', 'https://x.com/BlackHC/status/2105639684286345400',
   'Andreas Kirsch — why he chose not to continue', 'X', 'first_party', '2026-10-01'),
  ('andreas-kirsch', 'https://utaw.tech/news/trust-is-not-governance',
   'Trust is not Governance', 'UTAW — Andreas Kirsch', 'first_party', '2026-06-30')
) AS s(slug, url, title, platform, source_type, published_date)
JOIN public.profiles p ON p.slug = s.slug;

INSERT INTO public.profile_sources (profile_id, url, title, platform, source_type, published_date)
SELECT id, 'https://www.bbc.com/news/articles/cmreyvepnv0po',
  'Google staff resign in backlash over its AI contracts with military',
  'BBC', 'reporting', '2026-10-21'
FROM public.profiles WHERE slug IN ('sofia-liguori', 'andreas-kirsch');

INSERT INTO public.profile_concern_tags (profile_id, concern_tag_id)
SELECT p.id, t.id FROM public.profiles p CROSS JOIN public.concern_tags t
WHERE p.slug IN ('sofia-liguori', 'andreas-kirsch')
  AND t.slug IN ('military-applications', 'inadequate-oversight', 'lack-of-transparency');

INSERT INTO public.publications (
  profile_id, title, url, publication_type, publisher, published_date,
  published_date_precision, abstract
)
SELECT p.id, w.title, w.url, w.type, w.publisher, w.date::date, 'day', w.abstract
FROM (VALUES
  ('sofia-liguori', 'Stay Human.', 'https://stay-human.sofialiguori.com/',
   'resignation_letter', 'Sofia Liguori', '2026-10-20',
   'Liguori explains her decision to leave Google DeepMind over military and surveillance applications of AI. She argues that ethical responsibility extends beyond an employee’s own project to how the company’s technology is used.'),
  ('andreas-kirsch', 'Trust is not Governance', 'https://utaw.tech/news/trust-is-not-governance',
   'essay', 'UTAW', '2026-06-30',
   'Kirsch argues that a strong safety culture and voluntary commitments cannot replace binding independent oversight. He examines Google’s military AI agreement and calls for enforceable safeguards, transparency, and protected employee voice.')
) AS w(slug, title, url, type, publisher, date, abstract)
JOIN public.profiles p ON p.slug = w.slug;

-- A new interview supports existing contested accounts; it does not establish
-- retaliation or change either profile's evidence category or departure date.
INSERT INTO public.profile_sources (id, profile_id, url, title, platform, source_type, published_date)
SELECT CASE slug
  WHEN 'tomek-korbak' THEN 'f0de1025-0002-4000-8000-000000000001'::uuid
  ELSE 'f0de1025-0002-4000-8000-000000000002'::uuid END,
  id, 'https://news.wjct.org/tech/2026-10-23/fired-openai-researchers-say-independent-safety-audits-arent-going-well',
  'Korbak and Balesni — interview on independent safety audits and their dismissals',
  'NPR / WJCT', 'first_party', '2026-10-23'
FROM public.profiles WHERE slug IN ('tomek-korbak', 'mikita-balesni');

UPDATE public.profiles
SET departure_context = departure_context || CASE slug
    WHEN 'tomek-korbak' THEN ' In an October 23 NPR interview, Korbak described repeated visits by METR as the investigation expanded. He said OpenAI was broadly acting in good faith, but that the investigation was restricted.'
    ELSE ' In an October 23 NPR interview, Balesni said investigators asked to see Signal conversations on the researchers’ personal phones a week before their dismissals, and that they complied.' END,
    last_reviewed_at = '2026-10-25', reviewer = 'NPR interview review (2026-10-25)'
WHERE slug IN ('tomek-korbak', 'mikita-balesni');

-- Keep the legacy stored counter aligned; the UI derives counts from profiles.
UPDATE public.ticker_stats SET
  total_count = (SELECT count(*) FROM public.profiles WHERE status = 'published'
    AND headline_counted AND motive_evidence IN ('direct', 'reported')),
  ninety_day_count = (SELECT count(*) FROM public.profiles WHERE status = 'published'
    AND headline_counted AND motive_evidence IN ('direct', 'reported')
    AND departure_date >= current_date - interval '90 days' AND departure_date <= current_date),
  updated_at = now();
COMMIT;
