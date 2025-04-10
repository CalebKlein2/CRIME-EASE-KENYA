'use client';

import React from "react";
import { useNavigate, useLocation, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Home, 
  FileText, 
  ClipboardList, 
  MapPin, 
  Bell,
  Settings
} from "lucide-react";

// Import dashboard components
import DashboardHome from "./components/DashboardHome";
import CasesPage from "./components/CasesPage";
import ReportsPage from "./components/ReportsPage";
import MapPage from "./components/MapPage";
import AlertsPage from "./components/AlertsPage";
import SettingsPage from "./components/SettingsPage";

// Define navigation items for officer dashboard
const getNavItems = (currentPath) => [
  {
    label: "Dashboard",
    href: "/officer-dashboard",
    icon: <Home className="h-5 w-5" />,
    active: currentPath === "/officer-dashboard" || currentPath === "/officer-dashboard/"
  },
  {
    label: "Cases",
    href: "/officer-dashboard/cases",
    icon: <FileText className="h-5 w-5" />,
    active: currentPath.includes("/officer-dashboard/cases")
  },
  {
    label: "Reports",
    href: "/officer-dashboard/reports",
    icon: <ClipboardList className="h-5 w-5" />,
    active: currentPath.includes("/officer-dashboard/reports")
  },
  {
    label: "Map",
    href: "/officer-dashboard/map",
    icon: <MapPin className="h-5 w-5" />,
    active: currentPath.includes("/officer-dashboard/map")
  },
  {
    label: "Alerts",
    href: "/officer-dashboard/alerts",
    icon: <Bell className="h-5 w-5" />,
    active: currentPath.includes("/officer-dashboard/alerts")
  },
  {
    label: "Settings",
    href: "/officer-dashboard/settings",
    icon: <Settings className="h-5 w-5" />,
    active: currentPath.includes("/officer-dashboard/settings")
  }
];

// Main officer dashboard component
export default function OfficerDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // Check if user is logged in and has the correct role - temporarily commented for development
  /*
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'officer') {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'citizen') {
      return <Navigate to="/citizen-dashboard" replace />;
    } else if (user.role === 'station_admin') {
      return <Navigate to="/station-dashboard" replace />;
    } else if (user.role === 'national_admin') {
      return <Navigate to="/national-dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }
  */

  const navItems = getNavItems(currentPath);

  return (
    <DashboardLayout 
      navItems={navItems}
      title="Officer Dashboard"
      userName={user?.full_name || "Officer"}
      userRole="Police Officer"
      userAvatarFallback="PO"
      notifications={3}
    >
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/cases/*" element={<CasesPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </DashboardLayout>
  );
}
