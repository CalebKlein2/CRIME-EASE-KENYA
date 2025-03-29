// src/app/(station-admin)/officer-management/page.tsx
"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ClipboardList,
  Users,
  Shield,
  FileText,
  Settings,
  Briefcase,
  TrendingUp,
  UserPlus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatisticsChart } from "@/components/charts/StatisticsChart";

// Mock data
const officersData = [
  {
    id: "1",
    name: "John Johnson",
    badge_number: "KP-001",
    rank: "Sergeant",
    department: "Criminal Investigations",
    status: "active" as const,
    cases_assigned: 4,
    cases_resolved: 12,
    join_date: "2020-05-15",
  },
  {
    id: "2",
    name: "Sarah Williams",
    badge_number: "KP-002",
    rank: "Officer",
    department: "Patrol",
    status: "active" as const,
    cases_assigned: 3,
    cases_resolved: 8,
    join_date: "2021-02-10",
  },
  {
    id: "3",
    name: "Michael Davis",
    badge_number: "KP-003",
    rank: "Corporal",
    department: "Criminal Investigations",
    status: "active" as const,
    cases_assigned: 2,
    cases_resolved: 15,
    join_date: "2019-11-20",
  },
  {
    id: "4",
    name: "Jessica Martinez",
    badge_number: "KP-004",
    rank: "Officer",
    department: "Traffic",
    status: "inactive" as const,
    cases_assigned: 0,
    cases_resolved: 7,
    join_date: "2022-01-05",
  },
  {
    id: "5",
    name: "Robert Brown",
    badge_number: "KP-005",
    rank: "Detective",
    department: "Special Investigations",
    status: "active" as const,
    cases_assigned: 1,
    cases_resolved: 21,
    join_date: "2018-07-12",
  },
];

const departmentDistributionData = [
  { name: "Criminal Investigations", value: 12 },
  { name: "Patrol", value: 18 },
  { name: "Traffic", value: 8 },
  { name: "Special Investigations", value: 5 },
  { name: "Administration", value: 3 },
];

const rankDistributionData = [
  { name: "Officer", value: 25 },
  { name: "Corporal", value: 10 },
  { name: "Sergeant", value: 7 },
  { name: "Detective", value: 4 },
  { name: "Inspector", value: 2 },
];

// Navigation items
const navItems = [
  {
    label: "Dashboard",
    href: "/station-dashboard",
    icon: <ClipboardList className="h-5 w-5" />,
  },
  {
    label: "Cases",
    href: "/case-management",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    label: "Officers",
    href: "/officer-management",
    icon: <Users className="h-5 w-5" />,
    active: true,
  },
  {
    label: "Teams",
    href: "/team-management",
    icon: <Briefcase className="h-5 w-5" />,
  },
  {
    label: "Resources",
    href: "/resources",
    icon: <Shield className="h-5 w-5" />,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export default function OfficerManagementPage() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    badge_number: "",
    rank: "",
    department: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would call a Convex mutation
    console.log("Adding officer:", formData);
    setShowAddDialog(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      badge_number: "",
      rank: "",
      department: "",
    });
  };

  const handleStatusChange = (officerId: string, newStatus: "active" | "inactive") => {
    // In production, this would call a Convex mutation
    console.log("Changing status:", { officerId, newStatus });
  };

  return (
    <DashboardLayout
      title="Officer Management"
      subtitle="Manage police officers and assignments"
      navItems={navItems}
      role="station_admin"
      notifications={5}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Police Officers</h2>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Officer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add New Officer</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddOfficer} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="badge_number">Badge Number</Label>
                    <Input
                      id="badge_number"
                      name="badge_number"
                      value={formData.badge_number}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rank">Rank</Label>
                    <Select
                      value={formData.rank}
                      onValueChange={(value) => handleSelectChange("rank", value)}
                    >
                      <SelectTrigger id="rank">
                        <SelectValue placeholder="Select rank" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="officer">Officer</SelectItem>
                        <SelectItem value="corporal">Corporal</SelectItem>
                        <SelectItem value="sergeant">Sergeant</SelectItem>
                        <SelectItem value="detective">Detective</SelectItem>
                        <SelectItem value="inspector">Inspector</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                  <Label htmlFor="department">Department</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => handleSelectChange("department", value)}
                    >
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="criminal_investigations">Criminal Investigations</SelectItem>
                        <SelectItem value="patrol">Patrol</SelectItem>
                        <SelectItem value="traffic">Traffic</SelectItem>
                        <SelectItem value="special_investigations">Special Investigations</SelectItem>
                        <SelectItem value="administration">Administration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="submit">Add Officer</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <DataTable
                  data={officersData}
                  columns={[
                    {
                      key: "name",
                      header: "Name",
                      cell: (row) => <span className="font-medium">{row.name}</span>,
                    },
                    {
                      key: "badge_number",
                      header: "Badge Number",
                      cell: (row) => row.badge_number,
                    },
                    {
                      key: "rank",
                      header: "Rank",
                      cell: (row) => row.rank,
                      sortable: true,
                    },
                    {
                      key: "department",
                      header: "Department",
                      cell: (row) => row.department,
                      sortable: true,
                    },
                    {
                      key: "cases_assigned",
                      header: "Current Cases",
                      cell: (row) => row.cases_assigned,
                      sortable: true,
                    },
                    {
                      key: "status",
                      header: "Status",
                      cell: (row) => (
                        <span
                          className={`flex items-center gap-1 ${
                            row.status === "active"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {row.status === "active" ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          <span className="capitalize">{row.status}</span>
                        </span>
                      ),
                    },
                  ]}
                  actions={(row) => (
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {row.status === "active" ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500"
                          onClick={() => handleStatusChange(row.id, "inactive")}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-500"
                          onClick={() => handleStatusChange(row.id, "active")}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <StatisticsChart
                  title=""
                  type="pie"
                  data={departmentDistributionData}
                  dataKeys={["value"]}
                  height={200}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rank Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <StatisticsChart
                  title=""
                  type="pie"
                  data={rankDistributionData}
                  dataKeys={["value"]}
                  colors={["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#6366f1"]}
                  height={200}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Officer Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {officersData
                    .sort((a, b) => b.cases_resolved - a.cases_resolved)
                    .slice(0, 3)
                    .map((officer) => (
                      <div key={officer.id} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="font-medium">{officer.name}</span>
                          <span>{officer.cases_resolved} resolved</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-blue-500 rounded-full"
                            style={{ width: `${(officer.cases_resolved / 25) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}