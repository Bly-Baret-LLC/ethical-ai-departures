-- Add predicted_date to track when a claim was originally made
-- (distinct from created_at which is when it was entered into our database)
ALTER TABLE predictions ADD COLUMN predicted_date date;
