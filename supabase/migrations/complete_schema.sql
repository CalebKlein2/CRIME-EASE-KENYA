-- Complete Database Schema for Crime Ease Kenya
-- Run this script in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- USERS AND AUTHENTICATION
-- ==========================================

-- Police stations table
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

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  email TEXT UNIQUE,
  phone_number TEXT,
  role TEXT CHECK (role IN ('citizen', 'police', 'admin')) NOT NULL DEFAULT 'citizen',
  avatar_url TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  national_id TEXT UNIQUE,
  badge_number TEXT UNIQUE,
  station_id UUID REFERENCES police_stations(id),
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ==========================================
-- CRIME REPORTS
-- ==========================================

-- Crime Reports table
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
  user_id UUID REFERENCES profiles(id),
  status TEXT CHECK (status IN ('pending', 'under_investigation', 'resolved', 'closed', 'rejected')) NOT NULL DEFAULT 'pending',
  assigned_officer_id UUID REFERENCES profiles(id),
  assigned_station_id UUID REFERENCES police_stations(id),
  media_files JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ==========================================
-- CASES MANAGEMENT
-- ==========================================

-- Cases table
CREATE TABLE IF NOT EXISTS cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT CHECK (status IN ('open', 'under_investigation', 'pending_trial', 'closed', 'resolved')) NOT NULL DEFAULT 'open',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) NOT NULL DEFAULT 'medium',
  case_number TEXT UNIQUE NOT NULL,
  crime_report_id UUID REFERENCES crime_reports(id),
  assigned_officer_id UUID REFERENCES profiles(id),
  station_id UUID REFERENCES police_stations(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  closed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES profiles(id) NOT NULL
);

-- Evidence table
CREATE TABLE IF NOT EXISTS evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES cases(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT CHECK (type IN ('photo', 'video', 'document', 'audio', 'physical', 'other')) NOT NULL,
  file_url TEXT,
  collected_by UUID REFERENCES profiles(id),
  collection_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location JSONB,
  status TEXT CHECK (status IN ('collected', 'processing', 'stored', 'presented_in_court', 'returned', 'destroyed')) NOT NULL DEFAULT 'collected',
  chain_of_custody JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Interviews table
CREATE TABLE IF NOT EXISTS interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES cases(id) NOT NULL,
  interviewee_name TEXT NOT NULL,
  interviewee_type TEXT CHECK (interviewee_type IN ('witness', 'suspect', 'victim', 'expert', 'other')) NOT NULL,
  interviewer_id UUID REFERENCES profiles(id) NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  summary TEXT NOT NULL,
  recording_url TEXT,
  transcript TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Case notes table
CREATE TABLE IF NOT EXISTS case_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES cases(id) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ==========================================
-- MESSAGING AND NOTIFICATIONS
-- ==========================================

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  receiver_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  case_id UUID REFERENCES cases(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  action_url TEXT,
  case_id UUID REFERENCES cases(id),
  crime_report_id UUID REFERENCES crime_reports(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ==========================================
-- REFERENCE TABLES
-- ==========================================

-- Crime types reference table
CREATE TABLE IF NOT EXISTS crime_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('minor', 'moderate', 'serious', 'severe')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

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

-- ==========================================
-- TRIGGERS AND FUNCTIONS
-- ==========================================

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables with updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_police_stations_updated_at
BEFORE UPDATE ON police_stations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crime_reports_updated_at
BEFORE UPDATE ON crime_reports
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cases_updated_at
BEFORE UPDATE ON cases
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_evidence_updated_at
BEFORE UPDATE ON evidence
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interviews_updated_at
BEFORE UPDATE ON interviews
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_case_notes_updated_at
BEFORE UPDATE ON case_notes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crime_types_updated_at
BEFORE UPDATE ON crime_types
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile after signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'citizen')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile after signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to create notification when case status changes
CREATE OR REPLACE FUNCTION notify_case_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status <> NEW.status THEN
    -- Get reporter's ID from associated crime report
    DECLARE 
      reporter_id UUID;
    BEGIN
      SELECT user_id INTO reporter_id
      FROM crime_reports
      WHERE id = NEW.crime_report_id;
      
      IF reporter_id IS NOT NULL THEN
        INSERT INTO notifications(
          user_id, title, message, type, read, case_id, crime_report_id
        )
        VALUES (
          reporter_id,
          'Case Status Update',
          'Your case status has been updated to ' || NEW.status,
          'case_update',
          false,
          NEW.id,
          NEW.crime_report_id
        );
      END IF;
    END;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for case status change notifications
CREATE TRIGGER on_case_status_change
AFTER UPDATE ON cases
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION notify_case_status_change();

-- Function to create notification when crime report is assigned
CREATE OR REPLACE FUNCTION notify_crime_report_assignment()
RETURNS TRIGGER AS $$
BEGIN
  IF (OLD.assigned_officer_id IS NULL AND NEW.assigned_officer_id IS NOT NULL) 
  OR (OLD.assigned_officer_id IS DISTINCT FROM NEW.assigned_officer_id) THEN
    -- If there's a user_id (not anonymous report)
    IF NEW.user_id IS NOT NULL THEN
      INSERT INTO notifications(
        user_id, title, message, type, read, crime_report_id
      )
      VALUES (
        NEW.user_id,
        'Report Assigned',
        'Your crime report has been assigned to an officer for investigation',
        'report_update',
        false,
        NEW.id
      );
    END IF;
    
    -- Also notify the assigned officer
    INSERT INTO notifications(
      user_id, title, message, type, read, crime_report_id
    )
    VALUES (
      NEW.assigned_officer_id,
      'New Assignment',
      'You have been assigned to investigate a new crime report',
      'assignment',
      false,
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for crime report assignment notifications
CREATE TRIGGER on_crime_report_assignment
AFTER UPDATE ON crime_reports
FOR EACH ROW
WHEN (
  (OLD.assigned_officer_id IS NULL AND NEW.assigned_officer_id IS NOT NULL) OR
  (OLD.assigned_officer_id IS DISTINCT FROM NEW.assigned_officer_id)
)
EXECUTE FUNCTION notify_crime_report_assignment();
