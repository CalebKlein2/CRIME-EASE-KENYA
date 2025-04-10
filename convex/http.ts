// convex/http.ts
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";

const http = httpRouter();

// Clerk webhook handler
http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async ({ runMutation, runQuery, storage }, request) => {
    const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    
    if (!CLERK_WEBHOOK_SECRET) {
      return new Response("Missing webhook secret", { status: 500 });
    }
    
    // Get the headers
    const svix_id = request.headers.get("svix-id");
    const svix_timestamp = request.headers.get("svix-timestamp");
    const svix_signature = request.headers.get("svix-signature");
    
    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Missing svix headers", { status: 400 });
    }
    
    // Get the body
    const body = await request.text();
    
    // Create a new Svix instance with your secret
    const wh = new Webhook(CLERK_WEBHOOK_SECRET);
    
    let evt: any;
    
    // Verify the payload with the headers
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error verifying webhook", { status: 400 });
    }
    
    // Get the event type and data
    const { type, data } = evt;
    
    // Process the event
    try {
      if (type === "user.created" || type === "user.updated") {
        // Extract user data
        const { id, email_addresses, first_name, last_name, image_url, phone_numbers } = data;
        
        // Get primary email
        const primaryEmail = email_addresses.find((email: any) => email.id === data.primary_email_address_id);
        const email = primaryEmail ? primaryEmail.email_address : email_addresses[0]?.email_address;
        
        if (!email) {
          return new Response("User has no email address", { status: 400 });
        }
        
        // Get phone number if available
        const primaryPhone = phone_numbers && phone_numbers.length > 0 
          ? phone_numbers[0].phone_number 
          : undefined;
        
        // Create or update user in Convex
        await runMutation(api.users.createFromClerk, { 
          clerkId: id,
          email,
          fullName: `${first_name || ''} ${last_name || ''}`.trim(),
          profileImage: image_url,
          phoneNumber: primaryPhone,
        });
        
        console.log(`User ${id} created/updated in Convex`);
      } else if (type === "user.deleted") {
        // Remove user from Convex
        await runMutation(api.users.removeByClerkId, { 
          clerkId: data.id 
        });
        
        console.log(`User ${data.id} marked as deleted in Convex`);
      }
      
      return new Response("Webhook processed", { status: 200 });
    } catch (error) {
      console.error("Error processing webhook:", error);
      return new Response(`Webhook error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
    }
  }),
});

export default http;
