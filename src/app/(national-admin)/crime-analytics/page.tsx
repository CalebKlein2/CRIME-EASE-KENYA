// src/app/(national-admin)/crime-analytics/page.tsx
"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatisticsChart } from "@/components/charts/StatisticsChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapView } from "@/components/maps/MapView";
import { DataTable } from "@/components/tables/DataTable";
import {
  ClipboardList,
  Users,
  Shield,
  Building,
  Settings,
  BarChart,
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Mock data
const crimeByRegionData = [
  { name: "Nairobi", theft: 245, assault: 128, vandalism: 89, fraud: 112 },
  { name: "Central", theft: 156, assault: 76, vandalism: 65, fraud: 48 },
  { name: "Coast", theft: 178, assault: 92, vandalism: 58, fraud: 73 },
  { name: "Western", theft: 132, assault: 65, vandalism: 42, fraud: 32 },
  { name: "Rift Valley", theft: 167, assault: 81, vandalism: 54, fraud: 45 },
];

const crimeOverTimeData = [
  { month: "Jan", violent: 245, property: 378, other: 156 },
  { month: "Feb", violent: 232, property: 352, other: 164 },
  { month: "Mar", violent: 258, property: 365, other: 175 },
  { month: "Apr", violent: 243, property: 329, other: 168 },
  { month: "May", violent: 276, property: 345, other: 172 },
  { month: "Jun", violent: 289, property: 367, other: 185 },
];

const resolutionRateData = [
  { month: "Jan", rate: 62 },
  { month: "Feb", rate: 65 },
  { month: "Mar", rate: 68 },
  { month: "Apr", rate: 64 },
  { month: "May", rate: 67 },
  { month: "Jun", rate: 71 },
];

const crimeHotspots = [
  { id: "1", lat: -1.2864, lng: 36.8172, title: "CBD Hotspot", description: "High theft rates", weight: 10 },
  { id: "2", lat: -1.2700, lng: 36.8100, title: "Westlands Area", description: "Vehicle theft", weight: 8 },
  { id: "3", lat: -1.3000, lng: 36.8250, title: "South B Area", description: "Burglary reports", weight: 7 },
  { id: "4", lat: -1.2650, lng: 36.7950, title: "Parklands", description: "Robberies", weight: 6 },
  { id: "5", lat: -1.2950, lng: 36.8080, title: "Kilimani", description: "House break-ins", weight: 9 },
];

const topCrimesData = [
  { id: "1", type: "Theft/Larceny", count: 845, change: 5.2, trend: "up" as const },
  { id: "2", type: "Assault", count: 442, change: -2.8, trend: "down" as const },
  { id: "3", type: "Burglary", count: 356, change: 7.4, trend: "up" as const },
  { id: "4", type: "Fraud", count: 310, change: 12.6, trend: "up" as const },
  { id: "5", type: "Vandalism", count: 287, change: -1.5, trend: "down" as const },
  { id: "6", type: "Drug Offenses", count: 256, change: 4.3, trend: "up" as const },
  { id: "7", type: "Vehicle Theft", count: 198, change: -8.2, trend: "down" as const },
  { id: "8", type: "Robbery", count: 176, change: -3.4, trend: "down" as const },
];

// Navigation items
const navItems = [
  {
    label: "Dashboard",
    href: "/national-dashboard",
    icon: <ClipboardList className="h-5 w-5" />,
  },
  {
    label: "Stations",
    href: "/station-map",
    icon: <Building className="h-5 w-5" />,
  },
  {
    label: "Crime Analytics",
    href: "/crime-analytics",
    icon: <BarChart className="h-5 w-5" />,
    active: true,
  },
  {
    label: "Resources",
    href: "/resource-management",
    icon: <Shield className="h-5 w-5" />,
  },
  {
    label: "Users",
    href: "/user-administration",
    icon: <Users className="h-5 w-5" />,
  },
  {
    label: "System",
    href: "/system-config",
    icon: <Settings className="h-5 w-5" />,
  },
];

export default function CrimeAnalytics() {
  const [timeRange, setTimeRange] = useState("6m");
  const [region, setRegion] = useState("all");

  return (
    <DashboardLayout
      title="Crime Analytics"
      subtitle="Nationwide crime statistics and patterns"
      navItems={navItems}
      role="national_admin"
      notifications={8}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">Last Month</SelectItem>
                <SelectItem value="3m">Last 3 Months</SelectItem>
                <SelectItem value="6m">Last 6 Months</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="nairobi">Nairobi</SelectItem>
                <SelectItem value="central">Central</SelectItem>
                <SelectItem value="coast">Coast</SelectItem>
                <SelectItem value="western">Western</SelectItem>
                <SelectItem value="rift">Rift Valley</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">
              Data as of March 29, 2025
            </span>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Crime Trends</TabsTrigger>
            <TabsTrigger value="hotspots">Crime Hotspots</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Reported Crimes</p>
                      <h3 className="text-2xl font-bold mt-1">2,458</h3>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-xs text-green-500">+3.2% from previous period</span>
                      </div>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-full text-blue-700">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Resolution Rate</p>
                      <h3 className="text-2xl font-bold mt-1">67.3%</h3>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-xs text-green-500">+2.5% from previous period</span>
                      </div>
                    </div>
                    <div className="p-2 bg-green-100 rounded-full text-green-700">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Violent Crimes</p>
                      <h3 className="text-2xl font-bold mt-1">792</h3>
                      <div className="flex items-center mt-1">
                        <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-xs text-green-500">-1.8% from previous period</span>
                      </div>
                    </div>
                    <div className="p-2 bg-red-100 rounded-full text-red-700">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Property Crimes</p>
                      <h3 className="text-2xl font-bold mt-1">1,386</h3>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-xs text-red-500">+5.7% from previous period</span>
                      </div>
                    </div>
                    <div className="p-2 bg-orange-100 rounded-full text-orange-700">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Crime by Type and Region Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Crime by Region and Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <StatisticsChart
                    title=""
                    type="bar"
                    data={crimeByRegionData}
                    dataKeys={["theft", "assault", "vandalism", "fraud"]}
                    colors={["#3b82f6", "#ef4444", "#f59e0b", "#10b981"]}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Crime Trends Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <StatisticsChart
                    title=""
                    type="line"
                    data={crimeOverTimeData}
                    dataKeys={["violent", "property", "other"]}
                    colors={["#ef4444", "#3b82f6", "#f59e0b"]}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Top Crimes Table */}
            <Card>
              <CardHeader>
                <CardTitle>Top Crime Types</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={topCrimesData}
                  columns={[
                    {
                      key: "type",
                      header: "Crime Type",
                      cell: (row) => <span className="font-medium">{row.type}</span>,
                    },
                    {
                      key: "count",
                      header: "Reported Cases",
                      cell: (row) => row.count.toLocaleString(),
                      sortable: true,
                    },
                    {
                      key: "trend",
                      header: "Trend",
                      cell: (row) => (
                        <div className="flex items-center">
                          {row.trend === "up" ? (
                            <>
                              <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                              <span className="text-red-500">+{row.change}%</span>
                            </>
                          ) : (
                            <>
                              <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                              <span className="text-green-500">{row.change}%</span>
                            </>
                          )}
                        </div>
                      ),
                    },
                  ]}
                  pagination={false}
                  searchable={false}
                />
              </CardContent>
            </Card>

            {/* Resolution Rate Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Case Resolution Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <StatisticsChart
                    title=""
                    type="line"
                    data={resolutionRateData}
                    dataKeys={["rate"]}
                    colors={["#3b82f6"]}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Crime Trends Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 mb-4">
                    Detailed crime trend analysis will be displayed here, showing patterns over time, seasonal variations, 
                    and correlations between different crime types.
                  </p>
                  <div className="h-[400px] bg-gray-100 rounded-md flex items-center justify-center">
                    <p className="text-gray-500">Trend visualization would appear here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="hotspots">
            <Card>
              <CardHeader>
                <CardTitle>Crime Hotspot Map</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[500px]">
                  <MapView
                    center={{ lat: -1.2864, lng: 36.8172 }}
                    zoom={12}
                    markers={crimeHotspots}
                    height="100%"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generated Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Monthly Crime Statistics - March 2025</h3>
                        <p className="text-sm text-gray-500">Generated on March 29, 2025</p>
                      </div>
                      <button className="flex items-center text-blue-600 hover:text-blue-800">
                        <Download className="h-4 w-4 mr-1" />
                        Download PDF
                      </button>
                    </div>
                    <div className="p-4 border rounded-md flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Quarterly Crime Analysis - Q1 2025</h3>
                        <p className="text-sm text-gray-500">Generated on March 25, 2025</p>
                      </div>
                      <button className="flex items-center text-blue-600 hover:text-blue-800">
                        <Download className="h-4 w-4 mr-1" />
                        Download PDF
                      </button>
                    </div>
                    <div className="p-4 border rounded-md flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Regional Crime Comparison - 2025</h3>
                        <p className="text-sm text-gray-500">Generated on March 15, 2025</p>
                      </div>
                      <button className="flex items-center text-blue-600 hover:text-blue-800">
                        <Download className="h-4 w-4 mr-1" />
                        Download PDF
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}