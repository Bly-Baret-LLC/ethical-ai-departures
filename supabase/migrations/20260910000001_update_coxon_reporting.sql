-- Add distinct follow-up reporting published after the initial profile review.
-- These sources contribute original interviews, corroboration, and Anthropic's
-- response rather than duplicating the initial breaking-news coverage.

UPDATE profiles
SET departure_context = 'Before joining Anthropic, Coxon worked at OpenAI, where he contributed to GPT-4o and co-authored research on making neural-network computations easier to interpret. In interviews, he distinguished between the laboratories: he said Anthropic took AI risk more seriously than OpenAI and had not yet cut safety corners, but argued that competitive pressure would eventually force unacceptable trade-offs. Coxon told Axios he resigned about two months before his Anthropic equity would have vested. Anthropic told WIRED that it had consistently acknowledged AI''s benefits and risks and supported lawful, verifiable coordination on the pace of powerful model releases; OpenAI did not respond to WIRED.',
    last_reviewed_at = '2026-09-10',
    reviewer = 'editorial review (2026-09-10)',
    updated_at = now()
WHERE slug = 'jacob-coxon';

INSERT INTO profile_sources (
  profile_id, url, title, platform, source_type, published_date
)
SELECT p.id, v.url, v.title, v.platform, 'reporting', v.published_date::date
FROM profiles p
JOIN (VALUES
  (
    'https://www.seattletimes.com/business/anthropic-researcher-resigns-warning-of-reckless-race-toward-superintelligence/',
    'Anthropic researcher resigns, warning of “reckless race” toward superintelligence',
    'The Seattle Times',
    '2026-09-09'
  ),
  (
    'https://www.wired.com/story/anthropic-researcher-quits-jacob-coxon-ai-fears-humanity/',
    'The AI Researcher Who Just Quit Anthropic Says It’s “Crunch Time for Humanity”',
    'WIRED',
    '2026-09-09'
  ),
  (
    'https://www.axios.com/2026/09/09/anthropic-researcher-ai-warning-interview',
    'Scoop: Anthropic whistleblower gave up his equity to leave the company',
    'Axios',
    '2026-09-09'
  )
) AS v(url, title, platform, published_date)
  ON true
WHERE p.slug = 'jacob-coxon'
  AND NOT EXISTS (
    SELECT 1
    FROM profile_sources existing
    WHERE existing.profile_id = p.id
      AND existing.url = v.url
  );
