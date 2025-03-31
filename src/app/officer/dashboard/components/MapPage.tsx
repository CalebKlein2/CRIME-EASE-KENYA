import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { 
  MapPin, 
  Search, 
  Filter, 
  Layers, 
  Navigation, 
  AlertTriangle, 
  Shield, 
  Map as MapIcon,
  AlertCircle,
  Home,
  FileText,
  Clock,
  Info
} from 'lucide-react';

// Mock heat map data component
const HeatMapPlaceholder = () => (
  <div className="relative h-[600px] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
    <div className="absolute inset-0 opacity-70">
      <div className="absolute top-[20%] left-[30%] w-24 h-24 rounded-full bg-red-500 blur-xl"></div>
      <div className="absolute top-[40%] left-[50%] w-32 h-32 rounded-full bg-red-600 blur-xl"></div>
      <div className="absolute top-[60%] left-[25%] w-20 h-20 rounded-full bg-orange-500 blur-xl"></div>
      <div className="absolute top-[30%] left-[70%] w-28 h-28 rounded-full bg-yellow-500 blur-xl"></div>
      <div className="absolute top-[10%] left-[10%] w-16 h-16 rounded-full bg-green-500 blur-xl"></div>
      <div className="absolute top-[70%] left-[60%] w-20 h-20 rounded-full bg-orange-500 blur-xl"></div>
      <div className="absolute top-[50%] left-[15%] w-16 h-16 rounded-full bg-orange-500 blur-xl"></div>
      <div className="absolute top-[20%] left-[60%] w-12 h-12 rounded-full bg-green-500 blur-xl"></div>
      <div className="absolute top-[80%] left-[40%] w-16 h-16 rounded-full bg-yellow-500 blur-xl"></div>
    </div>
    <div className="z-10 text-center">
      <MapIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-medium text-gray-600">Crime Heat Map</h3>
      <p className="text-sm text-gray-500 max-w-md mt-2">
        This is a placeholder for the interactive crime heat map. In production, this would 
        be implemented with a mapping library like Google Maps, Mapbox, or Leaflet.
      </p>
    </div>
    
    {/* Map Controls (Right) */}
    <div className="absolute top-4 right-4 bg-white p-2 rounded-md shadow-md flex flex-col gap-2">
      <Button size="icon" variant="outline" title="Zoom In">
        <span className="text-xl font-bold">+</span>
      </Button>
      <Button size="icon" variant="outline" title="Zoom Out">
        <span className="text-xl font-bold">-</span>
      </Button>
      <Button size="icon" variant="outline" title="Current Location">
        <Navigation className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="outline" title="Layers">
        <Layers className="h-4 w-4" />
      </Button>
    </div>
    
    {/* Map Legend (Bottom) */}
    <div className="absolute bottom-4 left-4 bg-white p-3 rounded-md shadow-md">
      <h4 className="font-medium text-sm mb-2">Crime Intensity</h4>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-red-500"></div>
        <span className="text-xs">High</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-orange-500"></div>
        <span className="text-xs">Medium</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
        <span className="text-xs">Low</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-green-500"></div>
        <span className="text-xs">Very Low</span>
      </div>
    </div>
    
    {/* Incident Markers */}
    <div className="absolute top-[20%] left-[30%] cursor-pointer">
      <div className="relative">
        <MapPin className="h-6 w-6 text-red-600" />
        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white"></div>
      </div>
    </div>
    <div className="absolute top-[40%] left-[50%] cursor-pointer">
      <div className="relative">
        <MapPin className="h-6 w-6 text-red-600" />
        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white"></div>
      </div>
    </div>
    <div className="absolute top-[30%] left-[70%] cursor-pointer">
      <div className="relative">
        <MapPin className="h-6 w-6 text-blue-600" />
      </div>
    </div>
    <div className="absolute top-[60%] left-[25%] cursor-pointer">
      <div className="relative">
        <MapPin className="h-6 w-6 text-orange-500" />
      </div>
    </div>
    <div className="absolute top-[70%] left-[60%] cursor-pointer">
      <div className="relative">
        <MapPin className="h-6 w-6 text-yellow-500" />
      </div>
    </div>
  </div>
);

