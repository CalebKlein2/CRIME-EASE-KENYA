import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, useAuth as useClerkAuth } from "@clerk/clerk-react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Suspense, lazy, useEffect, useState } from "react";
import AdminDashboard from "./components/admin/AdminDashboard";
import LandingPage from "./components/LandingPage";
import Home from "./components/home";
import AnonymousReport from "./components/AnonymousReport";
import ReportCrimeForm from "./components/ReportCrimeForm";
import StandaloneReportPage from "./components/StandaloneReportPage";
import { PoliceStationFinder } from './components/maps/PoliceStationFinder';
import { AuthRoutes } from "./routes/auth-routes";
import { Toaster } from "./components/ui/toaster";

// Import role-specific dashboard pages
const CitizenDashboard = lazy(() => import("./app/citizen/dashboard/page"));
const OfficerDashboard = lazy(() => import("./app/officer/dashboard/page"));
const StationAdminDashboard = lazy(() => import("./app/station-admin/dashboard/page"));
const NationalAdminDashboard = lazy(() => import("./app/national-admin/national-dashboard/page"));

// Import authentication pages
const SignUpPage = lazy(() => import("./app/sign-up/[[...sign-up]]/page"));
const SignInPage = lazy(() => import("./app/sign-in/[[...sign-in]]/page"));

// Loading fallback component
const LoadingFallback = () => <div className="flex items-center justify-center h-screen">Loading...</div>;

// Role-based redirect component
const DashboardRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (isRedirecting) return; // Prevent infinite redirects
    
    if (user) {
      setIsRedirecting(true);
      
      // Check if a preferred role is specified in the URL
      const searchParams = new URLSearchParams(location.search);
      const preferredRole = searchParams.get('role');
      
      // If user has a preferred role specified in the URL and it matches their role
      if (preferredRole && user.role === preferredRole) {
        redirectToRoleDashboard(preferredRole);
      } else {
        // Otherwise use the default user role
        redirectToRoleDashboard(user.role);
      }
    } else {
      navigate("/sign-in");
    }
  }, [user, navigate, location]);

  const redirectToRoleDashboard = (role) => {
    switch (role) {
      case "citizen":
        navigate("/citizen-dashboard");
        break;
      case "officer":
        navigate("/officer-dashboard");
        break;
      case "station_admin":
        navigate("/station-dashboard");
        break;
      case "national_admin":
        navigate("/national-dashboard");
        break;
      default:
        navigate("/");
    }
    setIsRedirecting(false);
  };

  return <LoadingFallback />;
};

export default function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/anonymous" element={<AnonymousReport />} />
          <Route path="/find-station" element={<PoliceStationFinder />} />
          
          {/* New Authentication Routes */}
          <Route path="/sign-up/*" element={<SignUpPage />} />
          <Route path="/sign-in/*" element={<SignInPage />} />
          
          {/* Legacy Auth routes - for backward compatibility */}
          <Route path="/login/*" element={<Navigate to="/sign-in" replace />} />
          <Route path="/citizen-login" element={<Navigate to="/sign-in?role=citizen" replace />} />
          <Route path="/officer-login" element={<Navigate to="/sign-in?role=officer" replace />} />
          <Route path="/station-admin-login" element={<Navigate to="/sign-in?role=station_admin" replace />} />
          <Route path="/national-admin-login" element={<Navigate to="/sign-in?role=national_admin" replace />} />
          <Route path="/signup" element={<Navigate to="/sign-up" replace />} />

          {/* Dashboard redirect based on role */}
          <Route 
            path="/dashboard" 
            element={
              <SignedIn>
                <DashboardRedirect />
              </SignedIn>
            } 
          />

          {/* Protected routes */}
          <Route
            path="/report"
            element={
              <StandaloneReportPage />
            }
          />
          
          {/* Role-specific dashboards */}
          <Route
            path="/citizen-dashboard/*"
            element={
              <SignedIn>
                <CitizenDashboard />
              </SignedIn>
            }
          />
          
          <Route
            path="/officer-dashboard/*"
            element={
              <SignedIn>
                <OfficerDashboard />
              </SignedIn>
            }
          />
          
          <Route
            path="/station-dashboard/*"
            element={
              <SignedIn>
                <StationAdminDashboard />
              </SignedIn>
            }
          />
          
          <Route
            path="/national-dashboard/*"
            element={
              <SignedIn>
                <NationalAdminDashboard />
              </SignedIn>
            }
          />
          
          {/* Catch all - 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Toaster />
      </Suspense>
    </AuthProvider>
  );
}
