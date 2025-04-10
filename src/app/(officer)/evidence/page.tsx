// src/app/(officer)/evidence/page.tsx
"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/tables/DataTable";
import { FileUploader } from "@/components/forms/FileUploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  ClipboardList,
  FileText,
  MessageSquare,
  Users,
  Download,
  Eye,
  Trash2,
  Video,
  Image,
  FileText as FileIcon,
  Mic,
  File,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const evidenceData = [
  {
    id: "1",
    title: "CCTV Footage",
    case_number: "OB-2025-001",
    case_title: "Theft at Main Street",
    type: "video",
    file_name: "cctv_main_st_20250328.mp4",
    size: "24.5 MB",
    uploaded_by: "Officer Johnson",
    uploaded_at: "2025-03-28",
    verified: true,
  },
  {
    id: "2",
    title: "Scene Photos",
    case_number: "OB-2025-001",
    case_title: "Theft at Main Street",
    type: "image",
    file_name: "scene_photos.zip",
    size: "8.2 MB",
    uploaded_by: "Officer Johnson",
    uploaded_at: "2025-03-28",
    verified: true,
  },
  {
    id: "3",
    title: "Victim Statement",
    case_number: "OB-2025-001",
    case_title: "Theft at Main Street",
    type: "document",
    file_name: "victim_statement.pdf",
    size: "1.4 MB",
    uploaded_by: "Officer Johnson",
    uploaded_at: "2025-03-28",
    verified: true,
  },
  {
    id: "4",
    title: "Suspect Interview",
    case_number: "OB-2025-003",
    case_title: "Missing Person Report",
    type: "audio",
    file_name: "suspect_interview.mp3",
    size: "12.8 MB",
    uploaded_by: "Officer Johnson",
    uploaded_at: "2025-03-27",
    verified: false,
  },
  {
    id: "5",
    title: "Traffic Camera Footage",
    case_number: "OB-2025-002",
    case_title: "Vandalism at Central Park",
    type: "video",
    file_name: "traffic_cam_20250327.mp4",
    size: "45.2 MB",
    uploaded_by: "Officer Johnson",
    uploaded_at: "2025-03-27",
    verified: true,
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
    active: true,
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

export default function EvidenceManagementPage() {
  const [selectedCase, setSelectedCase] = useState("");
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4 text-blue-500" />;
      case "image":
        return <Image className="h-4 w-4 text-green-500" />;
      case "document":
        return <FileIcon className="h-4 w-4 text-orange-500" />;
      case "audio":
        return <Mic className="h-4 w-4 text-purple-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleUploadEvidence = async (files: File[]) => {
    // In production, this would upload to Convex storage
    console.log("Uploading files:", files);
    setShowUploadDialog(false);
    return Promise.resolve();
  };

  return (
    <DashboardLayout
      title="Evidence Management"
      subtitle="Manage case evidence and uploads"
      navItems={navItems}
      role="officer"
      notifications={3}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Evidence Files</h2>
          </div>
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button>Upload Evidence</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Upload Evidence Files</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="case-select" className="text-sm font-medium">
                    Select Case
                  </label>
                  <select
                    id="case-select"
                    className="w-full rounded-md border border-gray-300 p-2"
                    value={selectedCase}
                    onChange={(e) => setSelectedCase(e.target.value)}
                  >
                    <option value="">Select a case...</option>
                    <option value="OB-2025-001">OB-2025-001: Theft at Main Street</option>
                    <option value="OB-2025-002">OB-2025-002: Vandalism at Central Park</option>
                    <option value="OB-2025-003">OB-2025-003: Missing Person Report</option>
                  </select>
                </div>
                <FileUploader
                  onUpload={handleUploadEvidence}
                  label="Upload evidence files"
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Files</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardContent className="p-6">
                <DataTable
                  data={evidenceData}
                  columns={[
                    {
                      key: "type",
                      header: "Type",
                      cell: (row) => (
                        <div className="flex items-center">
                          {getTypeIcon(row.type)}
                          <span className="ml-2 capitalize">{row.type}</span>
                        </div>
                      ),
                    },
                    {
                      key: "title",
                      header: "Title",
                      cell: (row) => row.title,
                    },
                    {
                      key: "case_number",
                      header: "Case Number",
                      cell: (row) => row.case_number,
                    },
                    {
                      key: "file_name",
                      header: "File Name",
                      cell: (row) => row.file_name,
                    },
                    {
                      key: "size",
                      header: "Size",
                      cell: (row) => row.size,
                    },
                    {
                      key: "uploaded_at",
                      header: "Uploaded On",
                      cell: (row) => row.uploaded_at,
                      sortable: true,
                    },
                    {
                      key: "verified",
                      header: "Verified",
                      cell: (row) => (
                        <span className={row.verified ? "text-green-500" : "text-orange-500"}>
                          {row.verified ? "Yes" : "Pending"}
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
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardContent className="p-6">
                <DataTable
                  data={evidenceData.filter((evidence) => evidence.type === "document")}
                  columns={[
                    {
                      key: "title",
                      header: "Title",
                      cell: (row) => row.title,
                    },
                    {
                      key: "case_number",
                      header: "Case Number",
                      cell: (row) => row.case_number,
                    },
                    {
                      key: "file_name",
                      header: "File Name",
                      cell: (row) => row.file_name,
                    },
                    {
                      key: "size",
                      header: "Size",
                      cell: (row) => row.size,
                    },
                    {
                      key: "uploaded_at",
                      header: "Uploaded On",
                      cell: (row) => row.uploaded_at,
                      sortable: true,
                    },
                  ]}
                  actions={(row) => (
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos">
            <Card>
              <CardContent className="p-6">
                <DataTable
                  data={evidenceData.filter((evidence) => evidence.type === "image")}
                  columns={[
                    {
                      key: "title",
                      header: "Title",
                      cell: (row) => row.title,
                    },
                    {
                      key: "case_number",
                      header: "Case Number",
                      cell: (row) => row.case_number,
                    },
                    {
                      key: "file_name",
                      header: "File Name",
                      cell: (row) => row.file_name,
                    },
                    {
                      key: "size",
                      header: "Size",
                      cell: (row) => row.size,
                    },
                    {
                      key: "uploaded_at",
                      header: "Uploaded On",
                      cell: (row) => row.uploaded_at,
                      sortable: true,
                    },
                  ]}
                  actions={(row) => (
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="videos">
            <Card>
              <CardContent className="p-6">
                <DataTable
                  data={evidenceData.filter((evidence) => evidence.type === "video")}
                  columns={[
                    {
                      key: "title",
                      header: "Title",
                      cell: (row) => row.title,
                    },
                    {
                      key: "case_number",
                      header: "Case Number",
                      cell: (row) => row.case_number,
                    },
                    {
                      key: "file_name",
                      header: "File Name",
                      cell: (row) => row.file_name,
                    },
                    {
                      key: "size",
                      header: "Size",
                      cell: (row) => row.size,
                    },
                    {
                      key: "uploaded_at",
                      header: "Uploaded On",
                      cell: (row) => row.uploaded_at,
                      sortable: true,
                    },
                  ]}
                  actions={(row) => (
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audio">
            <Card>
              <CardContent className="p-6">
                <DataTable
                  data={evidenceData.filter((evidence) => evidence.type === "audio")}
                  columns={[
                    {
                      key: "title",
                      header: "Title",
                      cell: (row) => row.title,
                    },
                    {
                      key: "case_number",
                      header: "Case Number",
                      cell: (row) => row.case_number,
                    },
                    {
                      key: "file_name",
                      header: "File Name",
                      cell: (row) => row.file_name,
                    },
                    {
                      key: "size",
                      header: "Size",
                      cell: (row) => row.size,
                    },
                    {
                      key: "uploaded_at",
                      header: "Uploaded On",
                      cell: (row) => row.uploaded_at,
                      sortable: true,
                    },
                  ]}
                  actions={(row) => (
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
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