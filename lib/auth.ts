// lib/auth.ts
import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: [
    "/",
    "/login",
    "/signup",
    "/forgot-password",
    "/anonymous",
    "/officer-login",
    "/station-admin-login",
    "/national-admin-login",
    "/api/webhook/clerk",
  ],
});
 
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};