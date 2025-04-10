import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CalendarCheck, FileText, MapPin, Bell, Home, User, Settings, MessageCircle, HelpCircle, FileSearch } from 'lucide-react';

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
    icon: <FileText className="h-5 w-5" />,
    active: true
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

export default function CitizenReports() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to main page if role doesn't match
  useEffect(() => {
    if (user && user.role !== "citizen") {
      console.log("[CitizenReports] User role doesn't match, redirecting to home");
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout
      title="My Reports"
      subtitle="View and manage your submitted reports"
      navItems={navItems}
      role="citizen"
      notifications={3}
    >
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>My Reports</CardTitle>
            <CardDescription>
              All your submitted reports and their current status
            </CardDescription>
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
                <div className="mt-3 flex space-x-2">
                  <button className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100">
                    View Details
                  </button>
                  <button className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100">
                    Contact Officer
                  </button>
                </div>
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
                <div className="mt-3 flex space-x-2">
                  <button className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100">
                    View Details
                  </button>
                  <button className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100">
                    Contact Officer
                  </button>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">Noise Complaint #12347</h3>
                    <p className="text-sm text-gray-500">Submitted on March 5, 2025</p>
                  </div>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">Closed</span>
                </div>
                <p className="mt-2 text-sm">Excessive noise from neighboring apartment during night hours.</p>
                <div className="mt-3 flex space-x-2">
                  <button className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100">
                    View Details
                  </button>
                  <button className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100">
                    Submit Feedback
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
