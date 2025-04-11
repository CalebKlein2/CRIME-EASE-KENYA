import React from 'react';
import { StatsCard } from "@/components/dashboard/StatsCard";
import { StatisticsChart } from "@/components/charts/StatisticsChart";
import { DataTable } from "@/components/tables/DataTable";
import { CaseStatusBadge } from "@/components/case/CaseStatusBadge";
import { CasePriorityBadge } from "@/components/case/CasePriorityBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  UserCheck, 
  Clock,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { MapView } from "@/components/maps/MapView";
import { Button } from "@/components/ui/button";

interface DashboardHomeProps {
  recentCases: any[];
  resourcesData: any[];
  officerActivityData: any[];
  caseTypeData: any[];
  totalCases: number;
  activeOfficers: number;
  caseClearance: number;
  highPriorityCases: number;
  handleCaseClick: (id: string) => void;
}

export default function StationDashboardHome({ 
  recentCases, 
  resourcesData, 
  officerActivityData,
  caseTypeData,
  totalCases,
  activeOfficers,
  caseClearance,
  highPriorityCases,
  handleCaseClick 
}: DashboardHomeProps) {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Cases"
          value={totalCases}
          icon={<FileText className="h-6 w-6 text-blue-600" />}
          description="Total cases this month"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Active Officers"
          value={activeOfficers}
          icon={<UserCheck className="h-6 w-6 text-green-600" />}
          description="Currently on duty"
          trend={{ value: 2, isPositive: true }}
        />
        <StatsCard
          title="Case Clearance"
          value={`${caseClearance}%`}
          icon={<Clock className="h-6 w-6 text-amber-600" />}
          description="Average this month"
          trend={{ value: 5, isPositive: false }}
        />
        <StatsCard
          title="High Priority"
          value={highPriorityCases}
          icon={<AlertTriangle className="h-6 w-6 text-red-600" />}
          description="Cases needing attention"
          trend={{ value: 1, isPositive: true }}
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
              <StatisticsChart 
                title="Crime Type Distribution"
                type="bar"
                data={caseTypeData}
                dataKeys={["value"]}
                colors={["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6"]}
              />
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
                  key: "ob_number",
                  header: "OB Number",
                  cell: (item) => (
                    <div className="font-medium">{item.ob_number}</div>
                  ),
                },
                {
                  key: "title",
                  header: "Case Title",
                  cell: (item) => item.title,
                },
                {
                  key: "status",
                  header: "Status",
                  cell: (item) => (
                    <CaseStatusBadge status={item.status} />
                  ),
                },
                {
                  key: "priority",
                  header: "Priority",
                  cell: (item) => (
                    <CasePriorityBadge priority={item.priority} />
                  ),
                },
                {
                  key: "officer",
                  header: "Assigned Officer",
                  cell: (item) => item.officer,
                },
                {
                  key: "actions",
                  header: "Actions",
                  cell: (item) => (
                    <Button size="sm" variant="outline" onClick={() => handleCaseClick(item.id)}>
                      View Details
                    </Button>
                  ),
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
                  key: "resource",
                  header: "Resource",
                  cell: (item) => <span className="font-medium">{item.resource}</span>,
                },
                {
                  key: "available",
                  header: "Available",
                  cell: (item) => item.available,
                },
                {
                  key: "total",
                  header: "Total",
                  cell: (item) => item.total,
                },
                {
                  key: "status",
                  header: "Status",
                  cell: (item) => (
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status.includes("100%") ? "bg-green-100 text-green-800" : 
                        item.status.includes("75%") ? "bg-yellow-100 text-yellow-800" : 
                        "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  ),
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
  );
}