// Mock GIS map view for detailed crime analysis
const GISMapPlaceholder = () => (
  <div className="relative h-[600px] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
    <div className="absolute inset-0">
      <div className="w-full h-full bg-gray-200">
        {/* Grid lines to simulate a map grid */}
        <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
          {Array(10).fill(0).map((_, i) => (
            <div key={`col-${i}`} className="border-r border-gray-300 h-full"></div>
          ))}
          {Array(10).fill(0).map((_, i) => (
            <div key={`row-${i}`} className="border-b border-gray-300 w-full"></div>
          ))}
        </div>
        
        {/* Simulated district boundaries */}
        <div className="absolute top-[20%] left-[20%] w-[30%] h-[40%] border-2 border-blue-400 rounded-lg bg-blue-100 bg-opacity-20">
          <div className="absolute top-2 left-2 text-xs font-bold text-blue-700">Downtown District</div>
        </div>
        <div className="absolute top-[10%] right-[20%] w-[25%] h-[45%] border-2 border-green-400 rounded-lg bg-green-100 bg-opacity-20">
          <div className="absolute top-2 left-2 text-xs font-bold text-green-700">Westlands District</div>
        </div>
        <div className="absolute bottom-[15%] left-[30%] w-[40%] h-[30%] border-2 border-purple-400 rounded-lg bg-purple-100 bg-opacity-20">
          <div className="absolute top-2 left-2 text-xs font-bold text-purple-700">South District</div>
        </div>
      </div>
    </div>
    <div className="z-10 text-center">
      <MapIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-medium text-gray-600">GIS Analysis</h3>
      <p className="text-sm text-gray-500 max-w-md mt-2">
        This is a placeholder for the Geographic Information System (GIS) analysis view. 
        In production, this would be implemented with specialized GIS mapping tools.
      </p>
    </div>
    
    {/* Controls and tools */}
    <div className="absolute top-4 right-4 bg-white p-2 rounded-md shadow-md">
      <div className="space-y-2">
        <Button size="sm" variant="outline" className="w-full">
          <Layers className="h-4 w-4 mr-2" /> Layers
        </Button>
        <Button size="sm" variant="outline" className="w-full">
          <Filter className="h-4 w-4 mr-2" /> Filter
        </Button>
        <Button size="sm" variant="outline" className="w-full">
          <Info className="h-4 w-4 mr-2" /> District Info
        </Button>
      </div>
    </div>
    
    {/* Legend */}
    <div className="absolute bottom-4 left-4 bg-white p-3 rounded-md shadow-md">
      <h4 className="font-medium text-sm mb-2">District Crime Rates</h4>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border border-blue-400 bg-blue-100"></div>
        <span className="text-xs">Downtown: High</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border border-green-400 bg-green-100"></div>
        <span className="text-xs">Westlands: Medium</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border border-purple-400 bg-purple-100"></div>
        <span className="text-xs">South: Low</span>
      </div>
    </div>
  </div>
);

