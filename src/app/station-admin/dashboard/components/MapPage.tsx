import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { MapView } from '@/components/maps/MapView';
import { DataTable } from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  FileText, 
  MapPin, 
  Users, 
  Car, 
  AlertTriangle,
  Filter
} from 'lucide-react';

// Mock patrol data
const patrolData = [
  {
    id: "1",
    area: "Central Business District",
    officer: "Officer Johnson",
    vehicle: "KPS-001",
    status: "Active",
    start_time: "08:00 AM",
    end_time: "04:00 PM",
  },
  {
    id: "2",
    area: "Residential Zone A",
    officer: "Officer Chen",
    vehicle: "KPS-002",
    status: "Active",
    start_time: "09:00 AM",
    end_time: "05:00 PM",
  },
  {
    id: "3",
    area: "Market Area",
    officer: "Officer Garcia",
    vehicle: "KPS-003",
    status: "Completed",
    start_time: "07:00 AM",
    end_time: "03:00 PM",
  },
  {
    id: "4",
    area: "School Zone",
    officer: "Officer Patel",
    vehicle: "KPS-004",
    status: "Scheduled",
    start_time: "02:00 PM",
    end_time: "10:00 PM",
  },
];

// Mock hotspot data
const hotspotData = [
  {
    id: "1",
    location: "Market Square",
    incidents: 12,
    crime_type: "Theft",
    priority: "High",
    last_incident: "2025-03-25",
  },
  {
    id: "2",
    location: "Central Bus Station",
    incidents: 8,
    crime_type: "Theft/Assault",
    priority: "Medium",
    last_incident: "2025-03-28",
  },
  {
    id: "3",
    location: "Nightclub District",
    incidents: 15,
    crime_type: "Assault",
    priority: "High",
    last_incident: "2025-03-30",
  },
  {
    id: "4",
    location: "Shopping Mall",
    incidents: 6,
    crime_type: "Theft",
    priority: "Medium",
    last_incident: "2025-03-27",
  },
];

export default function StationMapPage() {
  const [mapView, setMapView] = useState<'patrols' | 'hotspots' | 'incidents'>('patrols');
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Station Map</h2>
          <p className="text-gray-500">View patrol routes, crime hotspots, and incident locations</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="patrols">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="patrols" onSelect={() => setMapView('patrols')}>Patrol Routes</SelectItem>
              <SelectItem value="hotspots" onSelect={() => setMapView('hotspots')}>Crime Hotspots</SelectItem>
              <SelectItem value="incidents" onSelect={() => setMapView('incidents')}>Recent Incidents</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle>
                {mapView === 'patrols' ? 'Patrol Routes' : 
                 mapView === 'hotspots' ? 'Crime Hotspots' : 'Incident Locations'}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[500px]">
              <MapView />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Tabs defaultValue="patrols" className="h-full flex flex-col">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="patrols" onClick={() => setMapView('patrols')}>Patrols</TabsTrigger>
              <TabsTrigger value="hotspots" onClick={() => setMapView('hotspots')}>Hotspots</TabsTrigger>
              <TabsTrigger value="date">Date</TabsTrigger>
            </TabsList>
            
            <div className="flex-grow">
              <TabsContent value="patrols" className="mt-4 h-full">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Active Patrols</CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-[500px] overflow-y-auto">
                    <ul className="space-y-3">
                      {patrolData.map(patrol => (
                        <li 
                          key={patrol.id}
                          className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium flex items-center">
                                <MapPin className="h-4 w-4 mr-1 text-blue-600" />
                                {patrol.area}
                              </p>
                              <p className="text-sm text-gray-500">
                                <Users className="h-3 w-3 inline mr-1" /> {patrol.officer}
                              </p>
                              <p className="text-sm text-gray-500">
                                <Car className="h-3 w-3 inline mr-1" /> {patrol.vehicle}
                              </p>
                            </div>
                            <Badge
                              className={
                                patrol.status === 'Active' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                                patrol.status === 'Completed' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                                'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                              }
                            >
                              {patrol.status}
                            </Badge>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            <Calendar className="h-3 w-3 inline mr-1" /> 
                            {patrol.start_time} - {patrol.end_time}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="hotspots" className="mt-4 h-full">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Crime Hotspots</CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-[500px] overflow-y-auto">
                    <ul className="space-y-3">
                      {hotspotData.map(hotspot => (
                        <li 
                          key={hotspot.id}
                          className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium flex items-center">
                                <AlertTriangle className={`h-4 w-4 mr-1 ${
                                  hotspot.priority === 'High' ? 'text-red-600' : 'text-yellow-600'
                                }`} />
                                {hotspot.location}
                              </p>
                              <p className="text-sm text-gray-500">
                                {hotspot.crime_type}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">{hotspot.incidents}</span> incidents
                              </p>
                            </div>
                            <Badge
                              className={
                                hotspot.priority === 'High' ? 'bg-red-100 text-red-800 hover:bg-red-100' :
                                'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                              }
                            >
                              {hotspot.priority}
                            </Badge>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            Last incident: {hotspot.last_incident}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="date" className="mt-4 h-full">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Date Range</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DatePickerWithRange className="mb-6" />
                    <Button className="w-full">Apply Date Filter</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
