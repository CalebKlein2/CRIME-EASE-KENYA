// convex/interviews.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";

// Schedule an interview
export const scheduleInterview = mutation({
  args: {
    caseId: v.id("cases"),
    officerId: v.id("police_officers"),
    citizenId: v.optional(v.id("users")),
    scheduledTime: v.number(),
    durationMinutes: v.number(),
    meetingPlatform: v.string(),
    meetingLink: v.string(),
    meetingId: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Verify case exists
    const caseData = await ctx.db.get(args.caseId);
    if (!caseData) {
      throw new ConvexError("Case not found");
    }
    
    // Verify officer exists
    const officer = await ctx.db.get(args.officerId);
    if (!officer) {
      throw new ConvexError("Officer not found");
    }
    
    // Create interview record
    const interviewId = await ctx.db.insert("interviews", {
      case_id: args.caseId,
      officer_id: args.officerId,
      citizen_id: args.citizenId,
      scheduled_time: args.scheduledTime,
      duration_minutes: args.durationMinutes,
      meeting_platform: args.meetingPlatform,
      meeting_link: args.meetingLink,
      meeting_id: args.meetingId,
      status: "scheduled",
      notes: args.notes,
      created_at: Date.now(),
      updated_at: Date.now(),
    });
    
    // Add case update
    const officerUser = await ctx.db.get(officer.user_id);
    const scheduledDate = new Date(args.scheduledTime);
    
    await ctx.db.insert("case_updates", {
      case_id: args.caseId,
      update_text: `Interview scheduled with ${officerUser?.full_name || "an officer"} on ${scheduledDate.toLocaleDateString()} at ${scheduledDate.toLocaleTimeString()}`,
      update_type: "note",
      visibility: "public",
      created_by: officer.user_id,
      created_at: Date.now(),
    });
    
    // Send notification to citizen if not anonymous
    if (args.citizenId) {
      await ctx.db.insert("notifications", {
        user_id: args.citizenId,
        title: "Interview Scheduled",
        content: `An interview has been scheduled for your case #${caseData.ob_number} on ${scheduledDate.toLocaleDateString()} at ${scheduledDate.toLocaleTimeString()}`,
        type: "interview",
        related_case_id: args.caseId,
        is_read: false,
        created_at: Date.now(),
      });
    }
    
    return { interviewId };
  },
});

// Get officer's scheduled interviews
export const getOfficerInterviews = query({
  args: { 
    officerId: v.id("police_officers"),
    status: v.optional(v.string()),
  },
  handler: async (ctx, { officerId, status }) => {
    let interviewsQuery = ctx.db
      .query("interviews")
      .withIndex("by_officer", (q) => q.eq("officer_id", officerId));
    
    if (status) {
      interviewsQuery = interviewsQuery.filter((q) => q.eq(q.field("status"), status));
    }
    
    const interviews = await interviewsQuery.collect();
    
    // Enrich with case and citizen info
    const enrichedInterviews = await Promise.all(
      interviews.map(async (interview) => {
        const caseData = await ctx.db.get(interview.case_id);
        let citizen = null;
        
        if (interview.citizen_id) {
          const user = await ctx.db.get(interview.citizen_id);
          if (user) {
            citizen = {
              id: user._id,
              name: user.full_name,
              email: user.email,
              phone: user.phone_number,
            };
          }
        }
        
        return {
          ...interview,
          case: caseData ? {
            id: caseData._id,
            ob_number: caseData.ob_number,
            title: caseData.title,
          } : null,
          citizen,
        };
      })
    );
    
    return enrichedInterviews;
  },
});

// Update interview status
export const updateInterviewStatus = mutation({
  args: {
    interviewId: v.id("interviews"),
    status: v.string(),
    recordingPath: v.optional(v.string()),
    transcriptPath: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { interviewId, status, recordingPath, transcriptPath, notes }) => {
    const interview = await ctx.db.get(interviewId);
    if (!interview) {
      throw new ConvexError("Interview not found");
    }
    
    // Verify status is valid
    if (!["scheduled", "completed", "cancelled", "no_show"].includes(status)) {
      throw new ConvexError("Invalid status");
    }
    
    // Update interview
    const updates: any = {
      status,
      updated_at: Date.now(),
    };
    
    if (recordingPath) updates.recording_path = recordingPath;
    if (transcriptPath) updates.transcript_path = transcriptPath;
    if (notes) updates.notes = notes;
    
    await ctx.db.patch(interviewId, updates);
    
    // Add case update
    const statusMessages = {
      completed: "Interview has been completed",
      cancelled: "Interview has been cancelled",
      no_show: "Interviewee did not show up for the scheduled interview",
    };
    
    if (status !== "scheduled") {
      await ctx.db.insert("case_updates", {
        case_id: interview.case_id,
        update_text: statusMessages[status as keyof typeof statusMessages] || `Interview status updated to ${status}`,
        update_type: "note",
        visibility: "public",
        created_by: ("system" as any), // System-generated update
        created_at: Date.now(),
      });
    }
    
    return { success: true };
  },
});