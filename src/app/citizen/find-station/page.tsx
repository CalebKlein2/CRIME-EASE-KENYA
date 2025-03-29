import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarCheck, FileText, MapPin, Bell, Home, User, Settings, MessageCircle, HelpCircle, FileSearch, Phone, ExternalLink } from 'lucide-react';

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
    icon: <MapPin className="h-5 w-5" />,
    active: true
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

const stations = [
  {
    id: 1,
    name: "Central Police Station",
    distance: "2.3 km",
    address: "123 Main Street, Central District",
    phone: "+254 712 345 678",
    services: ["General Reporting", "Criminal Investigation", "Traffic Division"],
    hours: "24/7"
  },
  {
    id: 2,
    name: "Westlands Police Post",
    distance: "4.7 km",
    address: "456 Westlands Road, Westlands",
    phone: "+254 723 456 789",
    services: ["General Reporting", "Community Policing"],
    hours: "8:00 AM - 8:00 PM"
  },
  {
    id: 3,
    name: "Eastleigh Police Station",
    distance: "6.1 km",
    address: "789 Eastleigh Avenue, Eastleigh",
    phone: "+254 734 567 890",
    services: ["General Reporting", "Criminal Investigation", "Gender Desk"],
    hours: "24/7"
  }
];

export default function FindStation() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to main page if role doesn't match
  useEffect(() => {
    if (user && user.role !== "citizen") {
      console.log("[FindStation] User role doesn't match, redirecting to home");
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout
      title="Find Police Station"
      subtitle="Locate police stations near you"
      navItems={navItems}
      role="citizen"
      notifications={3}
    >
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Search Police Stations</CardTitle>
            <CardDescription>
              Find police stations by location or name
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input 
                  placeholder="Enter location or postal code" 
                  className="w-full"
                />
              </div>
              <Button>
                <MapPin className="mr-2 h-4 w-4" />
                Find Nearest Stations
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nearby Police Stations</CardTitle>
            <CardDescription>
              Stations closest to your current location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stations.map(station => (
                <div key={station.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{station.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{station.distance} away</p>
                      <p className="text-sm mt-2">{station.address}</p>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <Phone className="h-3 w-3 mr-1" />
                        <span>{station.phone}</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-xs font-medium">Hours: </span>
                        <span className="text-xs">{station.hours}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {station.services.map(service => (
                          <span 
                            key={service} 
                            className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline">
                        <MapPin className="mr-2 h-3 w-3" /> Directions
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="mr-2 h-3 w-3" /> Call
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <Button variant="outline">
              View All Stations <ExternalLink className="ml-2 h-3 w-3" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
}
