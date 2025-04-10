// test-convex.cjs

const { ConvexHttpClient } = require("convex/http"); // ✅ this works in CJS
const { api } = require("./convex/_generated/api");
require("dotenv").config();

(async () => {
  const convexUrl = process.env.CONVEX_URL || "https://your-project.convex.cloud";
  const client = new ConvexHttpClient(convexUrl);

  const testData = {
    description: "CLI test report",
    location: { latitude: 1, longitude: 2, address: "Test" },
    incidentType: "Robbery",
    date: new Date().toISOString().split("T")[0],
    city: "Nairobi",
    postalCode: "00100",
    name: "Test User",
    contact: "test@example.com",
    isAnonymous: false,
  };

  try {
    const result = await client.mutation(api.crimeReports.createCrimeReport, testData);
    console.log("✅ Report created:", result);

    const reports = await client.query(api.crimeReports.getAllReports, {});
    console.log("Found reports:", reports.length);
  } catch (err) {
    console.error("❌ Error:", err);
  }
})();
