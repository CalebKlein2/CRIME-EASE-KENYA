import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Import auth pages
const CitizenLogin = React.lazy(() => import("@/app/(auth)/citizen-login/page"));
const OfficerLogin = React.lazy(() => import("@/app/(auth)/officer-login/page"));
const StationAdminLogin = React.lazy(() => import("@/app/(auth)/station-admin-login/page"));
const NationalAdminLogin = React.lazy(() => import("@/app/(auth)/national-admin-login/page"));
const LoginSelector = React.lazy(() => import("@/app/(auth)/login/page"));
const SignupPage = React.lazy(() => import("@/app/(auth)/signup/page"));

export function AuthRoutes() {
  const { isSignedIn, isLoaded, user } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // If user is signed in, redirect to appropriate dashboard
  if (isSignedIn && user) {
    let redirectPath = "/dashboard";
    
    switch (user.role) {
      case "citizen":
        redirectPath = "/citizen-dashboard";
        break;
      case "officer":
        redirectPath = "/officer/dashboard";
        break;
      case "station_admin":
        redirectPath = "/station-admin/station-dashboard";
        break;
      case "national_admin":
        redirectPath = "/national-admin/national-dashboard";
        break;
    }
    
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginSelector />} />
      <Route path="/citizen-login" element={<CitizenLogin />} />
      <Route path="/officer-login" element={<OfficerLogin />} />
      <Route path="/station-admin-login" element={<StationAdminLogin />} />
      <Route path="/national-admin-login" element={<NationalAdminLogin />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  );
}
