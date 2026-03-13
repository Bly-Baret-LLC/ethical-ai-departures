-- Create ticker_stats table for cached aggregate counts
CREATE TABLE ticker_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_count INTEGER NOT NULL DEFAULT 0,
  ninety_day_count INTEGER NOT NULL DEFAULT 0,
  seniority_breakdown JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER ticker_stats_updated_at
  BEFORE UPDATE ON ticker_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
