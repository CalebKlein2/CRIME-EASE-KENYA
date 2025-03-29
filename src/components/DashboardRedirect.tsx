// src/components/DashboardRedirect.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Component that redirects users to their appropriate dashboard based on role
 * Can be overridden by a role parameter in the URL or a passed role prop
 */
export function DashboardRedirect({ preferredRole }: { preferredRole?: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading, isSignedIn, setUserRole, refreshUser } = useAuth();
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  const [redirectDelay, setRedirectDelay] = useState(0);

  useEffect(() => {
    // Function to handle redirection based on role
    const handleRoleBasedRedirect = async (role: string) => {
      console.log(`[DashboardRedirect] Redirecting user to dashboard for role: ${role}`);
      // Now redirect to the appropriate dashboard
      switch (role) {
        case "citizen":
          console.log(`[DashboardRedirect] Redirecting to citizen dashboard`);
          navigate("/citizen/dashboard", { replace: true });
          break;
        case "officer":
          console.log(`[DashboardRedirect] Redirecting to officer dashboard`);
          navigate("/officer/dashboard", { replace: true });
          break;
        case "station_admin":
          console.log(`[DashboardRedirect] Redirecting to station dashboard`);
          navigate("/station-admin/station-dashboard", { replace: true });
          break;
        case "national_admin":
          console.log(`[DashboardRedirect] Redirecting to national dashboard`);
          navigate("/national-admin/national-dashboard", { replace: true });
          break;
        default:
          console.log(`[DashboardRedirect] Unknown role: ${role}, defaulting to citizen dashboard`);
          // Fallback to citizen dashboard
          navigate("/citizen/dashboard", { replace: true });
      }
    };

    const attemptRedirect = async () => {
      console.log(`[DashboardRedirect] Attempting redirection. Already attempted: ${redirectAttempted}, isLoading: ${isLoading}`);
      // Don't redirect if we've already attempted this once or we're loading
      if (redirectAttempted || isLoading) {
        console.log(`[DashboardRedirect] Skipping redirection - already attempted or still loading`);
        return;
      }

      // If not signed in, redirect to sign-in page
      if (!isSignedIn || !user) {
        console.log(`[DashboardRedirect] User not signed in or user data missing, redirecting to sign-in`);
        navigate("/sign-in");
        setRedirectAttempted(true);
        return;
      }

      console.log(`[DashboardRedirect] User authenticated:`, {
        userId: user.id,
        clerkId: user.clerkId,
        currentRole: user.role,
        isFullyLoaded: !!user.role
      });

      // Check for role override in URL query params
      const params = new URLSearchParams(location.search);
      const urlRole = params.get("role");
      console.log(`[DashboardRedirect] Role from URL: ${urlRole || 'none'}`);

      // Determine which role to use (URL param > passed prop > user's current role)
      let targetRole = urlRole || preferredRole || user.role;
      console.log(`[DashboardRedirect] Selected target role: ${targetRole} (URL > prop > user's role)`);

      // Validate the role is one of our accepted roles
      if (!["citizen", "officer", "station_admin", "national_admin"].includes(targetRole)) {
        console.log(`[DashboardRedirect] Invalid role: ${targetRole}, defaulting to citizen`);
        targetRole = "citizen"; // Default to citizen if invalid role
      }

      // If we have a role from URL or prop, and it's different from the user's stored role
      // we need to update it in our database
      if ((urlRole || preferredRole) && targetRole !== user.role) {
        console.log(`[DashboardRedirect] Role change detected. Changing from ${user.role} to ${targetRole}`);
        try {
          console.log(`[DashboardRedirect] Updating user role in database to: ${targetRole}`);
          await setUserRole(targetRole as any);
          
          // Since we're changing roles, refresh user data to get updated permissions
          console.log(`[DashboardRedirect] Refreshing user data after role change`);
          await refreshUser();
          
          // Short delay to ensure database consistency
          console.log(`[DashboardRedirect] Adding small delay to ensure database consistency`);
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Now redirect based on new role
          console.log(`[DashboardRedirect] Redirecting based on new role: ${targetRole}`);
        } catch (error) {
          console.error(`[DashboardRedirect] Error updating role:`, error);
        }
      }

      console.log(`[DashboardRedirect] Final redirection decision - role: ${targetRole}`);
      
      // Final redirect based on role
      handleRoleBasedRedirect(targetRole);
      setRedirectAttempted(true);
    };

    // Add a slight delay to allow for database synchronization if we haven't attempted redirect
    if (!redirectAttempted && !isLoading) {
      console.log(`[DashboardRedirect] Setting timer for redirect attempt with delay: ${redirectDelay}ms`);
      // Increasing delay for subsequent attempts can help with race conditions
      const timer = setTimeout(attemptRedirect, redirectDelay);
      setRedirectDelay(prev => {
        const newDelay = prev + 500;
        console.log(`[DashboardRedirect] Increasing delay for next attempt to: ${newDelay}ms`);
        return newDelay;
      }); // Increase delay for next attempt if needed
      return () => {
        console.log(`[DashboardRedirect] Clearing redirect timer`);
        clearTimeout(timer);
      };
    }
  }, [user, isLoading, isSignedIn, navigate, location.search, preferredRole, setUserRole, redirectAttempted, redirectDelay, refreshUser]);

  // If we've attempted redirect but we're still here, try a refresh
  useEffect(() => {
    if (redirectAttempted && user && isSignedIn && !isLoading) {
      console.log(`[DashboardRedirect] Redirect was attempted but still on redirect page. User data:`, {
        userId: user.id,
        role: user.role,
        isSignedIn: isSignedIn
      });
      // If we've already attempted to redirect but something went wrong, try refreshing user data
      console.log(`[DashboardRedirect] Setting timer to refresh user data and retry redirection`);
      const timer = setTimeout(async () => {
        console.log(`[DashboardRedirect] Refreshing user data for retry`);
        await refreshUser();
        console.log(`[DashboardRedirect] Resetting redirectAttempted to false to try again`);
        setRedirectAttempted(false); // Reset to try redirection again
      }, 1000);
      
      return () => {
        console.log(`[DashboardRedirect] Clearing refresh timer`);
        clearTimeout(timer);
      };
    }
  }, [redirectAttempted, user, isSignedIn, isLoading, refreshUser]);

  // Show a loading state while redirecting
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
      <h2 className="mt-4 text-xl font-medium text-gray-700">Redirecting to your dashboard...</h2>
    </div>
  );
}
