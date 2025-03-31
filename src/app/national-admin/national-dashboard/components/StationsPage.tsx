import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/tables/DataTable";
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  Search, 
  MapPin, 
  Phone, 
  Users, 
  FileText,
  Plus,
  Filter,
  ArrowUpDown,
  Eye
} from 'lucide-react';
import { MapView } from '@/components/maps/MapView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock stations data
const stationsData = [
  {
    id: "1",
    name: "Central Police Station",
    region: "Nairobi",
    county: "Nairobi",
    address: "Kimathi Street, Nairobi",
    status: "Active",
    officers: 42,
    cases: 156,
    commander: "Chief Inspector Jane Doe",
  },
  {
    id: "2",
    name: "Mombasa Police Station",
    region: "Coast",
    county: "Mombasa",
    address: "Moi Avenue, Mombasa",
    status: "Active",
    officers: 38,
    cases: 120,
    commander: "Chief Inspector John Smith",
  },
  {
    id: "3",
    name: "Kisumu Central",
    region: "Nyanza",
    county: "Kisumu",
    address: "Oginga Odinga Road, Kisumu",
    status: "Active",
    officers: 29,
    cases: 97,
    commander: "Chief Inspector Sarah Ouko",
  },
  {
    id: "4",
    name: "Eldoret Police Station",
    region: "Rift Valley",
    county: "Uasin Gishu",
    address: "Uganda Road, Eldoret",
    status: "Active",
    officers: 32,
    cases: 105,
    commander: "Chief Inspector James Kimutai",
  },
  {
    id: "5",
    name: "Nakuru Central",
    region: "Rift Valley",
    county: "Nakuru",
    address: "Kenyatta Avenue, Nakuru",
    status: "Active",
    officers: 30,
    cases: 112,
    commander: "Chief Inspector Ruth Tanui",
  },
  {
    id: "6",
    name: "Nyeri Police Station",
    region: "Central",
    county: "Nyeri",
    address: "Kimathi Way, Nyeri",
    status: "Active",
    officers: 25,
    cases: 86,
    commander: "Chief Inspector Peter Kamau",
  },
  {
    id: "7",
    name: "Garissa Police Station",
    region: "North Eastern",
    county: "Garissa",
    address: "Kismayu Road, Garissa",
    status: "Maintenance",
    officers: 22,
    cases: 64,
    commander: "Chief Inspector Abdi Hassan",
  },
  {
    id: "8",
    name: "Kakamega Police Station",
    region: "Western",
    county: "Kakamega",
    address: "Kakamega-Kisumu Road",
    status: "Active",
    officers: 28,
    cases: 91,
    commander: "Chief Inspector William Ouma",
  },
];

// Mock regions data
const regions = [
  "All Regions",
  "Nairobi",
  "Coast",
  "Nyanza",
  "Rift Valley",
  "Central",
  "Western",
  "Eastern",
  "North Eastern"
];

export default function StationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [mapView, setMapView] = useState(false);
  
  // Filter stations based on search query, region, and status
  const filteredStations = stationsData.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         station.county.toLowerCase().includes(searchQuery.toLowerCase());
                         
    const matchesRegion = selectedRegion === "All Regions" || station.region === selectedRegion;
    
    const matchesStatus = selectedStatus === "All" || station.status === selectedStatus;
    
    return matchesSearch && matchesRegion && matchesStatus;
  });
  
  const handleViewStation = (id: string) => {
    console.log("View station details:", id);
    // Navigate to station details page
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Police Stations</h2>
          <p className="text-gray-500">Manage police stations across the country</p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Station
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>All Police Stations</CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant={mapView ? "default" : "outline"} 
                size="sm"
                onClick={() => setMapView(true)}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Map View
              </Button>
              <Button 
                variant={!mapView ? "default" : "outline"} 
                size="sm"
                onClick={() => setMapView(false)}
              >
                <FileText className="mr-2 h-4 w-4" />
                List View
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search stations by name or county..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map(region => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {mapView ? (
            <div className="h-[600px] relative">
              <MapView />
              <div className="absolute top-4 right-4 bg-white p-3 rounded-md shadow-md">
                <h3 className="font-medium text-sm mb-2">Legend</h3>
                <div className="space-y-1">
                  <div className="flex items-center text-xs">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span>Active Station</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <span>Maintenance</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span>Inactive</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <DataTable
              data={filteredStations}
              columns={[
                {
                  key: "name",
                  header: "Station Name",
                  cell: (row) => (
                    <div>
                      <div className="font-medium flex items-center">
                        <Building className="h-4 w-4 mr-2 text-blue-600" />
                        {row.name}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        <MapPin className="h-3 w-3 inline mr-1" />
                        {row.address}
                      </p>
                    </div>
                  ),
                },
                {
                  key: "region",
                  header: () => (
                    <div className="flex items-center">
                      Region/County
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  ),
                  cell: (row) => (
                    <div>
                      <div>{row.region}</div>
                      <div className="text-sm text-gray-500">{row.county}</div>
                    </div>
                  ),
                },
                {
                  key: "status",
                  header: "Status",
                  cell: (row) => (
                    <Badge
                      className={
                        row.status === "Active" ? "bg-green-100 text-green-800 hover:bg-green-100" :
                        row.status === "Maintenance" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" :
                        "bg-red-100 text-red-800 hover:bg-red-100"
                      }
                    >
                      {row.status}
                    </Badge>
                  ),
                },
                {
                  key: "officers",
                  header: () => (
                    <div className="flex items-center">
                      Officers
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  ),
                  cell: (row) => (
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      {row.officers}
                    </div>
                  ),
                },
                {
                  key: "cases",
                  header: () => (
                    <div className="flex items-center">
                      Active Cases
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  ),
                  cell: (row) => (
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-500" />
                      {row.cases}
                    </div>
                  ),
                },
                {
                  key: "commander",
                  header: "Commander",
                  cell: (row) => row.commander,
                },
                {
                  key: "actions",
                  header: "",
                  cell: (row) => (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewStation(row.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  ),
                },
              ]}
            />
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Station Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="clearance">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="clearance">Clearance Rates</TabsTrigger>
              <TabsTrigger value="response">Response Times</TabsTrigger>
              <TabsTrigger value="officers">Officer Workload</TabsTrigger>
              <TabsTrigger value="resources">Resource Allocation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="clearance" className="mt-4">
              <div className="h-[400px]">
                {/* Here would be a chart component showing clearance rates by station */}
                <div className="flex items-center justify-center h-full bg-gray-50 rounded-md border">
                  <p className="text-gray-500">Station Clearance Rate Chart</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="response" className="mt-4">
              <div className="h-[400px]">
                {/* Here would be a chart component showing response times by station */}
                <div className="flex items-center justify-center h-full bg-gray-50 rounded-md border">
                  <p className="text-gray-500">Station Response Time Chart</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="officers" className="mt-4">
              <div className="h-[400px]">
                {/* Here would be a chart component showing officer workload by station */}
                <div className="flex items-center justify-center h-full bg-gray-50 rounded-md border">
                  <p className="text-gray-500">Officer Workload Chart</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="resources" className="mt-4">
              <div className="h-[400px]">
                {/* Here would be a chart component showing resource allocation by station */}
                <div className="flex items-center justify-center h-full bg-gray-50 rounded-md border">
                  <p className="text-gray-500">Resource Allocation Chart</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
