import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { AuthProvider } from "./contexts/AuthContext";
import AdminDashboard from "./components/admin/AdminDashboard";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/auth/LoginPage";
import SignUpPage from "./components/auth/SignUpPage";
import Home from "./components/home";
import AnonymousReport from "./components/AnonymousReport";
import ReportCrimeForm from "./components/ReportCrimeForm";
import { PoliceStationFinder } from './components/maps/PoliceStationFinder';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/anonymous" element={<AnonymousReport />} />
        
        {/* Auth routes with Clerk */}
        <Route
          path="/login"
          element={
            <SignedOut>
              <LoginPage />
            </SignedOut>
          }
        />
        <Route
          path="/signup"
          element={
            <SignedOut>
              <SignUpPage />
            </SignedOut>
          }
        />

        {/* Protected routes */}
        <Route
          path="/report"
          element={
            <SignedIn>
              <div className="container mx-auto py-8 flex justify-center">
                <ReportCrimeForm />
              </div>
            </SignedIn>
          }
        />
        <Route
          path="/admin/*"
          element={
            <SignedIn>
              <AdminDashboard />
            </SignedIn>
          }
        />
        <Route
          path="/dashboard/*"
          element={
            <SignedIn>
              <Home />
            </SignedIn>
          }
        />
        <Route 
          path="/find-station" 
          element={
            <SignedIn>
              <PoliceStationFinder />
            </SignedIn>
          } 
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
