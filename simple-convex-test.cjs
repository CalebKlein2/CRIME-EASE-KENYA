// simple-convex-test.cjs
// Basic test script to verify Convex connection
const { ConvexHttpClient } = require("convex/browser");
require("dotenv").config();

async function main() {
  try {
    // Get the Convex URL from environment variables
    const convexUrl = process.env.VITE_CONVEX_URL || "https://notable-alpaca-532.convex.cloud";
    console.log(`Connecting to Convex at: ${convexUrl}`);
    
    // Create a Convex client
    const client = new ConvexHttpClient(convexUrl);
    
    // Test connection by getting available tables
    console.log("Checking available tables...");
    
    try {
      // Simple test query to list tables
      const result = await client.query({ path: "_system/listTables" });
      console.log("✅ Connection successful!");
      console.log("Available tables:", result);
      return true;
    } catch (error) {
      console.log("❌ Query failed:", error.message);
      return false;
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    return false;
  }
}

// Run the test
main().then(success => {
  if (success) {
    console.log("\n✅ Convex connection test passed successfully!");
  } else {
    console.log("\n❌ Convex connection test failed. Please check your configuration.");
  }
});
