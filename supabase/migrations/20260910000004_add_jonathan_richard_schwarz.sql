-- Add Jonathan Richard Schwarz after a first-party statement explicitly tied
-- his 2023 Google DeepMind departure to concerns about concentrated lab power.

BEGIN;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM profiles WHERE slug = 'jonathan-richard-schwarz') THEN
    RAISE EXCEPTION 'Profile jonathan-richard-schwarz already exists';
  END IF;
END $$;

INSERT INTO concern_tags (id, name, slug, description)
VALUES (
  'a0000000-0000-4000-8000-000000000013',
  'Concentration of Power',
  'concentration-of-power',
  'Decision-making authority or control over advanced AI is concentrated in too few companies or leaders.'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

INSERT INTO profiles (
  slug, name, photo_url, company, role, departure_date,
  departure_date_precision, effective_departure_date, departure_date_note,
  seo_description, stated_reason, departure_context, status, departure_type,
  motive_evidence, headline_counted, motive_quote, claim_status,
  last_reviewed_at, reviewer
)
VALUES (
  'jonathan-richard-schwarz',
  'Jonathan Richard Schwarz',
  NULL,
  'Google',
  'Senior Research Scientist, Google DeepMind',
  '2023-01-01',
  'year',
  NULL,
  'Schwarz says he left Google DeepMind in 2023; the exact departure date is not publicly documented. He first publicly connected the departure to concerns about concentrated lab power on September 9, 2026.',
  'Jonathan Richard Schwarz says he left Google DeepMind after seven years because of severe concerns about the concentration of power at frontier AI labs.',
  'Senior research scientist who left Google DeepMind in 2023 after seven years at the laboratory. In a September 2026 statement, Schwarz explicitly said concerns about the concentration of power represented by the major frontier AI labs caused him to leave DeepMind and later reject offers from the other two. His personal website confirms his former role and tenure, while his August 2024 departure announcement establishes that he left in 2023. Schwarz later pursued research and company-building outside the three leading frontier laboratories, including work on sovereign AI intended to broaden institutional control over advanced models.',
  'Schwarz publicly connected his departure to concern about concentrated power in frontier AI labs. The statement was retrospective, made roughly three years after the departure.',
  'published',
  'resigned',
  'direct',
  true,
  'I left DeepMind after 7 years … due to severe concerns about the concentration of power these labs represent.',
  'uncontested',
  '2026-09-10',
  'editorial review (2026-09-10)'
);

INSERT INTO profile_sources (
  profile_id, url, title, platform, source_type, published_date
)
SELECT p.id, v.url, v.title, v.platform, v.source_type, v.published_date::date
FROM profiles p
JOIN (VALUES
  (
    'jonathan-richard-schwarz',
    'https://x.com/schwarzjn_/status/2097569894401262019',
    'Statement on leaving DeepMind and the concentration of power at frontier AI labs',
    'X',
    'first_party',
    '2026-09-09'
  ),
  (
    'jonathan-richard-schwarz',
    'https://jonathan-schwarz.github.io/',
    'Jonathan Richard Schwarz — academic website',
    'Jonathan Richard Schwarz',
    'first_party',
    NULL
  ),
  (
    'jonathan-richard-schwarz',
    'https://www.linkedin.com/posts/schwarzjonathan_exciting-news-following-my-departure-from-activity-7231943169611870208-VV3l',
    'Announcement following his 2023 departure from DeepMind',
    'LinkedIn',
    'first_party',
    '2024-08-21'
  )
) AS v(slug, url, title, platform, source_type, published_date)
  ON p.slug = v.slug;

INSERT INTO profile_concern_tags (profile_id, concern_tag_id)
SELECT p.id, ct.id
FROM profiles p
JOIN concern_tags ct ON ct.slug = 'concentration-of-power'
WHERE p.slug = 'jonathan-richard-schwarz';

INSERT INTO publications (
  profile_id, title, url, publication_type, publisher, published_date,
  published_date_precision, last_updated_at, abstract
)
SELECT
  p.id,
  'Thomson: Continual Learning of Frontier Models for SovereignAI',
  'https://arxiv.org/abs/2608.27147',
  'preprint',
  'arXiv',
  '2026-08-27',
  'day',
  NULL,
  'Schwarz and his co-authors argue that frontier-model development is concentrated among a small number of highly funded organizations, creating information, economic, and power asymmetries. They present a continual-learning approach for adapting open-weight models across data, values, training, evaluation, and infrastructure, and report that it can make control of much of the AI stack feasible for a broader range of institutions. The work directly addresses the concentration concern Schwarz later cited when explaining his departure from DeepMind.'
FROM profiles p
WHERE p.slug = 'jonathan-richard-schwarz';

UPDATE ticker_stats
SET total_count = (
      SELECT count(*)
      FROM profiles
      WHERE status = 'published'
        AND headline_counted = true
        AND motive_evidence IN ('direct', 'reported')
    ),
    ninety_day_count = (
      SELECT count(*)
      FROM profiles
      WHERE status = 'published'
        AND headline_counted = true
        AND motive_evidence IN ('direct', 'reported')
        AND departure_date >= current_date - interval '90 days'
    ),
    updated_at = now();

COMMIT;
