import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import LoginPage from "./components/auth/LoginPage";
import SignUpPage from "./components/auth/SignUpPage";
import LandingPage from "./components/LandingPage";
import AnonymousReport from "./components/AnonymousReport";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import routes from "tempo-routes";
import Navbar from "./components/Navbar";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/anonymous" element={<AnonymousReport />} />
            <Route
              path="/dashboard/*"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </div>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
