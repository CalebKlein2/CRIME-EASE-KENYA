import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";

// Mock officer data
const officersData = [
  {
    id: "1",
    name: "Officer Johnson",
    badge: "KPS-1234",
    rank: "Sergeant",
    status: "On duty",
    cases: 5,
    phone: "+254 712 345 678",
  },
  {
    id: "2",
    name: "Officer Chen",
    badge: "KPS-2345",
    rank: "Corporal",
    status: "On duty",
    cases: 3,
    phone: "+254 723 456 789",
  },
  {
    id: "3",
    name: "Officer Garcia",
    badge: "KPS-3456",
    rank: "Constable",
    status: "Off duty",
    cases: 0,
    phone: "+254 734 567 890",
  },
  {
    id: "4",
    name: "Officer Patel",
    badge: "KPS-4567",
    rank: "Constable",
    status: "On leave",
    cases: 0,
    phone: "+254 745 678 901",
  },
  {
    id: "5",
    name: "Officer Nguyen",
    badge: "KPS-5678",
    rank: "Sergeant",
    status: "On duty",
    cases: 4,
    phone: "+254 756 789 012",
  },
];

export default function StationOfficersPage() {
  const handleViewOfficer = (id: string) => {
    console.log("View officer details:", id);
    // Navigate to officer details page
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Station Officers</h2>
        <Button>Add New Officer</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Officers</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={officersData}
            columns={[
              {
                key: "name",
                header: "Name",
                cell: (item) => <span className="font-medium">{item.name}</span>,
              },
              {
                key: "badge",
                header: "Badge Number",
                cell: (item) => item.badge,
              },
              {
                key: "rank",
                header: "Rank",
                cell: (item) => item.rank,
              },
              {
                key: "status",
                header: "Status",
                cell: (item) => (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === "On duty" ? "bg-green-100 text-green-800" :
                      item.status === "Off duty" ? "bg-gray-100 text-gray-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {item.status}
                  </span>
                ),
              },
              {
                key: "cases",
                header: "Active Cases",
                cell: (item) => item.cases,
              },
              {
                key: "phone",
                header: "Contact",
                cell: (item) => item.phone,
              },
              {
                key: "actions",
                header: "Actions",
                cell: (item) => (
                  <Button size="sm" variant="outline" onClick={() => handleViewOfficer(item.id)}>
                    View Details
                  </Button>
                ),
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
