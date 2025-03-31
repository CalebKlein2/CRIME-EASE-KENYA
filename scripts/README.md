# Sample User Creation Scripts

This directory contains scripts to create sample users for testing the Crime Ease Kenya application.

## Prerequisites

Before running the scripts, make sure you have:

1. Set up your environment variables in `.env.local` file with:
   - `CLERK_SECRET_KEY` - Your Clerk API secret key
   - `NEXT_PUBLIC_CONVEX_URL` - Your Convex deployment URL

2. Installed the required dependencies:
   ```
   npm install @clerk/clerk-sdk-node convex dotenv
   ```

## Available Scripts

### `create-sample-users.js`

This script creates 4 sample users with different roles:
- Citizen
- Police Officer
- Station Admin
- National Admin

Each user is created in both Clerk and Convex with the appropriate role and metadata.

### `run-create-users.bat`

Windows batch file to run the user creation script.

## How to Use

### On Windows

1. Double-click the `run-create-users.bat` file
2. The script will run and create the sample users
3. Check the console output for results

### Manual Execution

```powershell
# Navigate to the project root
cd C:\Users\ADMIN\Documents\GitHub\CRIME-EASE-KENYA

# Run the script
node scripts/create-sample-users.js
```

## Sample Users Created

The script creates the following users:

1. **Citizen**
   - Name: John Citizen
   - Email: john.citizen@example.com
   - Password: CrimeEase_Citizen_2025!
   - Role: citizen

2. **Police Officer**
   - Name: Officer Smith
   - Email: officer.smith@police.gov.ke
   - Password: CrimeEase_Officer_2025!
   - Role: officer
   - Badge Number: KPS-1234
   - Station Code: NRB-001

3. **Station Admin**
   - Name: Station Admin
   - Email: station.admin@police.gov.ke
   - Password: CrimeEase_Station_2025!
   - Role: station_admin
   - Badge Number: KPS-ADMIN-001
   - Station Code: NRB-001

4. **National Admin**
   - Name: National Admin
   - Email: national.admin@police.gov.ke
   - Password: CrimeEase_National_2025!
   - Role: national_admin
   - Security Code: NAT-ADMIN-001

## How to Use the Sample Users

1. Go to your application's sign-in page
2. Sign in with any of the sample user credentials above
3. You should be automatically redirected to the appropriate dashboard based on the user's role
4. If you see "That email address is taken" errors when running the script again, it means the users have already been created successfully

## Troubleshooting

If you encounter any issues:

1. Check that your Clerk API key is correct and has permission to create users
2. Verify that your Convex URL is correct and the database is accessible
3. Make sure you have created at least one police station in your Convex database for officer assignments
