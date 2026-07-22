-- Evidence-model data migration (remediation brief, 2026-07-22).
-- Requires 20260722000001_add_evidence_model.sql. Classifications per the
-- brief's explicit instructions (Section 4) with research-required groups
-- conservatively set to contextual pending individual evidence.

UPDATE profiles SET motive_evidence = 'direct', headline_counted = true, departure_type = 'resigned', claim_status = 'uncontested', last_reviewed_at = '2026-07-22', reviewer = 'editorial remediation (brief 2026-07-22)'
  WHERE slug IN ('alex-hanna', 'caitlin-kalinowski', 'daniel-kokotajlo', 'david-baker', 'dylan-baker', 'ed-newton-rex', 'el-mahdi-el-mhamdi', 'frances-haugen', 'geoffrey-hinton', 'gretchen-krueger', 'hieu-pham', 'jan-leike', 'joan-deitchman', 'laura-nolan', 'meredith-whittaker', 'miles-brundage', 'mrinank-sharma', 'richard-ngo', 'rosie-campbell', 'rumman-chowdhury', 'steven-adler', 'suchir-balaji', 'timnit-gebru', 'tom-cunningham', 'vinesh-kannan', 'william-saunders', 'zoe-hitzig');

UPDATE profiles SET motive_evidence = 'reported', headline_counted = true, departure_type = 'resigned', claim_status = 'uncontested', last_reviewed_at = '2026-07-22', reviewer = 'editorial remediation (brief 2026-07-22)'
  WHERE slug IN ('dario-amodei', 'ilya-sutskever', 'margaret-mitchell', 'samy-bengio');

UPDATE profiles SET motive_evidence = 'alleged', headline_counted = false, claim_status = 'contested', last_reviewed_at = '2026-07-22', reviewer = 'editorial remediation (brief 2026-07-22)'
  WHERE slug IN ('leopold-aschenbrenner', 'ryan-beiermeister', 'devin-kim');

UPDATE profiles SET motive_evidence = 'contextual', headline_counted = false, departure_type = 'resigned', last_reviewed_at = '2026-07-22', reviewer = 'editorial remediation (brief 2026-07-22)'
  WHERE slug IN ('andrea-vallone', 'barret-zoph', 'behnam-neyshabur', 'bob-mcgrew', 'carroll-wainwright', 'chris-olah', 'christian-szegedy', 'collin-burns', 'cullen-o-keefe', 'daniela-amodei', 'harsh-mehta', 'igor-babuschkin', 'jack-clark', 'jan-hendrik-kirchner', 'jared-kaplan', 'jeffrey-wu', 'jimmy-ba', 'john-schulman', 'jonathan-uesato', 'lilian-weng', 'mira-murati', 'pavel-izmailov', 'paul-christiano', 'ryan-lowe', 'sam-mccandlish', 'steven-bills', 'toby-pohlen', 'todor-markov', 'tom-brown', 'tony-wu', 'yuri-burda', 'zvika-krieger');

UPDATE profiles SET departure_type = 'fired'
  WHERE slug IN ('timnit-gebru', 'margaret-mitchell', 'leopold-aschenbrenner', 'ryan-beiermeister', 'devin-kim');

UPDATE profiles SET departure_type = 'team_eliminated'
  WHERE slug IN ('rumman-chowdhury', 'joan-deitchman');

-- Correction notes for records materially changed by the remediation
UPDATE profiles SET correction_note = 'Reclassified to contextual on 2026-07-22: prior copy inferred a safety motive from the February 2026 departure wave; the individual''s own post did not state one.' WHERE slug IN ('harsh-mehta','behnam-neyshabur');
UPDATE profiles SET correction_note = 'Corrected on 2026-07-22: removed ''coordinated'' characterization; OpenAI described the same-day departures as independent and amicable. Reclassified contextual.' WHERE slug IN ('mira-murati','bob-mcgrew','barret-zoph');
UPDATE profiles SET correction_note = 'Corrected on 2026-07-22: removed unsupported ''Whistleblower Retaliation'' tag; whistleblowing is documented, a specific retaliatory act is not.' WHERE slug = 'frances-haugen';
UPDATE profiles SET correction_note = 'Corrected on 2026-07-22: removed unsupported retaliation tag and moved death details out of the departure summary per editorial policy.' WHERE slug = 'suchir-balaji';
UPDATE profiles SET correction_note = 'Corrected on 2026-07-22: replaced stale ''9 of 11'' founder count with dated, sourced language; reclassified contextual pending individual motive evidence.' WHERE slug IN ('jimmy-ba','toby-pohlen','igor-babuschkin','tony-wu','christian-szegedy');
UPDATE profiles SET correction_note = 'Corrected on 2026-07-22: dated the 10-20% extinction estimate to post-departure interviews (December 2024).' WHERE slug = 'geoffrey-hinton';
UPDATE profiles SET correction_note = 'Reclassified to alleged on 2026-07-22: retaliation link is asserted by the individual and disputed or unresolved; attribution-first wording applied.' WHERE slug IN ('ryan-beiermeister','devin-kim','leopold-aschenbrenner');

-- Publication content-type corrections (require widened constraint)
UPDATE publications SET publication_type = 'resignation_letter' WHERE title = 'Why I Resigned from Stability AI';
UPDATE publications SET publication_type = 'resignation_letter' WHERE title = 'Resignation Letter from Anthropic';
UPDATE publications SET publication_type = 'legal_analysis' WHERE title = 'When Does Generative AI Qualify for Fair Use?';
UPDATE publications SET publication_type = 'forecast_essay' WHERE title = 'What 2026 Looks Like';
UPDATE publications SET publication_type = 'essay' WHERE title IN ('OpenAI Is Making the Mistakes Facebook Made. I Quit.', 'Technological Optimism and Appropriate Fear', 'Time''s Up for AI Policy', 'We''re in Triage Mode for AI Policy');
UPDATE publications SET publication_type = 'testimony' WHERE title LIKE 'Written Testimony Before the Senate%';

-- Prediction remediation: claim/prediction split + under-review state
UPDATE predictions SET record_kind = 'claim' WHERE title = 'OpenAI safety culture has taken a back seat to product launches';
UPDATE predictions SET under_review = true;
UPDATE predictions SET event_date = '2026-01-26' WHERE title = 'Without adequate oversight, alignment failures will occur in deployed systems';

