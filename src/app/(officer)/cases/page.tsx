// src/app/(officer)/cases/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/tables/DataTable";
import { CaseStatusBadge } from "@/components/case/CaseStatusBadge";
import { CasePriorityBadge } from "@/components/case/CasePriorityBadge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  ClipboardList,
  FileText,
  Filter,
  MessageSquare,
  Users,
  MapPin,
  Calendar,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock cases data
const cases = [
  {
    id: "1",
    ob_number: "OB-2025-001",
    title: "Theft at Main Street",
    status: "in-progress" as const,
    priority: "high" as const,
    date: "2025-03-28",
    reporter: "John Smith",
    location: "123 Main St",
    incident_type: "Theft",
    last_updated: "2025-03-29",
  },
  {
    id: "2",
    ob_number: "OB-2025-002",
    title: "Vandalism at Central Park",
    status: "open" as const,
    priority: "medium" as const,
    date: "2025-03-27",
    reporter: "Anonymous",
    location: "Central Park",
    incident_type: "Vandalism",
    last_updated: "2025-03-28",
  },
  {
    id: "3",
    ob_number: "OB-2025-003",
    title: "Missing Person Report",
    status: "open" as const,
    priority: "high" as const,
    date: "2025-03-26",
    reporter: "Sarah Johnson",
    location: "456 Oak Avenue",
    incident_type: "Missing Person",
    last_updated: "2025-03-27",
  },
  {
    id: "4",
    ob_number: "OB-2025-004",
    title: "Assault Case",
    status: "in-progress" as const,
    priority: "high" as const,
    date: "2025-03-25",
    reporter: "Michael Brown",
    location: "789 Pine Street",
    incident_type: "Assault",
    last_updated: "2025-03-26",
  },
  {
    id: "5",
    ob_number: "OB-2025-005",
    title: "Noise Complaint",
    status: "closed" as const,
    priority: "low" as const,
    date: "2025-03-24",
    reporter: "Emma Wilson",
    location: "101 Elm Road",
    incident_type: "Disturbance",
    last_updated: "2025-03-25",
  },
];

// Navigation items
const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <ClipboardList className="h-5 w-5" />,
  },
  {
    label: "My Cases",
    href: "/cases",
    icon: <FileText className="h-5 w-5" />,
    active: true,
  },
  {
    label: "Evidence",
    href: "/evidence",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    label: "Interviews",
    href: "/interviews",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    label: "Communications",
    href: "/communications",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    label: "Team",
    href: "/team",
    icon: <Users className="h-5 w-5" />,
  },
];

export default function CaseManagementPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const handleCaseClick = (caseId: string) => {
    router.push(`/cases/${caseId}`);
  };

  // Filter cases based on active tab and filters
  const filteredCases = cases.filter((c) => {
    // Filter by tab
    if (activeTab === "open" && c.status === "closed") return false;
    if (activeTab === "closed" && c.status !== "closed") return false;
    if (activeTab === "high-priority" && c.priority !== "high") return false;

    // Filter by status
    if (statusFilter !== "all" && c.status !== statusFilter) return false;

    // Filter by priority
    if (priorityFilter !== "all" && c.priority !== priorityFilter) return false;

    return true;
  });

  return (
    <DashboardLayout
      title="Case Management"
      subtitle="View and manage your assigned cases"
      navItems={navItems}
      role="officer"
      notifications={3}
    >
      <div className="space-y-6">
        <Tabs
          defaultValue="all"
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All Cases</TabsTrigger>
              <TabsTrigger value="open">Open Cases</TabsTrigger>
              <TabsTrigger value="closed">Closed Cases</TabsTrigger>
              <TabsTrigger value="high-priority">High Priority</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={priorityFilter}
                onValueChange={setPriorityFilter}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="all" className="space-y-4">
            <DataTable
              data={filteredCases}
              columns={[
                {
                  key: "ob_number",
                  header: "OB Number",
                  cell: (row) => <span className="font-medium">{row.ob_number}</span>,
                },
                {
                  key: "title",
                  header: "Case Title",
                  cell: (row) => row.title,
                },
                {
                  key: "status",
                  header: "Status",
                  cell: (row) => <CaseStatusBadge status={row.status} />,
                  sortable: true,
                },
                {
                  key: "priority",
                  header: "Priority",
                  cell: (row) => <CasePriorityBadge priority={row.priority} />,
                  sortable: true,
                },
                {
                  key: "incident_type",
                  header: "Type",
                  cell: (row) => row.incident_type,
                },
                {
                  key: "location",
                  header: "Location",
                  cell: (row) => (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span>{row.location}</span>
                    </div>
                  ),
                },
                {
                  key: "date",
                  header: "Reported On",
                  cell: (row) => row.date,
                  sortable: true,
                },
                {
                  key: "last_updated",
                  header: "Last Updated",
                  cell: (row) => row.last_updated,
                  sortable: true,
                },
              ]}
              actions={(row) => (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/cases/${row.id}`);
                  }}
                >
                  View
                </Button>
              )}
              onRowClick={handleCaseClick}
            />
          </TabsContent>

          <TabsContent value="open">
            <DataTable
              data={filteredCases}
              columns={[
                {
                  key: "ob_number",
                  header: "OB Number",
                  cell: (row) => <span className="font-medium">{row.ob_number}</span>,
                },
                {
                  key: "title",
                  header: "Case Title",
                  cell: (row) => row.title,
                },
                {
                  key: "status",
                  header: "Status",
                  cell: (row) => <CaseStatusBadge status={row.status} />,
                },
                {
                  key: "priority",
                  header: "Priority",
                  cell: (row) => <CasePriorityBadge priority={row.priority} />,
                },
                {
                  key: "incident_type",
                  header: "Type",
                  cell: (row) => row.incident_type,
                },
                {
                  key: "date",
                  header: "Reported On",
                  cell: (row) => row.date,
                },
              ]}
              onRowClick={handleCaseClick}
            />
          </TabsContent>

          <TabsContent value="closed">
            <DataTable
              data={filteredCases}
              columns={[
                {
                  key: "ob_number",
                  header: "OB Number",
                  cell: (row) => <span className="font-medium">{row.ob_number}</span>,
                },
                {
                  key: "title",
                  header: "Case Title",
                  cell: (row) => row.title,
                },
                {
                  key: "incident_type",
                  header: "Type",
                  cell: (row) => row.incident_type,
                },
                {
                  key: "date",
                  header: "Reported On",
                  cell: (row) => row.date,
                },
                {
                  key: "last_updated",
                  header: "Closed On",
                  cell: (row) => row.last_updated,
                },
              ]}
              onRowClick={handleCaseClick}
            />
          </TabsContent>

          <TabsContent value="high-priority">
            <DataTable
              data={filteredCases}
              columns={[
                {
                  key: "ob_number",
                  header: "OB Number",
                  cell: (row) => <span className="font-medium">{row.ob_number}</span>,
                },
                {
                    key: "title",
                    header: "Case Title",
                    cell: (row) => row.title,
                  },
                  {
                    key: "status",
                    header: "Status",
                    cell: (row) => <CaseStatusBadge status={row.status} />,
                  },
                  {
                    key: "incident_type",
                    header: "Type",
                    cell: (row) => row.incident_type,
                  },
                  {
                    key: "date",
                    header: "Reported On",
                    cell: (row) => row.date,
                  },
                  {
                    key: "last_updated",
                    header: "Last Updated",
                    cell: (row) => row.last_updated,
                  },
                ]}
                onRowClick={handleCaseClick}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    );
  }