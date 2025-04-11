// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { crimeReportService, notificationService, caseTrackingService, policeStationService } from '@/lib/supabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { 
  CalendarCheck, 
  FileText, 
  MapPin, 
  Bell, 
  Home, 
  User, 
  Settings,
  MessageCircle,
  HelpCircle,
  FileSearch,
  Phone,
  Clock,
  Send,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Shield,
  Calendar,
  BarChart,
  Loader2,
  Mail,
  Search,
  Share2,
  ThumbsUp,
  PhoneCall,
  MessageSquare,
  Heart,
  PenLine
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

// Define navigation items for citizen dashboard
const navItems = [
  {
    label: "Dashboard",
    href: "/citizen-dashboard/",
    icon: <Home className="h-5 w-5" />,
    active: true
  },
  {
    label: "My Reports",
    href: "/citizen-dashboard/reports/",
    icon: <FileText className="h-5 w-5" />
  },
  {
    label: "Find Station",
    href: "/citizen-dashboard/find-station/",
    icon: <MapPin className="h-5 w-5" />
  },
  {
    label: "Notifications",
    href: "/citizen-dashboard/notifications/",
    icon: <Bell className="h-5 w-5" />
  },
  {
    label: "Track Case",
    href: "/citizen-dashboard/track/",
    icon: <FileSearch className="h-5 w-5" />
  },
  {
    label: "Contact Support",
    href: "/citizen-dashboard/support/",
    icon: <MessageCircle className="h-5 w-5" />
  },
  {
    label: "Help & FAQs",
    href: "/citizen-dashboard/help/",
    icon: <HelpCircle className="h-5 w-5" />
  },
  {
    label: "Profile Settings",
    href: "/citizen-dashboard/settings/",
    icon: <Settings className="h-5 w-5" />
  }
];

// Import the original page content
import CitizenReportsOriginal from '../reports/page';
import CitizenFindStationOriginal from '../find-station/page';
import CitizenNotificationsOriginal from '../notifications/page';
import CitizenTrackOriginal from '../track/page';
import CitizenSupportOriginal from '../support/page';
import CitizenHelpOriginal from '../help/page';
import CitizenReportPage from '../report/page';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

