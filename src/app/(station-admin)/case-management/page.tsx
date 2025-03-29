// src/app/(station-admin)/case-management/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/tables/DataTable";
import { CaseStatusBadge } from "@/components/case/CaseStatusBadge";
import { CasePriorityBadge } from "@/components/case/CasePriorityBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ClipboardList,
  Users,
  Shield,
  FileText,
  Settings,
  Briefcase,
  UserCheck,
  TrendingUp,
  Filter,
  MapPin,
  Calendar,
  UserPlus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapView } from "@/components/maps/MapView";

// Mock data
const casesData = [
  {
    id: "1",
    ob_number: "OB-2025-001",
    title: "Theft at Main Street",
    status: "in-progress" as const,
    priority: "high" as const,
    date: "2025-03-28",
    location: "123 Main St",
    incident_type: "Theft",
    officer: "Officer Johnson",
    team: null,
    coordinates: { lat: -1.2901, lng: 36.8229 },
  },
  {
    id: "2",
    ob_number: "OB-2025-002",
    title: "Vandalism at Central Park",
    status: "open" as const,
    priority: "medium" as const,
    date: "2025-03-27",
    location: "Central Park",
    incident_type: "Vandalism",
    officer: null,
    team: null,
    coordinates: { lat: -1.2852, lng: 36.8143 },
  },
  {
    id: "3",
    ob_number: "OB-2025-003",
    title: "Missing Person Report",
    status: "open" as const,
    priority: "high" as const,
    date: "2025-03-26",
    location: "456 Oak Avenue",
    incident_type: "Missing Person",
    officer: "Officer Williams",
    team: null,
    coordinates: { lat: -1.2819, lng: 36.8243 },
  },
  {
    id: "4",
    ob_number: "OB-2025-004",
    title: "Assault Case",
    status: "in-progress" as const,
    priority: "high" as const,
    date: "2025-03-25",
    location: "789 Pine Street",
    incident_type: "Assault",
    officer: null,
    team: "Assault Investigation Team",
    coordinates: { lat: -1.2872, lng: 36.8200 },
  },
  {
    id: "5",
    ob_number: "OB-2025-005",
    title: "Noise Complaint",
    status: "closed" as const,
    priority: "low" as const,
    date: "2025-03-24",
    location: "101 Elm Road",
    incident_type: "Disturbance",
    officer: "Officer Davis",
    team: null,
    coordinates: { lat: -1.2845, lng: 36.8230 },
  },
];

const officers = [
  { id: "1", name: "Officer Johnson", available: true, cases: 4 },
  { id: "2", name: "Officer Williams", available: true, cases: 3 },
  { id: "3", name: "Officer Davis", available: true, cases: 2 },
  { id: "4", name: "Officer Martinez", available: false, cases: 5 },
  { id: "5", name: "Officer Brown", available: true, cases: 1 },
];

