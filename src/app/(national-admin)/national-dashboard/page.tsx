// src/app/(national-admin)/national-dashboard/page.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

// Define navigation items for national admin dashboard
const navItems = [
  {
    label: "Dashboard",
    href: "/national-admin/national-dashboard",
    icon: <Home className="h-5 w-5" />,
    active: true
  },
  {
    label: "Stations",
    href: "/national-admin/stations",
    icon: <Shield className="h-5 w-5" />
  },
  {
    label: "Officers",
    href: "/national-admin/officers",
    icon: <Users className="h-5 w-5" />
  },
  {
    label: "Case Reports",
    href: "/national-admin/reports",
    icon: <ClipboardCheck className="h-5 w-5" />
  },
  {
    label: "Statistics",
    href: "/national-admin/statistics",
    icon: <BarChart className="h-5 w-5" />
  },
  {
    label: "Alerts",
    href: "/national-admin/alerts",
    icon: <AlertCircle className="h-5 w-5" />
  },
  {
    label: "Settings",
    href: "/national-admin/settings",
    icon: <Settings className="h-5 w-5" />
  },
  {
    label: "System Logs",
    href: "/national-admin/logs",
    icon: <Database className="h-5 w-5" />
  }
];

export default function NationalDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Handle region click
  const handleRegionClick = (id: string) => {
    navigate(`/national-admin/regions/${id}`);
  };

  // Redirect to main page if role doesn't match
  useEffect(() => {
    if (user && user.role !== "national_admin") {
      console.log("[NationalDashboard] User role doesn't match, redirecting to home");
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout
      title="National Police Administration"
      subtitle="Countrywide Crime Management System"
      navItems={navItems}
      role="national_admin"
      notifications={8}
      securityCode={user.security_code}
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Cases"
            value={nationalStats.total_cases.toString()}
            icon={<FileText className="h-6 w-6 text-blue-600" />}
            description="Nationwide"
            trend={{
              value: 2.3,
              isPositive: false
            }}
            variant="default"
          />
          <StatsCard
            title="Active Officers"
            value={nationalStats.active_officers.toString()}
            icon={<Users className="h-6 w-6 text-green-600" />}
            description={`Across ${nationalStats.stations} stations`}
            trend={{
              value: 5,
              isPositive: true
            }}
            variant="success"
          />
          <StatsCard
            title="Response Time"
            value={`${nationalStats.response_time_avg} min`}
            icon={<Clock className="h-6 w-6 text-amber-600" />}
            description="Average nationwide"
            trend={{
              value: 1.5,
              isPositive: true
            }}
            variant="success"
          />
          <StatsCard
            title="Clearance Rate"
            value={`${nationalStats.case_clearance_rate}%`}
            icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
            description="Cases resolved"
            trend={{
              value: 4,
              isPositive: true
            }}
            variant="success"
          />
        </div>

        {/* Case Map and Crime Types */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Nationwide Crime Heatmap</CardTitle>
              </CardHeader>
              <CardContent className="h-96">
                <MapView center={{ lat: -1.2921, lng: 36.8219 }} height="100%" />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Crime Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <StatisticsChart
                  title="Crime Distribution"
                  type="pie"
                  data={crimeTypeData}
                  dataKeys={["value"]}
                  colors={["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6", "#6b7280"]}
                />
                <div className="mt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    View Detailed Report <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Regional Statistics */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Regional Statistics</CardTitle>
            <Button size="sm">View All Regions</Button>
          </CardHeader>
          <CardContent>
            <DataTable
              data={regionData}
              columns={[
                {
                  key: "region",
                  header: "Region",
                  cell: (row) => (
                    <div className="font-medium">{row.region}</div>
                  ),
                },
                {
                  key: "cases",
                  header: "Cases",
                  cell: (row) => row.cases,
                },
                {
                  key: "officers",
                  header: "Officers",
                  cell: (row) => row.officers,
                },
                {
                  key: "stations",
                  header: "Stations",
                  cell: (row) => row.stations,
                },
                {
                  key: "clearance_rate",
                  header: "Clearance Rate",
                  cell: (row) => row.clearance_rate,
                },
              ]}
            />
          </CardContent>
        </Card>

        {/* System Alerts and Monthly Trend */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alertsData.map((alert) => (
                  <div key={alert.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-2 rounded-full ${
                          alert.severity === "High"
                            ? "bg-red-100"
                            : alert.severity === "Medium"
                            ? "bg-amber-100"
                            : "bg-blue-100"
                        }`}
                      >
                        <AlertTriangle
                          className={`h-5 w-5 ${
                            alert.severity === "High"
                              ? "text-red-600"
                              : alert.severity === "Medium"
                              ? "text-amber-600"
                              : "text-blue-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{alert.title}</h3>
                          <span
                            className={`text-xs rounded-full px-2 py-1 ${
                              alert.severity === "High"
                                ? "bg-red-100 text-red-800"
                                : alert.severity === "Medium"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {alert.severity}
                          </span>
                        </div>
                        <div className="flex justify-between mt-2 text-sm text-gray-500">
                          <span>{alert.region}</span>
                          <span>{alert.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Case Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <StatisticsChart
                title="Cases per Month"
                type="line"
                data={monthlyCasesData}
                dataKeys={["cases"]}
                colors={["#3b82f6"]}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}