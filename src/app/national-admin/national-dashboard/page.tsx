// src/app/(national-admin)/national-dashboard/page.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Routes, Route, Navigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { StatisticsChart } from "@/components/charts/StatisticsChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/DataTable";
import { MapView } from "@/components/maps/MapView";
import {
  ClipboardList,
  Users,
  Shield,
  FileText,
  Settings,
  BarChart,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Clock,
  MapPin,
  Building,
  Flag,
  Home,
  ClipboardCheck,
  AlertCircle,
  Database,
} from "lucide-react";

// Import dashboard components
import DashboardHome from "./components/DashboardHome";
import StationsPage from "./components/StationsPage";
import OfficersPage from "./components/OfficersPage";
import ReportsPage from "./components/ReportsPage";
import StatisticsPage from "./components/StatisticsPage";
import AlertsPage from "./components/AlertsPage";
import SettingsPage from "./components/SettingsPage";
import SystemLogsPage from "./components/SystemLogsPage";

// Mock data
const nationalStats = {
  total_cases: 2458,
  active_officers: 345,
  stations: 47,
  response_time_avg: 18, // minutes
  case_clearance_rate: 62, // percentage
  incident_growth: -3.2, // percentage
};

const regionData = [
  {
    id: "1",
    region: "Nairobi",
    cases: 542,
    officers: 120,
    stations: 12,
    clearance_rate: "68%",
  },
  {
    id: "2",
    region: "Coast",
    cases: 328,
    officers: 85,
    stations: 8,
    clearance_rate: "64%",
  },
  {
    id: "3",
    region: "Central",
    cases: 298,
    officers: 72,
    stations: 7,
    clearance_rate: "71%",
  },
  {
    id: "4",
    region: "Eastern",
    cases: 276,
    officers: 65,
    stations: 6,
    clearance_rate: "59%",
  },
  {
    id: "5",
    region: "Western",
    cases: 246,
    officers: 52,
    stations: 5,
    clearance_rate: "55%",
  },
];

const crimeTypeData = [
  { name: "Theft", value: 32 },
  { name: "Assault", value: 18 },
  { name: "Traffic", value: 15 },
  { name: "Fraud", value: 12 },
  { name: "Domestic", value: 10 },
  { name: "Other", value: 13 },
];

const monthlyCasesData = [
  { name: "Jan", cases: 180 },
  { name: "Feb", cases: 200 },
  { name: "Mar", cases: 220 },
  { name: "Apr", cases: 190 },
  { name: "May", cases: 210 },
  { name: "Jun", cases: 240 },
  { name: "Jul", cases: 250 },
  { name: "Aug", cases: 230 },
  { name: "Sep", cases: 220 },
  { name: "Oct", cases: 210 },
  { name: "Nov", cases: 200 },
  { name: "Dec", cases: 190 },
];

const alertsData = [
  {
    id: "1",
    title: "Spike in Vehicle Theft",
    region: "Nairobi",
    severity: "High",
    date: "2025-03-28",
  },
  {
    id: "2",
    title: "Officer Shortage",
    region: "Coast",
    severity: "Medium",
    date: "2025-03-27",
  },
  {
    id: "3",
    title: "System Maintenance",
    region: "All Regions",
    severity: "Low",
    date: "2025-03-30",
  },
];

// Define navigation items for national admin dashboard with relative paths
const navItems = [
  {
    label: "Dashboard",
    href: ".", // Use relative dot path for current directory (index)
    icon: <Home className="h-5 w-5" />,
    active: true
  },
  {
    label: "Stations",
    href: "stations", // Relative path that matches Route path
    icon: <Shield className="h-5 w-5" />
  },
  {
    label: "Officers",
    href: "officers", // Relative path that matches Route path
    icon: <Users className="h-5 w-5" />
  },
  {
    label: "Case Reports",
    href: "reports", // Relative path that matches Route path
    icon: <ClipboardCheck className="h-5 w-5" />
  },
  {
    label: "Statistics",
    href: "statistics", // Relative path that matches Route path
    icon: <BarChart className="h-5 w-5" />
  },
  {
    label: "Alerts",
    href: "alerts", // Relative path that matches Route path
    icon: <AlertCircle className="h-5 w-5" />
  },
  {
    label: "Settings",
    href: "settings", // Relative path that matches Route path
    icon: <Settings className="h-5 w-5" />
  },
  {
    label: "System Logs",
    href: "system-logs", // Relative path that matches Route path
    icon: <Database className="h-5 w-5" />
  }
];

export default function NationalDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  // Updated function to set the active nav item based on current path
  const getNavItemsWithActive = () => {
    const currentPath = location.pathname;
    const dashboardBasePath = "/national-dashboard";
    
    return navItems.map(item => ({
      ...item,
      active: (item.href === "." && (currentPath === dashboardBasePath || currentPath === dashboardBasePath + "/")) ||
              (item.href !== "." && currentPath.endsWith("/" + item.href))
    }));
  };
  
  // Add timeout to prevent infinite loading
  useEffect(() => {
    // Set a timeout to stop showing loading after 5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
      console.log("[NationalDashboard] Loading timeout reached, forcing dashboard to show");
    }, 5000);
    
    // Check if user has national admin role
    if (user && user.role) {
      if (user.role !== "national_admin") {
        console.log("[NationalDashboard] User doesn't have national admin role, redirecting");
        navigate("/login");
      } else {
        setIsLoading(false);
        console.log("[NationalDashboard] User confirmed as national admin");
      }
    }
    
    return () => clearTimeout(timer);
  }, [user, navigate]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900"></div>
      </div>
    );
  }
  
  return (
    <DashboardLayout
      title="National Dashboard"
      subtitle="Countrywide Crime Management System"
      navItems={getNavItemsWithActive()}
      userName={user?.full_name || "Admin User"}
      userRole="National Administrator"
      notifications={8}
      userAvatarFallback="NA"
    >
      <Routes>
        <Route index element={<DashboardHome />} />
        <Route path="stations" element={<StationsPage />} />
        <Route path="officers" element={<OfficersPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="statistics" element={<StatisticsPage />} />
        <Route path="alerts" element={<AlertsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="system-logs" element={<SystemLogsPage />} />
        <Route path="*" element={<Navigate to="/national-dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
}