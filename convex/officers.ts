// convex/officers.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";

// Login for officers
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    badgeNumber: v.string(),
  },
  handler: async (ctx, { email, password, badgeNumber }) => {
    // In a real implementation, this would verify against a secure password store
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    
    if (!user) {
      throw new ConvexError("Invalid credentials");
    }
    
    // Check if this is an officer
    if (user.role !== "officer" && user.role !== "station_admin" && user.role !== "national_admin") {
      throw new ConvexError("Invalid user type");
    }
    
    // Verify badge number for officers
    if (user.role === "officer") {
      const officer = await ctx.db
        .query("police_officers")
        .withIndex("by_user_id", (q) => q.eq("user_id", user._id))
        .first();
      
      if (!officer || officer.badge_number !== badgeNumber) {
        throw new ConvexError("Invalid badge number");
      }
      
      if (officer.status !== "active") {
        throw new ConvexError("Officer account is not active");
      }
    }
    
    // Generate a session token
    return {
      userId: user._id,
      role: user.role,
      token: "simulated_session_token",
    };
  },
});

// Get officer details
export const getOfficerDetails = query({
  args: { officerId: v.id("police_officers") },
  handler: async (ctx, { officerId }) => {
    const officer = await ctx.db.get(officerId);
    if (!officer) {
      throw new ConvexError("Officer not found");
    }
    
    const user = await ctx.db.get(officer.user_id);
    if (!user) {
      throw new ConvexError("User not found");
    }
    
    const station = await ctx.db.get(officer.station_id);
    
    return {
      id: officer._id,
      badge_number: officer.badge_number,
      rank: officer.rank,
      department: officer.department,
      status: officer.status,
      joined_date: officer.joined_date,
      full_name: user.full_name,
      email: user.email,
      phone_number: user.phone_number,
      station: station ? {
        id: station._id,
        name: station.name,
        location: station.location,
        county: station.county,
      } : null,
    };
  },
});

// Get all officers in a station
export const getStationOfficers = query({
  args: { stationId: v.id("police_stations") },
  handler: async (ctx, { stationId }) => {
    const officers = await ctx.db
      .query("police_officers")
      .withIndex("by_station", (q) => q.eq("station_id", stationId))
      .collect();
    
    const officersWithDetails = await Promise.all(
      officers.map(async (officer) => {
        const user = await ctx.db.get(officer.user_id);
        return {
          id: officer._id,
          badge_number: officer.badge_number,
          rank: officer.rank,
          department: officer.department,
          status: officer.status,
          joined_date: officer.joined_date,
          full_name: user?.full_name || "Unknown",
          email: user?.email || "Unknown",
        };
      })
    );
    
    return officersWithDetails;
  },
});

// Update officer status
export const updateOfficerStatus = mutation({
  args: { 
    officerId: v.id("police_officers"),
    status: v.string(),
  },
  handler: async (ctx, { officerId, status }) => {
    const officer = await ctx.db.get(officerId);
    if (!officer) {
      throw new ConvexError("Officer not found");
    }
    
    // Verify that status is one of the allowed values
    if (!["active", "inactive", "suspended"].includes(status)) {
      throw new ConvexError("Invalid status value");
    }
    
    await ctx.db.patch(officerId, { status });
    
    return { success: true };
  },
});