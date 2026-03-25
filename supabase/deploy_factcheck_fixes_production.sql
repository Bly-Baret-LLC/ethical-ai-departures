-- PRODUCTION: Fact-check fixes + Kalinowski update
-- Run this in Supabase SQL Editor (one shot)

-- 1. Fix Kalinowski stated reason
UPDATE profiles SET stated_reason = 'Resigned over OpenAI''s deal with the Pentagon, citing insufficient deliberation around guardrails — specifically surveillance without judicial oversight and lethal autonomy without human authorization. The Pentagon deal had already triggered a 295% surge in ChatGPT uninstalls before her departure.' WHERE slug = 'caitlin-kalinowski';

-- 2. Remove Aleksander Madry (reassigned internally, not departed)
DELETE FROM profile_concern_tags WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'aleksander-madry');
DELETE FROM profile_sources WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'aleksander-madry');
DELETE FROM profiles WHERE slug = 'aleksander-madry';

-- 3. Fix Anthropic co-founder departure dates (Dec 2020, not Jan 2021)
UPDATE profiles SET departure_date = '2020-12-15' WHERE slug IN ('dario-amodei', 'daniela-amodei', 'tom-brown', 'chris-olah', 'sam-mccandlish', 'jack-clark', 'jared-kaplan');

-- 4. Fix Babuschkin stated reason (VC firm, not alignment research)
UPDATE profiles SET stated_reason = 'Left xAI and founded Babuschkin Ventures, a venture capital firm investing in AI and agentic systems. Part of the broader xAI co-founder exodus where 9 of 11 original co-founders departed.' WHERE slug = 'igor-babuschkin';

-- 5. Decrement ticker (Madry removed)
UPDATE ticker_stats SET total_count = total_count - 1, updated_at = now();

-- 6. Fix Aschenbrenner stated reason (memo characterization, both sides)
UPDATE profiles SET stated_reason = 'Fired after raising cybersecurity concerns internally and sharing a security memo with board members. OpenAI cited a separate alleged information leak as the reason for termination; Aschenbrenner said the security memo was a major factor. Later published the influential ''Situational Awareness'' essay arguing AGI is imminent and labs are unprepared.' WHERE slug = 'leopold-aschenbrenner';

-- 7. Fix Paul Christiano departure date (left separately from Anthropic group)
UPDATE profiles SET departure_date = '2021-04-01' WHERE slug = 'paul-christiano';

-- 8. Fix Beiermeister stated reason (present both sides)
UPDATE profiles SET stated_reason = 'Fired while leading the product policy team that develops safeguards. Had opposed ChatGPT''s planned ''adult mode'' feature. OpenAI cited a discrimination allegation from a colleague as the reason for termination; Beiermeister denied the allegation and said it was retaliation for raising safety concerns.' WHERE slug = 'ryan-beiermeister';

-- 9. Fix Hieu Pham source (replace pre-departure source)
UPDATE profile_sources SET url = 'https://dnyuz.com/2026/02/26/a-former-openai-and-xai-staffer-says-he-burned-out-in-ai-labs-so-hes-quitting-and-going-back-to-vietnam/', title = 'A former OpenAI and xAI staffer says he burned out in AI labs, so he''s quitting and going back to Vietnam', platform = 'DNyuz', published_date = '2026-02-26' WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'hieu-pham') AND platform = 'Technocracy News';
