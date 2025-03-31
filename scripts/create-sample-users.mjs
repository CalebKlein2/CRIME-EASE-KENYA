// scripts/create-sample-users.mjs
// Script to create sample users in Clerk and Convex for testing

import dotenv from 'dotenv';
import { Clerk } from '@clerk/clerk-sdk-node';
import { ConvexHttpClient } from 'convex/browser';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Initialize Clerk SDK with your secret key
const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

// Initialize Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

// Sample user data with different roles
const sampleUsers = [
  {
    firstName: 'John',
    lastName: 'Citizen',
    email: 'john.citizen@example.com',
    password: 'CrimeEase_Citizen_2025!',
    role: 'citizen'
  },
  {
    firstName: 'Officer',
    lastName: 'Smith',
    email: 'officer.smith@police.gov.ke',
    password: 'CrimeEase_Officer_2025!',
    role: 'officer',
    badgeNumber: 'KPS-1234',
    stationCode: 'NRB-001'
  },
  {
    firstName: 'Station',
    lastName: 'Admin',
    email: 'station.admin@police.gov.ke',
    password: 'CrimeEase_Station_2025!',
    role: 'station_admin',
    badgeNumber: 'KPS-ADMIN-001',
    stationCode: 'NRB-001'
  },
  {
    firstName: 'National',
    lastName: 'Admin',
    email: 'national.admin@police.gov.ke',
    password: 'CrimeEase_National_2025!',
    role: 'national_admin',
    securityCode: 'NAT-ADMIN-001'
  }
];

async function createUserInClerk(userData) {
  try {
    console.log(`Creating Clerk user: ${userData.firstName} ${userData.lastName} (${userData.role})`);
    
    // Create user in Clerk
    const user = await clerk.users.createUser({
      firstName: userData.firstName,
      lastName: userData.lastName,
      emailAddress: [userData.email],
      password: userData.password,
      publicMetadata: {
        role: userData.role
      }
    });
    
    console.log(`Created Clerk user with ID: ${user.id}`);
    return user;
  } catch (error) {
    console.error(`Error creating Clerk user ${userData.email}:`, error);
    throw error;
  }
}

async function createUserInConvex(clerkUser, userData) {
  try {
    console.log(`Creating Convex user for Clerk ID: ${clerkUser.id}`);
    
    // Create user in Convex using the createFromClerk mutation
    const result = await convex.mutation('users:createFromClerk', {
      clerkId: clerkUser.id,
      email: userData.email,
      fullName: `${userData.firstName} ${userData.lastName}`,
      profileImage: clerkUser.imageUrl,
      phoneNumber: clerkUser.primaryPhoneNumber?.phoneNumber,
      role: userData.role
    });
    
    console.log(`Created Convex user with ID: ${result.userId}`);
    
    // If user is an officer or admin, we would normally create officer record
    // But since we don't have the police_stations:listStations query, we'll skip this part
    if (userData.role === 'officer' || userData.role === 'station_admin') {
      console.log(`Skipping officer record creation for ${userData.firstName} ${userData.lastName} - police_stations:listStations query not available`);
    }
    
    return result;
  } catch (error) {
    console.error(`Error creating Convex user for ${userData.email}:`, error);
    throw error;
  }
}

async function createSampleUsers() {
  console.log('Starting sample user creation...');
  console.log(`Using Clerk Secret Key: ${process.env.CLERK_SECRET_KEY ? '✓ Found' : '✗ Missing'}`);
  console.log(`Using Convex URL: ${process.env.NEXT_PUBLIC_CONVEX_URL ? '✓ Found' : '✗ Missing'}`);
  
  if (!process.env.CLERK_SECRET_KEY || !process.env.NEXT_PUBLIC_CONVEX_URL) {
    console.error('ERROR: Missing required environment variables. Check your .env.local file.');
    process.exit(1);
  }
  
  for (const userData of sampleUsers) {
    try {
      // Create user in Clerk
      const clerkUser = await createUserInClerk(userData);
      
      // Create user in Convex
      await createUserInConvex(clerkUser, userData);
      
      console.log(`Successfully created ${userData.role} user: ${userData.firstName} ${userData.lastName}\n`);
    } catch (error) {
      console.error(`Failed to create user ${userData.email}:`, error);
    }
  }
  
  console.log('Sample user creation complete!');
}

// Run the script
createSampleUsers().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});
