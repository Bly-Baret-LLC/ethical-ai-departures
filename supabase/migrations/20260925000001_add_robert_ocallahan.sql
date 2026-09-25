-- Add Robert O'Callahan after his first-party statement explicitly connected
-- his resignation from Google DeepMind to the pace and effects of AI progress.

BEGIN;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM profiles WHERE slug = 'robert-ocallahan') THEN
    RAISE EXCEPTION 'Profile robert-ocallahan already exists';
  END IF;
END $$;

INSERT INTO profiles (
  slug, name, photo_url, company, role, departure_date,
  departure_date_precision, effective_departure_date, departure_date_note,
  seo_description, stated_reason, departure_context, status, departure_type,
  motive_evidence, headline_counted, motive_quote, claim_status,
  last_reviewed_at, reviewer
)
VALUES (
  'robert-ocallahan',
  'Robert O''Callahan',
  NULL,
  'Google',
  'Software Engineer, Chip Design Tools (Google DeepMind)',
  '2026-09-24',
  'day',
  NULL,
  'O''Callahan wrote on September 24, 2026 that he was resigning from Google that day.',
  'Robert O''Callahan resigned from Google DeepMind in 2026, saying his chip-design work would make AI cheaper and faster while AI progress was already moving too quickly.',
  'Software engineer who resigned from Google DeepMind on September 24, 2026. O''Callahan said his team built improved tools for hardware-chip design whose principal effect would be to make AI cheaper, faster, and more pervasive. He said AI progress was already far too rapid, that moving to another Google project not accelerating AI was impractical from New Zealand, and that he no longer believed continuing the work was good for people.',
  'O''Callahan said he valued his colleagues and the work itself, but concluded that even an indirect contribution to AI capability acceleration carried moral responsibility. He had publicly argued since 2023 for slower AI development and stronger regulation, and wrote in 2025 that he regularly considered resigning while weighing his ability to influence Google from within against his role in accelerating AI.',
  'published',
  'resigned',
  'direct',
  true,
  'My team’s goal is ultimately to make AI much cheaper and lower-latency, and I don’t think that’s good for people right now.',
  'uncontested',
  '2026-09-25',
  'editorial review (2026-09-25)'
);

INSERT INTO profile_sources (
  profile_id, url, title, platform, source_type, published_date
)
SELECT p.id, v.url, v.title, v.platform, v.source_type, v.published_date::date
FROM profiles p
JOIN (VALUES
  (
    'robert-ocallahan',
    'https://robert.ocallahan.org/2026/09/goodbye-google.html',
    'Goodbye Google',
    'Robert O''Callahan',
    'first_party',
    '2026-09-24'
  ),
  (
    'robert-ocallahan',
    'https://robert.ocallahan.org/2026/07/pacing-the-frontier.html',
    'Thoughts on “Pacing The Frontier”',
    'Robert O''Callahan',
    'first_party',
    '2026-07-30'
  ),
  (
    'robert-ocallahan',
    'https://robert.ocallahan.org/2025/11/ai-road-trip.html',
    'AI And Jesus In Late 2025: A Road Trip Report',
    'Robert O''Callahan',
    'first_party',
    '2025-11-10'
  ),
  (
    'robert-ocallahan',
    'https://robert.ocallahan.org/2023/04/why-i-signed-pause-letter.html',
    'Why I Signed The “Pause” Letter',
    'Robert O''Callahan',
    'first_party',
    '2023-04-03'
  ),
  (
    'robert-ocallahan',
    'https://2022.splashcon.org/profile/robertocallahan',
    'Robert O''Callahan — SPLASH 2022 profile',
    'SPLASH 2022',
    'reference',
    NULL
  )
) AS v(slug, url, title, platform, source_type, published_date)
  ON p.slug = v.slug;

INSERT INTO profile_concern_tags (profile_id, concern_tag_id)
SELECT p.id, ct.id
FROM profiles p
JOIN concern_tags ct ON ct.slug IN (
  'competitive-race-dynamics', 'workforce-displacement'
)
WHERE p.slug = 'robert-ocallahan'
ON CONFLICT DO NOTHING;

INSERT INTO publications (
  profile_id, title, url, publication_type, publisher, published_date,
  published_date_precision, last_updated_at, abstract
)
SELECT p.id, v.title, v.url, v.publication_type, v.publisher,
  v.published_date::date, v.published_date_precision, v.last_updated_at::date,
  v.abstract
FROM profiles p
JOIN (VALUES
  (
    'robert-ocallahan',
    'Goodbye Google',
    'https://robert.ocallahan.org/2026/09/goodbye-google.html',
    'resignation_letter',
    'Self-published',
    '2026-09-24',
    'day',
    NULL,
    'O''Callahan explains why he resigned from Google DeepMind. He says his work on chip-design tools would ultimately make AI cheaper, faster, and more pervasive, while AI progress was already moving too quickly for people and institutions to understand or adapt. He also discusses existential risk, power concentration, economic disruption, cybersecurity, and accountability.'
  ),
  (
    'robert-ocallahan',
    'Thoughts on “Pacing The Frontier”',
    'https://robert.ocallahan.org/2026/07/pacing-the-frontier.html',
    'essay',
    'Self-published',
    '2026-07-30',
    'day',
    NULL,
    'O''Callahan argues against treating advanced AI development as a race to be won. He calls for cooperation, verification, and negotiated limits between laboratories and countries rather than accelerating toward systems whose consequences and control mechanisms remain uncertain.'
  ),
  (
    'robert-ocallahan',
    'AI And Jesus In Late 2025: A Road Trip Report',
    'https://robert.ocallahan.org/2025/11/ai-road-trip.html',
    'essay',
    'Self-published',
    '2025-11-10',
    'day',
    NULL,
    'Writing while employed at Google DeepMind, O''Callahan describes conversations with colleagues about mass unemployment, human irrelevance, and extinction. He says he believed AI would most likely be disastrous for humanity and recounts his internal debate over whether to keep trying to influence the company or resign.'
  ),
  (
    'robert-ocallahan',
    'Why I Signed The “Pause” Letter',
    'https://robert.ocallahan.org/2023/04/why-i-signed-pause-letter.html',
    'essay',
    'Self-published',
    '2023-04-03',
    'day',
    NULL,
    'O''Callahan explains his support for a pause in advanced AI development. He identifies risks from economic displacement, malicious use, and loss of control, argues that society needs time to adapt, and calls for government regulation and industry self-regulation.'
  )
) AS v(slug, title, url, publication_type, publisher, published_date, published_date_precision, last_updated_at, abstract)
  ON p.slug = v.slug;

INSERT INTO predictions (
  profile_id, title, description, source_quote, resolution_criteria, status,
  predicted_date, reviewed_by, review_notes, record_kind, under_review,
  event_date, is_verbatim_quote, source_url
)
SELECT
  p.id,
  'AI will most likely be disastrous for humanity',
  'O''Callahan stated a broad expectation of disaster without a time horizon, probability estimate, or objective outcome threshold. It is recorded as a warning and excluded from accuracy scoring.',
  'I believe AI will most likely be disastrous for humanity.',
  'Not scored: the statement gives no time horizon and does not define “disastrous” as an objectively adjudicable outcome.',
  'not_applicable',
  '2025-11-10',
  'editorial review (2026-09-25)',
  'Added as a warning because it expresses a forward-looking expectation but cannot be resolved against a defined date and outcome threshold.',
  'warning',
  false,
  '2025-11-10',
  true,
  'https://robert.ocallahan.org/2025/11/ai-road-trip.html'
FROM profiles p
WHERE p.slug = 'robert-ocallahan';

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
