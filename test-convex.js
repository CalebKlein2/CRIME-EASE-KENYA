// test-convex.js
// Run with: node test-convex.js

import { ConvexHttpClient } from "convex/http"; // ✅ use http
import { api } from "./convex/_generated/api"; // ✅ auto-generated API references
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

async function testConvexConnection() {
  const convexUrl = process.env.VITE_CONVEX_URL ||
                    process.env.NEXT_PUBLIC_CONVEX_URL ||
                    process.env.CONVEX_URL ||
                    "https://notable-alpaca-532.convex.cloud";

  console.log(`Connecting to Convex at: ${convexUrl}`);

  const client = new ConvexHttpClient(convexUrl);

  try {
    // Test 1: Insert test data
    console.log("\n--- Test 1: Insert Test Crime Report ---");
    const testData = {
      description: "Test crime report from Windows CLI",
      location: {
        latitude: 1.2345,
        longitude: 6.7890,
        address: "Test address"
      },
      incidentType: "Robbery",
      date: new Date().toISOString().split('T')[0],
      city: "Nairobi",
      postalCode: "00100",
      name: "Test User",
      contact: "test@example.com",
      isAnonymous: true
    };

    console.log("Sending test data to createCrimeReport:", testData);

    const result = await client.mutation(api.crimeReports.createCrimeReport, testData);
    console.log("✅ Response from server:", result);

    // Test 2: Query all reports
    console.log("\n--- Test 2: Query All Crime Reports ---");
    const reports = await client.query(api.crimeReports.getAllReports, {});
    console.log(`Found ${reports ? reports.length : 0} reports`);
    if (reports?.length > 0) {
      console.log("Latest report:", reports[reports.length - 1]);
    }

    console.log("\n✅ All tests completed successfully!");
  } catch (error) {
    console.error("❌ Error testing Convex connection:", error);
    process.exit(1);
  }
}

testConvexConnection();
