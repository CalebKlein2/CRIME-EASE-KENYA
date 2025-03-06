# Supabase Setup Guide for Crime Ease Kenya

## Overview
Crime Ease Kenya uses a hybrid authentication system:
- Clerk: Handles user authentication and session management
- Supabase: Serves as the primary database and handles data storage

## Setup Steps

### 1. Create Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in project details:
   - Name: crime-ease-kenya
   - Database Password: (generate a strong password)
   - Region: Choose closest to Kenya
   - Pricing Plan: Free tier to start

### 2. Configure Environment Variables
Add these to your `.env` file:
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Database Setup
1. Go to SQL Editor in Supabase Dashboard
2. Copy the contents of `supabase/schema.sql`
3. Run the SQL commands to create:
   - Users table (linked to Clerk)
   - Police stations table
   - Cases table
   - Teams and team members tables
   - Row Level Security policies
   - Triggers for updated_at columns

### 4. Row Level Security (RLS)
The schema includes RLS policies for:
- Users can view their own profiles
- Admins can view all users
- Users can view their reported cases
- Officers can view assigned cases
- Admins can view all cases

### 5. Data Synchronization
When a user signs up through Clerk:
1. Clerk handles authentication
2. Our AuthContext creates a corresponding user record in Supabase
3. User data is synced between both services

### 6. Development vs Production
Development:
- Uses mock data (configured in `src/lib/supabase.ts`)
- No actual Supabase connection required
- Perfect for local development

Production:
- Requires valid Supabase credentials
- Real database operations
- Full RLS policy enforcement

### 7. Database Schema

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  clerk_id TEXT UNIQUE,
  email TEXT UNIQUE,
  full_name TEXT,
  role TEXT,
  station_id UUID,
  badge_number TEXT
);
```

#### Police Stations Table
```sql
CREATE TABLE police_stations (
  id UUID PRIMARY KEY,
  name TEXT,
  location TEXT,
  jurisdiction TEXT,
  contact_number TEXT
);
```

#### Cases Table
```sql
CREATE TABLE cases (
  id UUID PRIMARY KEY,
  title TEXT,
  description TEXT,
  status TEXT,
  reporter_id UUID,
  assigned_officer_id UUID,
  station_id UUID
);
```

## Testing
1. Create a test user in Clerk
2. Verify user data syncs to Supabase
3. Test RLS policies by:
   - Creating cases as different user types
   - Attempting to access data with different permissions
   - Verifying admin access to all resources

## Troubleshooting
1. Check environment variables are correctly set
2. Verify Supabase connection in browser console
3. Check RLS policies if data access is denied
4. Monitor Supabase logs for errors

## Next Steps
1. Set up data backups
2. Configure proper indexes for performance
3. Set up monitoring and alerts
4. Plan for scaling as user base grows
