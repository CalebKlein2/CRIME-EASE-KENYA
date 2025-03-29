// src/app/(officer)/cases/[id]/page.tsx
"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CaseStatusBadge } from "@/components/case/CaseStatusBadge";
import { CasePriorityBadge } from "@/components/case/CasePriorityBadge";
import { CaseTimeline } from "@/components/case/CaseTimeline";
import { MapView } from "@/components/maps/MapView";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  ClipboardList,
  FileText,
  MessageSquare,
  Users,
  MapPin,
  Clock,
  Edit,
  Download,
  Upload,
  Plus,
  Phone,
  Mail,
} from "lucide-react";
import { FileUploader } from "@/components/forms/FileUploader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

// Mock case data
const caseData = {
  id: "1",
  ob_number: "OB-2025-001",
  title: "Theft at Main Street",
  status: "in-progress" as const,
  priority: "high" as const,
  date_reported: "2025-03-28",
  reporter: {
    name: "John Smith",
    phone: "+254 712 345 678",
    email: "john.smith@example.com",
    is_anonymous: false,
  },
  location: {
    address: "123 Main Street, Downtown",
    coordinates: { lat: -1.292066, lng: 36.821945 },
  },
  incident_type: "Theft",
  description: "Victim reported laptop and personal belongings stolen from their car while parked on Main Street. Car was locked but showed signs of forced entry. Incident occurred between 2:00PM and 4:00PM.",
  last_updated: "2025-03-29",
};

// Mock timeline data
const timelineData = [
  {
    id: "1",
    type: "status_change" as const,
    content: "Case status changed from Open to In Progress",
    date: "March 29, 2025 at 10:15 AM",
    user: {
      name: "Officer Johnson",
      role: "Investigating Officer",
    },
  },
  {
    id: "2",
    type: "note" as const,
    content: "Reviewed CCTV footage from nearby buildings. Potential suspect identified wearing red hoodie and dark jeans.",
    date: "March 28, 2025 at 4:30 PM",
    user: {
      name: "Officer Johnson",
      role: "Investigating Officer",
    },
  },
  {
    id: "3",
    type: "evidence_added" as const,
    content: "Added CCTV screenshots and incident scene photos",
    date: "March 28, 2025 at 2:15 PM",
    user: {
      name: "Officer Johnson",
      role: "Investigating Officer",
    },
  },
  {
    id: "4",
    type: "status_change" as const,
    content: "Case opened and assigned to Officer Johnson",
    date: "March 28, 2025 at 11:30 AM",
    user: {
      name: "Sergeant Williams",
      role: "Station Supervisor",
    },
  },
];

