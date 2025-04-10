-- Migration: 02_indexes_and_policies.sql
-- This migration adds indexes and row-level security policies

-- ==========================================
-- INDEXES
-- ==========================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_station_id ON profiles(station_id);

-- Police stations indexes
CREATE INDEX IF NOT EXISTS idx_police_stations_city ON police_stations(city);

-- Crime reports indexes
CREATE INDEX IF NOT EXISTS idx_crime_reports_user_id ON crime_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_crime_reports_incident_type ON crime_reports(incident_type);
CREATE INDEX IF NOT EXISTS idx_crime_reports_status ON crime_reports(status);
CREATE INDEX IF NOT EXISTS idx_crime_reports_assigned_officer_id ON crime_reports(assigned_officer_id);
CREATE INDEX IF NOT EXISTS idx_crime_reports_assigned_station_id ON crime_reports(assigned_station_id);
CREATE INDEX IF NOT EXISTS idx_crime_reports_city ON crime_reports(city);
CREATE INDEX IF NOT EXISTS idx_crime_reports_date ON crime_reports(date);
CREATE INDEX IF NOT EXISTS idx_crime_reports_is_anonymous ON crime_reports(is_anonymous);

-- Cases indexes
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_assigned_officer_id ON cases(assigned_officer_id);
CREATE INDEX IF NOT EXISTS idx_cases_station_id ON cases(station_id);
CREATE INDEX IF NOT EXISTS idx_cases_crime_report_id ON cases(crime_report_id);

-- Evidence indexes
CREATE INDEX IF NOT EXISTS idx_evidence_case_id ON evidence(case_id);
CREATE INDEX IF NOT EXISTS idx_evidence_type ON evidence(type);
CREATE INDEX IF NOT EXISTS idx_evidence_status ON evidence(status);

-- Interviews indexes
CREATE INDEX IF NOT EXISTS idx_interviews_case_id ON interviews(case_id);
CREATE INDEX IF NOT EXISTS idx_interviews_interviewer_id ON interviews(interviewer_id);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_case_id ON messages(case_id);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE police_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE crime_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE crime_types ENABLE ROW LEVEL SECURITY;

-- Profile policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Police and admins can view all profiles" ON profiles
  FOR SELECT USING (
    auth.jwt()->>'role' IN ('police', 'admin')
  );

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Police stations policies
CREATE POLICY "Anyone can view police stations" ON police_stations
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify police stations" ON police_stations
  FOR ALL USING (
    auth.jwt()->>'role' = 'admin'
  );

-- Crime reports policies
CREATE POLICY "Anyone can create crime reports" ON crime_reports
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own crime reports" ON crime_reports
  FOR SELECT USING (
    auth.uid() = user_id OR
    is_anonymous = true OR
    auth.jwt()->>'role' IN ('police', 'admin')
  );

CREATE POLICY "Police and admins can update crime reports" ON crime_reports
  FOR UPDATE USING (
    auth.jwt()->>'role' IN ('police', 'admin')
  );

-- Cases policies
CREATE POLICY "Police and admins can view all cases" ON cases
  FOR SELECT USING (
    auth.jwt()->>'role' IN ('police', 'admin')
  );

CREATE POLICY "Users can view cases related to their reports" ON cases
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM crime_reports cr
      WHERE cr.id = cases.crime_report_id AND cr.user_id = auth.uid()
    )
  );

CREATE POLICY "Police and admins can modify cases" ON cases
  FOR ALL USING (
    auth.jwt()->>'role' IN ('police', 'admin')
  );

-- Evidence policies
CREATE POLICY "Police and admins can access evidence" ON evidence
  FOR ALL USING (
    auth.jwt()->>'role' IN ('police', 'admin')
  );

-- Interviews policies
CREATE POLICY "Police and admins can access interviews" ON interviews
  FOR ALL USING (
    auth.jwt()->>'role' IN ('police', 'admin')
  );

-- Case notes policies
CREATE POLICY "Police and admins can access case notes" ON case_notes
  FOR ALL USING (
    auth.jwt()->>'role' IN ('police', 'admin')
  );

-- Messages policies
CREATE POLICY "Users can view their own messages" ON messages
  FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
  );

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Crime types policies
CREATE POLICY "Anyone can view crime types" ON crime_types
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify crime types" ON crime_types
  FOR ALL USING (
    auth.jwt()->>'role' = 'admin'
  );
