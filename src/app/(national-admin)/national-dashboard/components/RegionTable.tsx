// @ts-nocheck
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data
const regionData = [
  {
    id: "1",
    region: "Nairobi",
    cases: 542,
    officers: 120,
    stations: 12,
    clearance_rate: "68%",
  },
  {
    id: "2",
    region: "Mombasa",
    cases: 423,
    officers: 85,
    stations: 8,
    clearance_rate: "62%",
  },
  {
    id: "3",
    region: "Kisumu",
    cases: 321,
    officers: 65,
    stations: 7,
    clearance_rate: "59%",
  },
  {
    id: "4",
    region: "Nakuru",
    cases: 254,
    officers: 45,
    stations: 6,
    clearance_rate: "65%",
  },
  {
    id: "5",
    region: "Eldoret",
    cases: 187,
    officers: 40,
    stations: 5,
    clearance_rate: "60%",
  },
];

export const RegionTable = () => {
  const navigate = useNavigate();
  
  const handleRegionClick = (id: string) => {
    navigate(`/national-admin/regions/${id}`);
  };
  
  const columns = [
    {
      header: "Region",
      accessorKey: "region",
    },
    {
      header: "Cases",
      accessorKey: "cases",
    },
    {
      header: "Officers",
      accessorKey: "officers",
    },
    {
      header: "Stations",
      accessorKey: "stations",
    },
    {
      header: "Clearance Rate",
      accessorKey: "clearance_rate",
    },
    {
      header: "Actions",
      cell: ({ row }: any) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleRegionClick(row.original.id)}
        >
          Details <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
  ];
  
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Regional Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={regionData} />
      </CardContent>
    </Card>
  );
};

