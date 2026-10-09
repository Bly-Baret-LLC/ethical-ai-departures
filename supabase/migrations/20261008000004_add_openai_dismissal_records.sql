-- Three contested dismissals, reviewed against the signed letter and each
-- author's October 8 public statement (original X posts verified directly).
-- These are excluded from headline and recent-departure counts.
-- January 1 is a year-only sorting anchor, not an asserted dismissal date.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';
LOCK TABLE public.profiles IN SHARE ROW EXCLUSIVE MODE;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.profiles WHERE
    slug IN ('tomek-korbak', 'jasmine-wang', 'mikita-balesni') OR
    lower(name) IN ('tomek korbak', 'tomasz korbak', 'jasmine wang', 'mikita balesni')) THEN
    RAISE EXCEPTION 'Dismissal candidate already exists; stop for duplicate review';
  END IF;
  IF (SELECT count(*) FROM public.concern_tags WHERE slug IN
    ('inadequate-oversight', 'lack-of-transparency')) <> 2 THEN
    RAISE EXCEPTION 'Required concern tags are missing';
  END IF;
END $$;

INSERT INTO public.profiles (
  id, slug, name, photo_url, company, role, departure_date,
  departure_date_precision, departure_date_note, seo_description,
  stated_reason, departure_context, status, departure_type, motive_evidence,
  headline_counted, claim_status, last_reviewed_at, reviewer
)
SELECT v.id::uuid, v.slug, v.name, NULL, 'OpenAI', v.role, '2026-01-01',
  'year',
  'The dismissals were publicly reported on October 1, 2026. The exact departure dates are not confirmed.',
  v.seo_description, v.stated_reason,
  v.departure_context || ' OpenAI says the three mishandled sensitive information in breach of company procedures. OpenAI denies retaliation.',
  'published', 'fired', 'alleged', false, 'contested', '2026-10-08',
  'OpenAI dismissal review (2026-10-08)'
FROM (VALUES
  (
    'f0de1008-0003-4000-8000-000000000001', 'tomek-korbak', 'Tomek Korbak',
    'Safety researcher, chain-of-thought monitorability',
    'Tomek Korbak disputes his dismissal from OpenAI. Read his account, the company response, and relevant safety research.',
    'Korbak was fired from OpenAI. He believes his warnings about losing the ability to monitor AI reasoning led to his dismissal. He says the company cited his communication with independent evaluator METR, which was part of his job.',
    'Korbak was OpenAI’s technical contact for METR’s Hugging Face investigation. In a joint letter with Jasmine Wang and Mikita Balesni, he defended that collaboration and warned that the dismissals could discourage independent safety work.'
  ),
  (
    'f0de1008-0003-4000-8000-000000000002', 'jasmine-wang', 'Jasmine Wang',
    'Safety cases program co-lead',
    'Jasmine Wang disputes her dismissal from OpenAI. Read her account, the company response, and relevant safety research.',
    'Wang was fired from OpenAI. She challenged the reason given for her dismissal and warned that staff could be pushed out for raising concerns or working with outside safety groups.',
    'The letter says Wang’s access to an executive’s inbox was authorized for recruiting and remained active after she requested its removal. It says she promptly reported opening a sensitive email by mistake.'
  ),
  (
    'f0de1008-0003-4000-8000-000000000003', 'mikita-balesni', 'Mikita Balesni',
    'Alignment researcher',
    'Mikita Balesni disputes his dismissal from OpenAI. Read his account, the company response, and relevant safety research.',
    'Balesni was fired from OpenAI. He says he and two safety colleagues were dismissed for putting AI safety ahead of the company’s short-term interests.',
    'Balesni worked on alignment evaluations and monitoring AI reasoning. The joint letter says he coordinated external safety work with senior leadership, checked with his managers, and removed sensitive details before sharing materials.'
  )
) AS v(id, slug, name, role, seo_description, stated_reason, departure_context);

