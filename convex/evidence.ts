// convex/evidence.ts
import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { ConvexError } from "convex/values";

// Upload evidence
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Add evidence to a case
export const addEvidence = mutation({
  args: {
    caseId: v.id("cases"),
    title: v.string(),
    description: v.optional(v.string()),
    type: v.string(),
    storageId: v.string(),
    fileName: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Verify case exists
    const caseData = await ctx.db.get(args.caseId);
    if (!caseData) {
      throw new ConvexError("Case not found");
    }
    
    // Add evidence record
    const evidenceId = await ctx.db.insert("evidence", {
      case_id: args.caseId,
      title: args.title,
      description: args.description,
      type: args.type,
      storage_id: args.storageId,
      file_name: args.fileName,
      file_type: args.fileType,
      file_size: args.fileSize,
      submitted_by: args.userId,
      submitted_at: Date.now(),
      is_verified: false,
    });
    
    // Add case update
    await ctx.db.insert("case_updates", {
      case_id: args.caseId,
      update_text: `New evidence added: ${args.title}`,
      update_type: "evidence_added",
      visibility: "public",
      created_by: args.userId,
      created_at: Date.now(),
    });
    
    // Update the case's updated_at timestamp
    await ctx.db.patch(args.caseId, {
      updated_at: Date.now(),
    });
    
    // Notify officers assigned to the case
    if (caseData.assigned_officer_id) {
      const officer = await ctx.db.get(caseData.assigned_officer_id);
      if (officer) {
        await ctx.db.insert("notifications", {
          user_id: officer.user_id,
          title: "New Evidence Added",
          content: `New evidence has been added to case #${caseData.ob_number}`,
          type: "evidence_added",
          related_case_id: args.caseId,
          is_read: false,
          created_at: Date.now(),
        });
      }
    }
    
    return { evidenceId };
  },
});

// Get evidence for a case
export const getCaseEvidence = query({
  args: { caseId: v.id("cases") },
  handler: async (ctx, { caseId }) => {
    const evidence = await ctx.db
      .query("evidence")
      .withIndex("by_case", (q) => q.eq("case_id", caseId))
      .collect();
    
    // Enrich with submitter info
    const enrichedEvidence = await Promise.all(
      evidence.map(async (item) => {
        const user = await ctx.db.get(item.submitted_by);
        let verifier = null;
        
        if (item.verified_by) {
          const officer = await ctx.db.get(item.verified_by);
          if (officer) {
            const officerUser = await ctx.db.get(officer.user_id);
            verifier = {
              id: officer._id,
              name: officerUser?.full_name || "Unknown",
              badge: officer.badge_number,
            };
          }
        }
        
        // Generate URL for evidence
        const url = await ctx.storage.getUrl(item.storage_id);
        
        return {
          ...item,
          submitter: user ? {
            id: user._id,
            name: user.full_name,
            role: user.role,
          } : { name: "Unknown", role: "unknown" },
          verifier,
          download_url: url,
        };
      })
    );
    
    return enrichedEvidence;
  },
});

// Verify evidence
export const verifyEvidence = mutation({
  args: {
    evidenceId: v.id("evidence"),
    officerId: v.id("police_officers"),
  },
  handler: async (ctx, { evidenceId, officerId }) => {
    const evidence = await ctx.db.get(evidenceId);
    if (!evidence) {
      throw new ConvexError("Evidence not found");
    }
    
    await ctx.db.patch(evidenceId, {
      is_verified: true,
      verified_by: officerId,
      verified_at: Date.now(),
    });
    
    // Add case update
    const officer = await ctx.db.get(officerId);
    if (officer) {
      const user = await ctx.db.get(officer.user_id);
      
      await ctx.db.insert("case_updates", {
        case_id: evidence.case_id,
        update_text: `Evidence "${evidence.title}" verified by ${user?.full_name || "an officer"}`,
        update_type: "evidence_added",
        visibility: "internal", // Only visible to officers
        created_by: user?._id || ("system" as any),
        created_at: Date.now(),
      });
    }
    
    return { success: true };
  },
});

// Delete evidence
export const deleteEvidence = mutation({
  args: {
    evidenceId: v.id("evidence"),
    userId: v.id("users"),
  },
  handler: async (ctx, { evidenceId, userId }) => {
    const evidence = await ctx.db.get(evidenceId);
    if (!evidence) {
      throw new ConvexError("Evidence not found");
    }
    
    // Get user to check role
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new ConvexError("User not found");
    }
    
    // Only officers, station admins, or the original submitter can delete evidence
    if (user.role === "citizen" && evidence.submitted_by.toString() !== userId.toString()) {
      throw new ConvexError("Unauthorized to delete this evidence");
    }
    
    // Delete from storage
    await ctx.storage.delete(evidence.storage_id);
    
    // Delete the evidence record
    await ctx.db.delete(evidenceId);
    
    // Add case update (internal only)
    await ctx.db.insert("case_updates", {
      case_id: evidence.case_id,
      update_text: `Evidence "${evidence.title}" was deleted by ${user.full_name}`,
      update_type: "evidence_added",
      visibility: "internal",
      created_by: userId,
      created_at: Date.now(),
    });
    
    return { success: true };
  },
});