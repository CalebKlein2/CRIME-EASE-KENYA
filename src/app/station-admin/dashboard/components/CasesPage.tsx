import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { CaseStatusBadge } from "@/components/case/CaseStatusBadge";
import { CasePriorityBadge } from "@/components/case/CasePriorityBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock case data
const casesData = [
  {
    id: "1",
    ob_number: "OB-2025-001",
    title: "Theft at Main Street",
    status: "in-progress" as const,
    priority: "high" as const,
    reporter: "John Doe",
    date_reported: "2025-03-15",
    officer: "Officer Johnson",
  },
  {
    id: "2",
    ob_number: "OB-2025-002",
    title: "Vandalism at Central Park",
    status: "open" as const,
    priority: "medium" as const,
    reporter: "Jane Smith",
    date_reported: "2025-03-20",
    officer: "Officer Chen",
  },
  {
    id: "3",
    ob_number: "OB-2025-003",
    title: "Missing Person Report",
    status: "open" as const,
    priority: "high" as const,
    reporter: "Michael Brown",
    date_reported: "2025-03-22",
    officer: "Officer Garcia",
  },
  {
    id: "4",
    ob_number: "OB-2025-004",
    title: "Traffic Accident on Highway 5",
    status: "closed" as const,
    priority: "low" as const,
    reporter: "Sarah Johnson",
    date_reported: "2025-03-10",
    officer: "Officer Patel",
  },
  {
    id: "5",
    ob_number: "OB-2025-005",
    title: "Domestic Disturbance Call",
    status: "in-progress" as const,
    priority: "medium" as const,
    reporter: "Robert Wilson",
    date_reported: "2025-03-25",
    officer: "Officer Nguyen",
  },
];

export default function StationCasesPage() {
  const handleViewCase = (id: string) => {
    console.log("View case details:", id);
    // Navigate to case details page
  };

  const handleAssignCase = (id: string) => {
    console.log("Assign case:", id);
    // Open assign case dialog
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Station Cases</h2>
        <Button>Register New Case</Button>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Cases</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={casesData}
                columns={[
                  {
                    key: "ob_number",
                    header: "OB Number",
                    cell: (item) => <span className="font-medium">{item.ob_number}</span>,
                  },
                  {
                    key: "title",
                    header: "Case Title",
                    cell: (item) => item.title,
                  },
                  {
                    key: "status",
                    header: "Status",
                    cell: (item) => <CaseStatusBadge status={item.status} />,
                  },
                  {
                    key: "priority",
                    header: "Priority",
                    cell: (item) => <CasePriorityBadge priority={item.priority} />,
                  },
                  {
                    key: "date_reported",
                    header: "Date Reported",
                    cell: (item) => item.date_reported,
                  },
                  {
                    key: "officer",
                    header: "Assigned Officer",
                    cell: (item) => item.officer || "Unassigned",
                  },
                  {
                    key: "actions",
                    header: "Actions",
                    cell: (item) => (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleViewCase(item.id)}>
                          View
                        </Button>
                        {(item.status === "open" || !item.officer) && (
                          <Button size="sm" variant="outline" onClick={() => handleAssignCase(item.id)}>
                            Assign
                          </Button>
                        )}
                      </div>
                    ),
                  },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="open" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Open Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={casesData.filter(c => c.status === "open")}
                columns={[
                  {
                    key: "ob_number",
                    header: "OB Number",
                    cell: (item) => <span className="font-medium">{item.ob_number}</span>,
                  },
                  {
                    key: "title",
                    header: "Case Title",
                    cell: (item) => item.title,
                  },
                  {
                    key: "priority",
                    header: "Priority",
                    cell: (item) => <CasePriorityBadge priority={item.priority} />,
                  },
                  {
                    key: "date_reported",
                    header: "Date Reported",
                    cell: (item) => item.date_reported,
                  },
                  {
                    key: "actions",
                    header: "Actions",
                    cell: (item) => (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleViewCase(item.id)}>
                          View
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleAssignCase(item.id)}>
                          Assign
                        </Button>
                      </div>
                    ),
                  },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="in-progress" className="mt-6">
          {/* Similar content for in-progress cases */}
          <Card>
            <CardHeader>
              <CardTitle>In Progress Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={casesData.filter(c => c.status === "in-progress")}
                columns={[
                  {
                    key: "ob_number",
                    header: "OB Number",
                    cell: (item) => <span className="font-medium">{item.ob_number}</span>,
                  },
                  {
                    key: "title",
                    header: "Case Title",
                    cell: (item) => item.title,
                  },
                  {
                    key: "priority",
                    header: "Priority",
                    cell: (item) => <CasePriorityBadge priority={item.priority} />,
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
                      <Button size="sm" variant="outline" onClick={() => handleViewCase(item.id)}>
                        View
                      </Button>
                    ),
                  },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="closed" className="mt-6">
          {/* Similar content for closed cases */}
          <Card>
            <CardHeader>
              <CardTitle>Closed Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={casesData.filter(c => c.status === "closed")}
                columns={[
                  {
                    key: "ob_number",
                    header: "OB Number",
                    cell: (item) => <span className="font-medium">{item.ob_number}</span>,
                  },
                  {
                    key: "title",
                    header: "Case Title",
                    cell: (item) => item.title,
                  },
                  {
                    key: "date_reported",
                    header: "Date Reported",
                    cell: (item) => item.date_reported,
                  },
                  {
                    key: "officer",
                    header: "Handled By",
                    cell: (item) => item.officer,
                  },
                  {
                    key: "actions",
                    header: "Actions",
                    cell: (item) => (
                      <Button size="sm" variant="outline" onClick={() => handleViewCase(item.id)}>
                        View
                      </Button>
                    ),
                  },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
