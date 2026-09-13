-- Editorial context audit (2026-09-10).
--
-- Context-only person records are removed from public presentation. Three
-- profiles now have person-level evidence and are promoted. Tom Brown is held
-- in draft until the primary interview can be checked against a transcript.
-- Organizational events are stored in site data, not this table, and therefore
-- cannot enter the person tally.

BEGIN;

DO $$
DECLARE
  contextual_profile_count integer;
BEGIN
  SELECT count(*)
  INTO contextual_profile_count
  FROM profiles
  WHERE slug IN (
    'andrea-vallone',
    'barret-zoph',
    'behnam-neyshabur',
    'bob-mcgrew',
    'chris-olah',
    'christian-szegedy',
    'collin-burns',
    'cullen-o-keefe',
    'daniela-amodei',
    'harsh-mehta',
    'igor-babuschkin',
    'jack-clark',
    'jan-hendrik-kirchner',
    'jared-kaplan',
    'jeffrey-wu',
    'jimmy-ba',
    'john-schulman',
    'jonathan-uesato',
    'lilian-weng',
    'mira-murati',
    'paul-christiano',
    'pavel-izmailov',
    'ryan-lowe',
    'sam-mccandlish',
    'steven-bills',
    'toby-pohlen',
    'tom-brown',
    'tony-wu',
    'yuri-burda',
    'zvika-krieger'
  )
    AND status = 'published'
    AND motive_evidence = 'contextual';

  IF contextual_profile_count <> 30 THEN
    RAISE EXCEPTION
      'Expected 30 published contextual profiles before audit, found %',
      contextual_profile_count;
  END IF;
END $$;

-- These 26 records have no person-level evidence tying the departure to a
-- safety, ethics, governance, or accountability concern. Archive rather than
-- delete so the source history and a simple rollback remain available.
UPDATE profiles
SET status = 'archived'
WHERE slug IN (
  'andrea-vallone',
  'barret-zoph',
  'behnam-neyshabur',
  'bob-mcgrew',
  'chris-olah',
  'christian-szegedy',
  'collin-burns',
  'cullen-o-keefe',
  'harsh-mehta',
  'igor-babuschkin',
  'jack-clark',
  'jan-hendrik-kirchner',
  'jared-kaplan',
  'jimmy-ba',
  'john-schulman',
  'jonathan-uesato',
  'lilian-weng',
  'mira-murati',
  'paul-christiano',
  'pavel-izmailov',
  'ryan-lowe',
  'sam-mccandlish',
  'steven-bills',
  'toby-pohlen',
  'tony-wu',
  'zvika-krieger'
);

-- The video is primary evidence, but no transcript is available. Keep Brown
-- out of public results until the relevant passage can be manually verified.
UPDATE profiles
SET status = 'draft',
    claim_status = 'pending',
    last_reviewed_at = '2026-09-10',
    reviewer = 'editorial context audit (2026-09-10)',
    correction_note = 'Moved to draft on 2026-09-10 pending manual verification of the primary interview passage connecting the departure to safety and long-term risk.'
WHERE slug = 'tom-brown';

UPDATE profiles
SET motive_evidence = 'direct',
    headline_counted = true,
    claim_status = 'uncontested',
    stated_reason = 'Amodei said the seven-person founding group left OpenAI because it was easier to create their intended safety- and impact-focused vision in a new company.',
    departure_context = 'In a 2026 Stanford Graduate School of Business interview, Daniela Amodei directly connected the group''s departure to creating a different vision for the technology outside OpenAI. TIME separately reported that Daniela and Dario Amodei left over concerns that OpenAI was becoming too commercial.',
    last_reviewed_at = '2026-09-10',
    reviewer = 'editorial context audit (2026-09-10)',
    correction_note = 'Promoted from Context only to Explicitly stated on 2026-09-10 after review of Daniela Amodei''s Stanford interview and corroborating TIME reporting.'
WHERE slug = 'daniela-amodei';

UPDATE profiles
SET motive_evidence = 'reported',
    headline_counted = true,
    claim_status = 'uncontested',
    stated_reason = 'The Information reported that Wu was among researchers who departed because of safety concerns and a lack of trust in OpenAI leadership, citing a source who had spoken with him.',
    departure_context = 'The Information explicitly named Jeffrey Wu in its reporting on researchers who left amid safety concerns and diminished trust in leadership. This is a reported connection, not a public statement from Wu.',
    last_reviewed_at = '2026-09-10',
    reviewer = 'editorial context audit (2026-09-10)',
    correction_note = 'Promoted from Context only to Reported connection on 2026-09-10 based on person-specific reporting by The Information.'
WHERE slug = 'jeffrey-wu';

UPDATE profiles
SET motive_evidence = 'reported',
    headline_counted = true,
    claim_status = 'uncontested',
    stated_reason = 'The Information reported that Burda was among researchers who departed because of safety concerns and a lack of trust in OpenAI leadership, citing a source who had spoken with him.',
    departure_context = 'The Information explicitly named Yuri Burda in its reporting on researchers who left amid safety concerns and diminished trust in leadership. This is a reported connection, not a public statement from Burda.',
    last_reviewed_at = '2026-09-10',
    reviewer = 'editorial context audit (2026-09-10)',
    correction_note = 'Promoted from Context only to Reported connection on 2026-09-10 based on person-specific reporting by The Information.'
WHERE slug = 'yuri-burda';

INSERT INTO profile_sources (
  profile_id, url, title, platform, source_type, published_date
)
SELECT p.id, v.url, v.title, v.platform, v.source_type, v.published_date::date
FROM profiles p
JOIN (
  VALUES
    (
      'daniela-amodei',
      'https://www.gsb.stanford.edu/insights/daniela-amodei-says-curiosity-underrated',
      'Daniela Amodei Says Curiosity Is Underrated',
      'Stanford Graduate School of Business',
      'first_party',
      '2026-06-29'
    ),
    (
      'daniela-amodei',
      'https://time.com/6295523/claude-2-anthropic-chatgpt/',
      'What to Know About Claude 2, Anthropic''s Rival to ChatGPT',
      'TIME',
      'reporting',
      '2023-07-18'
    ),
    (
      'jeffrey-wu',
      'https://www.theinformation.com/articles/openai-removes-ai-safety-leader-m-dry-a-onetime-ally-of-ceo-altman',
      'OpenAI Removes AI Safety Leader Madry, a Onetime Ally of CEO Altman',
      'The Information',
      'reporting',
      '2024-07-23'
    ),
    (
      'yuri-burda',
      'https://www.theinformation.com/articles/openai-removes-ai-safety-leader-m-dry-a-onetime-ally-of-ceo-altman',
      'OpenAI Removes AI Safety Leader Madry, a Onetime Ally of CEO Altman',
      'The Information',
      'reporting',
      '2024-07-23'
    )
) AS v(slug, url, title, platform, source_type, published_date)
  ON p.slug = v.slug
WHERE NOT EXISTS (
  SELECT 1
  FROM profile_sources existing
  WHERE existing.profile_id = p.id
    AND existing.url = v.url
);

-- The legacy realtime row mirrors the canonical evidence-linked selector.
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
