// src/app/(national-admin)/station-map/page.tsx
"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MapView } from "@/components/maps/MapView";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/tables/DataTable";
import {
  ClipboardList,
  Users,
  Shield,
  Building,
  Settings,
  BarChart,
  MapPin,
  Phone,
  Search,
  Plus,
  Eye,
  Edit,
  Mail,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Mock data
const policeStations = [
  {
    id: "1",
    name: "Central Police Station",
    region: "Nairobi",
    address: "Nairobi CBD, Tom Mboya Street",
    phone: "+254 20 123 4567",
    email: "central@police.go.ke",
    officers: 45,
    active_cases: 78,
    coordinates: { lat: -1.2864, lng: 36.8172 },
  },
  {
    id: "2",
    name: "Westlands Police Station",
    region: "Nairobi",
    address: "Westlands, Waiyaki Way",
    phone: "+254 20 234 5678",
    email: "westlands@police.go.ke",
    officers: 32,
    active_cases: 56,
    coordinates: { lat: -1.2600, lng: 36.8000 },
  },
  {
    id: "3",
    name: "Kilimani Police Station",
    region: "Nairobi",
    address: "Kilimani, Argwings Kodhek Road",
    phone: "+254 20 345 6789",
    email: "kilimani@police.go.ke",
    officers: 28,
    active_cases: 42,
    coordinates: { lat: -1.2900, lng: 36.7900 },
  },
  {
    id: "4",
    name: "Mombasa Central Police Station",
    region: "Coast",
    address: "Mombasa Island, Moi Avenue",
    phone: "+254 41 123 4567",
    email: "mombasa@police.go.ke",
    officers: 38,
    active_cases: 65,
    coordinates: { lat: -4.0435, lng: 39.6682 },
  },
  {
    id: "5",
    name: "Nakuru Central Police Station",
    region: "Rift Valley",
    address: "Nakuru Town, Kenyatta Avenue",
    phone: "+254 51 123 4567",
    email: "nakuru@police.go.ke",
    officers: 25,
    active_cases: 48,
    coordinates: { lat: -0.2802, lng: 36.0667 },
  },
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
    active: true,
  },
  {
    label: "Crime Analytics",
    href: "/crime-analytics",
    icon: <BarChart className="h-5 w-5" />,
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

export default function StationMapView() {
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStation, setSelectedStation] = useState<typeof policeStations[0] | null>(null);
  const [showStationDialog, setShowStationDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Filter stations based on region and search query
  const filteredStations = policeStations.filter((station) => {
    const matchesRegion = selectedRegion === "all" || station.region === selectedRegion;
    const matchesSearch =
      searchQuery === "" ||
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  const mapMarkers = filteredStations.map((station) => ({
    id: station.id,
    lat: station.coordinates.lat,
    lng: station.coordinates.lng,
    title: station.name,
    description: station.address,
  }));

  const handleStationClick = (stationId: string) => {
    const station = policeStations.find((s) => s.id === stationId);
    if (station) {
      setSelectedStation(station);
      setShowStationDialog(true);
    }
  };

  const handleMarkerClick = (marker: any) => {
    const station = policeStations.find((s) => s.id === marker.id);
    if (station) {
      setSelectedStation(station);
      setShowStationDialog(true);
    }
  };

  return (
    <DashboardLayout
      title="Police Stations Map"
      subtitle="View and manage station locations nationwide"
      navItems={navItems}
      role="national_admin"
      notifications={8}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search stations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedRegion}
              onValueChange={setSelectedRegion}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="Nairobi">Nairobi</SelectItem>
                <SelectItem value="Coast">Coast</SelectItem>
                <SelectItem value="Central">Central</SelectItem>
                <SelectItem value="Rift Valley">Rift Valley</SelectItem>
                <SelectItem value="Western">Western</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Station
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add New Police Station</DialogTitle>
              </DialogHeader>
              <form className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="station-name">Station Name</Label>
                    <Input id="station-name" placeholder="e.g., Central Police Station" />
                  </div>
                  <div>
                    <Label htmlFor="region">Region</Label>
                    <Select>
                      <SelectTrigger id="region">
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nairobi">Nairobi</SelectItem>
                        <SelectItem value="coast">Coast</SelectItem>
                        <SelectItem value="central">Central</SelectItem>
                        <SelectItem value="rift_valley">Rift Valley</SelectItem>
                        <SelectItem value="western">Western</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="Full address" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="+254 XX XXX XXXX" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="station@police.go.ke" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input id="latitude" placeholder="e.g., -1.2864" />
                    </div>
                    <div>
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input id="longitude" placeholder="e.g., 36.8172" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Add Station</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardContent className="p-0 h-full">
                <MapView
                  center={{ lat: -1.2921, lng: 36.8219 }} // Center of Kenya
                  zoom={7}
                  markers={mapMarkers}
                  height="100%"
                  onMarkerClick={handleMarkerClick}
                  showControls
                />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Police Stations</h3>
                <div className="space-y-4">
                  {filteredStations.map((station) => (
                    <div
                      key={station.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleStationClick(station.id)}
                    >
                      <h4 className="font-medium">{station.name}</h4>
                      <div className="text-sm text-gray-500 space-y-1 mt-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{station.address}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{station.phone}</span>
                        </div>
                        <div className="flex justify-between mt-2">
                          <span>{station.officers} officers</span>
                          <span>{station.active_cases} active cases</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Station list as table */}
        <Card>
          <CardContent className="p-6">
            <DataTable
              data={filteredStations}
              columns={[
                {
                  key: "name",
                  header: "Station Name",
                  cell: (row) => <span className="font-medium">{row.name}</span>,
                },
                {
                  key: "region",
                  header: "Region",
                  cell: (row) => row.region,
                  sortable: true,
                },
                {
                    key: "address",
                    header: "Address",
                    cell: (row) => (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{row.address}</span>
                      </div>
                    ),
                  },
                  {
                    key: "contact",
                    header: "Contact",
                    cell: (row) => (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{row.phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{row.email}</span>
                        </div>
                      </div>
                    ),
                  },
                  {
                    key: "officers",
                    header: "Officers",
                    cell: (row) => row.officers,
                    sortable: true,
                  },
                  {
                    key: "active_cases",
                    header: "Active Cases",
                    cell: (row) => row.active_cases,
                    sortable: true,
                  },
                ]}
                actions={(row) => (
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleStationClick(row.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              />
            </CardContent>
          </Card>
        </div>

        {/* Station Detail Dialog */}
        <Dialog open={showStationDialog} onOpenChange={setShowStationDialog}>
          <DialogContent className="sm:max-w-[600px]">
            {selectedStation && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedStation.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 text-blue-700 p-4 rounded-full">
                      <Building className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-gray-500">Region</p>
                      <p className="font-semibold">{selectedStation.region}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-500">Address</p>
                      <p>{selectedStation.address}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-gray-500">Contact</p>
                      <p>{selectedStation.phone}</p>
                      <p>{selectedStation.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-500">Officers</p>
                      <p className="text-2xl font-bold">{selectedStation.officers}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-gray-500">Active Cases</p>
                      <p className="text-2xl font-bold">{selectedStation.active_cases}</p>
                    </div>
                  </div>
                  <div className="h-[300px] rounded-md overflow-hidden">
                    <MapView
                      center={selectedStation.coordinates}
                      zoom={15}
                      markers={[
                        {
                          id: selectedStation.id,
                          lat: selectedStation.coordinates.lat,
                          lng: selectedStation.coordinates.lng,
                          title: selectedStation.name,
                          description: selectedStation.address,
                        },
                      ]}
                      height="100%"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowStationDialog(false)}>
                      Close
                    </Button>
                    <Button>View Station Dashboard</Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}