import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
  Mail
} from 'lucide-react';
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
    href: "/citizen-dashboard",
    icon: <Home className="h-5 w-5" />
  },
  {
    label: "My Reports",
    href: "/citizen-dashboard/reports",
    icon: <FileText className="h-5 w-5" />
  },
  {
    label: "Find Station",
    href: "/citizen-dashboard/find-station",
    icon: <MapPin className="h-5 w-5" />
  },
  {
    label: "Notifications",
    href: "/citizen-dashboard/notifications",
    icon: <Bell className="h-5 w-5" />
  },
  {
    label: "Track Case",
    href: "/citizen-dashboard/track",
    icon: <FileSearch className="h-5 w-5" />
  },
  {
    label: "Contact Support",
    href: "/citizen-dashboard/support",
    icon: <MessageCircle className="h-5 w-5" />
  },
  {
    label: "Help & FAQs",
    href: "/citizen-dashboard/help",
    icon: <HelpCircle className="h-5 w-5" />
  },
  {
    label: "Profile Settings",
    href: "/citizen-dashboard/settings",
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

// Enhanced Reports Content
const ReportsContent = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock reports data
  const reports = [
    {
      id: "12345",
      title: "Theft Report",
      date: "March 15, 2025",
      status: "in-progress",
      statusText: "In Progress",
      description: "Theft of laptop from vehicle at Main Street parking lot between 2-4 PM.",
      officer: "Officer Johnson",
      location: "Main Street, Nairobi",
      category: "Theft",
      lastUpdated: "March 20, 2025",
      caseNumber: "CRB-23456",
      attachments: 2
    },
    {
      id: "12346",
      title: "Vandalism Report",
      date: "March 10, 2025",
      status: "resolved",
      statusText: "Resolved",
      description: "Graffiti on the community center wall on Park Avenue.",
      officer: "Officer Williams",
      location: "Park Avenue, Nairobi",
      category: "Vandalism",
      lastUpdated: "March 18, 2025",
      caseNumber: "CRB-23457",
      attachments: 1
    },
    {
      id: "12347",
      title: "Noise Complaint",
      date: "March 8, 2025",
      status: "pending",
      statusText: "Pending Review",
      description: "Continuous loud music from apartment 4B after 11 PM for the last week.",
      officer: "Unassigned",
      location: "River Road Apartments, Nairobi",
      category: "Disturbance",
      lastUpdated: "March 8, 2025",
      caseNumber: "CRB-23458",
      attachments: 0
    },
    {
      id: "12348",
      title: "Stolen Vehicle",
      date: "March 5, 2025",
      status: "investigating",
      statusText: "Under Investigation",
      description: "White Toyota Corolla, license plate KBN 456X, stolen from workplace parking lot.",
      officer: "Officer Ngugi",
      location: "Westlands Business Park, Nairobi",
      category: "Theft",
      lastUpdated: "March 16, 2025",
      caseNumber: "CRB-23459",
      attachments: 3
    }
  ];

  // Filter reports based on active tab
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.caseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "pending" && report.status === "pending") return matchesSearch;
    if (activeTab === "active" && (report.status === "in-progress" || report.status === "investigating")) return matchesSearch;
    if (activeTab === "resolved" && report.status === "resolved") return matchesSearch;
    
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
            <Link to="/report">
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