// Mock evidence data
const evidenceData = [
  {
    id: "1",
    title: "CCTV Footage",
    type: "video",
    file_name: "cctv_main_st_20250328.mp4",
    size: "24.5 MB",
    uploaded_by: "Officer Johnson",
    uploaded_at: "March 28, 2025 at 2:15 PM",
  },
  {
    id: "2",
    title: "Scene Photos",
    type: "photo",
    file_name: "scene_photos.zip",
    size: "8.2 MB",
    uploaded_by: "Officer Johnson",
    uploaded_at: "March 28, 2025 at 2:15 PM",
  },
  {
    id: "3",
    title: "Victim Statement",
    type: "document",
    file_name: "victim_statement.pdf",
    size: "1.4 MB",
    uploaded_by: "Officer Johnson",
    uploaded_at: "March 28, 2025 at 11:45 AM",
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

export default function CaseDetailPage() {
  const params = useParams();
  const { id } = params;
  const [newUpdate, setNewUpdate] = useState("");
  
  const handleAddUpdate = () => {
    if (newUpdate.trim()) {
      // In production, this would call a Convex mutation
      console.log("Adding update:", newUpdate);
      setNewUpdate("");
    }
  };
  
  const handleUploadEvidence = async (files: File[]) => {
    // In production, this would call a Convex mutation to upload files
    console.log("Uploading files:", files);
    return Promise.resolve();
  };
  
  const handleStatusChange = (newStatus: string) => {
    // In production, this would call a Convex mutation
    console.log("Changing status to:", newStatus);
  };

  return (
    <DashboardLayout
      title={`Case #${caseData.ob_number}`}
      subtitle={caseData.title}
      navItems={navItems}
      role="officer"
      notifications={3}
    >
      <div className="space-y-6">
        {/* Case Header */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <CaseStatusBadge status={caseData.status} size="lg" />
                  <Button variant="ghost" size="sm">
                    <Edit className="h-3 w-3 mr-1" />
                    Change
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Priority</p>
                <div className="flex items-center gap-2 mt-1">
                  <CasePriorityBadge priority={caseData.priority} size="lg" />
                  <Button variant="ghost" size="sm">
                    <Edit className="h-3 w-3 mr-1" />
                    Change
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Date Reported</p>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{caseData.date_reported}</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Incident Type</p>
                <p className="font-medium mt-1">{caseData.incident_type}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Location</p>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{caseData.location.address}</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{caseData.last_updated}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Case Details */}
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Case Description</h3>
                    <p className="text-gray-700">{caseData.description}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Case Updates</h3>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Update
                      </Button>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <Textarea 
                        placeholder="Add a new update to this case..."
                        value={newUpdate}
                        onChange={(e) => setNewUpdate(e.target.value)}
                        className="mb-2"
                      />
                      <div className="flex justify-end">
                        <Button onClick={handleAddUpdate} disabled={!newUpdate.trim()}>
                          Submit Update
                        </Button>
                      </div>
                    </div>

                    <CaseTimeline items={timelineData} />
                  </CardContent>
                </Card>
              </div>

              {/* Reporter Info & Actions */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Reporter Information</h3>
                    
                    {caseData.reporter.is_anonymous ? (
                      <div className="text-center p-4 bg-gray-50 rounded-md">
                        <p className="text-gray-500">This case was reported anonymously</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{caseData.reporter.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{caseData.reporter.name}</p>
                            <p className="text-sm text-gray-500">Reporter</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{caseData.reporter.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>{caseData.reporter.email}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Send Message
                          </Button>
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4 mr-2" />
                            Call Reporter
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Case Actions</h3>
                    <div className="space-y-2">
                      <Button className="w-full" variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Interview
                      </Button>
                      <Button className="w-full" variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Add Evidence
                      </Button>
                      <Button className="w-full" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Generate Report
                      </Button>
                      <Button className="w-full" variant="destructive">
                        Close Case
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Evidence Tab */}
          <TabsContent value="evidence" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Upload Evidence</h3>
                <FileUploader onUpload={handleUploadEvidence} />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Evidence Files</h3>
                <div className="space-y-4">
                  {evidenceData.map((evidence) => (
                    <div 
                      key={evidence.id}
                      className="flex items-start justify-between border-b pb-4 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 text-blue-700 p-2 rounded">
                          {evidence.type === "video" && <Video className="h-6 w-6" />}
                          {evidence.type === "photo" && <Image className="h-6 w-6" />}
                          {evidence.type === "document" && <FileText className="h-6 w-6" />}
                          {evidence.type === "audio" && <Mic className="h-6 w-6" />}
                        </div>
                        <div>
                          <p className="font-medium">{evidence.title}</p>
                          <p className="text-sm text-gray-500">{evidence.file_name}</p>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <span className="mr-2">{evidence.uploaded_at}</span>
                            <span className="mr-2">•</span>
                            <span>{evidence.size}</span>
                            <span className="mx-2">•</span>
                            <span>By {evidence.uploaded_by}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <Card>
              <CardContent className="p-6">
                <CaseTimeline items={timelineData} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communication Tab */}
          <TabsContent value="communication">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Communications</h3>
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500">No messages yet</p>
                  <Button className="mt-4">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Start Conversation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Map Tab */}
          <TabsContent value="map">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Case Location</h3>
                <MapView
                  center={caseData.location.coordinates}
                  zoom={15}
                  markers={[{
                    id: "1",
                    lat: caseData.location.coordinates.lat,
                    lng: caseData.location.coordinates.lng,
                    title: "Incident Location",
                    description: caseData.location.address
                  }]}
                  height="400px"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}