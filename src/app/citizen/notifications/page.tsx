import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CalendarCheck, FileText, MapPin, Bell, Home, User, Settings, MessageCircle, HelpCircle, FileSearch, Clock, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    icon: <Bell className="h-5 w-5" />,
    active: true
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

// Mock notification data
const notifications = [
  {
    id: 1,
    title: "Case Update: Theft Report #12345",
    message: "Officer John Doe has been assigned to your case. Expect contact within 24 hours.",
    timestamp: "Today, 2:45 PM",
    read: false,
    type: "update"
  },
  {
    id: 2,
    title: "Evidence Request: Theft Report #12345",
    message: "Please upload any additional photos or documentation related to your stolen property.",
    timestamp: "Today, 11:30 AM",
    read: false,
    type: "request"
  },
  {
    id: 3,
    title: "Case Status Change: Vandalism Report #12346",
    message: "Your case status has been updated to 'Resolved'. The suspect has been identified and appropriate action has been taken.",
    timestamp: "Yesterday, 3:15 PM",
    read: true,
    type: "status"
  },
  {
    id: 4,
    title: "Feedback Request: Noise Complaint #12347",
    message: "Your case has been closed. Please take a moment to provide feedback on how we handled your complaint.",
    timestamp: "Mar 25, 2025",
    read: true,
    type: "feedback"
  },
  {
    id: 5,
    title: "Crime Alert: Your Area",
    message: "There have been reports of vehicle break-ins in your neighborhood. Please ensure your vehicles are locked and valuables are not visible.",
    timestamp: "Mar 23, 2025",
    read: true,
    type: "alert"
  }
];

export default function CitizenNotifications() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to main page if role doesn't match
  useEffect(() => {
    if (user && user.role !== "citizen") {
      console.log("[CitizenNotifications] User role doesn't match, redirecting to home");
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'update':
        return <Bell className="h-5 w-5 text-blue-500" />;
      case 'request':
        return <FileText className="h-5 w-5 text-purple-500" />;
      case 'status':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'feedback':
        return <MessageCircle className="h-5 w-5 text-orange-500" />;
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <DashboardLayout
      title="Notifications"
      subtitle="Stay updated on your cases and alerts"
      navItems={navItems}
      role="citizen"
      notifications={notifications.filter(n => !n.read).length}
    >
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Notifications</CardTitle>
              <CardDescription>
                Updates and alerts about your reports and local safety
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Mark All as Read
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`border rounded-lg p-4 transition-colors ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className={`font-medium truncate ${notification.read ? '' : 'text-blue-800'}`}>
                          {notification.title}
                        </h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {notification.timestamp}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-700">
                        {notification.message}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 text-xs">
                          {notification.read ? 'Mark as Unread' : 'Mark as Read'}
                        </Button>
                        {notification.type === 'update' || notification.type === 'status' && (
                          <Button variant="ghost" size="sm" className="h-8 text-xs">
                            View Case
                          </Button>
                        )}
                        {notification.type === 'request' && (
                          <Button variant="ghost" size="sm" className="h-8 text-xs">
                            Respond
                          </Button>
                        )}
                        {notification.type === 'feedback' && (
                          <Button variant="ghost" size="sm" className="h-8 text-xs">
                            Give Feedback
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
