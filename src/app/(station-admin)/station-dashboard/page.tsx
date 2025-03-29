// src/app/(station-admin)/station-dashboard/page.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  BarChart
} from "lucide-react";
import { MapView } from "@/components/maps/MapView";

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
const navItems = [
  {
    label: "Dashboard",
    href: "/station-admin/station-dashboard",
    icon: <Home className="h-5 w-5" />,
    active: true
  },
  {
    label: "Station Officers",
    href: "/station-admin/officers",
    icon: <Users className="h-5 w-5" />
  },
  {
    label: "Case Management",
    href: "/station-admin/cases",
    icon: <FileText className="h-5 w-5" />
  },
  {
    label: "Reports",
    href: "/station-admin/reports",
    icon: <ClipboardList className="h-5 w-5" />
  },
  {
    label: "Schedules",
    href: "/station-admin/schedules",
    icon: <Calendar className="h-5 w-5" />
  },
  {
    label: "Resources",
    href: "/station-admin/resources",
    icon: <Archive className="h-5 w-5" />
  },
  {
    label: "Station Stats",
    href: "/station-admin/statistics",
    icon: <BarChart className="h-5 w-5" />
  },
  {
    label: "Settings",
    href: "/station-admin/settings",
    icon: <Settings className="h-5 w-5" />
  }
];

export default function StationDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Handle case click
  const handleCaseClick = (id: string) => {
    navigate(`/station-admin/cases/${id}`);
  };
  
  // Redirect to main page if role doesn't match
  useEffect(() => {
    if (user && user.role !== "station_admin") {
      console.log("[StationDashboard] User role doesn't match, redirecting to home");
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout
      title="Station Dashboard"
      subtitle={`${user.station_code || "Central Police Station"}`}
      navItems={navItems}
      role="station_admin"
      notifications={5}
      stationCode={user.station_code}
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Cases"
            value="124"
            icon={<FileText className="h-6 w-6 text-blue-600" />}
            description="Total cases this month"
            trend="+8%"
            trendDirection="up"
          />
          <StatsCard
            title="Active Officers"
            value="42"
            icon={<UserCheck className="h-6 w-6 text-green-600" />}
            description="Currently on duty"
            trend="+2"
            trendDirection="up"
          />
          <StatsCard
            title="Case Clearance"
            value="68%"
            icon={<Clock className="h-6 w-6 text-amber-600" />}
            description="Average this month"
            trend="-5%"
            trendDirection="down"
          />
          <StatsCard
            title="High Priority"
            value="6"
            icon={<AlertTriangle className="h-6 w-6 text-red-600" />}
            description="Cases needing attention"
            trend="+1"
            trendDirection="up"
          />
        </div>

        {/* Charts and Station Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Case Distribution by Type</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <StatisticsChart />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Station Coverage</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <MapView />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Cases and Officer Activity */}
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={recentCases}
                columns={[
                  {
                    accessorKey: "ob_number",
                    header: "OB Number",
                    cell: ({ row }: any) => (
                      <div className="font-medium">{row.original.ob_number}</div>
                    ),
                  },
                  {
                    accessorKey: "title",
                    header: "Case Title",
                  },
                  {
                    accessorKey: "status",
                    header: "Status",
                    cell: ({ row }: any) => (
                      <CaseStatusBadge status={row.original.status} />
                    ),
                  },
                  {
                    accessorKey: "priority",
                    header: "Priority",
                    cell: ({ row }: any) => (
                      <CasePriorityBadge priority={row.original.priority} />
                    ),
                  },
                  {
                    accessorKey: "officer",
                    header: "Assigned Officer",
                  },
                ]}
              />
            </CardContent>
          </Card>
        </div>

        {/* Resources and Officer Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Station Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={resourcesData}
                columns={[
                  {
                    accessorKey: "resource",
                    header: "Resource",
                  },
                  {
                    accessorKey: "available",
                    header: "Available",
                  },
                  {
                    accessorKey: "total",
                    header: "Total",
                  },
                  {
                    accessorKey: "status",
                    header: "Status",
                  },
                ]}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Officers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {officerActivityData.slice(0, 3).map((officer, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{officer.name}</p>
                      <p className="text-sm text-gray-500">
                        {officer.cases} cases | {officer.reports} reports
                      </p>
                    </div>
                    <div className="text-sm font-medium text-green-600">
                      {index === 0 ? (
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          Top performer
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}