// Enhanced Reports Content
const ReportsContent = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch reports from Supabase
  useEffect(() => {
    const fetchReports = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const userReports = await crimeReportService.getUserReports(user.id);
        
        // Transform the data to match the UI format
        const formattedReports = userReports.map(report => ({
          id: report.id,
          title: report.title || `${report.incident_type} Report`,
          date: new Date(report.created_at).toLocaleDateString(),
          status: report.status || 'pending',
          statusText: getStatusText(report.status || 'pending'),
          description: report.description,
          officer: report.officer_name || 'Unassigned',
          location: report.location?.address || `${report.city}`,
          category: report.incident_type,
          lastUpdated: report.updated_at ? new Date(report.updated_at).toLocaleDateString() : new Date(report.created_at).toLocaleDateString(),
          caseNumber: `CRB-${report.id.substring(0, 5)}`,
          attachments: report.media_files?.length || 0
        }));
        
        setReports(formattedReports);
        setError(null);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Failed to load your reports. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReports();
  }, [user?.id]);
  
  // Helper function to get status text
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'pending': return 'Pending Review';
      case 'under_investigation': return 'Under Investigation';
      case 'resolved': return 'Resolved';
      case 'closed': return 'Closed';
      case 'rejected': return 'Rejected';
      default: return 'Pending Review';
    }
  };

  // Filter reports based on active tab
  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.caseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "pending" && report.status === "pending") return matchesSearch;
    if (activeTab === "active" && (report.status === "under_investigation")) return matchesSearch;
    if (activeTab === "resolved" && (report.status === "resolved" || report.status === "closed")) return matchesSearch;
    
    return false;
  });

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusStyles = {
      "pending": "bg-yellow-100 text-yellow-800",
      "in-progress": "bg-blue-100 text-blue-800",
      "investigating": "bg-purple-100 text-purple-800",
      "resolved": "bg-green-100 text-green-800"
    };
    
    return (
      <span className={`px-2 py-1 rounded text-xs ${statusStyles[status]}`}>
        {status === "in-progress" ? "In Progress" : 
         status === "investigating" ? "Investigating" :
         status === "pending" ? "Pending Review" : "Resolved"}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative">
          <Input
            placeholder="Search reports..."
            className="pl-10 w-full md:w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FileSearch className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline">
            <FileText className="mr-1 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" variant="outline">
            <Calendar className="mr-1 h-4 w-4" />
            Filter by Date
          </Button>
          <Button size="sm" asChild>
            <Link to="/citizen-dashboard/report">
              <FileText className="mr-1 h-4 w-4" />
              New Report
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="all">All Reports ({reports.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({reports.filter(r => r.status === "pending").length})</TabsTrigger>
          <TabsTrigger value="active">Active ({reports.filter(r => r.status === "in-progress" || r.status === "investigating").length})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({reports.filter(r => r.status === "resolved").length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Crime Reports</CardTitle>
              <CardDescription>All reports you have submitted ({filteredReports.length} shown)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredReports.length > 0 ? (
                  filteredReports.map(report => (
                    <div key={report.id} className="border rounded-lg p-4 hover:border-blue-200 transition-colors">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">{report.title} #{report.id}</h3>
                            <span className="ml-2 text-xs text-gray-500 border rounded px-2 py-0.5">
                              {report.caseNumber}
                            </span>
                          </div>
                          <div className="flex items-center mt-1 text-gray-500 text-sm space-x-2">
                            <span>{report.date}</span>
                            <span>•</span>
                            <span>{report.category}</span>
                          </div>
                        </div>
                        <StatusBadge status={report.status} />
                      </div>
                      
                      <p className="text-sm">{report.description}</p>
                      
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-500">
                        <div>
                          <span className="font-medium">Location:</span> {report.location}
                        </div>
                        <div>
                          <span className="font-medium">Assigned to:</span> {report.officer}
                        </div>
                        <div>
                          <span className="font-medium">Last Updated:</span> {report.lastUpdated}
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t flex justify-between items-center">
                        <div className="flex items-center space-x-1">
                          <Badge variant="outline" className="px-2 py-0">
                            <FileText className="h-3 w-3 mr-1" /> 
                            {report.attachments} {report.attachments === 1 ? "file" : "files"}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <MessageCircle className="h-3 w-3 mr-1" /> Comment
                          </Button>
                          <Button size="sm" variant="outline">
                            <FileSearch className="h-3 w-3 mr-1" /> Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FileSearch className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                    <h3 className="font-medium text-gray-500">No reports found</h3>
                    <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-gray-500">
                Showing {filteredReports.length} of {reports.length} reports
              </div>
              <Button variant="outline" size="sm">Load More</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Reports</CardTitle>
              <CardDescription>Reports awaiting initial review</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Same structure as above, but filtered for pending */}
              <div className="space-y-4">
                {filteredReports.length > 0 ? (
                  filteredReports.map(report => (
                    <div key={report.id} className="border rounded-lg p-4 hover:border-blue-200 transition-colors">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">{report.title} #{report.id}</h3>
                            <span className="ml-2 text-xs text-gray-500 border rounded px-2 py-0.5">
                              {report.caseNumber}
                            </span>
                          </div>
                          <div className="flex items-center mt-1 text-gray-500 text-sm space-x-2">
                            <span>{report.date}</span>
                            <span>•</span>
                            <span>{report.category}</span>
                          </div>
                        </div>
                        <StatusBadge status={report.status} />
                      </div>
                      
                      <p className="text-sm">{report.description}</p>
                      
                      <div className="mt-3 pt-3 border-t flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                          <Loader2 className="h-3 w-3 inline mr-1 animate-spin" />
                          Waiting for review
                        </div>
                        <Button size="sm" variant="outline">
                          <FileSearch className="h-3 w-3 mr-1" /> View Details
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                    <h3 className="font-medium text-gray-500">No pending reports</h3>
                    <p className="text-gray-400 text-sm mt-1">All your reports have been reviewed</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Reports</CardTitle>
              <CardDescription>Reports in progress or under investigation</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Content for active reports */}
              <div className="space-y-4">
                {filteredReports.length > 0 ? (
                  filteredReports.map(report => (
                    <div key={report.id} className="border rounded-lg p-4 hover:border-blue-200 transition-colors">
                      {/* Similar structure to above */}
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">{report.title} #{report.id}</h3>
                            <span className="ml-2 text-xs text-gray-500 border rounded px-2 py-0.5">
                              {report.caseNumber}
                            </span>
                          </div>
                          <div className="flex items-center mt-1 text-gray-500 text-sm space-x-2">
                            <span>{report.date}</span>
                            <span>•</span>
                            <span>{report.category}</span>
                          </div>
                        </div>
                        <StatusBadge status={report.status} />
                      </div>
                      
                      <p className="text-sm">{report.description}</p>
                      
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-500">
                        <div>
                          <span className="font-medium">Location:</span> {report.location}
                        </div>
                        <div>
                          <span className="font-medium">Assigned to:</span> {report.officer}
                        </div>
                        <div>
                          <span className="font-medium">Last Updated:</span> {report.lastUpdated}
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t flex justify-between items-center">
                        <div className="flex items-center space-x-1">
                          <Badge variant="outline" className="px-2 py-0">
                            <FileText className="h-3 w-3 mr-1" /> 
                            {report.attachments} {report.attachments === 1 ? "file" : "files"}
                          </Badge>
                        </div>
                        <Button size="sm">
                          <FileSearch className="h-3 w-3 mr-1" /> View Case
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Loader2 className="h-10 w-10 mx-auto text-gray-400 mb-2 animate-spin" />
                    <h3 className="font-medium text-gray-500">No active reports</h3>
                    <p className="text-gray-400 text-sm mt-1">You don't have any reports being processed</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolved" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Resolved Reports</CardTitle>
              <CardDescription>Reports that have been completed</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Content for resolved reports */}
              <div className="space-y-4">
                {filteredReports.length > 0 ? (
                  filteredReports.map(report => (
                    <div key={report.id} className="border rounded-lg p-4 hover:border-blue-200 transition-colors">
                      {/* Similar structure to above */}
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">{report.title} #{report.id}</h3>
                            <span className="ml-2 text-xs text-gray-500 border rounded px-2 py-0.5">
                              {report.caseNumber}
                            </span>
                          </div>
                          <div className="flex items-center mt-1 text-gray-500 text-sm space-x-2">
                            <span>{report.date}</span>
                            <span>•</span>
                            <span>{report.category}</span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="text-green-500 w-4 h-4 mr-1" />
                          <StatusBadge status={report.status} />
                        </div>
                      </div>
                      
                      <p className="text-sm">{report.description}</p>
                      
                      <div className="mt-3 pt-3 border-t flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                          <span className="font-medium">Resolved on:</span> {report.lastUpdated}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <FileSearch className="h-3 w-3 mr-1" /> View Summary
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageCircle className="h-3 w-3 mr-1" /> Feedback
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                    <h3 className="font-medium text-gray-500">No resolved reports</h3>
                    <p className="text-gray-400 text-sm mt-1">Your reports are still being processed</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Enhanced Find Station Content
const FindStationContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [mapView, setMapView] = useState(true);
  
  // Mock stations data
  const stations = [
    {
      id: 1,
      name: "Central Police Station",
      distance: "2.3",
      address: "Kimathi Street, CBD, Nairobi",
      phone: "+254-020-2227411",
      email: "central@police.go.ke",
      hours: "24/7",
      services: ["Crime Reporting", "Traffic Services", "Criminal Investigations"],
      coordinates: { lat: -1.2833, lng: 36.8167 },
      officers: 45,
      rating: 4.1
    },
    {
      id: 2,
      name: "Westlands Police Post",
      distance: "4.7",
      address: "Mpaka Road, Westlands, Nairobi",
      phone: "+254-020-4441652",
      email: "westlands@police.go.ke",
      hours: "24/7",
      services: ["Crime Reporting", "Community Policing"],
      coordinates: { lat: -1.2641, lng: 36.8065 },
      officers: 18,
      rating: 3.8
    },
    {
      id: 3,
      name: "Kilimani Police Station",
      distance: "5.2",
      address: "Argwings Kodhek Road, Kilimani, Nairobi",
      phone: "+254-020-2721712",
      email: "kilimani@police.go.ke",
      hours: "24/7",
      services: ["Crime Reporting", "Traffic Services", "Gender Desk"],
      coordinates: { lat: -1.2897, lng: 36.7816 },
      officers: 38,
      rating: 4.3
    },
    {
      id: 4,
      name: "Industrial Area Police Station",
      distance: "6.5",
      address: "Enterprise Road, Industrial Area, Nairobi",
      phone: "+254-020-5501234",
      email: "industrial@police.go.ke",
      hours: "24/7",
      services: ["Crime Reporting", "Commercial Crime Unit"],
      coordinates: { lat: -1.3106, lng: 36.8354 },
      officers: 32,
      rating: 3.5
    }
  ];

  // Filter stations based on search
  const filteredStations = stations.filter(station => 
    station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current location
  const getCurrentLocation = () => {
    setLoadingLocation(true);
    // Simulating getting location
    setTimeout(() => {
      setCurrentLocation({ lat: -1.2921, lng: 36.8219 });
      setLoadingLocation(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative flex-1 w-full md:max-w-md">
          <Input
            placeholder="Search police stations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <MapPin className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Button 
            variant="outline" 
            size="sm"
            onClick={getCurrentLocation}
            disabled={loadingLocation}
          >
            {loadingLocation ? (
              <>
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                Locating...
              </>
            ) : (
              <>
                <MapPin className="mr-1 h-4 w-4" />
                Use My Location
              </>
            )}
          </Button>
          
          <div className="border rounded-md flex">
            <Button 
              variant={mapView ? "default" : "ghost"} 
              size="sm" 
              className="rounded-r-none"
              onClick={() => setMapView(true)}
            >
              <MapPin className="h-4 w-4" />
              <span className="ml-1 hidden md:inline">Map</span>
            </Button>
            <Button 
              variant={!mapView ? "default" : "ghost"} 
              size="sm" 
              className="rounded-l-none"
              onClick={() => setMapView(false)}
            >
              <FileText className="h-4 w-4" />
              <span className="ml-1 hidden md:inline">List</span>
            </Button>
          </div>
        </div>
      </div>

      {mapView ? (
        <Card>
          <CardHeader>
            <CardTitle>Police Stations Near You</CardTitle>
            <CardDescription>Interactive map showing nearby stations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-80 bg-gray-100 rounded-md flex items-center justify-center border">
              <div className="text-center p-4">
                <MapPin className="h-10 w-10 mx-auto mb-2 text-blue-500" />
                <p className="text-gray-500">Map view would display here</p>
                <p className="text-sm text-gray-400 mt-1">Using Google Maps or Mapbox integration</p>
                
                {/* Pins for demo purposes */}
                <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-full">
                  <div className="relative">
                    <MapPin className="h-5 w-5 text-red-500" />
                    <div className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-full bg-white rounded shadow-md p-1 text-xs whitespace-nowrap">
                      Central Police Station
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-1/3 right-1/3 transform -translate-x-1/2 -translate-y-1/2">
                  <MapPin className="h-5 w-5 text-red-500" />
                </div>
                
                <div className="absolute bottom-1/4 right-1/4 transform -translate-x-1/2 -translate-y-1/2">
                  <MapPin className="h-5 w-5 text-red-500" />
                </div>
                
                {currentLocation && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 bg-blue-500 rounded-full animate-ping absolute" />
                    <div className="h-4 w-4 bg-blue-500 rounded-full relative" />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="text-sm text-gray-500">
            Click on a station pin to view more details
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Nearby Police Stations</CardTitle>
            <CardDescription>
              {filteredStations.length} station{filteredStations.length !== 1 ? 's' : ''} found
              {currentLocation ? ' near your location' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredStations.map(station => (
                <div key={station.id} className="border rounded-lg p-4 hover:border-blue-200 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium">{station.name}</h3>
                        <Badge className="ml-2" variant="outline">{station.distance} km</Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{station.address}</p>
                    </div>
                    <div className="flex items-center mt-2 md:mt-0">
                      <div className="flex items-center space-x-1 text-sm">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={`h-4 w-4 ${i < Math.floor(station.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                        ))}
                        <span className="text-sm ml-1">{station.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-500">
                    <div>
                      <span className="font-medium">Location:</span> {station.address}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span> {station.phone}
                    </div>
                    <div>
                      <span className="font-medium">Hours:</span> {station.hours}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <h4 className="text-xs font-medium mb-1">Services:</h4>
                    <div className="flex flex-wrap gap-1">
                      {station.services.map((service, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">{service}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      <Shield className="h-3 w-3 inline mr-1" /> 
                      {station.officers} officers on duty
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Phone className="h-3 w-3 mr-1" /> Call
                      </Button>
                      <Button size="sm">
                        <MapPin className="h-3 w-3 mr-1" /> Directions
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredStations.length === 0 && (
                <div className="text-center py-8">
                  <MapPin className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                  <h3 className="font-medium text-gray-500">No stations found</h3>
                  <p className="text-gray-400 text-sm mt-1">Try changing your search criteria</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline">Load More Stations</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

// Enhanced Notifications Content
const NotificationsContent = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch notifications from Supabase
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const userNotifications = await notificationService.getUserNotifications(user.id);
        
        // Transform the data to match the UI format
        const formattedNotifications = userNotifications.map(notification => ({
          id: notification.id,
          title: notification.title,
          message: notification.message,
          date: new Date(notification.created_at).toLocaleDateString(),
          isRead: notification.is_read,
          type: notification.notification_type || 'general',
          relatedCaseId: notification.related_case_id
        }));
        
        setNotifications(formattedNotifications);
        setError(null);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Failed to load your notifications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
  }, [user?.id]);

  // Mark notification as read
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true } 
            : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };
  
  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    if (!user?.id) return;
    
    try {
      await notificationService.markAllAsRead(user.id);
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "unread" && !notification.read) return matchesSearch;
    if (activeTab === "action" && notification.actionRequired) return matchesSearch;
    if (activeTab === "case_updates" && (notification.type === "case_update" || notification.type === "status_change")) return matchesSearch;
    
    return false;
  });
  
  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "case_update":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "evidence":
        return <FileSearch className="h-5 w-5 text-green-500" />;
      case "interview":
        return <MessageCircle className="h-5 w-5 text-purple-500" />;
      case "status_change":
        return <BarChart className="h-5 w-5 text-orange-500" />;
      case "alert":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const openNotificationDetails = (notification) => {
    setSelectedNotification(notification);
  };

  // We'll use the existing filteredNotifications definition below

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-sm font-medium mb-1">Filter Notifications</h3>
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm" 
              variant={activeTab === "all" ? "default" : "outline"}
              onClick={() => setActiveTab("all")}
            >
              All ({notifications.length})
            </Button>
            <Button 
              size="sm" 
              variant={activeTab === "unread" ? "default" : "outline"}
              onClick={() => setActiveTab("unread")}
            >
              Unread ({notifications.filter(n => !n.read).length})
            </Button>
            <Button 
              size="sm" 
              variant={activeTab === "action" ? "default" : "outline"}
              onClick={() => setActiveTab("action")}
            >
              Action Required ({notifications.filter(n => n.actionRequired).length})
            </Button>
            <Button 
              size="sm" 
              variant={activeTab === "case_updates" ? "default" : "outline"}
              onClick={() => setActiveTab("case_updates")}
            >
              Case Updates ({notifications.filter(n => n.type === "case_update" || n.type === "status_change").length})
            </Button>
          </div>
        </div>
        
        <Button size="sm" variant="outline">
          <CheckCircle className="mr-1 h-4 w-4" />
          Mark All as Read
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Notifications</CardTitle>
              <CardDescription>Stay updated on your cases and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredNotifications.length > 0 ? (
                <div className="space-y-3">
                  {filteredNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`border rounded-lg p-4 hover:border-blue-200 transition-colors cursor-pointer relative ${!notification.read ? 'bg-blue-50' : ''}`}
                      onClick={() => openNotificationDetails(notification)}
                    >
                      {!notification.read && (
                        <div className="absolute top-4 right-4 h-2 w-2 bg-blue-500 rounded-full"></div>
                      )}
                      
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-grow">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <h3 className="font-medium">{notification.title}</h3>
                            <span className="text-xs text-gray-500 md:ml-2">{notification.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                          
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {notification.caseId && (
                                <Badge variant="outline" className="text-xs">
                                  Case #{notification.caseId}
                                </Badge>
                              )}
                              {notification.type === "alert" && (
                                <Badge variant="destructive" className="text-xs">
                                  Alert
                                </Badge>
                              )}
                              {notification.actionRequired && (
                                <Badge variant="default" className="text-xs bg-amber-500">
                                  Action Required
                                </Badge>
                              )}
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                  <h3 className="font-medium text-gray-500">No notifications</h3>
                  <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <div className="text-sm text-gray-500">
                Showing {filteredNotifications.length} of {notifications.length} notifications
              </div>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Notification Preferences</h3>
                <div className="flex items-center justify-between text-sm">
                  <span>Email Notifications</span>
                  <Button size="sm" variant="outline">Enabled</Button>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>SMS Notifications</span>
                  <Button size="sm" variant="outline">Disabled</Button>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Push Notifications</span>
                  <Button size="sm" variant="outline">Enabled</Button>
                </div>
              </div>
              
              <div className="pt-3 border-t space-y-2">
                <h3 className="text-sm font-medium">Notification Types</h3>
                <div className="space-y-1.5">
                  <div className="flex items-center">
                    <input type="checkbox" id="case_updates" className="mr-2" defaultChecked />
                    <label htmlFor="case_updates" className="text-sm">Case Updates</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="evidence" className="mr-2" defaultChecked />
                    <label htmlFor="evidence" className="text-sm">Evidence Notifications</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="interviews" className="mr-2" defaultChecked />
                    <label htmlFor="interviews" className="text-sm">Interview Requests</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="status" className="mr-2" defaultChecked />
                    <label htmlFor="status" className="text-sm">Status Changes</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="alerts" className="mr-2" defaultChecked />
                    <label htmlFor="alerts" className="text-sm">Crime Alerts</label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Bell className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{selectedNotification.title}</CardTitle>
                  <CardDescription>{selectedNotification.time}</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0" 
                  onClick={() => setSelectedNotification(null)}
                >
                  <span className="sr-only">Close</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                {getNotificationIcon(selectedNotification.type)}
                <Badge variant="outline">
                  {selectedNotification.type === "case_update" ? "Case Update" :
                   selectedNotification.type === "evidence" ? "Evidence" :
                   selectedNotification.type === "interview" ? "Interview Request" :
                   selectedNotification.type === "status_change" ? "Status Change" :
                   selectedNotification.type === "alert" ? "Crime Alert" : "Notification"}
                </Badge>
                {selectedNotification.caseId && (
                  <Badge variant="secondary">Case #{selectedNotification.caseId}</Badge>
                )}
              </div>
              
              <p className="text-gray-700 mb-6">{selectedNotification.message}</p>
              
              {selectedNotification.actionRequired && (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4">
                  <h4 className="text-amber-800 font-medium flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Action Required
                  </h4>
                  <p className="text-amber-700 text-sm mt-1">
                    This notification requires your attention. Please respond as soon as possible.
                  </p>
                </div>
              )}
              
              {selectedNotification.caseId && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Case Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm">
                      <FileSearch className="mr-1 h-4 w-4" />
                      View Case Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageCircle className="mr-1 h-4 w-4" />
                      Contact Officer
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="ghost" size="sm" onClick={() => setSelectedNotification(null)}>
                Close
              </Button>
              <Button variant="outline" size="sm">
                <CheckCircle className="mr-1 h-4 w-4" />
                Mark as Read
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

// Enhanced Track Case Content
const TrackCaseContent = () => {
  const { user } = useAuth();
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [caseUpdates, setCaseUpdates] = useState<any[]>([]);
  
  // Fetch user's cases from Supabase
  useEffect(() => {
    const fetchUserCases = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const userReports = await crimeReportService.getUserReports(user.id);
        
        // Transform the data to match the UI format
        const formattedCases = userReports.map(report => {
          // Calculate progress based on status
          let progress = 0;
          switch(report.status) {
            case 'pending': progress = 20; break;
            case 'under_investigation': progress = 60; break;
            case 'resolved': progress = 100; break;
            case 'closed': progress = 100; break;
            case 'rejected': progress = 0; break;
            default: progress = 10;
          }
          
          return {
            id: report.id,
            title: report.title || `${report.incident_type} Report`,
            date: new Date(report.created_at).toLocaleDateString(),
            status: report.status || 'pending',
            statusText: getStatusText(report.status || 'pending'),
            description: report.description,
            officer: report.assigned_officer_name || 'Not assigned yet',
            officerContact: report.assigned_officer_email || '',
            officerId: report.assigned_officer_id || '',
            location: report.location && typeof report.location === 'object' ? report.location.address || 'Address not specified' : 'Location not specified',
            category: report.incident_type || 'General',
            lastUpdated: report.updated_at ? new Date(report.updated_at).toLocaleDateString() : 'Not updated yet',
            caseNumber: report.id.substring(0, 8),
            progress: progress,
            // We'll fetch the actual timeline and evidence separately
            timeline: [],
            evidence: []
          };
        });
        
        setCases(formattedCases);
        setError(null);
      } catch (err) {
        console.error('Error fetching user cases:', err);
        setError('Failed to load your cases. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserCases();
  }, [user?.id]);
  
  // Fetch case updates when a case is selected
  useEffect(() => {
    const fetchCaseUpdates = async () => {
      if (!selectedCase) return;
      
      try {
        const updates = await caseTrackingService.getCaseUpdates(selectedCase.id);
        
        // Transform updates into timeline format
        const timeline = updates.map(update => ({
          id: update.id,
          date: new Date(update.created_at).toLocaleDateString(),
          time: new Date(update.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          event: update.update_text,
          icon: getUpdateIcon(update.update_type),
          status: getUpdateStatus(update, selectedCase.status)
        }));
        
        // Add the initial case submission as the first timeline item
        timeline.unshift({
          id: 'submission',
          date: selectedCase.date,
          time: new Date(selectedCase.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          event: 'Case submitted',
          icon: 'FileText',
          status: 'complete'
        });
        
        // Sort timeline by date (newest first)
        timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        // Update the selected case with the timeline
        setSelectedCase(prev => ({
          ...prev,
          timeline: timeline
        }));
        
        setCaseUpdates(updates);
      } catch (err) {
        console.error('Error fetching case updates:', err);
      }
    };
    
    fetchCaseUpdates();
  }, [selectedCase?.id]);
  
  // Helper function to get status text
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'pending': return 'Pending Review';
      case 'under_investigation': return 'Under Investigation';
      case 'resolved': return 'Resolved';
      case 'closed': return 'Closed';
      case 'rejected': return 'Rejected';
      default: return 'Pending Review';
    }
  };
  
  // Helper function to get update icon
  const getUpdateIcon = (type: string): string => {
    switch (type) {
      case 'status_change': return 'RefreshCw';
      case 'officer_assigned': return 'User';
      case 'evidence_received': return 'FileSearch';
      case 'interview': return 'MessageCircle';
      case 'investigation': return 'Search';
      case 'resolution': return 'CheckSquare';
      default: return 'Info';
    }
  };
  
  // Helper function to get update status
  const getUpdateStatus = (update: any, caseStatus: string): string => {
    const updateDate = new Date(update.created_at).getTime();
    const now = new Date().getTime();
    
    // If the update is in the future, mark as upcoming
    if (updateDate > now) return 'upcoming';
    
    // If the case is resolved or closed, all updates are complete
    if (caseStatus === 'resolved' || caseStatus === 'closed') return 'complete';
    
    // Find the most recent update
    const isLatestUpdate = caseUpdates.length > 0 && 
      update.id === caseUpdates.reduce((latest, current) => {
        return new Date(current.created_at) > new Date(latest.created_at) ? current : latest;
      }, caseUpdates[0]).id;
    
    return isLatestUpdate ? 'current' : 'complete';
  };
  
  // Filter cases based on search
  const filteredCases = cases.filter(caseItem => 
    caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    caseItem.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    caseItem.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get status color based on case status
  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "investigating": return "bg-blue-100 text-blue-800";
      case "resolved": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Get progress color based on case progress
  const getProgressColor = (progress) => {
    if (progress < 25) return "bg-red-500";
    if (progress < 50) return "bg-yellow-500";
    if (progress < 75) return "bg-blue-500";
    return "bg-green-500";
  };

  // Get icon component based on icon name
  const getTimelineIcon = (iconName) => {
    switch (iconName) {
      case "FileText": return <FileText className="h-4 w-4" />;
      case "CheckCircle": return <CheckCircle className="h-4 w-4" />;
      case "User": return <User className="h-4 w-4" />;
      case "Search": return <FileSearch className="h-4 w-4" />;
      case "FileSearch": return <FileSearch className="h-4 w-4" />;
      case "CheckSquare": return <CheckCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  // Get evidence icon based on type
  const getEvidenceIcon = (type) => {
    switch (type) {
      case "image": return <FileText className="h-4 w-4" />;
      case "video": return <FileText className="h-4 w-4" />;
      case "audio": return <FileText className="h-4 w-4" />;
      case "document": return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-80">
          <Input
            placeholder="Search case number or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <FileSearch className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        
        <Button size="sm" asChild>
          <Link to="/citizen-dashboard/reports/">
            <FileText className="mr-1 h-4 w-4" />
            Submit New Report
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Case Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Total Cases</span>
              <Badge variant="secondary">{cases.length}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Pending Review</span>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-800">
                {cases.filter(c => c.status === "pending").length}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Under Investigation</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-800">
                {cases.filter(c => c.status === "investigating").length}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Resolved</span>
              <Badge variant="outline" className="bg-green-50 text-green-800">
                {cases.filter(c => c.status === "resolved").length}
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="pt-2 border-t">
            <Button variant="ghost" size="sm" className="w-full">
              <BarChart className="h-4 w-4 mr-1" />
              View Reports
            </Button>
          </CardFooter>
        </Card>

        <Card className="col-span-1 md:col-span-3">
          <CardHeader>
            <CardTitle>Your Cases</CardTitle>
            <CardDescription>Track the status of your reported cases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCases.length > 0 ? (
                filteredCases.map(caseItem => (
                  <div 
                    key={caseItem.id} 
                    className="border rounded-lg p-4 hover:border-blue-200 transition-colors cursor-pointer"
                    onClick={() => setSelectedCase(caseItem)}
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium">{caseItem.title}</h3>
                          <span className="ml-2 text-xs text-gray-500 border rounded px-2 py-0.5">
                            {caseItem.caseNumber}
                          </span>
                        </div>
                        <div className="flex items-center mt-1 text-gray-500 text-sm space-x-2">
                          <span>{caseItem.date}</span>
                          <span>•</span>
                          <span>{caseItem.category}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(caseItem.status)}`}>
                        {caseItem.statusText}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-1">{caseItem.description}</p>
                    
                    <div className="space-y-2">
                      <div className="text-xs text-gray-500 mb-1">Case Progress</div>
                      <div className="relative h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`absolute left-0 top-0 h-full ${getProgressColor(caseItem.progress)}`}
                          style={{ width: `${caseItem.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Submitted</span>
                        <span>{caseItem.progress}%</span>
                        <span>Resolved</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t flex justify-between items-center">
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="font-medium mr-1">Assigned to:</span>
                        {caseItem.officer !== "Unassigned" ? caseItem.officer : "Pending Assignment"}
                      </div>
                      <Button size="sm" variant="outline">
                        <FileSearch className="h-3 w-3 mr-1" /> View Details
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileSearch className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                  <h3 className="font-medium text-gray-500">No cases found</h3>
                  <p className="text-gray-400 text-sm mt-1">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Case Detail Modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    {selectedCase.title}
                    <span className="ml-2 text-sm text-gray-500 border rounded px-2 py-0.5">
                      {selectedCase.caseNumber}
                    </span>
                  </CardTitle>
                  <CardDescription>{selectedCase.date}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedCase.status)}`}>
                    {selectedCase.statusText}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={() => setSelectedCase(null)}
                  >
                    <span className="sr-only">Close</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Case Information</h3>
                  <div className="bg-gray-50 p-4 rounded-md space-y-2">
                    <div>
                      <span className="text-xs text-gray-500 block">Description</span>
                      <p className="text-sm">{selectedCase.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-gray-500 block">Category</span>
                        <p className="text-sm">{selectedCase.category}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 block">Location</span>
                        <p className="text-sm">{selectedCase.location}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 block">Assigned Officer</span>
                        <p className="text-sm">{selectedCase.officer}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 block">Last Updated</span>
                        <p className="text-sm">{selectedCase.lastUpdated}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Case Progress</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="space-y-2">
                      <div className="text-xs text-gray-500">Overall Progress</div>
                      <div className="relative h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`absolute left-0 top-0 h-full ${getProgressColor(selectedCase.progress)}`}
                          style={{ width: `${selectedCase.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Submitted</span>
                        <span>{selectedCase.progress}% Complete</span>
                        <span>Resolved</span>
                      </div>
                    </div>
                    
                    {selectedCase.status === "resolved" && selectedCase.resolution && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="text-sm font-medium mb-2 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                          Resolution
                        </h4>
                        <div className="bg-green-50 p-3 rounded-md text-sm">
                          <p className="text-green-800 font-medium">{selectedCase.resolution.outcome}</p>
                          <p className="text-green-700 mt-1">{selectedCase.resolution.details}</p>
                          <div className="flex justify-between mt-2 text-xs text-green-600">
                            <span>Resolved on: {selectedCase.resolution.date}</span>
                            <span>{selectedCase.resolution.actionTaken}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">Case Timeline</h3>
                <div className="relative space-y-0">
                  {selectedCase.timeline.map((event, index) => (
                    <div key={index} className="flex gap-4 pb-8 last:pb-0 relative">
                      {/* Vertical line */}
                      {index < selectedCase.timeline.length - 1 && (
                        <div className={`absolute left-[15px] top-[24px] w-0.5 h-full ${event.status === 'upcoming' ? 'bg-gray-200' : event.status === 'current' ? 'bg-blue-200' : 'bg-green-200'}`}></div>
                      )}
                      
                      {/* Icon */}
                      <div className={`z-10 flex items-center justify-center w-8 h-8 rounded-full ${
                        event.status === 'upcoming' ? 'bg-gray-200 text-gray-500' :
                        event.status === 'current' ? 'bg-blue-200 text-blue-700' :
                        'bg-green-200 text-green-700'
                      }`}>
                        {getTimelineIcon(event.icon)}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{event.event}</h4>
                        <div className="flex space-x-2 text-xs text-gray-500 mt-1">
                          {event.date && <span>{event.date}</span>}
                          {event.time && (
                            <>
                              <span>•</span>
                              <span>{event.time}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedCase.evidence && selectedCase.evidence.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Submitted Evidence</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedCase.evidence.map(item => (
                      <div key={item.id} className="border rounded-md p-3 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center ${
                          item.type === 'image' ? 'text-blue-500' :
                          item.type === 'video' ? 'text-red-500' :
                          item.type === 'audio' ? 'text-purple-500' :
                          'text-green-500'
                        }`}>
                          {getEvidenceIcon(item.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">{item.name}</h4>
                          <p className="text-xs text-gray-500">Submitted on {item.date}</p>
                        </div>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <FileSearch className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact information */}
              {selectedCase.officer !== "Unassigned" && (
                <div className="bg-blue-50 p-4 rounded-md">
                  <h3 className="text-sm font-medium mb-2 flex items-center text-blue-800">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-xs text-blue-700 block">Assigned Officer</span>
                      <p className="font-medium text-blue-900">{selectedCase.officer}</p>
                      {selectedCase.officerId && (
                        <p className="text-xs text-blue-700">ID: {selectedCase.officerId}</p>
                      )}
                    </div>
                    <div>
                      <span className="text-xs text-blue-700 block">Contact</span>
                      {selectedCase.officerContact ? (
                        <p className="text-blue-900">{selectedCase.officerContact}</p>
                      ) : (
                        <p className="text-blue-900">Contact through system messaging</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" className="w-full text-blue-700 border-blue-300 hover:bg-blue-100">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Send Message
                    </Button>
                    {selectedCase.officerContact && (
                      <Button size="sm" variant="outline" className="w-full text-blue-700 border-blue-300 hover:bg-blue-100">
                        <Mail className="h-4 w-4 mr-1" />
                        Send Email
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="ghost" size="sm" onClick={() => setSelectedCase(null)}>
                Close Details
              </Button>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <MessageCircle className="mr-1 h-4 w-4" />
                  Add Comment
                </Button>
                <Button size="sm">
                  <FileText className="mr-1 h-4 w-4" />
                  {selectedCase.status === "resolved" ? "View Report" : "Update Case"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

// Enhanced Support Content
const SupportContent = () => {
  const [activeTab, setActiveTab] = useState("faq");
  const [searchQuery, setSearchQuery] = useState("");
  const [showContactForm, setShowContactForm] = useState(false);
  
  // Mock FAQ data
  const faqs = [
    {
      id: 1,
      question: "How do I report a crime?",
      answer: "You can report a crime through our platform by clicking on the 'Report' section in the dashboard, then select 'New Report'. Fill in all the required details and submit. You'll receive a case number for tracking once your report is reviewed.",
      category: "reporting"
    },
    {
      id: 2,
      question: "What information should I include in my report?",
      answer: "Include as much detail as possible: date, time, and location of the incident, description of what happened, information about any suspects, witnesses, or victims, and any evidence you may have such as photos or videos. The more information you provide, the more effectively law enforcement can respond.",
      category: "reporting"
    },
    {
      id: 3,
      question: "How long does it take for my report to be reviewed?",
      answer: "Reports are typically reviewed within 24-48 hours. Priority is given to emergencies and more serious offenses. You'll receive a notification when your report status changes.",
      category: "processing"
    },
    {
      id: 4,
      question: "Can I update my report after submission?",
      answer: "Yes, you can add additional information or evidence to your report. Go to 'Track Cases' in the dashboard, find your case, and click 'Update Case' to add new information.",
      category: "reporting"
    },
    {
      id: 5,
      question: "How do I find the nearest police station?",
      answer: "Use the 'Find Station' feature in your dashboard. It will show you the closest police stations based on your location, along with their contact information and services offered.",
      category: "services"
    },
    {
      id: 6,
      question: "Is my information kept confidential?",
      answer: "Yes, all personal information is kept confidential and is only accessible to authorized law enforcement personnel. Your information is protected by our privacy policy and is used solely for the purpose of investigating the reported incident.",
      category: "privacy"
    },
    {
      id: 7,
      question: "Can I report anonymously?",
      answer: "Yes, you can choose to report anonymously, though providing contact information helps officers follow up if they need additional information. Anonymous reports are still investigated, but may be limited if further details are needed.",
      category: "privacy"
    },
    {
      id: 8,
      question: "How do I track the status of my case?",
      answer: "You can track your case through the 'Track Cases' section in your dashboard. Enter your case number or browse your submitted reports to see the current status, assigned officer, and any updates.",
      category: "processing"
    }
  ];

  // Mock contact methods
  const contactMethods = [
    {
      id: 1,
      title: "Emergency Hotline",
      description: "For immediate assistance in emergency situations",
      contact: "999 or 112",
      icon: "PhoneCall",
      priority: "high"
    },
    {
      id: 2,
      title: "Non-Emergency Police Line",
      description: "For non-urgent police matters and inquiries",
      contact: "0800 722 203",
      icon: "Phone",
      priority: "medium"
    },
    {
      id: 3,
      title: "Technical Support",
      description: "For issues with the Crime Ease Kenya platform",
      contact: "support@crimeease.go.ke",
      icon: "HelpCircle",
      priority: "low"
    },
    {
      id: 4,
      title: "Victim Support Services",
      description: "Counseling and support for crime victims",
      contact: "0800 723 253",
      icon: "Heart",
      priority: "medium"
    }
  ];

  // Filter FAQs based on search
  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.includes(searchQuery.toLowerCase())
  );

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case "PhoneCall": return <PhoneCall className="h-5 w-5" />;
      case "Phone": return <Phone className="h-5 w-5" />;
      case "HelpCircle": return <HelpCircle className="h-5 w-5" />;
      case "MessageSquare": return <MessageSquare className="h-5 w-5" />;
      case "Heart": return <Heart className="h-5 w-5" />;
      default: return <HelpCircle className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="w-full">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
              <TabsTrigger value="contact">Contact Support</TabsTrigger>
              <TabsTrigger value="guides">User Guides</TabsTrigger>
            </TabsList>
            
            <TabsContent value="faq" className="mt-6">
              <div className="mb-6">
                <div className="relative">
                  <Input
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline" onClick={() => setSearchQuery("")} className="cursor-pointer hover:bg-gray-100">
                    All
                  </Badge>
                  <Badge variant="outline" onClick={() => setSearchQuery("reporting")} className="cursor-pointer hover:bg-gray-100">
                    Reporting
                  </Badge>
                  <Badge variant="outline" onClick={() => setSearchQuery("processing")} className="cursor-pointer hover:bg-gray-100">
                    Case Processing
                  </Badge>
                  <Badge variant="outline" onClick={() => setSearchQuery("privacy")} className="cursor-pointer hover:bg-gray-100">
                    Privacy
                  </Badge>
                  <Badge variant="outline" onClick={() => setSearchQuery("services")} className="cursor-pointer hover:bg-gray-100">
                    Services
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-4">
                {filteredFaqs.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {filteredFaqs.map((faq) => (
                      <AccordionItem key={faq.id} value={`faq-${faq.id}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pt-2 pb-4 text-gray-700">
                            {faq.answer}
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <Badge variant="outline" className="bg-gray-50">
                              {faq.category}
                            </Badge>
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="ghost" className="h-8 px-2">
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                Helpful
                              </Button>
                              <Button size="sm" variant="ghost" className="h-8 px-2">
                                <Share2 className="h-4 w-4 mr-1" />
                                Share
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="text-center py-8 border rounded-lg">
                    <Search className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                    <h3 className="font-medium text-gray-500">No FAQs found</h3>
                    <p className="text-gray-400 text-sm mt-1">Try adjusting your search criteria</p>
                    <Button variant="outline" size="sm" className="mt-4" onClick={() => setSearchQuery("")}>
                      Clear Search
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-start">
                  <HelpCircle className="h-5 w-5 text-blue-700 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-800">Can't find what you're looking for?</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Our support team is ready to help with any questions you may have.
                    </p>
                    <Button 
                      size="sm" 
                      className="mt-3 bg-blue-700 hover:bg-blue-800"
                      onClick={() => {
                        setActiveTab("contact");
                        setShowContactForm(true);
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Contact Support
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="contact" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contactMethods.map(method => (
                  <Card key={method.id} className={`border-l-4 ${getPriorityColor(method.priority)}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center">
                        <div className={`mr-3 p-2 rounded-full ${
                          method.priority === 'high' ? 'bg-red-100' :
                          method.priority === 'medium' ? 'bg-yellow-100' :
                          'bg-blue-100'
                        }`}>
                          {getIconComponent(method.icon)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{method.title}</CardTitle>
                          <CardDescription>{method.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="font-medium text-lg">{method.contact}</div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      {method.icon === "PhoneCall" || method.icon === "Phone" ? (
                        <Button className="w-full">
                          <Phone className="h-4 w-4 mr-1" />
                          Call Now
                        </Button>
                      ) : (
                        <Button className="w-full">
                          <Mail className="h-4 w-4 mr-1" />
                          Send Email
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {showContactForm && (
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Form</CardTitle>
                    <CardDescription>Fill out this form and we'll get back to you as soon as possible</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" type="email" placeholder="john@example.com" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" placeholder="Help with my report" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" placeholder="Please describe your issue in detail..." rows={5} />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technical">Technical Issue</SelectItem>
                            <SelectItem value="account">Account Problem</SelectItem>
                            <SelectItem value="report">Reporting Help</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" />
                        <Label htmlFor="terms" className="text-sm">I understand that my information will be processed in accordance with the privacy policy</Label>
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setShowContactForm(false)}>Cancel</Button>
                    <Button>Submit Request</Button>
                  </CardFooter>
                </Card>
              )}
              
              {!showContactForm && (
                <div className="flex justify-center">
                  <Button onClick={() => setShowContactForm(true)}>
                    <PenLine className="h-4 w-4 mr-1" />
                    Open Contact Form
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="guides" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Reporting Guide</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center mb-3">
                      <FileText className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-700">
                      Learn how to effectively report incidents and what information to include for faster processing.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View Guide</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Case Tracking Tutorial</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center mb-3">
                      <FileText className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-700">
                      A step-by-step tutorial on how to track your case, interpret status updates, and communicate with officers.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View Guide</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Platform Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center mb-3">
                      <FileText className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-700">
                      Get familiar with all features of the Crime Ease Kenya platform and how to navigate the citizen dashboard.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View Guide</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

// Main dashboard content component
const DashboardHome = () => {
  const { user } = useAuth();
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [nearbyStations, setNearbyStations] = useState<any[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [loadingStations, setLoadingStations] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch recent reports from Supabase
  useEffect(() => {
    const fetchRecentReports = async () => {
      if (!user?.id) return;
      
      try {
        setLoadingReports(true);
        const reports = await crimeReportService.getRecentReports(user.id, 2);
        
        // Transform the data to match the UI format
        const formattedReports = reports.map(report => ({
          id: report.id,
          title: report.title || `${report.incident_type} Report`,
          date: new Date(report.created_at).toLocaleDateString(),
          status: report.status || 'pending',
          statusText: getStatusText(report.status || 'pending'),
          description: report.description.substring(0, 100) + (report.description.length > 100 ? '...' : ''),
          caseNumber: report.id.substring(0, 5)
        }));
        
        setRecentReports(formattedReports);
      } catch (err) {
        console.error('Error fetching recent reports:', err);
        setError('Failed to load your recent reports.');
      } finally {
        setLoadingReports(false);
      }
    };
    
    fetchRecentReports();
  }, [user?.id]);

  // Fetch nearby police stations
  useEffect(() => {
    const fetchNearbyStations = async () => {
      try {
        setLoadingStations(true);
        
        // Get user's location if available, otherwise use default location
        let latitude = -1.2921; // Default to Nairobi
        let longitude = 36.8219;
        
        // Try to get user's current location
        if (navigator.geolocation) {
          try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 5000,
                maximumAge: 60000
              });
            });
            
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
          } catch (locationErr) {
            console.warn('Could not get user location:', locationErr);
            // Continue with default coordinates
          }
        }
        
        // Fetch nearby stations from Supabase
        const stations = await policeStationService.getNearestStations(latitude, longitude, 2);
        // Ensure each station has a distance property (default to 0 if not available)
        const stationsWithDistance = stations.map(station => ({
          ...station,
          distance: station.distance || 0
        }));
        setNearbyStations(stationsWithDistance);
      } catch (err) {
        console.error('Error fetching nearby stations:', err);
      } finally {
        setLoadingStations(false);
      }
    };
    
    fetchNearbyStations();
  }, []);
  
  // Helper function to get status text
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'pending': return 'Pending Review';
      case 'under_investigation': return 'Under Investigation';
      case 'resolved': return 'Resolved';
      case 'closed': return 'Closed';
      case 'rejected': return 'Rejected';
      default: return 'Pending Review';
    }
  };
  
  // Helper function to get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'under_investigation': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-8 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Report a Crime</CardTitle>
            <CardDescription>Submit a new crime report</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/citizen-dashboard/report/">
                <FileText className="mr-2 h-4 w-4" /> New Report
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">My Reports</CardTitle>
            <CardDescription>Check your submitted reports</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <Link to="/citizen-dashboard/reports/">
                <CalendarCheck className="mr-2 h-4 w-4" /> View Reports
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Find Station</CardTitle>
            <CardDescription>Locate police stations near you</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <Link to="/citizen-dashboard/find-station/">
                <MapPin className="mr-2 h-4 w-4" /> Find Stations
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Notifications</CardTitle>
            <CardDescription>Updates on your reports</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <Link to="/citizen-dashboard/notifications/">
                <Bell className="mr-2 h-4 w-4" /> Notifications
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Your recent crime reports and their status</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingReports ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : recentReports.length > 0 ? (
              <div className="space-y-4">
                {recentReports.map(report => (
                  <div key={report.id} className="border rounded-lg p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{report.title} #{report.caseNumber}</h3>
                        <p className="text-sm text-gray-500">Submitted on {report.date}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(report.status)}`}>
                        {report.statusText}
                      </span>
                    </div>
                    <p className="mt-2 text-sm">{report.description}</p>
                  </div>
                ))}
                
                <div className="pt-2">
                  <Button variant="ghost" size="sm" asChild className="text-sm">
                    <Link to="/citizen-dashboard/reports/">
                      View all reports <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">You haven't submitted any reports yet.</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link to="/citizen-dashboard/report/">
                    <FileText className="mr-2 h-4 w-4" /> Create your first report
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nearby Stations</CardTitle>
            <CardDescription>Police stations in your area</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingStations ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : nearbyStations.length > 0 ? (
              <div className="space-y-4">
                {nearbyStations.map(station => (
                  <div key={station.id} className="border rounded-lg p-3">
                    <h3 className="font-medium">{station.name}</h3>
                    <p className="text-sm text-gray-500">{station.distance.toFixed(2)} km away</p>
                    <div className="mt-2 flex">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${station.location.latitude},${station.location.longitude}`, '_blank')}
                      >
                        <MapPin className="mr-1 h-3 w-3" /> Directions
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="ml-2 text-xs"
                        onClick={() => window.open(`tel:${station.phone_number || ''}`, '_blank')}
                        disabled={!station.phone_number}
                      >
                        <Phone className="mr-1 h-3 w-3" /> Contact
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="pt-2">
                  <Button variant="ghost" size="sm" asChild className="text-sm">
                    <Link to="/citizen-dashboard/find-station/">
                      Find more stations <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No nearby stations found.</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link to="/citizen-dashboard/find-station/">
                    <MapPin className="mr-2 h-4 w-4" /> Find stations
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const CitizenDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  
  // Add timeout to prevent infinite loading
  useEffect(() => {
    // Set a timeout to stop showing loading after 5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
      console.log("[CitizenDashboard] Loading timeout reached, forcing dashboard to show");
    }, 5000);
    
    // Clear the timeout if user loads successfully
    if (user) {
      clearTimeout(timer);
      setIsLoading(false);
      console.log("[CitizenDashboard] User loaded successfully:", user);
    }
    
    return () => clearTimeout(timer);
  }, [user]);

  // Redirect to main page if role doesn't match
  useEffect(() => {
    if (user && user.role !== "citizen") {
      console.log("[CitizenDashboard] User role doesn't match:", user.role);
      
      // Redirect to appropriate dashboard based on role
      if (user.role === "national_admin") {
        console.log("[CitizenDashboard] Redirecting to National dashboard");
        navigate("/national-dashboard/", { replace: true });
      } else if (user.role === "station_admin") {
        console.log("[CitizenDashboard] Redirecting to Station Admin dashboard");
        navigate("/station-dashboard/", { replace: true });
      } else if (user.role === "officer") {
        console.log("[CitizenDashboard] Redirecting to Officer dashboard");
        navigate("/officer-dashboard/", { replace: true });
      } else {
        // Default fallback
        console.log("[CitizenDashboard] Role unknown, redirecting to home");
        navigate("/", { replace: true });
      }
    }
  }, [user, navigate]);

  if (!user && isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-spin mb-4">
          <Loader2 size={48} className="text-blue-500" />
        </div>
        <p className="text-lg font-medium">Loading your dashboard...</p>
        <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
      </div>
    );
  }

  // If we're past the loading timeout and still no user, show a fallback UI
  if (!user && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="mb-4 text-amber-500">
          <AlertCircle size={48} />
        </div>
        <h2 className="text-xl font-bold mb-2">Dashboard Access Issue</h2>
        <p className="text-center mb-4">
          We're having trouble loading your user information. This could be due to:
        </p>
        <ul className="list-disc pl-6 mb-6 text-gray-700">
          <li>Your session may have expired</li>
          <li>You may not have the correct permissions</li>
          <li>There might be a temporary system issue</li>
        </ul>
        <div className="flex gap-4">
          <Button onClick={() => navigate("/sign-in")}>
            Sign In Again
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  // Function to set the active nav item based on current path
  const getNavItemsWithActive = () => {
    const currentPath = location.pathname;
    return navItems.map(item => ({
      ...item,
      active: currentPath.includes(item.href) || 
              (item.href === "/citizen-dashboard/" && currentPath === "/citizen-dashboard")
    }));
  };

  return (
    <DashboardLayout
      title="Citizen Dashboard"
      subtitle={`Welcome, ${user.full_name || "Citizen"}`}
      navItems={getNavItemsWithActive()}
      userName={user.full_name || "Citizen"}
      userRole="Citizen"
      notifications={3}
    >
      <Routes>
        <Route index element={<DashboardHome />} />
        <Route path="report/*" element={<CitizenReportPage />} />
        <Route path="reports/*" element={
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">My Reports</h2>
            <ReportsContent />
          </div>
        } />
        <Route path="find-station/*" element={
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Find Police Station</h2>
            <FindStationContent />
          </div>
        } />
        <Route path="notifications/*" element={
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Notifications</h2>
            <NotificationsContent />
          </div>
        } />
        <Route path="track/*" element={
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Track Your Cases</h2>
            <TrackCaseContent />
          </div>
        } />
        <Route path="support/*" element={
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Contact Support</h2>
            <SupportContent />
          </div>
        } />
        <Route path="help/*" element={
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Help & FAQs</h2>
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Common questions and answers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">How do I report a crime?</h3>
                  <p className="text-sm text-gray-600">
                    You can report a crime by clicking the "Report Crime" button on your dashboard.
                  </p>
                </div>
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">How long does it take for my report to be processed?</h3>
                  <p className="text-sm text-gray-600">
                    Most reports are initially reviewed within 24-48 hours.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        } />
        <Route path="settings/*" element={
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
            <Card>
              <CardHeader>
                <CardTitle>Your Account</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium">Full Name</h3>
                    <p className="text-gray-700">{user.full_name || "User"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Email</h3>
                    <p className="text-gray-700">{user.email || "email@example.com"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        } />
        <Route path="*" element={<Navigate to="/citizen-dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default CitizenDashboard;
