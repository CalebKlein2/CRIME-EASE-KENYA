import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";
import { Id } from "./_generated/dataModel";

// Helper function to generate a unique OB number
function generateOBNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const randomDigits = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");
    return `OB-${year}-${randomDigits}`;
}

// Mutation to create a new case report
export const createCase = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        incident_type: v.string(),
        incident_date: v.number(),
        location: v.string(),
        coordinates: v.object({
            latitude: v.number(),
            longitude: v.number(),
        }),
        is_anonymous: v.boolean(),
        reporter_id: v.optional(v.id("users")),
        station_id: v.id("police_stations"),
    },
    handler: async (ctx, args) => {
        const ob_number = generateOBNumber();
        const caseId = await ctx.db.insert("cases", {
            ob_number,
            title: args.title,
            description: args.description,
            incident_type: args.incident_type,
            incident_date: args.incident_date,
            location: args.location,
            coordinates: args.coordinates,
            station_id: args.station_id,
            status: "open",
            priority: "medium",
            reporter_id: args.reporter_id,
            is_anonymous: args.is_anonymous,
            created_at: Date.now(),
            updated_at: Date.now(),
        });

        await ctx.db.insert("case_updates", {
            case_id: caseId,
            update_text: "Case opened and pending review.",
            update_type: "status_change",
            visibility: "public",
            created_by: args.reporter_id || ("system" as any),
            created_at: Date.now(),
        });

        return { caseId, ob_number };
    },
});

// Query to retrieve case details
export const getCaseDetails = query({
    args: { caseId: v.id("cases") },
    handler: async (ctx, { caseId }) => {
        const caseData = await ctx.db.get(caseId);
        if (!caseData) {
            throw new ConvexError("Case not found");
        }

        const station = await ctx.db.get(caseData.station_id);

        let assignedOfficer = null;
        if (caseData.assigned_officer_id) {
            const officer = await ctx.db.get(
                caseData.assigned_officer_id as Id<"police_officers">
            );
            if (officer) {
                const user = await ctx.db.get(officer.user_id as Id<"users">);
                assignedOfficer = {
                    id: officer._id,
                    badge_number: officer.badge_number,
                    rank: officer.rank,
                    name: user?.full_name || "Unknown",
                };
            }
        }

        let assignedTeam = null;
        if (caseData.assigned_team_id) {
            const team = await ctx.db.get(
                caseData.assigned_team_id as Id<"investigation_teams">
            );
            if (team) {
                assignedTeam = {
                    id: team._id,
                    name: team.name,
                };
            }
        }

        let reporter = null;
        if (!caseData.is_anonymous && caseData.reporter_id) {
            const user = await ctx.db.get(caseData.reporter_id);
            if (user) {
                reporter = {
                    id: user._id,
                    name: user.full_name,
                    email: user.email,
                    phone: user.phone_number,
                };
            }
        }

        return {
            ...caseData,
            station: station
                ? {
                    id: station._id,
                    name: station.name,
                    location: station.location,
                }
                : null,
            assigned_officer: assignedOfficer,
            assigned_team: assignedTeam,
            reporter,
        };
    },
});

// Query to retrieve case updates
export const getCaseUpdates = query({
    args: {
        caseId: v.id("cases"),
        visibility: v.optional(v.string()),
    },
    handler: async (ctx, { caseId, visibility }) => {
        let updatesQuery = ctx.db
            .query("case_updates")
            .withIndex("by_case", (q) => q.eq("case_id", caseId));

        if (visibility) {
            updatesQuery = updatesQuery.filter((q) =>
                q.eq(q.field("visibility"), visibility)
            );
        }

        const updates = await updatesQuery.order("desc").collect();

        const enrichedUpdates = await Promise.all(
            updates.map(async (update) => {
                let creator = { name: "System", role: "system" };

                if (typeof update.created_by === "object") {
                    const user = await ctx.db.get(update.created_by as Id<"users">);
                    if (user) {
                        creator = {
                            name: user.full_name || "Unknown",
                            role: user.role || "unknown",
                        };
                    }
                }

                return { ...update, creator };
            })
        );

        return enrichedUpdates;
    },
});