INSERT INTO public.profile_sources (
  profile_id, url, title, platform, source_type, published_date
)
SELECT p.id, s.url, s.title, s.platform, s.source_type, s.published_date::date
FROM public.profiles p
CROSS JOIN (VALUES
  ('https://mikitabalesni.com/letter/letter.pdf',
   'OpenAI cannot make AI safe on its own',
   'Joint letter — Korbak, Wang, and Balesni', 'first_party', '2026-10-08'),
  ('https://economictimes.indiatimes.com/openai-fires-3-researchers-amid-ai-safety-debate/articleshow/134629969.cms',
   'OpenAI’s explanation for the dismissals',
   'AFP / The Economic Times', 'reporting', '2026-10-02'),
  ('https://techcrunch.com/2026/10/08/fired-openai-safety-researchers-dispute-misconduct-claims-warn-of-chilling-effect/',
   'OpenAI’s response to the letter',
   'TechCrunch', 'reporting', '2026-10-08')
) AS s(url, title, platform, source_type, published_date)
WHERE p.id IN ('f0de1008-0003-4000-8000-000000000001',
  'f0de1008-0003-4000-8000-000000000002', 'f0de1008-0003-4000-8000-000000000003');

INSERT INTO public.profile_sources (
  profile_id, url, title, platform, source_type, published_date
)
SELECT p.id, s.url, p.name || ' — account of dismissal', 'X', 'first_party', '2026-10-08'
FROM (VALUES
  ('tomek-korbak', 'https://x.com/tomekkorbak/status/2108266859397283953'),
  ('jasmine-wang', 'https://x.com/j_asminewang/status/2108263312291180680'),
  ('mikita-balesni', 'https://x.com/balesni/status/2108262814003687745')
) AS s(slug, url) JOIN public.profiles p ON p.slug = s.slug;

INSERT INTO public.profile_concern_tags (profile_id, concern_tag_id)
SELECT p.id, t.id FROM public.profiles p CROSS JOIN public.concern_tags t
WHERE p.id IN ('f0de1008-0003-4000-8000-000000000001',
  'f0de1008-0003-4000-8000-000000000002', 'f0de1008-0003-4000-8000-000000000003')
  AND t.slug IN ('inadequate-oversight', 'lack-of-transparency');

INSERT INTO public.publications (
  profile_id, title, url, publication_type, publisher, published_date,
  published_date_precision, last_updated_at, abstract
)
SELECT p.id, w.title, w.url, w.publication_type, w.publisher,
  w.published_date::date, 'day', w.last_updated_at::date, w.abstract
FROM public.profiles p
CROSS JOIN (VALUES
  ('OpenAI cannot make AI safe on its own',
   'https://mikitabalesni.com/letter/letter.pdf', 'essay',
   'Tomek Korbak, Jasmine Wang, and Mikita Balesni', '2026-10-08', NULL,
   'A joint open letter disputing the authors’ dismissals and calling for independent oversight, open safety discussion, and continued access to AI reasoning for monitoring.'),
  ('Chain of Thought Monitorability: A New and Fragile Opportunity for AI Safety',
   'https://arxiv.org/abs/2507.11473', 'paper', 'arXiv', '2025-07-15', '2025-12-07',
   'A cross-industry paper co-authored by Korbak, Wang, and Balesni on monitoring AI reasoning for signs of harmful behavior. It argues that this imperfect safety tool warrants further research and could be weakened by changes in how models are developed.')
) AS w(title, url, publication_type, publisher, published_date, last_updated_at, abstract)
WHERE p.id IN ('f0de1008-0003-4000-8000-000000000001',
  'f0de1008-0003-4000-8000-000000000002', 'f0de1008-0003-4000-8000-000000000003');

-- No forecast is inferred from a disputed dismissal; the shared safety warning
-- remains available in the letter on each profile, not three scored predictions.
-- ticker_stats needs no update: these records do not enter either stored count.
COMMIT;
