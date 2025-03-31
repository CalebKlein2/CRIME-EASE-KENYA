import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapView } from "@/components/maps/MapView";

// Create the map section component for the dashboard
export const MapSection = () => {
  // Police station locations mock data
  const locations = [
    { id: "1", name: "Central Police Station", lat: -1.286389, lng: 36.817223, cases: 142 },
    { id: "2", name: "Kilimani Police Station", lat: -1.291111, lng: 36.783333, cases: 98 },
    { id: "3", name: "Gigiri Police Station", lat: -1.235278, lng: 36.805556, cases: 76 },
    { id: "4", name: "Buruburu Police Station", lat: -1.273056, lng: 36.878611, cases: 112 },
    { id: "5", name: "Karen Police Station", lat: -1.319444, lng: 36.706667, cases: 64 },
  ];

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Crime Hotspots</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <MapView 
          locations={locations}
          centerLat={-1.286389}
          centerLng={36.817223}
          zoom={12}
          showHeatmap={true}
        />
      </CardContent>
    </Card>
  );
};
