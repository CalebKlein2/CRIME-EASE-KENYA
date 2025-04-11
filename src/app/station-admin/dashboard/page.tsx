// @ts-nocheck
// src/app/station-admin/dashboard/page.tsx
import React, { useEffect, useState } from "react";
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
import { 
  getTotalCases, 
  getActiveOfficers, 
  getCaseClearanceRate, 
  getHighPriorityCases, 
  getRecentCases, 
  getResourcesData, 
  getOfficerActivityData, 
  getCaseTypeData 
} from "@/lib/stationDashboardService";

// Import dashboard page components (create these files later)
import StationDashboardHome from "./components/DashboardHome";
import StationOfficersPage from "./components/OfficersPage";
import StationCasesPage from "./components/CasesPage";
import StationReportsPage from "./components/ReportsPage";
import StationMapPage from "./components/MapPage";
import StationAlertsPage from "./components/AlertsPage";
import StationSettingsPage from "./components/SettingsPage";

export default function StationDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const currentPath = location.pathname;

  const [totalCases, setTotalCases] = useState(0);
  const [activeOfficers, setActiveOfficers] = useState(0);
  const [caseClearance, setCaseClearance] = useState(0);
  const [highPriorityCases, setHighPriorityCases] = useState(0);
  const [recentCases, setRecentCases] = useState([]);
  const [resourcesData, setResourcesData] = useState([]);
  const [officerActivityData, setOfficerActivityData] = useState([]);
  const [caseTypeData, setCaseTypeData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch data from Supabase
      const totalCasesData = await getTotalCases();
      setTotalCases(totalCasesData);

      const activeOfficersData = await getActiveOfficers();
      setActiveOfficers(activeOfficersData);

      const caseClearanceData = await getCaseClearanceRate();
      setCaseClearance(caseClearanceData);

      const highPriorityCasesData = await getHighPriorityCases();
      setHighPriorityCases(highPriorityCasesData);

      const recentCasesData = await getRecentCases();
      setRecentCases(recentCasesData);

      const resourcesDataData = await getResourcesData();
      setResourcesData(resourcesDataData);

      const officerActivityDataData = await getOfficerActivityData();
      setOfficerActivityData(officerActivityDataData);

      const caseTypeDataData = await getCaseTypeData();
      setCaseTypeData(caseTypeDataData);
    };

    fetchData();
  }, []);

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

  const handleCaseClick = (id: string) => {
    // Handle case click logic here
    console.log(`Case clicked with ID: ${id}`);
  };

  const stationName = user?.station_name || "Central Police Station";
  const stationCode = user?.station_code || "CPL001";
  
  const navItems = getNavItems(currentPath);

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
          totalCases={totalCases}
          activeOfficers={activeOfficers}
          caseClearance={caseClearance}
          highPriorityCases={highPriorityCases}
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
