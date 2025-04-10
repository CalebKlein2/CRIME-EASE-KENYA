// convex/auth.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";

// Login for citizen users
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, { email, password }) => {
    // In a real implementation, this would verify against a secure password store
    // For now, we'll simulate the login process
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    
    if (!user) {
      throw new ConvexError("Invalid credentials");
    }
    
    // In production, use proper password verification
    // Simulating password check for demo purposes
    if (user.role !== "citizen") {
      throw new ConvexError("Invalid user type");
    }
    
    // Generate a session token
    // In production this would be handled by Clerk or another auth provider
    return {
      userId: user._id,
      token: "simulated_session_token",
    };
  },
});

// Register a new citizen user
export const register = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    full_name: v.string(),
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
    
    // In production, hash password before storing
    // Create the user
    const userId = await ctx.db.insert("users", {
      clerk_id: "simulated_clerk_id", // In production, this would come from Clerk
      email: args.email,
      full_name: args.full_name,
      role: "citizen",
      phone_number: args.phone_number,
      created_at: Date.now(),
      updated_at: Date.now(),
    });
    
    return {
      userId,
      success: true,
    };
  },
});

// Get current user information
export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_id", identity.subject))
      .first();
    
    if (!user) {
      return null;
    }
    
    // Check if user is an officer
    let officerDetails = null;
    if (user.role === "officer" || user.role === "station_admin") {
      const officer = await ctx.db
        .query("police_officers")
        .withIndex("by_user_id", (q) => q.eq("user_id", user._id))
        .first();
      
      if (officer) {
        const station = await ctx.db.get(officer.station_id);
        officerDetails = {
          id: officer._id,
          badge_number: officer.badge_number,
          rank: officer.rank,
          department: officer.department,
          status: officer.status,
          station: station ? {
            id: station._id,
            name: station.name,
            location: station.location,
            county: station.county,
          } : null,
        };
      }
    }
    
    return {
      id: user._id,
      clerk_id: user.clerk_id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      profile_image: user.profile_image,
      phone_number: user.phone_number,
      created_at: user.created_at,
      officer: officerDetails,
    };
  },
});

// Update user role
export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.string(),
  },
  handler: async (ctx, { userId, role }) => {
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new ConvexError("User not found");
    }
    
    // Validate role
    if (!["citizen", "officer", "station_admin", "national_admin"].includes(role)) {
      throw new ConvexError("Invalid role");
    }
    
    await ctx.db.patch(userId, {
      role,
      updated_at: Date.now(),
    });
    
    return { success: true };
  },
});

// Check if user has required role
export const hasRole = query({
  args: {
    requiredRoles: v.array(v.string()),
  },
  handler: async (ctx, { requiredRoles }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return false;
    }
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_id", identity.subject))
      .first();
    
    if (!user) {
      return false;
    }
    
    return requiredRoles.includes(user.role);
  },
});