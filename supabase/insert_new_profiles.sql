-- Insert Tom Cunningham profile
INSERT INTO profiles (slug, name, company, role, departure_date, stated_reason, status)
VALUES (
  'tom-cunningham',
  'Tom Cunningham',
  'OpenAI',
  'Economics Researcher',
  '2025-09-15',
  'Left after concluding it had become difficult to publish research that didn''t align with OpenAI''s commercial interests. Accused the economic research team of functioning as a ''de facto advocacy arm'' rather than conducting genuine research, specifically citing suppression of findings about AI''s negative economic impacts.',
  'published'
);

INSERT INTO profile_sources (profile_id, url, title, platform, published_date)
SELECT id,
  'https://futurism.com/artificial-intelligence/openai-researcher-quits-hiding-truth',
  'OpenAI Researcher Quits, Saying Company Is Hiding the Truth',
  'Futurism',
  '2025-12-06'
FROM profiles WHERE slug = 'tom-cunningham';

INSERT INTO profile_sources (profile_id, url, title, platform, published_date)
SELECT id,
  'https://gizmodo.com/openai-accused-of-self-censoring-research-that-paints-ai-in-a-bad-light-2000697413',
  'OpenAI Accused of Self-Censoring Research That Paints AI In a Bad Light',
  'Gizmodo',
  '2025-12-06'
FROM profiles WHERE slug = 'tom-cunningham';

INSERT INTO profile_concern_tags (profile_id, concern_tag_id)
SELECT p.id, ct.id
FROM profiles p, concern_tags ct
WHERE p.slug = 'tom-cunningham' AND ct.slug = 'research-suppression';

INSERT INTO profile_concern_tags (profile_id, concern_tag_id)
SELECT p.id, ct.id
FROM profiles p, concern_tags ct
WHERE p.slug = 'tom-cunningham' AND ct.slug = 'lack-of-transparency';

-- Insert Hieu Pham profile
INSERT INTO profiles (slug, name, company, role, departure_date, stated_reason, status)
VALUES (
  'hieu-pham',
  'Hieu Pham',
  'OpenAI',
  'Member of Technical Staff',
  '2026-02-26',
  'Resigned after seven months citing severe burnout from frontier AI work. Publicly stated: ''Today, I finally feel the existential threat that AI is posing. When AI becomes overly good and disrupts everything, what will be left for humans to do? And it''''s when, not if.''',
  'published'
);

INSERT INTO profile_sources (profile_id, url, title, platform, published_date)
SELECT id,
  'https://x.com/hyhieu226/status/2026841633342501150',
  'Hieu Pham departure announcement on X',
  'X (Twitter)',
  '2026-02-26'
FROM profiles WHERE slug = 'hieu-pham';

INSERT INTO profile_sources (profile_id, url, title, platform, published_date)
SELECT id,
  'https://www.technocracy.news/openai-engineer-calls-ai-existential-threat-days-after-anthropic-safety-lead-mrinank-quit-over-same-concerns/',
  'OpenAI Engineer Calls AI Existential Threat, Days After Anthropic Safety Lead Quit',
  'Technocracy News',
  '2026-02-12'
FROM profiles WHERE slug = 'hieu-pham';

INSERT INTO profile_concern_tags (profile_id, concern_tag_id)
SELECT p.id, ct.id
FROM profiles p, concern_tags ct
WHERE p.slug = 'hieu-pham' AND ct.slug = 'agi-risk-underestimation';

INSERT INTO profile_concern_tags (profile_id, concern_tag_id)
SELECT p.id, ct.id
FROM profiles p, concern_tags ct
WHERE p.slug = 'hieu-pham' AND ct.slug = 'workforce-displacement';

-- Update ticker stats (+2 for both new profiles)
UPDATE ticker_stats
SET total_count = total_count + 2,
    updated_at = now();
