import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/tables/DataTable";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Bell, 
  AlertCircle, 
  ArrowUpCircle,
  Clock,
  Building,
  Filter,
  Search,
  CheckCircle2,
  Eye
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock alerts data for the national admin
const alertsData = [
  {
    id: "1",
    title: "Spike in Vehicle Theft",
    message: "15% increase in vehicle theft cases reported in Nairobi over the last week.",
    type: "crime_trend",
    region: "Nairobi",
    severity: "high",
    timestamp: "2025-03-30 14:23",
    read: false,
  },
  {
    id: "2",
    title: "Officer Shortage Alert",
    message: "Critical officer shortage in Coast Region. Currently at 65% of required staff.",
    type: "resource",
    region: "Coast",
    severity: "medium",
    timestamp: "2025-03-30 11:15",
    read: true,
  },
  {
    id: "3",
    title: "System Maintenance",
    message: "Scheduled system maintenance on April 2nd from 02:00 to 04:00.",
    type: "system",
    region: "All Regions",
    severity: "low",
    timestamp: "2025-03-29 16:45",
    read: false,
  },
  {
    id: "4",
    title: "New Policy Implementation",
    message: "New evidence handling policy takes effect on April 5th. All stations must comply.",
    type: "policy",
    region: "All Regions",
    severity: "medium",
    timestamp: "2025-03-29 10:30",
    read: true,
  },
  {
    id: "5",
    title: "Regional Security Concern",
    message: "Increased border security incidents reported in North Eastern region.",
    type: "security",
    region: "North Eastern",
    severity: "high",
    timestamp: "2025-03-28 09:15",
    read: false,
  },
  {
    id: "6",
    title: "Missing Person Report Surge",
    message: "Unusual increase in missing person reports in Western Region. Potential pattern detected.",
    type: "crime_trend",
    region: "Western",
    severity: "high",
    timestamp: "2025-03-28 08:45",
    read: true,
  },
  {
    id: "7",
    title: "Quarterly Report Available",
    message: "Q1 2025 crime statistics report is now available for review.",
    type: "report",
    region: "All Regions",
    severity: "low",
    timestamp: "2025-03-28 08:00",
    read: false,
  },
  {
    id: "8",
    title: "Database Performance Issues",
    message: "Case database experiencing slower than normal performance. IT team investigating.",
    type: "system",
    region: "All Regions",
    severity: "medium",
    timestamp: "2025-03-27 15:30",
    read: false,
  },
  {
    id: "9",
    title: "Budget Allocation Updated",
    message: "New fiscal quarter budget allocation has been approved and distributed.",
    type: "administrative",
    region: "All Regions",
    severity: "medium",
    timestamp: "2025-03-27 12:00",
    read: true,
  },
  {
    id: "10",
    title: "Emergency Response Drill",
    message: "Nationwide emergency response drill scheduled for April 10th.",
    type: "training",
    region: "All Regions",
    severity: "medium",
    timestamp: "2025-03-26 16:45",
    read: false,
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

export default function AlertsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedType, setSelectedType] = useState("All");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  
  // Filter alerts based on search query and filters
  const filteredAlerts = alertsData
    .filter(alert => {
      const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            alert.message.toLowerCase().includes(searchQuery.toLowerCase());
                         
      const matchesSeverity = selectedSeverity === "All" || alert.severity === selectedSeverity.toLowerCase();
      const matchesRegion = selectedRegion === "All Regions" || alert.region === selectedRegion;
      const matchesType = selectedType === "All" || alert.type === selectedType;
      const matchesRead = showUnreadOnly ? !alert.read : true;
      
      return matchesSearch && matchesSeverity && matchesRegion && matchesType && matchesRead;
    });
  
  const handleMarkAsRead = (id: string) => {
    console.log("Mark as read:", id);
    // API call to mark alert as read
  };

  const handleViewAlert = (id: string) => {
    console.log("View alert:", id);
    // Navigate to alert details or open modal
  };

  const handleClearAll = () => {
    console.log("Clear all alerts");
    // API call to mark all alerts as read
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Alerts & Notifications</h2>
          <p className="text-gray-500">System-wide alerts and critical notifications</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleClearAll}>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Mark All as Read
          </Button>
          <Button>
            <Bell className="h-4 w-4 mr-2" />
            Alert Settings
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Alert Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search alerts by title or content..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Severity</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map(region => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Alert Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  <SelectItem value="crime_trend">Crime Trend</SelectItem>
                  <SelectItem value="resource">Resource</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="policy">Policy</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="report">Report</SelectItem>
                  <SelectItem value="administrative">Administrative</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center gap-2">
                <Switch 
                  id="unread-only" 
                  checked={showUnreadOnly}
                  onCheckedChange={setShowUnreadOnly}
                />
                <Label htmlFor="unread-only">Unread Only</Label>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Alerts</TabsTrigger>
              <TabsTrigger value="high">High Priority</TabsTrigger>
              <TabsTrigger value="system">System Alerts</TabsTrigger>
              <TabsTrigger value="regional">Regional Alerts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <DataTable
                data={filteredAlerts}
                columns={[
                  {
                    key: "status",
                    header: "",
                    cell: (item) => (
                      <div className="flex items-center justify-center">
                        {!item.read && (
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                    ),
                  },
                  {
                    key: "title",
                    header: "Alert",
                    cell: (item) => (
                      <div>
                        <div className="font-medium flex items-center">
                          {item.severity === "high" ? (
                            <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                          ) : item.severity === "medium" ? (
                            <ArrowUpCircle className="h-4 w-4 mr-2 text-yellow-500" />
                          ) : (
                            <Bell className="h-4 w-4 mr-2 text-blue-500" />
                          )}
                          {item.title}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{item.message}</p>
                      </div>
                    ),
                  },
                  {
                    key: "region",
                    header: "Region",
                    cell: (item) => (
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-1 text-gray-500" />
                        {item.region}
                      </div>
                    ),
                  },
                  {
                    key: "severity",
                    header: "Severity",
                    cell: (item) => (
                      <Badge
                        className={
                          item.severity === "high" ? "bg-red-100 text-red-800 hover:bg-red-100" :
                          item.severity === "medium" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" :
                          "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        }
                      >
                        {item.severity.charAt(0).toUpperCase() + item.severity.slice(1)}
                      </Badge>
                    ),
                  },
                  {
                    key: "type",
                    header: "Type",
                    cell: (item) => (
                      <Badge
                        variant="outline"
                        className="capitalize"
                      >
                        {item.type.replace('_', ' ')}
                      </Badge>
                    ),
                  },
                  {
                    key: "timestamp",
                    header: "Time",
                    cell: (item) => (
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {item.timestamp}
                      </div>
                    ),
                  },
                  {
                    key: "actions",
                    header: "",
                    cell: (item) => (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleViewAlert(item.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        {!item.read && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleMarkAsRead(item.id)}
                          >
                            Mark Read
                          </Button>
                        )}
                      </div>
                    ),
                  },
                ]}
              />
            </TabsContent>
            
            <TabsContent value="high" className="mt-6">
              <DataTable
                data={filteredAlerts.filter(alert => alert.severity === "high")}
                columns={[
                  {
                    key: "status",
                    header: "",
                    cell: (item) => (
                      <div className="flex items-center justify-center">
                        {!item.read && (
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                    ),
                  },
                  {
                    key: "title",
                    header: "Alert",
                    cell: (item) => (
                      <div>
                        <div className="font-medium flex items-center">
                          <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                          {item.title}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{item.message}</p>
                      </div>
                    ),
                  },
                  {
                    key: "region",
                    header: "Region",
                    cell: (item) => (
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-1 text-gray-500" />
                        {item.region}
                      </div>
                    ),
                  },
                  {
                    key: "timestamp",
                    header: "Time",
                    cell: (item) => (
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {item.timestamp}
                      </div>
                    ),
                  },
                  {
                    key: "actions",
                    header: "",
                    cell: (item) => (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleViewAlert(item.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    ),
                  },
                ]}
              />
            </TabsContent>
            
            <TabsContent value="system" className="mt-6">
              <DataTable
                data={filteredAlerts.filter(alert => alert.type === "system")}
                columns={[
                  {
                    key: "status",
                    header: "",
                    cell: (item) => (
                      <div className="flex items-center justify-center">
                        {!item.read && (
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                    ),
                  },
                  {
                    key: "title",
                    header: "Alert",
                    cell: (item) => (
                      <div>
                        <div className="font-medium flex items-center">
                          {item.severity === "high" ? (
                            <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                          ) : item.severity === "medium" ? (
                            <ArrowUpCircle className="h-4 w-4 mr-2 text-yellow-500" />
                          ) : (
                            <Bell className="h-4 w-4 mr-2 text-blue-500" />
                          )}
                          {item.title}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{item.message}</p>
                      </div>
                    ),
                  },
                  {
                    key: "severity",
                    header: "Severity",
                    cell: (item) => (
                      <Badge
                        className={
                          item.severity === "high" ? "bg-red-100 text-red-800 hover:bg-red-100" :
                          item.severity === "medium" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" :
                          "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        }
                      >
                        {item.severity.charAt(0).toUpperCase() + item.severity.slice(1)}
                      </Badge>
                    ),
                  },
                  {
                    key: "timestamp",
                    header: "Time",
                    cell: (item) => (
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {item.timestamp}
                      </div>
                    ),
                  },
                  {
                    key: "actions",
                    header: "",
                    cell: (item) => (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleViewAlert(item.id)}
                        >
                          View
                        </Button>
                        {!item.read && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleMarkAsRead(item.id)}
                          >
                            Mark Read
                          </Button>
                        )}
                      </div>
                    ),
                  },
                ]}
              />
            </TabsContent>
            
            <TabsContent value="regional" className="mt-6">
              <DataTable
                data={filteredAlerts.filter(alert => alert.region !== "All Regions")}
                columns={[
                  {
                    key: "status",
                    header: "",
                    cell: (item) => (
                      <div className="flex items-center justify-center">
                        {!item.read && (
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                    ),
                  },
                  {
                    key: "title",
                    header: "Alert",
                    cell: (item) => (
                      <div>
                        <div className="font-medium flex items-center">
                          {item.severity === "high" ? (
                            <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                          ) : item.severity === "medium" ? (
                            <ArrowUpCircle className="h-4 w-4 mr-2 text-yellow-500" />
                          ) : (
                            <Bell className="h-4 w-4 mr-2 text-blue-500" />
                          )}
                          {item.title}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{item.message}</p>
                      </div>
                    ),
                  },
                  {
                    key: "region",
                    header: "Region",
                    cell: (item) => (
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-1 text-gray-500" />
                        {item.region}
                      </div>
                    ),
                  },
                  {
                    key: "severity",
                    header: "Severity",
                    cell: (item) => (
                      <Badge
                        className={
                          item.severity === "high" ? "bg-red-100 text-red-800 hover:bg-red-100" :
                          item.severity === "medium" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" :
                          "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        }
                      >
                        {item.severity.charAt(0).toUpperCase() + item.severity.slice(1)}
                      </Badge>
                    ),
                  },
                  {
                    key: "timestamp",
                    header: "Time",
                    cell: (item) => (
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {item.timestamp}
                      </div>
                    ),
                  },
                  {
                    key: "actions",
                    header: "",
                    cell: (item) => (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleViewAlert(item.id)}
                        >
                          View
                        </Button>
                        {!item.read && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleMarkAsRead(item.id)}
                          >
                            Mark Read
                          </Button>
                        )}
                      </div>
                    ),
                  },
                ]}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Alert Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="severity">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="severity">By Severity</TabsTrigger>
                <TabsTrigger value="region">By Region</TabsTrigger>
                <TabsTrigger value="type">By Type</TabsTrigger>
              </TabsList>
              
              <TabsContent value="severity" className="mt-4">
                <div className="h-[300px]">
                  {/* Chart for alert distribution by severity would go here */}
                  <div className="flex items-center justify-center h-full bg-gray-50 rounded-md border">
                    <p className="text-gray-500">Alert Distribution by Severity Chart</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="region" className="mt-4">
                <div className="h-[300px]">
                  {/* Chart for alert distribution by region would go here */}
                  <div className="flex items-center justify-center h-full bg-gray-50 rounded-md border">
                    <p className="text-gray-500">Alert Distribution by Region Chart</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="type" className="mt-4">
                <div className="h-[300px]">
                  {/* Chart for alert distribution by type would go here */}
                  <div className="flex items-center justify-center h-full bg-gray-50 rounded-md border">
                    <p className="text-gray-500">Alert Distribution by Type Chart</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Alert Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="high-priority">High Priority Alerts</Label>
                  <p className="text-xs text-gray-500">
                    Critical alerts requiring immediate attention
                  </p>
                </div>
                <Switch id="high-priority" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="medium-priority">Medium Priority Alerts</Label>
                  <p className="text-xs text-gray-500">
                    Important but not critical alerts
                  </p>
                </div>
                <Switch id="medium-priority" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="low-priority">Low Priority Alerts</Label>
                  <p className="text-xs text-gray-500">
                    Informational alerts and updates
                  </p>
                </div>
                <Switch id="low-priority" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-xs text-gray-500">
                    Receive alerts via email
                  </p>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                  <p className="text-xs text-gray-500">
                    Receive critical alerts via SMS
                  </p>
                </div>
                <Switch id="sms-notifications" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-refresh">Auto Refresh</Label>
                  <p className="text-xs text-gray-500">
                    Automatically refresh alerts every 5 minutes
                  </p>
                </div>
                <Switch id="auto-refresh" defaultChecked />
              </div>
            </div>
            
            <Button className="w-full mt-6">
              Save Alert Preferences
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
