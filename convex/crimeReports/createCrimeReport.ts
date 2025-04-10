import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

// A query to get all crime reports
export const getAllReports = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("crimeReports").collect();
  },
});

// Simplified version that accepts any input
export const createCrimeReport = mutation({
  args: v.any(),
  handler: async (ctx, args) => {
    console.log("Received crime report data:", args);
    
    try {
      // Create a report with all the required fields
      const reportData = {
        description: args.description,
        incidentType: args.incidentType,
        date: args.date,
        city: args.city,
        postalCode: args.postalCode,
        name: args.name,
        contact: args.contact,
        isAnonymous: args.isAnonymous,
        userId: args.userId,
        createdAt: Date.now(),
        location: args.location
      };
      
      // Insert the data
      const reportId = await ctx.db.insert("crimeReports", reportData);
      console.log("Report saved successfully with ID:", reportId);
      return reportId;
    } catch (error) {
      console.error("Error creating report:", error);
      throw error;
    }
  },
});
