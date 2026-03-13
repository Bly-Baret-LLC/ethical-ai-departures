-- Create profiles table for departure tracking
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  photo_url TEXT,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  departure_date DATE NOT NULL,
  stated_reason TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_profiles_slug ON profiles(slug);
CREATE INDEX idx_profiles_status ON profiles(status);
CREATE INDEX idx_profiles_company ON profiles(company);
CREATE INDEX idx_profiles_departure_date ON profiles(departure_date);

-- Auto-update updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
