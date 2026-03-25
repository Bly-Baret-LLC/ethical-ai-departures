-- PRODUCTION: Medium-priority fact-check fixes
-- Run this in Supabase SQL Editor

UPDATE profiles SET stated_reason = 'Fired after raising cybersecurity concerns internally and sharing a security memo with board members. OpenAI cited a separate alleged information leak as the reason for termination; Aschenbrenner said the security memo was a major factor. Later published the influential ''Situational Awareness'' essay arguing AGI is imminent and labs are unprepared.' WHERE slug = 'leopold-aschenbrenner';

UPDATE profiles SET departure_date = '2021-04-01' WHERE slug = 'paul-christiano';

UPDATE profiles SET stated_reason = 'Fired while leading the product policy team that develops safeguards. Had opposed ChatGPT''s planned ''adult mode'' feature. OpenAI cited a discrimination allegation from a colleague as the reason for termination; Beiermeister denied the allegation and said it was retaliation for raising safety concerns.' WHERE slug = 'ryan-beiermeister';

UPDATE profile_sources SET url = 'https://dnyuz.com/2026/02/26/a-former-openai-and-xai-staffer-says-he-burned-out-in-ai-labs-so-hes-quitting-and-going-back-to-vietnam/', title = 'A former OpenAI and xAI staffer says he burned out in AI labs, so he is quitting and going back to Vietnam', platform = 'DNyuz', published_date = '2026-02-26' WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'hieu-pham') AND platform = 'Technocracy News';
