// @ts-nocheck
// src/app/station-admin/dashboard/page.tsx
import React, { useEffect } from "react";
import { useNavigate, useLocation, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { StatisticsChart } from "@/components/charts/StatisticsChart";
import { DataTable } from "@/components/tables/DataTable";
import { CaseStatusBadge } from "@/components/case/CaseStatusBadge";
import { CasePriorityBadge } from "@/components/case/CasePriorityBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ClipboardList, 
  Users, 
  Shield, 
  FileText, 
  Bell, 
  Settings,
  Briefcase,
  UserCheck, 
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Home,
  Calendar,
  Archive,
  BarChart,
  MapPin
} from "lucide-react";
import { MapView } from "@/components/maps/MapView";
import { Button } from "@/components/ui/button";

// Import dashboard page components (create these files later)
import StationDashboardHome from "./components/DashboardHome";
import StationOfficersPage from "./components/OfficersPage";
import StationCasesPage from "./components/CasesPage";
import StationReportsPage from "./components/ReportsPage";
import StationMapPage from "./components/MapPage";
import StationAlertsPage from "./components/AlertsPage";
import StationSettingsPage from "./components/SettingsPage";

// Mock data
const recentCases = [
  {
    id: "1",
    ob_number: "OB-2025-001",
    title: "Theft at Main Street",
    status: "in-progress" as const,
    priority: "high" as const,
    officer: "Officer Johnson",
  },
  {
    id: "2",
    ob_number: "OB-2025-002",
    title: "Vandalism at Central Park",
    status: "open" as const,
    priority: "medium" as const,
    officer: "Officer Chen",
  },
  {
    id: "3",
    ob_number: "OB-2025-003",
    title: "Missing Person Report",
    status: "open" as const,
    priority: "high" as const,
    officer: "Officer Garcia",
  },
  {
    id: "4",
    ob_number: "OB-2025-004",
    title: "Traffic Accident on Highway 5",
    status: "closed" as const,
    priority: "low" as const,
    officer: "Officer Patel",
  },
  {
    id: "5",
    ob_number: "OB-2025-005",
    title: "Domestic Disturbance Call",
    status: "in-progress" as const,
    priority: "medium" as const,
    officer: "Officer Nguyen",
  },
];

const officerActivityData = [
  { name: "Officer Johnson", cases: 12, reports: 24 },
  { name: "Officer Chen", cases: 8, reports: 16 },
  { name: "Officer Garcia", cases: 10, reports: 20 },
  { name: "Officer Patel", cases: 6, reports: 14 },
  { name: "Officer Nguyen", cases: 9, reports: 18 },
];

const caseTypeData = [
  { name: "Theft", value: 32 },
  { name: "Assault", value: 18 },
  { name: "Traffic", value: 24 },
  { name: "Vandalism", value: 15 },
  { name: "Domestic", value: 20 },
  { name: "Other", value: 10 },
];

const resourcesData = [
  {
    id: "1",
    resource: "Patrol Cars",
    available: 8,
    total: 12,
    status: "75% operational",
  },
  {
    id: "2",
    resource: "Officers",
    available: 42,
    total: 50,
    status: "84% staffed",
  },
  {
    id: "3",
    resource: "Investigation Kits",
    available: 15,
    total: 15,
    status: "100% available",
  },
  {
    id: "4",
    resource: "Body Cameras",
    available: 35,
    total: 40,
    status: "87% operational",
  },
];

// Define navigation items for station admin dashboard
const getNavItems = (currentPath) => [
  {
    label: "Dashboard",
    href: "/station-dashboard",
    icon: <Home className="h-5 w-5" />,
    active: currentPath === "/station-dashboard" || currentPath === "/station-dashboard/"
  },
  {
    label: "Officers",
    href: "/station-dashboard/officers",
    icon: <Users className="h-5 w-5" />,
    active: currentPath.includes("/station-dashboard/officers")
  },
  {
    label: "Cases",
    href: "/station-dashboard/cases",
    icon: <FileText className="h-5 w-5" />,
    active: currentPath.includes("/station-dashboard/cases")
  },
  {
    label: "Reports",
    href: "/station-dashboard/reports",
    icon: <ClipboardList className="h-5 w-5" />,
    active: currentPath.includes("/station-dashboard/reports")
  },
  {
    label: "Map",
    href: "/station-dashboard/map",
    icon: <MapPin className="h-5 w-5" />,
    active: currentPath.includes("/station-dashboard/map")
  },
  {
    label: "Alerts",
    href: "/station-dashboard/alerts",
    icon: <Bell className="h-5 w-5" />,
    active: currentPath.includes("/station-dashboard/alerts")
  },
  {
    label: "Settings",
    href: "/station-dashboard/settings",
    icon: <Settings className="h-5 w-5" />,
    active: currentPath.includes("/station-dashboard/settings")
  }
];

export default function StationDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const currentPath = location.pathname;
  
  // Redirect to main page if role doesn't match - temporarily commented for development
  /*
  useEffect(() => {
    if (user && user.role !== "station_admin") {
      console.log("[StationDashboard] User role doesn't match, redirecting to home");
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }
  */
  
  // Fallback data when database connection isn't available yet
  const stationName = user?.station_name || "Central Police Station";
  const stationCode = user?.station_code || "CPL001";
  
  const navItems = getNavItems(currentPath);
  
  // Handle case click
  const handleCaseClick = (id) => {
    navigate(`/station-dashboard/cases/${id}`);
  };

  return (
    <DashboardLayout
      title="Station Dashboard"
      subtitle={stationName}
      navItems={navItems}
      userName={user?.full_name || "Station Admin"}
      userRole="Station Administrator"
      userAvatarFallback="SA"
      notifications={5}
    >
      <Routes>
        <Route index element={<StationDashboardHome 
          recentCases={recentCases} 
          resourcesData={resourcesData}
          officerActivityData={officerActivityData}
          caseTypeData={caseTypeData}
          handleCaseClick={handleCaseClick}
        />} />
        <Route path="/officers/*" element={<StationOfficersPage />} />
        <Route path="/cases/*" element={<StationCasesPage />} />
        <Route path="/reports/*" element={<StationReportsPage />} />
        <Route path="/map/*" element={<StationMapPage />} />
        <Route path="/alerts/*" element={<StationAlertsPage />} />
        <Route path="/settings/*" element={<StationSettingsPage />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </DashboardLayout>
  );
}
