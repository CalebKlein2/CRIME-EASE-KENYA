// convex/admin.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";

// Login for station admin
export const loginStationAdmin = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    stationCode: v.string(),
  },
  handler: async (ctx, { email, password, stationCode }) => {
    // In a real implementation, this would verify against a secure password store
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    
    if (!user || user.role !== "station_admin") {
      throw new ConvexError("Invalid credentials");
    }
    
    // Verify station code
    const station = await ctx.db
      .query("police_stations")
      .withIndex("by_station_code", (q) => q.eq("station_code", stationCode))
      .first();
    
    if (!station) {
      throw new ConvexError("Invalid station code");
    }
    
    // Generate a session token
    return {
      userId: user._id,
      stationId: station._id,
      token: "simulated_session_token",
    };
  },
});

// Login for national admin
export const loginNationalAdmin = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    securityCode: v.string(),
  },
  handler: async (ctx, { email, password, securityCode }) => {
    // In a real implementation, this would verify against a secure password store
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    
    if (!user || user.role !== "national_admin") {
      throw new ConvexError("Invalid credentials");
    }
    
    // Verify security code - in production this would use 2FA or similar
    if (securityCode !== "123456") { // Simplified for demo
      throw new ConvexError("Invalid security code");
    }
    
    // Generate a session token
    return {
      userId: user._id,
      token: "simulated_session_token",
    };
  },
});

// Create new officer account
export const createOfficerAccount = mutation({
  args: {
    full_name: v.string(),
    email: v.string(),
    badge_number: v.string(),
    rank: v.string(),
    department: v.optional(v.string()),
    station_id: v.id("police_stations"),
    phone_number: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (existingUser) {
      throw new ConvexError("Email already in use");
    }
    
    // Check if badge number already exists
    const existingOfficer = await ctx.db
      .query("police_officers")
      .withIndex("by_badge_number", (q) => q.eq("badge_number", args.badge_number))
      .first();
    
    if (existingOfficer) {
      throw new ConvexError("Badge number already in use");
    }
    
    // Create user account
    const userId = await ctx.db.insert("users", {
        clerk_id: "simulated_clerk_id", // In production, this would come from Clerk
        email: args.email,
        full_name: args.full_name,
        role: "officer",
        phone_number: args.phone_number,
        created_at: Date.now(),
        updated_at: Date.now(),
      });
      
      // Create officer record
      const officerId = await ctx.db.insert("police_officers", {
        user_id: userId,
        badge_number: args.badge_number,
        rank: args.rank,
        station_id: args.station_id,
        department: args.department,
        status: "active",
        joined_date: Date.now(),
      });
      
      // In production, this would trigger an email to set up password
      
      return {
        userId,
        officerId,
      };
    },
  });
  
  // Get station statistics
  export const getStationStats = query({
    args: { stationId: v.id("police_stations") },
    handler: async (ctx, { stationId }) => {
      // Count officers
      const officers = await ctx.db
        .query("police_officers")
        .withIndex("by_station", (q) => q.eq("station_id", stationId))
        .collect();
      
      const activeOfficers = officers.filter(o => o.status === "active").length;
      
      // Count cases by status
      const allCases = await ctx.db
        .query("cases")
        .withIndex("by_station", (q) => q.eq("station_id", stationId))
        .collect();
      
      const totalCases = allCases.length;
      const openCases = allCases.filter(c => c.status === "open").length;
      const inProgressCases = allCases.filter(c => c.status === "in-progress").length;
      const closedCases = allCases.filter(c => c.status === "closed").length;
      
      // Calculate resolution rate
      const resolvedCases = allCases.filter(c => c.status === "closed").length;
      const resolutionRate = totalCases > 0 
        ? Math.round((resolvedCases / totalCases) * 100)
        : 0;
      
      // Count by priority
      const highPriorityCases = allCases.filter(c => c.priority === "high").length;
      const mediumPriorityCases = allCases.filter(c => c.priority === "medium").length;
      const lowPriorityCases = allCases.filter(c => c.priority === "low").length;
      
      // Get recent cases
      const recentCases = allCases
        .sort((a, b) => b.created_at - a.created_at)
        .slice(0, 5);
      
      return {
        officers: {
          total: officers.length,
          active: activeOfficers,
        },
        cases: {
          total: totalCases,
          open: openCases,
          inProgress: inProgressCases,
          closed: closedCases,
          highPriority: highPriorityCases,
          mediumPriority: mediumPriorityCases,
          lowPriority: lowPriorityCases,
          resolutionRate,
        },
        recentCases,
      };
    },
  });
  
  // Get national statistics
  export const getNationalStats = query({
    handler: async (ctx) => {
      // Count stations
      const stations = await ctx.db
        .query("police_stations")
        .collect();
      
      // Count officers
      const officers = await ctx.db
        .query("police_officers")
        .collect();
      
      const activeOfficers = officers.filter(o => o.status === "active").length;
      
      // Count cases by status
      const allCases = await ctx.db
        .query("cases")
        .collect();
      
      const totalCases = allCases.length;
      const openCases = allCases.filter(c => c.status === "open").length;
      const inProgressCases = allCases.filter(c => c.status === "in-progress").length;
      const closedCases = allCases.filter(c => c.status === "closed").length;
      
      // Calculate resolution rate
      const resolvedCases = allCases.filter(c => c.status === "closed").length;
      const resolutionRate = totalCases > 0 
        ? Math.round((resolvedCases / totalCases) * 100)
        : 0;
      
      // Count by priority
      const highPriorityCases = allCases.filter(c => c.priority === "high").length;
      const mediumPriorityCases = allCases.filter(c => c.priority === "medium").length;
      const lowPriorityCases = allCases.filter(c => c.priority === "low").length;
      
      // Get cases by region
      const casesByRegion: Record<string, number> = {};
      
      for (const caseItem of allCases) {
        const station = await ctx.db.get(caseItem.station_id);
        if (station) {
          const county = station.county;
          if (!casesByRegion[county]) {
            casesByRegion[county] = 0;
          }
          
          casesByRegion[county]++;
        }
      }
      
      // Get recent cases
      const recentCases = allCases
        .sort((a, b) => b.created_at - a.created_at)
        .slice(0, 5);
      
      return {
        stations: {
          total: stations.length,
        },
        officers: {
          total: officers.length,
          active: activeOfficers,
        },
        cases: {
          total: totalCases,
          open: openCases,
          inProgress: inProgressCases,
          closed: closedCases,
          highPriority: highPriorityCases,
          mediumPriority: mediumPriorityCases,
          lowPriority: lowPriorityCases,
          resolutionRate,
          byRegion: casesByRegion,
        },
        recentCases,
      };
    },
  });
  
  // Create new police station
  export const createPoliceStation = mutation({
    args: {
      name: v.string(),
      county: v.string(),
      station_code: v.string(),
      location: v.string(),
      coordinates: v.object({
        latitude: v.number(),
        longitude: v.number(),
      }),
      contact_phone: v.string(),
      contact_email: v.optional(v.string()),
      jurisdiction: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
      // Check if station code already exists
      const existingStation = await ctx.db
        .query("police_stations")
        .withIndex("by_station_code", (q) => q.eq("station_code", args.station_code))
        .first();
      
      if (existingStation) {
        throw new ConvexError("Station code already in use");
      }
      
      // Create station
      const stationId = await ctx.db.insert("police_stations", {
        ...args,
        created_at: Date.now(),
      });
      
      return { stationId };
    },
  });