// Mutation to update case status
export const updateCaseStatus = mutation({
    args: {
        caseId: v.id("cases"),
        status: v.string(),
        note: v.optional(v.string()),
        userId: v.id("users"),
    },
    handler: async (ctx, { caseId, status, note, userId }) => {
        const caseData = await ctx.db.get(caseId);
        if (!caseData) {
            throw new ConvexError("Case not found");
        }

        if (!["open", "in-progress", "closed", "archived"].includes(status)) {
            throw new ConvexError("Invalid status value");
        }

        const updates: any = { status, updated_at: Date.now() };
        if (status === "closed") {
            updates.closed_at = Date.now();
        }

        await ctx.db.patch(caseId, updates);

        await ctx.db.insert("case_updates", {
            case_id: caseId,
            update_text: note || `Case status changed to ${status}`,
            update_type: "status_change",
            visibility: "public",
            created_by: userId,
            created_at: Date.now(),
        });

        return { success: true };
    },
});

// Mutation to assign a case to an officer or team
export const assignCase = mutation({
    args: {
        caseId: v.id("cases"),
        assignType: v.string(),
        assigneeId: v.union(
            v.id("police_officers"),
            v.id("investigation_teams")
        ),
        note: v.optional(v.string()),
        userId: v.id("users"),
    },

    handler: async (ctx, { caseId, assignType, assigneeId, note, userId }) => {
        const caseData = await ctx.db.get(caseId);
        if (!caseData) {
            throw new ConvexError("Case not found");
        }

        if (!["officer", "team"].includes(assignType)) {
            throw new ConvexError("Invalid assignment type");
        }

        // Update the case with assignment
        const updates: any = {
            updated_at: Date.now(),
        };

        if (assignType === "officer") {
            updates.assigned_officer_id = assigneeId;
            updates.assigned_team_id = null;
        } else {
            updates.assigned_team_id = assigneeId;
            updates.assigned_officer_id = null;
        }

        // If case was open, move to in-progress
        if (caseData.status === "open") {
            updates.status = "in-progress";
        }

        await ctx.db.patch(caseId, updates);

        // Get assignee details for the update message
        let assigneeName = "Unknown";
        if (assignType === "officer") {
            const officer = await ctx.db.get(assigneeId as Id<"police_officers">);
            if (officer && 'user_id' in officer) {
                const user = await ctx.db.get(officer.user_id as Id<"users">);
                assigneeName = user && 'full_name' in user ? user.full_name : "Unknown Officer";
            }
        } else {
            const team = await ctx.db.get(assigneeId as Id<"investigation_teams">);
            assigneeName = team && 'name' in team ? team.name : "Unknown Team";
        }

        // Add case update
        await ctx.db.insert("case_updates", {
            case_id: caseId,
            update_text: note || `Case assigned to ${assigneeName}`,
            update_type: "assignment_change",
            visibility: "public",
            created_by: userId,
            created_at: Date.now(),
        });

        // Create notification for assignee
        if (assignType === "officer") {
            const officer = await ctx.db.get(assigneeId as Id<"police_officers">);
            if (officer && 'user_id' in officer) {
                await ctx.db.insert("notifications", {
                    user_id: officer.user_id as Id<"users">,
                    title: "New Case Assignment",
                    content: `You have been assigned to case #${caseData.ob_number}: ${caseData.title}`,
                    type: "assignment",
                    related_case_id: caseId,
                    is_read: false,
                    created_at: Date.now(),
                });
            }
        }

        return { success: true };
    },
});

// Mutation to add a case note/update
export const addCaseUpdate = mutation({
    args: {
        caseId: v.id("cases"),
        updateText: v.string(),
        updateType: v.string(),
        visibility: v.string(),
        userId: v.id("users"),
    },
    handler: async (ctx, { caseId, updateText, updateType, visibility, userId }) => {
        const caseData = await ctx.db.get(caseId);
        if (!caseData) {
            throw new ConvexError("Case not found");
        }

        // Verify update type
        if (!["note", "status_change", "evidence_added", "assignment_change"].includes(updateType)) {
            throw new ConvexError("Invalid update type");
        }

        // Verify visibility
        if (!["public", "internal"].includes(visibility)) {
            throw new ConvexError("Invalid visibility");
        }

        // Add the update
        const updateId = await ctx.db.insert("case_updates", {
            case_id: caseId,
            update_text: updateText,
            update_type: updateType,
            visibility,
            created_by: userId,
            created_at: Date.now(),
        });

        // Update the case's updated_at timestamp
        await ctx.db.patch(caseId, {
            updated_at: Date.now(),
        });

        // If update is public and there's a reporter, create notification
        if (visibility === "public" && !caseData.is_anonymous && caseData.reporter_id) {
            await ctx.db.insert("notifications", {
                user_id: caseData.reporter_id,
                title: "Case Update",
                content: `Your case #${caseData.ob_number} has been updated`,
                type: "case_update",
                related_case_id: caseId,
                is_read: false,
                created_at: Date.now(),
            });
        }

        return { updateId };
    },
});


