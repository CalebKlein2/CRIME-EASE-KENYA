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
          navigate("/citizen-dashboard", { replace: true });
          break;
        case "officer":
          console.log(`[DashboardRedirect] Redirecting to officer dashboard`);
          navigate("/officer-dashboard", { replace: true });
          break;
        case "station_admin":
          console.log(`[DashboardRedirect] Redirecting to station dashboard`);
          navigate("/station-dashboard", { replace: true });
          break;
        case "national_admin":
          console.log(`[DashboardRedirect] Redirecting to national dashboard`);
          navigate("/national-dashboard", { replace: true });
          break;
        default:
          console.log(`[DashboardRedirect] Unknown role: ${role}, defaulting to citizen dashboard`);
          // Fallback to citizen dashboard
          navigate("/citizen-dashboard", { replace: true });
      }
    };

    const attemptRedirect = async () => {
      console.log(`[DashboardRedirect] Attempting redirection. Already attempted: ${redirectAttempted}, isLoading: ${isLoading}`);
      // Don't redirect if we've already attempted this once or we're loading
      if (redirectAttempted || isLoading) {
        console.log(`[DashboardRedirect] Skipping redirection - already attempted or still loading`);
        return;
      }

      setRedirectAttempted(true);
      
      // If a preferred role was directly passed as a prop, use that
      if (preferredRole) {
        console.log(`[DashboardRedirect] Using preferred role from props: ${preferredRole}`);
        handleRoleBasedRedirect(preferredRole);
        return;
      }
      
      // Check if a preferred role is specified in the URL
      const params = new URLSearchParams(location.search);
      const roleParam = params.get("role");
      
      if (roleParam) {
        console.log(`[DashboardRedirect] Found role parameter in URL: ${roleParam}`);
        
        // If user is not loaded or not signed in, we'll first attempt to set the role
        if (!isSignedIn && roleParam) {
          try {
            console.log(`[DashboardRedirect] Attempting to set user role to: ${roleParam}`);
            await setUserRole(roleParam as any);
            await refreshUser();
          } catch (error) {
            console.error("[DashboardRedirect] Error setting role:", error);
          }
        }
        
        // Then redirect to the appropriate dashboard for this role
        handleRoleBasedRedirect(roleParam);
        return;
      }
      
      // Otherwise use the current user's role if available
      if (user && user.role) {
        console.log(`[DashboardRedirect] Using existing user role: ${user.role}`);
        handleRoleBasedRedirect(user.role);
        return;
      }
      
      // If we got here and the user isn't loaded, wait for a delay and try again
      if (!user && redirectDelay < 3) {
        const newDelay = redirectDelay + 1;
        console.log(`[DashboardRedirect] User not loaded, setting delay to ${newDelay}`);
        setRedirectDelay(newDelay);
        setRedirectAttempted(false);
        setTimeout(attemptRedirect, 1000); // Try again in 1 second
      } else {
        // If we still can't determine a role, redirect to login
        console.log(`[DashboardRedirect] Unable to determine user role, redirecting to login`);
        navigate("/login", { replace: true });
      }
    };

    attemptRedirect();
  }, [navigate, location, user, isLoading, preferredRole, redirectAttempted, redirectDelay, setUserRole, refreshUser, isSignedIn]);

  // Show loading spinner while determining where to redirect
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-700"></div>
      <p className="ml-4 text-lg">Redirecting to your dashboard...</p>
    </div>
  );
}
