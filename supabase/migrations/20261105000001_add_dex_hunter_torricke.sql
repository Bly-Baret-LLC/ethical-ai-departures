-- Approved for local preview. Production publication requires separate approval.
-- October 1 is a month-precision sorting anchor, not a sourced departure day.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';
LOCK TABLE public.profiles, public.profile_sources, public.profile_concern_tags,
  public.publications IN SHARE ROW EXCLUSIVE MODE;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.profiles
    WHERE slug = 'dex-hunter-torricke'
      OR regexp_replace(lower(name), '[^a-z0-9]', '', 'g') = 'dexhuntertorricke'
  ) THEN
    RAISE EXCEPTION 'Hunter-Torricke already exists; review all profile statuses';
  END IF;
  IF EXISTS (
    SELECT 1 FROM public.publications
    WHERE rtrim(url, '/') = 'https://dexhuntertorricke.substack.com/p/another-future-is-possible'
  ) THEN
    RAISE EXCEPTION 'Hunter-Torricke essay already exists; review authorship';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE company = 'Google' AND status = 'published')
    OR (SELECT count(*) FROM public.concern_tags WHERE slug IN ('inadequate-oversight', 'concentration-of-power')) <> 2 THEN
    RAISE EXCEPTION 'Required Google company grouping or concern tags missing';
  END IF;
END $$;

INSERT INTO public.profiles (
  id, slug, name, photo_url, company, role, departure_date, departure_date_precision,
  departure_date_note, seo_description, stated_reason, departure_context, status,
  departure_type, motive_evidence, headline_counted, claim_status, last_reviewed_at, reviewer
) VALUES (
  'f0de1105-0001-4000-8000-000000000001', 'dex-hunter-torricke', 'Dex Hunter-Torricke', NULL, 'Google',
  'Head of Global Communications & Marketing (Google DeepMind)', '2025-10-01', 'month',
  'Hunter-Torricke dates his exit from Big Tech to October 2025. TIME dates his decision to leave DeepMind to October 2024 and reports a year-long noncompete. His last working day is not established.',
  'Dex Hunter-Torricke left Google DeepMind, citing concerns that institutions were unprepared for the social and political effects of AI.',
  'Hunter-Torricke said he left Big Tech after concluding that institutions were unprepared for the effects of advanced AI, including widening inequality and concentrated power.',
  'He led global communications and marketing at Google DeepMind. In a February 2026 essay, he explained why he left and launched the Center for Tomorrow to work on how societies respond to AI. Google DeepMind told TIME that its communications had presented both the benefits and risks of AI.',
  'published', 'resigned', 'direct', true, 'uncontested', '2026-11-05',
  'Source review for approved local preview (2026-11-05)'
);

INSERT INTO public.profile_sources (id, profile_id, url, title, platform, source_type, published_date) VALUES
  ('f0de1105-0002-4000-8000-000000000001', 'f0de1105-0001-4000-8000-000000000001',
   'https://dexhuntertorricke.substack.com/p/another-future-is-possible', 'Another Future is Possible', 'Dex Hunter-Torricke', 'first_party', '2026-02-17'),
  ('f0de1105-0002-4000-8000-000000000002', 'f0de1105-0001-4000-8000-000000000001',
   'https://time.com/7378739/dex-hunter-torricke-tech-ai/', 'Dex Hunter-Torricke on leaving Big Tech', 'TIME', 'reporting', '2026-02-17'),
  ('f0de1105-0002-4000-8000-000000000003', 'f0de1105-0001-4000-8000-000000000001',
   'https://www.gov.uk/government/news/chancellor-enhances-treasury-board-by-introducing-cutting-edge-technology-expertise', 'HM Treasury appointment and former DeepMind role', 'HM Treasury', 'organization', '2025-10-17'),
  ('f0de1105-0002-4000-8000-000000000004', 'f0de1105-0001-4000-8000-000000000001',
   'https://www.linkedin.com/feed/update/urn:li:activity:7379523910922563584/', 'Dex Hunter-Torricke announces his departure from Big Tech', 'LinkedIn', 'first_party', NULL);

INSERT INTO public.profile_concern_tags (profile_id, concern_tag_id)
SELECT 'f0de1105-0001-4000-8000-000000000001'::uuid, id
FROM public.concern_tags WHERE slug IN ('inadequate-oversight', 'concentration-of-power');

INSERT INTO public.publications (
  id, profile_id, title, url, publication_type, publisher, published_date,
  published_date_precision, listed_in_publications, abstract
) VALUES (
  'f0de1105-0003-4000-8000-000000000001', 'f0de1105-0001-4000-8000-000000000001',
  'Another Future is Possible', 'https://dexhuntertorricke.substack.com/p/another-future-is-possible',
  'essay', 'Substack', '2026-02-17', 'day', true,
  'Hunter-Torricke explains why he left Big Tech and argues that, without public planning and oversight, advanced AI could deepen inequality and concentrate power.'
);
COMMIT;
