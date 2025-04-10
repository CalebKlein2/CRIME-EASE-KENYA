-- Migration: 03_triggers_and_functions.sql
-- This migration adds triggers and functions

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