const teams = [
  { id: "1", name: "Theft Investigation Team", members: 4, cases: 6 },
  { id: "2", name: "Assault Investigation Team", members: 3, cases: 4 },
  { id: "3", name: "Special Investigations Unit", members: 5, cases: 3 },
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
    active: true,
  },
  {
    label: "Officers",
    href: "/officer-management",
    icon: <Users className="h-5 w-5" />,
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

export default function CaseAssignmentPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedCase, setSelectedCase] = useState<typeof casesData[0] | null>(null);
  const [assignTo, setAssignTo] = useState<"officer" | "team">("officer");
  const [selectedOfficer, setSelectedOfficer] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [assignmentNote, setAssignmentNote] = useState("");

  const handleAssign = () => {
    if (!selectedCase) return;
    
    // In production, this would call a Convex mutation
    console.log("Assigning case:", {
      caseId: selectedCase.id,
      assignType: assignTo,
      assigneeId: assignTo === "officer" ? selectedOfficer : selectedTeam,
      note: assignmentNote,
    });
    
    setShowAssignDialog(false);
    setSelectedCase(null);
    setSelectedOfficer("");
    setSelectedTeam("");
    setAssignmentNote("");
  };

  const openAssignDialog = (caseItem: typeof casesData[0]) => {
    setSelectedCase(caseItem);
    setShowAssignDialog(true);
  };

  const handleCaseClick = (caseId: string) => {
    router.push(`/case-management/${caseId}`);
  };

  // Filter cases based on active tab
  const filteredCases = casesData.filter((c) => {
    if (activeTab === "unassigned") return !c.officer && !c.team;
    if (activeTab === "assigned") return c.officer || c.team;
    if (activeTab === "high-priority") return c.priority === "high";
    return true;
  });

  const mapMarkers = filteredCases.map(c => ({
    id: c.id,
    lat: c.coordinates.lat,
    lng: c.coordinates.lng,
    title: c.title,
    description: `${c.ob_number} - ${c.incident_type}`,
  }));

  return (
    <DashboardLayout
      title="Case Management"
      subtitle="Assign and manage cases"
      navItems={navItems}
      role="station_admin"
      notifications={5}
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
              <TabsTrigger value="unassigned">Unassigned</TabsTrigger>
              <TabsTrigger value="assigned">Assigned</TabsTrigger>
              <TabsTrigger value="high-priority">High Priority</TabsTrigger>
            </TabsList>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
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
                        key: "date",
                        header: "Reported On",
                        cell: (row) => row.date,
                        sortable: true,
                      },
                      {
                        key: "assignment",
                        header: "Assigned To",
                        cell: (row) => {
                          if (row.officer) return row.officer;
                          if (row.team) return row.team;
                          return <span className="text-yellow-500">Unassigned</span>;
                        },
                      },
                    ]}
                    actions={(row) => (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            openAssignDialog(row);
                          }}
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Assign
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCaseClick(row.id);
                          }}
                        >
                          View
                        </Button>
                      </div>
                    )}
                    onRowClick={handleCaseClick}
                  />
                </CardContent>
              </Card>
            </div>

            <div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Case Locations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MapView
                      center={{ lat: -1.2864, lng: 36.8172 }}
                      markers={mapMarkers}
                      height="300px"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Available Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Officers</h4>
                        <div className="space-y-2">
                          {officers
                            .filter((o) => o.available)
                            .map((officer) => (
                              <div
                                key={officer.id}
                                className="flex justify-between items-center"
                              >
                                <span>{officer.name}</span>
                                <span className="text-gray-500 text-sm">
                                  {officer.cases} cases
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Teams</h4>
                        <div className="space-y-2">
                          {teams.map((team) => (
                            <div
                              key={team.id}
                              className="flex justify-between items-center"
                            >
                              <span>{team.name}</span>
                              <span className="text-gray-500 text-sm">
                                {team.cases} cases
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Tabs>

        {/* Case Assignment Dialog */}
        <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Assign Case {selectedCase?.ob_number}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{selectedCase?.title}</h3>
                  <p className="text-sm text-gray-500">{selectedCase?.incident_type}</p>
                </div>
                <CasePriorityBadge
                  priority={(selectedCase?.priority as "low" | "medium" | "high") || "medium"}
                />
              </div>

              <div className="space-y-3">
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="assign-officer"
                      checked={assignTo === "officer"}
                      onChange={() => setAssignTo("officer")}
                      className="mr-2"
                    />
                    <Label htmlFor="assign-officer">Assign to Officer</Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="assign-team"
                      checked={assignTo === "team"}
                      onChange={() => setAssignTo("team")}
                      className="mr-2"
                    />
                    <Label htmlFor="assign-team">Assign to Team</Label>
                  </div>
                </div>

                {assignTo === "officer" ? (
                  <Select
                    value={selectedOfficer}
                    onValueChange={setSelectedOfficer}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an officer" />
                    </SelectTrigger>
                    <SelectContent>
                      {officers
                        .filter((o) => o.available)
                        .map((officer) => (
                          <SelectItem key={officer.id} value={officer.id}>
                            {officer.name} ({officer.cases} cases)
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Select
                    value={selectedTeam}
                    onValueChange={setSelectedTeam}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a team" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name} ({team.cases} cases)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                <div>
                  <Label htmlFor="assignment-note">Assignment Note</Label>
                  <Textarea
                    id="assignment-note"
                    placeholder="Add any special instructions or notes..."
                    value={assignmentNote}
                    onChange={(e) => setAssignmentNote(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={handleAssign}
                disabled={
                  (assignTo === "officer" && !selectedOfficer) ||
                  (assignTo === "team" && !selectedTeam)
                }
              >
                Assign Case
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}