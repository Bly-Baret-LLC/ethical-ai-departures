DO $$ BEGIN
  IF (SELECT count(*) FROM publications WHERE id IN ('f0de1026-0004-4000-8000-000000000001','f0de1026-0004-4000-8000-000000000002','f0de1026-0004-4000-8000-000000000003')) <> 3 THEN
    RAISE EXCEPTION 'Expected three new publications';
  END IF;
  IF NOT EXISTS(SELECT 1 FROM publications w JOIN profiles p ON p.id=w.profile_id WHERE p.slug='alex-hanna' AND w.publication_type='book' AND w.published_date='2025-05-22' AND w.publisher='Vintage Digital · UK edition') THEN RAISE EXCEPTION 'Book metadata incorrect'; END IF;
  IF EXISTS(SELECT 1 FROM publications WHERE publication_type='resignation_letter' AND listed_in_publications) THEN RAISE EXCEPTION 'Departure statement still curated'; END IF;
  IF EXISTS(SELECT 1 FROM publications WHERE url IN ('https://turntrout.com/why-i-left-google-deepmind','https://mikitabalesni.com/letter/letter.pdf') AND listed_in_publications) THEN RAISE EXCEPTION 'Departure account still curated'; END IF;
  IF NOT EXISTS(SELECT 1 FROM publications WHERE url='https://suchir.net/fair_use.html' AND abstract LIKE '%specific case.%' AND abstract NOT ILIKE '%stock photography%') THEN RAISE EXCEPTION 'Fair-use summary not corrected'; END IF;
END $$;
