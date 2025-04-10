// @ts-nocheck
// src/app/(officer)/dashboard/page.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DataTable } from "@/components/tables/DataTable";
import { CaseStatusBadge } from "@/components/case/CaseStatusBadge";
import { CasePriorityBadge } from "@/components/case/CasePriorityBadge";
import { StatisticsChart } from "@/components/charts/StatisticsChart";
import { Button } from "@/components/ui/button";
import { Home, FileText, ClipboardList, Calendar, MessageSquare, Users, User, Settings, Clock } from "lucide-react";

// Mock data - would come from Convex in production
const recentCases = [
  {
    id: "1",
    ob_number: "OB-2025-001",
    title: "Theft at Main Street",
    status: "in-progress" as const,
    priority: "high" as const,
    date: "2025-03-28",
    reporter: "John Smith",
  },
  {
    id: "2",
    ob_number: "OB-2025-002",
    title: "Vandalism at Central Park",
    status: "open" as const,
    priority: "medium" as const,
    date: "2025-03-27",
    reporter: "Jane Doe",
  },
  {
    id: "3",
    ob_number: "OB-2025-003",
    title: "Traffic Accident on Highway 5",
    status: "closed" as const,
    priority: "low" as const,
    date: "2025-03-26",
    reporter: "Robert Johnson",
  },
  {
    id: "4",
    ob_number: "OB-2025-004",
    title: "Missing Person Report",
    status: "open" as const,
    priority: "high" as const,
    date: "2025-03-25",
    reporter: "Emily Williams",
  },
  {
    id: "5",
    ob_number: "OB-2025-005",
    title: "Domestic Disturbance Call",
    status: "in-progress" as const,
    priority: "medium" as const,
    date: "2025-03-24",
    reporter: "Michael Brown",
  },
];

// Define navigation items for officer dashboard
const navItems = [
  {
    label: "Dashboard",
    href: "/officer/dashboard",
    icon: <Home className="h-5 w-5" />,
    active: true
  },
  {
    label: "Active Cases",
    href: "/officer/cases",
    icon: <FileText className="h-5 w-5" />
  },
  {
    label: "Reports",
    href: "/officer/reports",
    icon: <ClipboardList className="h-5 w-5" />
  },
  {
    label: "Schedule",
    href: "/officer/schedule",
    icon: <Calendar className="h-5 w-5" />
  },
  {
    label: "Messages",
    href: "/officer/messages",
    icon: <MessageSquare className="h-5 w-5" />
  },
  {
    label: "Citizens",
    href: "/officer/citizens",
    icon: <Users className="h-5 w-5" />
  },
  {
    label: "Profile",
    href: "/officer/profile",
    icon: <User className="h-5 w-5" />
  },
  {
    label: "Settings",
    href: "/officer/settings",
    icon: <Settings className="h-5 w-5" />
  }
];

const columns = [
  {
    header: "OB #",
    accessorKey: "ob_number",
    cell: ({ row }: any) => (
      <div className="font-medium">{row.original.ob_number}</div>
    ),
  },
  {
    header: "Case Title",
    accessorKey: "title",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }: any) => (
      <CaseStatusBadge status={row.original.status} />
    ),
  },
  {
    header: "Priority",
    accessorKey: "priority",
    cell: ({ row }: any) => (
      <CasePriorityBadge priority={row.original.priority} />
    ),
  },
  {
    header: "Date",
    accessorKey: "date",
  },
  {
    header: "Reporter",
    accessorKey: "reporter",
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }: any) => (
      <Button size="sm" variant="outline">
        View Details
      </Button>
    ),
  },
];

export default function OfficerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCaseClick = (caseId: string) => {
    navigate(`/officer/cases/${caseId}`);
  };

  useEffect(() => {
    if (user && user.role !== "officer") {
      console.log("[OfficerDashboard] User role doesn't match, redirecting to home");
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout
      title="Officer Dashboard"
      subtitle={`Welcome back, Officer ${user.full_name}`}
      navItems={navItems}
      role="officer"
      notifications={3}
      badgeNumber={user.badge_number}
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Active Cases"
            value="24"
            description="5 new in last week"
            icon={<FileText className="h-8 w-8 text-blue-600" />}
            trend="+12%"
            trendDirection="up"
          />
          <StatsCard
            title="Reports Filed"
            value="142"
            description="For this month"
            icon={<ClipboardList className="h-8 w-8 text-purple-600" />}
            trend="+8%"
            trendDirection="up"
          />
          <StatsCard
            title="Case Closure Rate"
            value="68%"
            description="Last 30 days"
            icon={<Clock className="h-8 w-8 text-green-600" />}
            trend="+5%"
            trendDirection="up"
          />
          <StatsCard
            title="Citizen Interactions"
            value="87"
            description="Last 7 days"
            icon={<Users className="h-8 w-8 text-amber-600" />}
            trend="-3%"
            trendDirection="down"
          />
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-4">Case Statistics</h3>
              <StatisticsChart />
            </div>
          </div>
          <div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm h-full">
              <h3 className="text-lg font-medium mb-4">My Upcoming Shifts</h3>
              <div className="space-y-4">
                <div className="border p-3 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Morning Patrol</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        March 30, 2025
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">8:00 AM - 4:00 PM</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Downtown Area
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border p-3 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Evening Shift</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        March 31, 2025
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">4:00 PM - 12:00 AM</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        North Precinct
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border p-3 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Special Operation</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        April 2, 2025
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">10:00 AM - 6:00 PM</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        City Center
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Cases Table */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Recent Cases</h3>
            <Button size="sm">View All Cases</Button>
          </div>
          <DataTable data={recentCases} columns={columns} />
        </div>
      </div>
    </DashboardLayout>
  );
}
