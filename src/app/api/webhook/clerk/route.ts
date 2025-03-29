// app/api/webhook/clerk/route.ts
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { ConvexHttpClient } from "convex/browser";
import { Webhook } from "svix";
import { api } from "../../.././../convex/_generated/api";

// Initialize the Convex HTTP client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Webhook secret key from environment variables
const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(req: Request) {
  console.log(`[WEBHOOK] Received webhook request at ${new Date().toISOString()}`);
  
  // Verify the webhook signature
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature || !webhookSecret) {
    console.error("[WEBHOOK] Missing svix headers or webhook secret", {
      has_svix_id: !!svix_id,
      has_svix_timestamp: !!svix_timestamp,
      has_svix_signature: !!svix_signature,
      has_webhook_secret: !!webhookSecret
    });
    return new Response("Missing svix headers or webhook secret", { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);
  console.log(`[WEBHOOK] Processing webhook body of length: ${body.length}`);

  // Create a new Svix instance with the webhook secret
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    console.log("[WEBHOOK] Attempting to verify webhook signature");
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
    console.log("[WEBHOOK] Webhook signature verified successfully");
  } catch (err) {
    console.error("[WEBHOOK] Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }

  // Get the event type and data
  const { type, data } = evt;
  console.log(`[WEBHOOK] Processing webhook event type: ${type}`);

  try {
    // Handle different webhook events
    if (type === "user.created" || type === "user.updated") {
      console.log(`[WEBHOOK] Processing ${type} event for user ${data.id}`);
      
      // Extract user data
      const { id, email_addresses, first_name, last_name, image_url, phone_numbers, public_metadata, private_metadata } = data;
      
      // Get primary email
      const primaryEmail = email_addresses.find((email: any) => email.id === data.primary_email_address_id);
      const email = primaryEmail ? primaryEmail.email_address : email_addresses[0]?.email_address;
      
      if (!email) {
        console.error("[WEBHOOK] User has no email address");
        return new Response("User has no email address", { status: 400 });
      }
      
      // Get phone number if available
      const primaryPhone = phone_numbers && phone_numbers.length > 0 
        ? phone_numbers[0].phone_number 
        : undefined;
      
      // Check if there's a role in the metadata
      const userRole = public_metadata?.role || private_metadata?.role;
      console.log(`[WEBHOOK] User role from metadata: ${userRole || 'none'}`);
      
      // Log the data being sent to Convex
      console.log(`[WEBHOOK] Sending user data to Convex:`, {
        clerkId: id,
        email,
        fullName: `${first_name || ''} ${last_name || ''}`.trim(),
        hasProfileImage: !!image_url,
        hasPhoneNumber: !!primaryPhone,
        role: userRole || 'citizen (default)'
      });
      
      // Create or update user in Convex
      console.time("[WEBHOOK] Convex mutation time");
      try {
        const result = await convex.mutation(api.users.createFromClerk, { 
          clerkId: id,
          email,
          fullName: `${first_name || ''} ${last_name || ''}`.trim(),
          profileImage: image_url,
          phoneNumber: primaryPhone,
          role: userRole, // Include role if available from metadata
        });
        
        console.timeEnd("[WEBHOOK] Convex mutation time");
        console.log(`[WEBHOOK] User ${id} ${result.created ? 'created' : 'updated'} in Convex with role: ${userRole || 'default'}`);
        console.log(`[WEBHOOK] User ID in Convex: ${result.userId}`);
        
        // If this is a user.updated event and there's a role change, update the role separately
        if (type === "user.updated" && userRole) {
          console.log(`[WEBHOOK] Updating user role to ${userRole}`);
          await convex.mutation(api.users.updateUserRole, {
            userId: result.userId,
            role: userRole
          });
          console.log(`[WEBHOOK] User role updated to ${userRole}`);
        }
      } catch (error) {
        console.error("[WEBHOOK] Error during Convex mutation:", error);
        throw error;
      }
    } else if (type === "user.deleted") {
      console.log(`[WEBHOOK] Processing user.deleted event for user ${data.id}`);
      // Remove user from Convex
      await convex.mutation(api.users.removeByClerkId, { 
        clerkId: data.id 
      });
      
      console.log(`[WEBHOOK] User ${data.id} marked as deleted in Convex`);
    } else if (type === "session.created") {
      // Handle session creation, checking for URL parameters that might indicate role selection
      console.log(`[WEBHOOK] New session created for user ${data.user_id}`);
      
      // If the session has URL parameters and a role is specified, update the user's role
      if (data.last_active_url && data.user_id) {
        try {
          const url = new URL(data.last_active_url);
          const role = url.searchParams.get("role");
          
          console.log(`[WEBHOOK] Session URL params: ${url.search}, role from URL: ${role || 'none'}`);
          
          if (role && ["citizen", "officer", "station_admin", "national_admin"].includes(role)) {
            console.log(`[WEBHOOK] Valid role found in URL: ${role}, retrieving user from Convex`);
            // Get the user from Convex first to ensure they exist
            const user = await convex.query(api.users.getByClerkId, { clerkId: data.user_id });
            
            if (user) {
              console.log(`[WEBHOOK] Found user in Convex with ID: ${user.id}, current role: ${user.role}`);
              // Update the user's role in Convex
              await convex.mutation(api.users.updateUserRole, {
                userId: user.id,
                role
              });
              
              // Update the role in Clerk's metadata for future reference
              // This requires an API call to Clerk, which would need to be handled elsewhere
              console.log(`[WEBHOOK] Updated user ${data.user_id} role to ${role} based on session URL`);
            } else {
              console.log(`[WEBHOOK] User not found in Convex database: ${data.user_id}`);
            }
          } else {
            console.log(`[WEBHOOK] No valid role found in URL parameters`);
          }
        } catch (e) {
          console.error("[WEBHOOK] Error processing URL in session:", e);
        }
      }
    } else if (type === "session.ended") {
      // Handle session end if needed
      console.log(`[WEBHOOK] Session ended for user ${data.user_id}`);
    } else {
      console.log(`[WEBHOOK] Unhandled event type: ${type}`);
    }

    console.log(`[WEBHOOK] Successfully processed webhook event: ${type}`);
    return new Response("Webhook processed", { status: 200 });
  } catch (error) {
    console.error("[WEBHOOK] Error processing webhook:", error);
    return new Response(`Webhook error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}