// Patrol routes map placeholder
const PatrolRoutesPlaceholder = () => (
  <div className="relative h-[600px] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
    <div className="absolute inset-0">
      {/* City streets grid simulation */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12">
        {Array(12).fill(0).map((_, i) => (
          <div key={`col-${i}`} className="border-r border-gray-300 h-full"></div>
        ))}
        {Array(12).fill(0).map((_, i) => (
          <div key={`row-${i}`} className="border-b border-gray-300 w-full"></div>
        ))}
      </div>
      
      {/* Patrol route lines */}
      <div className="absolute top-[20%] left-[10%] w-[80%] h-[60%]">
        {/* Route 1 - Blue */}
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-lg"></div>
        
        {/* Route 2 - Green */}
        <div className="absolute top-[20%] left-[15%] w-[70%] h-[60%] border-4 border-green-500 rounded-lg"></div>
        
        {/* Route 3 - Orange */}
        <div className="absolute top-[10%] left-[25%] w-[50%] h-[80%] border-4 border-orange-500 rounded-md"></div>
      </div>
      
      {/* Patrol cars */}
      <div className="absolute top-[20%] left-[10%]">
        <div className="h-4 w-4 bg-blue-500 rounded-full animate-pulse"></div>
      </div>
      <div className="absolute top-[40%] left-[30%]">
        <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse"></div>
      </div>
      <div className="absolute top-[60%] left-[50%]">
        <div className="h-4 w-4 bg-orange-500 rounded-full animate-pulse"></div>
      </div>
    </div>
    
    <div className="z-10 text-center">
      <MapIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-medium text-gray-600">Patrol Routes</h3>
      <p className="text-sm text-gray-500 max-w-md mt-2">
        This is a placeholder for the patrol routes map. In production, this would
        display real-time location of patrol vehicles and their assigned routes.
      </p>
    </div>
    
    {/* Legend */}
    <div className="absolute bottom-4 left-4 bg-white p-3 rounded-md shadow-md">
      <h4 className="font-medium text-sm mb-2">Patrol Units</h4>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-blue-500"></div>
        <span className="text-xs">Unit 1 - North Zone</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-green-500"></div>
        <span className="text-xs">Unit 2 - Central Zone</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-orange-500"></div>
        <span className="text-xs">Unit 3 - South Zone</span>
      </div>
    </div>
  </div>
);

// Main map page component
export default function MapPage() {
  const [selectedCrimeTypes, setSelectedCrimeTypes] = useState<string[]>([
    "theft", "assault", "robbery", "vandalism", "drugs"
  ]);
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() });
  
  const toggleCrimeType = (type: string) => {
    if (selectedCrimeTypes.includes(type)) {
      setSelectedCrimeTypes(selectedCrimeTypes.filter(t => t !== type));
    } else {
      setSelectedCrimeTypes([...selectedCrimeTypes, type]);
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Crime Map</h1>
        <Button>
          <Navigation className="mr-2 h-4 w-4" /> Current Location
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Map Filters</CardTitle>
            <CardDescription>
              Filter incidents shown on the map
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Search Location</Label>
              <div className="flex mt-1">
                <Input placeholder="Address or landmark" className="rounded-r-none" />
                <Button variant="outline" className="rounded-l-none">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <Label>Date Range</Label>
              <div className="mt-1">
                <DatePickerWithRange className="w-full" />
              </div>
            </div>
            
            <div>
              <Label className="mb-2 block">Crime Types</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="filter-theft" 
                    checked={selectedCrimeTypes.includes("theft")}
                    onCheckedChange={() => toggleCrimeType("theft")}
                  />
                  <Label htmlFor="filter-theft">Theft & Burglary</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="filter-assault" 
                    checked={selectedCrimeTypes.includes("assault")}
                    onCheckedChange={() => toggleCrimeType("assault")}
                  />
                  <Label htmlFor="filter-assault">Assault & Battery</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="filter-robbery" 
                    checked={selectedCrimeTypes.includes("robbery")}
                    onCheckedChange={() => toggleCrimeType("robbery")}
                  />
                  <Label htmlFor="filter-robbery">Robbery</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="filter-vandalism" 
                    checked={selectedCrimeTypes.includes("vandalism")}
                    onCheckedChange={() => toggleCrimeType("vandalism")}
                  />
                  <Label htmlFor="filter-vandalism">Vandalism</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="filter-drugs" 
                    checked={selectedCrimeTypes.includes("drugs")}
                    onCheckedChange={() => toggleCrimeType("drugs")}
                  />
                  <Label htmlFor="filter-drugs">Drug Activity</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="filter-traffic" 
                    checked={selectedCrimeTypes.includes("traffic")}
                    onCheckedChange={() => toggleCrimeType("traffic")}
                  />
                  <Label htmlFor="filter-traffic">Traffic Incidents</Label>
                </div>
              </div>
            </div>
            
            <div>
              <Label>Status</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Case status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open Cases</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Display</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Display type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Incidents</SelectItem>
                  <SelectItem value="recent">Recent Only (7 days)</SelectItem>
                  <SelectItem value="hotspots">Hotspots Only</SelectItem>
                  <SelectItem value="patrols">Patrol Coverage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button variant="outline" className="w-full">
              <Filter className="mr-2 h-4 w-4" /> Reset Filters
            </Button>
            <Button className="w-full">
              Apply Filters
            </Button>
          </CardFooter>
        </Card>
        
        {/* Map content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="heatmap">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="heatmap">
                <AlertTriangle className="h-4 w-4 mr-2" /> Crime Heat Map
              </TabsTrigger>
              <TabsTrigger value="gis">
                <Layers className="h-4 w-4 mr-2" /> GIS Analysis
              </TabsTrigger>
              <TabsTrigger value="patrols">
                <Shield className="h-4 w-4 mr-2" /> Patrol Routes
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="heatmap" className="mt-4">
              <HeatMapPlaceholder />
            </TabsContent>
            
            <TabsContent value="gis" className="mt-4">
              <GISMapPlaceholder />
            </TabsContent>
            
            <TabsContent value="patrols" className="mt-4">
              <PatrolRoutesPlaceholder />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Incidents</CardTitle>
            <CardDescription>Last 24 hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="border rounded-md p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium">Armed Robbery</p>
                  <p className="text-sm text-gray-500">Main Street & 5th Avenue, 2 hours ago</p>
                </div>
              </div>
            </div>
            <div className="border rounded-md p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="font-medium">Theft</p>
                  <p className="text-sm text-gray-500">Central Market, 5 hours ago</p>
                </div>
              </div>
            </div>
            <div className="border rounded-md p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium">Vandalism</p>
                  <p className="text-sm text-gray-500">Downtown Park, 12 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Incidents
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Crime Hotspots</CardTitle>
            <CardDescription>High activity areas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="border rounded-md p-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium">Main Street Area</p>
                  <p className="text-sm text-gray-500">32 incidents this month</p>
                </div>
              </div>
            </div>
            <div className="border rounded-md p-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium">Central Market</p>
                  <p className="text-sm text-gray-500">28 incidents this month</p>
                </div>
              </div>
            </div>
            <div className="border rounded-md p-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="font-medium">Riverside Park</p>
                  <p className="text-sm text-gray-500">15 incidents this month</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View Detailed Analysis
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Patrols</CardTitle>
            <CardDescription>Currently on duty</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="border rounded-md p-3">
              <div className="flex items-start gap-2">
                <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium">Patrol Unit 1</p>
                  <p className="text-sm text-gray-500">North Zone • 2 officers</p>
                </div>
              </div>
            </div>
            <div className="border rounded-md p-3">
              <div className="flex items-start gap-2">
                <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Patrol Unit 2</p>
                  <p className="text-sm text-gray-500">Central Zone • 2 officers</p>
                </div>
              </div>
            </div>
            <div className="border rounded-md p-3">
              <div className="flex items-start gap-2">
                <Shield className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="font-medium">Patrol Unit 3</p>
                  <p className="text-sm text-gray-500">South Zone • 2 officers</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Patrol Units
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
