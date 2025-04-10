-- Migration: 01_create_tables.sql
-- This migration creates all tables in the correct order to avoid reference issues

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create police_stations table first (no foreign key dependencies)
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

-- Create profiles table next (depends on police_stations)
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

-- Create crime_reports table (depends on profiles and police_stations)
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

-- Create crime_types reference table (no dependencies)
CREATE TABLE IF NOT EXISTS crime_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('minor', 'moderate', 'serious', 'severe')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create cases table (depends on crime_reports, profiles, and police_stations)
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

-- Create evidence table (depends on cases and profiles)
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

-- Create interviews table (depends on cases and profiles)
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

-- Create case_notes table (depends on cases and profiles)
CREATE TABLE IF NOT EXISTS case_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES cases(id) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create messages table (depends on profiles and cases)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  receiver_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  case_id UUID REFERENCES cases(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create notifications table (depends on profiles, cases, and crime_reports)
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
