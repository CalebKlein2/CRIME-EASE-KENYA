// src/app/(officer)/interviews/page.tsx
"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  ClipboardList,
  FileText,
  MessageSquare,
  Users,
  Calendar as CalendarIcon,
  Clock,
  Video,
  Trash2,
  Plus,
  User,
  Link,
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
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const interviewsData = [
  {
    id: "1",
    case_number: "OB-2025-001",
    case_title: "Theft at Main Street",
    interview_type: "Witness",
    interviewee: "John Smith",
    date: "2025-03-30",
    time: "10:00 AM",
    platform: "Zoom",
    status: "scheduled",
    officer: "Officer Johnson",
  },
  {
    id: "2",
    case_number: "OB-2025-003",
    case_title: "Missing Person Report",
    interview_type: "Victim",
    interviewee: "Sarah Johnson",
    date: "2025-03-31",
    time: "02:30 PM",
    platform: "Google Meet",
    status: "scheduled",
    officer: "Officer Johnson",
  },
  {
    id: "3",
    case_number: "OB-2025-002",
    case_title: "Vandalism at Central Park",
    interview_type: "Suspect",
    interviewee: "Anonymous",
    date: "2025-03-29",
    time: "11:15 AM",
    platform: "Zoom",
    status: "completed",
    officer: "Officer Johnson",
  },
  {
    id: "4",
    case_number: "OB-2025-001",
    case_title: "Theft at Main Street",
    interview_type: "Witness",
    interviewee: "Michael Brown",
    date: "2025-03-28",
    time: "09:45 AM",
    platform: "Zoom",
    status: "completed",
    officer: "Officer Johnson",
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
    active: true,
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

export default function InterviewScheduler() {
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [formData, setFormData] = useState({
    case: "",
    interviewee: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    duration: "30",
    platform: "zoom",
    notes: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would call a Convex mutation
    console.log("Scheduling interview:", formData);
    setShowScheduleDialog(false);
  };

  return (
    <DashboardLayout
      title="Interview Scheduler"
      subtitle="Schedule and manage virtual interviews"
      navItems={navItems}
      role="officer"
      notifications={3}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Interviews</h2>
          </div>
          <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Interview
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Schedule New Interview</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSchedule} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="case">Case</Label>
                    <Select
                      name="case"
                      value={formData.case}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, case: value }))}
                    >
                      <SelectTrigger id="case">
                        <SelectValue placeholder="Select a case" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OB-2025-001">OB-2025-001: Theft at Main Street</SelectItem>
                        <SelectItem value="OB-2025-002">OB-2025-002: Vandalism at Central Park</SelectItem>
                        <SelectItem value="OB-2025-003">OB-2025-003: Missing Person Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="interviewee">Interviewee Name</Label>
                      <Input
                        id="interviewee"
                        name="interviewee"
                        value={formData.interviewee}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="interview-type">Interview Type</Label>
                      <Select
                        name="interview-type"
                        value={formData.interviewType}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, interviewType: value }))}
                      >
                        <SelectTrigger id="interview-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="witness">Witness</SelectItem>
                          <SelectItem value="victim">Victim</SelectItem>
                          <SelectItem value="suspect">Suspect</SelectItem>
                          <SelectItem value="informant">Informant</SelectItem>
                        </SelectContent>
                      </Select>
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
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        name="time"
                        type="time"
                        value={formData.time}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Select
                        name="duration"
                        value={formData.duration}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, duration: value }))}
                      >
                        <SelectTrigger id="duration">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                          <SelectItem value="90">90 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="platform">Platform</Label>
                    <Select
                      name="platform"
                      value={formData.platform}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, platform: value }))}
                    >
                      <SelectTrigger id="platform">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zoom">Zoom</SelectItem>
                        <SelectItem value="google-meet">Google Meet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="notes">Interview Notes/Agenda</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="submit">Schedule Interview</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All Interviews</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <Card>
              <CardContent className="p-6">
                <DataTable
                  data={interviewsData.filter((interview) => interview.status === "scheduled")}
                  columns={[
                    {
                      key: "case_number",
                      header: "Case Number",
                      cell: (row) => row.case_number,
                    },
                    {
                      key: "interview_type",
                      header: "Type",
                      cell: (row) => row.interview_type,
                    },
                    {
                      key: "interviewee",
                      header: "Interviewee",
                      cell: (row) => (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span>{row.interviewee}</span>
                        </div>
                      ),
                    },
                    {
                      key: "date",
                      header: "Date",
                      cell: (row) => (
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-gray-400" />
                          <span>{row.date}</span>
                        </div>
                      ),
                      sortable: true,
                    },
                    {
                      key: "time",
                      header: "Time",
                      cell: (row) => (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{row.time}</span>
                        </div>
                      ),
                    },
                    {
                      key: "platform",
                      header: "Platform",
                      cell: (row) => (
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-gray-400" />
                          <span>{row.platform}</span>
                        </div>
                      ),
                    },
                  ]}
                  actions={(row) => (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Link className="h-4 w-4 mr-1" />
                        Join
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardContent className="p-6">
                <DataTable
                  data={interviewsData.filter((interview) => interview.status === "completed")}
                  columns={[
                    {
                      key: "case_number",
                      header: "Case Number",
                      cell: (row) => row.case_number,
                    },
                    {
                      key: "interview_type",
                      header: "Type",
                      cell: (row) => row.interview_type,
                    },
                    {
                      key: "interviewee",
                      header: "Interviewee",
                      cell: (row) => row.interviewee,
                    },
                    {
                      key: "date",
                      header: "Date",
                      cell: (row) => row.date,
                      sortable: true,
                    },
                    {
                      key: "platform",
                      header: "Platform",
                      cell: (row) => row.platform,
                    },
                  ]}
                  actions={(row) => (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-1" />
                        View Record
                      </Button>
                    </div>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all">
            <Card>
              <CardContent className="p-6">
                <DataTable
                  data={interviewsData}
                  columns={[
                    {
                      key: "case_number",
                      header: "Case Number",
                      cell: (row) => row.case_number,
                    },
                    {
                      key: "interview_type",
                      header: "Type",
                      cell: (row) => row.interview_type,
                    },
                    {
                      key: "interviewee",
                      header: "Interviewee",
                      cell: (row) => row.interviewee,
                    },
                    {
                      key: "date",
                      header: "Date",
                      cell: (row) => row.date,
                      sortable: true,
                    },
                    {
                      key: "time",
                      header: "Time",
                      cell: (row) => row.time,
                    },
                    {
                      key: "status",
                      header: "Status",
                      cell: (row) => (
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${
                            row.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {row.status === "completed" ? "Completed" : "Scheduled"}
                        </span>
                      ),
                    },
                  ]}
                  actions={(row) => (
                    <div className="flex gap-2">
                      {row.status === "scheduled" ? (
                        <Button size="sm" variant="outline">
                          <Link className="h-4 w-4 mr-1" />
                          Join
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          View Record
                        </Button>
                      )}
                    </div>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}