// Main dashboard content component
const DashboardHome = () => {
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
              <Link to="/report">
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
              <Link to="/citizen-dashboard/reports">
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
              <Link to="/citizen-dashboard/find-station">
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
              <Link to="/citizen-dashboard/notifications">
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
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">Theft Report #12345</h3>
                    <p className="text-sm text-gray-500">Submitted on March 15, 2025</p>
                  </div>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">In Progress</span>
                </div>
                <p className="mt-2 text-sm">Theft of laptop from vehicle at Main Street parking lot.</p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">Vandalism Report #12346</h3>
                    <p className="text-sm text-gray-500">Submitted on March 10, 2025</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Resolved</span>
                </div>
                <p className="mt-2 text-sm">Graffiti on the community center wall.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nearby Stations</CardTitle>
            <CardDescription>Police stations in your area</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-3">
                <h3 className="font-medium">Central Police Station</h3>
                <p className="text-sm text-gray-500">2.3 km away</p>
                <div className="mt-2 flex">
                  <Button size="sm" variant="outline" className="text-xs">
                    <MapPin className="mr-1 h-3 w-3" /> Directions
                  </Button>
                  <Button size="sm" variant="outline" className="ml-2 text-xs">
                    <Bell className="mr-1 h-3 w-3" /> Contact
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg p-3">
                <h3 className="font-medium">Westlands Police Post</h3>
                <p className="text-sm text-gray-500">4.7 km away</p>
                <div className="mt-2 flex">
                  <Button size="sm" variant="outline" className="text-xs">
                    <MapPin className="mr-1 h-3 w-3" /> Directions
                  </Button>
                  <Button size="sm" variant="outline" className="ml-2 text-xs">
                    <Bell className="mr-1 h-3 w-3" /> Contact
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default function CitizenDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Update active nav item based on current path
  const getNavItemsWithActive = () => {
    return navItems.map(item => ({
      ...item,
      active: location.pathname === item.href || 
              (item.href !== "/citizen-dashboard" && location.pathname.startsWith(item.href))
    }));
  };
  
  // Redirect to main page if role doesn't match
  useEffect(() => {
    if (user && user.role !== "citizen") {
      console.log("[CitizenDashboard] User role doesn't match, redirecting to home");
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout
      title="Citizen Dashboard"
      subtitle={`Welcome, ${user.full_name || "Citizen"}`}
      navItems={getNavItemsWithActive()}
      role="citizen"
      notifications={3}
    >
      <Routes>
        <Route index element={<DashboardHome />} />
        <Route path="reports/*" element={
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">My Reports</h2>
            <ReportsContent />
          </div>
        } />
        <Route path="find-station/*" element={
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Find Police Station</h2>
            <Card>
              <CardHeader>
                <CardTitle>Nearby Police Stations</CardTitle>
                <CardDescription>Police stations in your vicinity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-3">
                    <h3 className="font-medium">Central Police Station</h3>
                    <p className="text-sm text-gray-500">2.3 km away</p>
                    <div className="mt-2 flex">
                      <Button size="sm" variant="outline" className="text-xs">
                        <MapPin className="mr-1 h-3 w-3" /> Directions
                      </Button>
                      <Button size="sm" variant="outline" className="ml-2 text-xs">
                        <Bell className="mr-1 h-3 w-3" /> Contact
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        } />
        <Route path="notifications/*" element={
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Notifications</h2>
            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>Updates on your reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-blue-500" />
                      <div>
                        <h3 className="font-medium">Case Update: Theft Report #12345</h3>
                        <p className="text-sm text-gray-500">Your case has been assigned to Officer Johnson.</p>
                        <p className="text-xs text-gray-400 mt-1">Today, 10:30 AM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        } />
        <Route path="track/*" element={
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Track Your Cases</h2>
            <Card>
              <CardHeader>
                <CardTitle>Case Status</CardTitle>
                <CardDescription>Monitor the progress of your cases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium">Theft Report #12345</h3>
                    <p className="text-sm text-gray-500 mb-4">Submitted on March 15, 2025</p>
                    <div className="relative">
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 z-0"></div>
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-3/5 h-1 bg-blue-500 z-10"></div>
                      <div className="relative z-20 flex justify-between">
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">✓</div>
                          <span className="text-xs mt-1">Submitted</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">✓</div>
                          <span className="text-xs mt-1">Reviewed</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">✓</div>
                          <span className="text-xs mt-1">Assigned</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xs">⋯</div>
                          <span className="text-xs mt-1">Investigating</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-gray-300 text-white flex items-center justify-center text-xs"></div>
                          <span className="text-xs mt-1">Resolved</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        } />
        <Route path="support/*" element={
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Contact Support</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Support</CardTitle>
                  <CardDescription>For issues with the app or website</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">+254 712 345 678</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">tech.support@crime-ease.ke</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
}
