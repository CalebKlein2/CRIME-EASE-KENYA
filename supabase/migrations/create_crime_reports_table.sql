-- Create police_stations table first
CREATE TABLE IF NOT EXISTS police_stations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location JSONB NOT NULL,
  jurisdiction TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT,
  phone_number TEXT,
  email TEXT,
  station_head TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create crime_reports table for Supabase
CREATE TABLE IF NOT EXISTS crime_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  description TEXT NOT NULL,
  location JSONB NOT NULL,
  incident_type TEXT NOT NULL,
  date TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  user_id TEXT,
  status TEXT CHECK (status IN ('pending', 'under_investigation', 'resolved', 'closed', 'rejected')) NOT NULL DEFAULT 'pending',
  assigned_officer_id TEXT,
  assigned_station_id UUID REFERENCES police_stations(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS (Row Level Security) policies
-- This allows all users to create reports
ALTER TABLE crime_reports ENABLE ROW LEVEL SECURITY;

-- Policy for inserting records - Anyone can create a report
CREATE POLICY "Anyone can create crime reports" 
  ON crime_reports 
  FOR INSERT 
  WITH CHECK (true);

-- Policy for selecting records - Public can view reports
CREATE POLICY "Public can view crime reports" 
  ON crime_reports 
  FOR SELECT 
  USING (true);

-- Policy for updating records - Authenticated users can only update their own reports unless they're admin
CREATE POLICY "Users can update their own reports" 
  ON crime_reports 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_crime_reports_user_id ON crime_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_crime_reports_incident_type ON crime_reports(incident_type);
CREATE INDEX IF NOT EXISTS idx_crime_reports_city ON crime_reports(city);
CREATE INDEX IF NOT EXISTS idx_crime_reports_date ON crime_reports(date);
CREATE INDEX IF NOT EXISTS idx_crime_reports_is_anonymous ON crime_reports(is_anonymous);

-- Comments for better documentation
COMMENT ON TABLE crime_reports IS 'Stores crime reports submitted by citizens';
COMMENT ON COLUMN crime_reports.id IS 'Unique identifier for each report';
COMMENT ON COLUMN crime_reports.description IS 'Description of the incident';
COMMENT ON COLUMN crime_reports.location IS 'JSON containing latitude, longitude, and address';
COMMENT ON COLUMN crime_reports.incident_type IS 'Type of crime/incident';
COMMENT ON COLUMN crime_reports.date IS 'Date of the incident';
COMMENT ON COLUMN crime_reports.city IS 'City where the incident occurred';
COMMENT ON COLUMN crime_reports.postal_code IS 'Postal code of the incident location';
COMMENT ON COLUMN crime_reports.name IS 'Name of the person reporting';
COMMENT ON COLUMN crime_reports.contact IS 'Contact information of the reporter';
COMMENT ON COLUMN crime_reports.is_anonymous IS 'Whether the report was submitted anonymously';
COMMENT ON COLUMN crime_reports.user_id IS 'User ID for authenticated users';
COMMENT ON COLUMN crime_reports.created_at IS 'Timestamp when the report was created';
COMMENT ON COLUMN crime_reports.updated_at IS 'Timestamp when the report was last updated';
