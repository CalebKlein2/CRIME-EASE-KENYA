// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users & Auth
  users: defineTable({
    clerk_id: v.string(),
    email: v.string(),
    full_name: v.string(),
    role: v.string(), // "citizen", "officer", "station_admin", "national_admin"
    phone_number: v.optional(v.string()),
    profile_image: v.optional(v.string()),
    deleted: v.optional(v.boolean()),
    created_at: v.number(),
    updated_at: v.number(),
  }).index("by_clerk_id", ["clerk_id"])
    .index("by_email", ["email"]),

  police_officers: defineTable({
    user_id: v.id("users"),
    badge_number: v.string(),
    rank: v.string(),
    station_id: v.id("police_stations"),
    department: v.optional(v.string()),
    status: v.string(), // "active", "inactive", "suspended"
    joined_date: v.number(),
  }).index("by_user_id", ["user_id"])
    .index("by_station", ["station_id"])
    .index("by_badge_number", ["badge_number"]),

  // Police Stations
  police_stations: defineTable({
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
    created_at: v.number(),
  }).index("by_county", ["county"])
    .index("by_station_code", ["station_code"]),

  // Investigation Teams
  investigation_teams: defineTable({
    name: v.string(),
    station_id: v.id("police_stations"),
    lead_officer_id: v.id("police_officers"),
    specialty: v.optional(v.string()),
    status: v.string(), // "active", "inactive"
    created_at: v.number(),
  }).index("by_station", ["station_id"]),

  team_members: defineTable({
    team_id: v.id("investigation_teams"),
    officer_id: v.id("police_officers"),
    role: v.string(),
    joined_at: v.number(),
  }).index("by_team", ["team_id"])
    .index("by_officer", ["officer_id"]),

  // Cases & Reports
  cases: defineTable({
    ob_number: v.string(),
    title: v.string(),
    description: v.string(),
    incident_type: v.string(),
    incident_date: v.number(),
    location: v.string(),
    coordinates: v.object({
      latitude: v.number(),
      longitude: v.number(),
    }),
    station_id: v.id("police_stations"),
    status: v.string(), // "open", "in-progress", "closed", "archived"
    priority: v.string(), // "low", "medium", "high"
    reporter_id: v.optional(v.id("users")),
    is_anonymous: v.boolean(),
    assigned_officer_id: v.optional(v.id("police_officers")),
    assigned_team_id: v.optional(v.id("investigation_teams")),
    created_at: v.number(),
    updated_at: v.number(),
    closed_at: v.optional(v.number()),
  }).index("by_ob_number", ["ob_number"])
    .index("by_station", ["station_id"])
    .index("by_status", ["status"])
    .index("by_officer", ["assigned_officer_id"])
    .index("by_team", ["assigned_team_id"])
    .index("by_reporter", ["reporter_id"]),

  // Evidence
  evidence: defineTable({
    case_id: v.id("cases"),
    title: v.string(),
    description: v.optional(v.string()),
    type: v.string(), // "photo", "video", "audio", "document", "other"
    storage_id: v.string(), // Convex storage ID
    file_name: v.string(),
    file_type: v.string(),
    file_size: v.number(),
    submitted_by: v.id("users"),
    submitted_at: v.number(),
    is_verified: v.boolean(),
    verified_by: v.optional(v.id("police_officers")),
    verified_at: v.optional(v.number()),
  }).index("by_case", ["case_id"])
    .index("by_submitter", ["submitted_by"])
    .index("by_type", ["type"]),

  // Case Updates
  case_updates: defineTable({
    case_id: v.id("cases"),
    update_text: v.string(),
    update_type: v.string(), // "status_change", "note", "evidence_added", "assignment_change"
    visibility: v.string(), // "internal", "public"
    created_by: v.id("users"),
    created_at: v.number(),
  }).index("by_case", ["case_id"]),

  // Communication
  messages: defineTable({
    case_id: v.id("cases"),
    sender_id: v.id("users"),
    sender_role: v.string(), // "citizen", "officer"
    content: v.string(),
    sent_at: v.number(),
    read: v.boolean(),
    read_at: v.optional(v.number()),
  }).index("by_case", ["case_id"])
    .index("by_sender", ["sender_id"]),

  // Virtual Interviews
  interviews: defineTable({
    case_id: v.id("cases"),
    officer_id: v.id("police_officers"),
    citizen_id: v.optional(v.id("users")),
    scheduled_time: v.number(),
    duration_minutes: v.number(),
    meeting_platform: v.string(), // "zoom", "google_meet"
    meeting_link: v.string(),
    meeting_id: v.string(),
    status: v.string(), // "scheduled", "completed", "cancelled", "no_show"
    recording_path: v.optional(v.string()),
    transcript_path: v.optional(v.string()),
    notes: v.optional(v.string()),
    created_at: v.number(),
    updated_at: v.number(),
  }).index("by_case", ["case_id"])
    .index("by_officer", ["officer_id"])
    .index("by_citizen", ["citizen_id"])
    .index("by_time", ["scheduled_time"]),

  // Notifications
  notifications: defineTable({
    user_id: v.id("users"),
    title: v.string(),
    content: v.string(),
    type: v.string(),
    related_case_id: v.optional(v.id("cases")),
    is_read: v.boolean(),
    created_at: v.number(),
  }).index("by_user", ["user_id"])
    .index("by_read_status", ["is_read"]),

  // Resources and Equipment
  resources: defineTable({
    station_id: v.id("police_stations"),
    resource_type: v.string(), // "vehicle", "equipment", "facility"
    name: v.string(),
    description: v.optional(v.string()),
    status: v.string(), // "available", "in-use", "maintenance", "retired"
    assigned_to: v.optional(v.id("police_officers")),
    acquisition_date: v.optional(v.number()),
    last_maintenance: v.optional(v.number()),
    created_at: v.number(),
    updated_at: v.number(),
  }).index("by_station", ["station_id"])
    .index("by_status", ["status"]),
  
  // System Settings
  system_settings: defineTable({
    key: v.string(),
    value: v.any(),
    description: v.optional(v.string()),
    updated_at: v.number(),
    updated_by: v.id("users"),
  }).index("by_key", ["key"]),
});