// convex/users.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";

// Create a user from Clerk webhook
export const createFromClerk = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    fullName: v.string(),
    profileImage: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    console.log(`[CONVEX:createFromClerk] Received request for user ${args.clerkId}`);
    console.log(`[CONVEX:createFromClerk] User data:`, {
      email: args.email,
      fullName: args.fullName,
      hasProfileImage: !!args.profileImage,
      hasPhoneNumber: !!args.phoneNumber,
      role: args.role || 'citizen (default)'
    });
    
    // Check if user already exists
    console.log(`[CONVEX:createFromClerk] Checking if user ${args.clerkId} already exists`);
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_id", args.clerkId))
      .first();
    
    if (existingUser) {
      console.log(`[CONVEX:createFromClerk] User ${args.clerkId} already exists, updating information`);
      // User already exists, update their information
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        full_name: args.fullName,
        profile_image: args.profileImage,
        phone_number: args.phoneNumber,
        updated_at: Date.now(),
      });
      
      console.log(`[CONVEX:createFromClerk] Updated user ${args.clerkId} with new information`);
      return { userId: existingUser._id, created: false };
    }
    
    console.log(`[CONVEX:createFromClerk] User ${args.clerkId} is new, creating record`);
    // Create new user
    try {
      const userId = await ctx.db.insert("users", {
        clerk_id: args.clerkId,
        email: args.email,
        full_name: args.fullName,
        role: args.role || "citizen", // Use provided role or default to citizen
        profile_image: args.profileImage,
        phone_number: args.phoneNumber,
        created_at: Date.now(),
        updated_at: Date.now(),
      });
      
      console.log(`[CONVEX:createFromClerk] Successfully created new user ${args.clerkId} with ID: ${userId}`);
      console.log(`[CONVEX:createFromClerk] Assigned role: ${args.role || "citizen"}`);
      return { userId, created: true };
    } catch (error) {
      console.error(`[CONVEX:createFromClerk] Error creating user ${args.clerkId}:`, error);
      throw error;
    }
  },
});

// Remove user by Clerk ID
export const removeByClerkId = mutation({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, { clerkId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_id", clerkId))
      .first();
    
    if (!user) {
      throw new ConvexError("User not found");
    }
    
    // Check if user is an officer
    if (user.role === "officer" || user.role === "station_admin" || user.role === "national_admin") {
      // Find officer record
      const officer = await ctx.db
        .query("police_officers")
        .withIndex("by_user_id", (q) => q.eq("user_id", user._id))
        .first();
      
      if (officer) {
        // Mark officer as inactive instead of deleting
        await ctx.db.patch(officer._id, {
          status: "inactive",
        });
      }
    }
    
    // For citizen users, we can delete or mark as inactive
    // For this implementation, we'll mark them as deleted by adding a deleted flag
    await ctx.db.patch(user._id, {
      deleted: true,
      updated_at: Date.now(),
    });
    
    return { success: true };
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    userId: v.id("users"),
    fullName: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    profileImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new ConvexError("User not found");
    }
    
    const updates: any = {
      updated_at: Date.now(),
    };
    
    if (args.fullName) updates.full_name = args.fullName;
    if (args.phoneNumber) updates.phone_number = args.phoneNumber;
    if (args.profileImage) updates.profile_image = args.profileImage;
    
    await ctx.db.patch(args.userId, updates);
    
    return { success: true };
  },
});

// Get user by Clerk ID
export const getByClerkId = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, { clerkId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_id", clerkId))
      .first();
    
    if (!user) {
      return null;
    }
    
    // If user is an officer, get officer details
    let officerDetails = null;
    if (user.role === "officer") {
      const officer = await ctx.db
        .query("police_officers")
        .withIndex("by_user_id", (q) => q.eq("user_id", user._id))
        .first();
      
      if (officer) {
        const station = await ctx.db.get(officer.station_id);
        
        if (officer) {
          officerDetails = {
            badge_number: officer.badge_number,
            rank: officer.rank,
            department: officer.department,
            status: officer.status,
            station: station ? {
              name: station.name,
              location: station.location,
            } : null,
          };
        }
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

// Get user notifications
export const getUserNotifications = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
    includeRead: v.optional(v.boolean()),
  },
  handler: async (ctx, { userId, limit = 10, includeRead = false }) => {
    let notificationsQuery = ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("user_id", userId));
    
    if (!includeRead) {
      notificationsQuery = notificationsQuery.filter((q) => q.eq(q.field("is_read"), false));
    }
    
    const notifications = await notificationsQuery
      .order("desc")
      .take(limit);
    
    return notifications;
  },
});

// Mark notification as read
export const markNotificationRead = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, { notificationId }) => {
    const notification = await ctx.db.get(notificationId);
    if (!notification) {
      throw new ConvexError("Notification not found");
    }
    
    await ctx.db.patch(notificationId, {
      is_read: true,
    });
    
    return { success: true };
  },
});

// Update user role - new function for role-based access control
export const updateUserRole = mutation({
  args: {
    userId: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    // Find user by clerk ID first (to support both internal IDs and clerk IDs)
    let user;
    
    if (args.userId.startsWith("user_")) { // Clerk ID format
      user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerk_id", args.userId))
        .first();
    } else { // Try as internal ID
      throw new ConvexError("Only Clerk IDs are supported for now");
    }
    
    if (!user) {
      throw new ConvexError("User not found");
    }
    
    // Validate role
    const validRoles = ["citizen", "officer", "station_admin", "national_admin"];
    if (!validRoles.includes(args.role)) {
      throw new ConvexError("Invalid role");
    }
    
    // Update user role
    await ctx.db.patch(user._id, {
      role: args.role,
      updated_at: Date.now(),
    });
    
    return { 
      success: true,
      userId: user._id,
      role: args.role
    };
  },
});
