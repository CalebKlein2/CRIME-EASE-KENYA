import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CalendarCheck, FileText, MapPin, Bell, Home, User, Settings, MessageCircle, HelpCircle, FileSearch, CheckCircle, Clock, AlertCircle } from 'lucide-react';

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
    icon: <FileSearch className="h-5 w-5" />,
    active: true
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

// Mock case tracking data
const mockCaseDetails = {
  caseNumber: "12345",
  title: "Theft of Personal Property",
  dateReported: "March 15, 2025",
  status: "In Progress",
  assignedTo: "Officer John Doe",
  badgeNumber: "KP-1234",
  station: "Central Police Station",
  description: "Theft of laptop from vehicle at Main Street parking lot.",
  timeline: [
    {
      date: "March 15, 2025",
      time: "10:30 AM",
      status: "Reported",
      description: "Case reported via online portal",
      icon: <FileText className="h-4 w-4" />
    },
    {
      date: "March 15, 2025",
      time: "2:45 PM",
      status: "Assigned",
      description: "Case assigned to Officer John Doe",
      icon: <User className="h-4 w-4" />
    },
    {
      date: "March 16, 2025",
      time: "9:15 AM",
      status: "Investigation Started",
      description: "Initial investigation begun, evidence collection underway",
      icon: <FileSearch className="h-4 w-4" />
    },
    {
      date: "March 18, 2025",
      time: "3:30 PM",
      status: "In Progress",
      description: "Reviewing security camera footage from the area",
      icon: <Clock className="h-4 w-4" />
    }
  ]
};

export default function TrackCase() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [caseNumber, setCaseNumber] = useState("");
  const [caseDetails, setCaseDetails] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Redirect to main page if role doesn't match
  useEffect(() => {
    if (user && user.role !== "citizen") {
      console.log("[TrackCase] User role doesn't match, redirecting to home");
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleTrackCase = () => {
    // In a real app, this would make an API call to fetch the case details
    setSearchPerformed(true);
    if (caseNumber === "12345") {
      setCaseDetails(mockCaseDetails);
    } else {
      setCaseDetails(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Reported':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'Assigned':
        return <User className="h-5 w-5 text-purple-500" />;
      case 'Investigation Started':
        return <FileSearch className="h-5 w-5 text-orange-500" />;
      case 'In Progress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'Resolved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Closed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <DashboardLayout
      title="Track Your Case"
      subtitle="Monitor the progress of your reported cases"
      navItems={navItems}
      role="citizen"
      notifications={3}
    >
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Case Tracker</CardTitle>
            <CardDescription>
              Enter your case number to track its status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input 
                  placeholder="Enter case number (e.g., 12345)" 
                  value={caseNumber}
                  onChange={(e) => setCaseNumber(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button onClick={handleTrackCase}>
                <FileSearch className="mr-2 h-4 w-4" />
                Track Case
              </Button>
            </div>
            
            {searchPerformed && !caseDetails && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
                <p className="text-sm">No case found with the provided case number. Please check and try again.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {caseDetails && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Case #{caseDetails.caseNumber}</CardTitle>
                  <CardDescription>
                    {caseDetails.title} | Reported on {caseDetails.dateReported}
                  </CardDescription>
                </div>
                <div className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  {caseDetails.status}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4">
                    <h3 className="text-sm font-medium mb-2">Case Details</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">Case Type:</span>
                        <span className="ml-2">{caseDetails.title}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Description:</span>
                        <p className="mt-1">{caseDetails.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="text-sm font-medium mb-2">Investigation Details</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">Assigned To:</span>
                        <span className="ml-2">{caseDetails.assignedTo}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Badge Number:</span>
                        <span className="ml-2">{caseDetails.badgeNumber}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Station:</span>
                        <span className="ml-2">{caseDetails.station}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-4">Case Timeline</h3>
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-3.5 top-0 h-full w-0.5 bg-gray-200"></div>
                    
                    {/* Timeline events */}
                    <div className="space-y-6">
                      {caseDetails.timeline.map((event, index) => (
                        <div key={index} className="relative pl-10">
                          {/* Timeline dot */}
                          <div className="absolute left-0 rounded-full bg-white p-1 border-2 border-blue-500">
                            {event.icon}
                          </div>
                          
                          <div className="flex flex-col">
                            <div className="flex items-center mb-1">
                              <h4 className="text-sm font-medium">{event.status}</h4>
                              <div className="ml-3 text-xs text-gray-500">
                                {event.date} at {event.time}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">{event.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4 pt-4 border-t">
                  <Button>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Contact Officer
                  </Button>
                  <Button variant="outline">
                    <User className="mr-2 h-4 w-4" />
                    Request Update
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
