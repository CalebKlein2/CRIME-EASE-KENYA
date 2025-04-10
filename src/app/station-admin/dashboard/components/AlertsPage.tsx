import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/tables/DataTable";
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpCircle,
  Clock
} from 'lucide-react';

// Mock alerts data
const alertsData = [
  {
    id: "1",
    title: "High Priority Case Assigned",
    message: "A new high priority case has been assigned to your station.",
    type: "case",
    priority: "high",
    timestamp: "2025-03-30 14:23",
    read: false,
  },
  {
    id: "2",
    title: "Resource Shortage Alert",
    message: "Vehicle maintenance required for 3 patrol cars.",
    type: "resource",
    priority: "medium",
    timestamp: "2025-03-30 11:15",
    read: true,
  },
  {
    id: "3",
    title: "System Maintenance",
    message: "Scheduled system maintenance on April 2nd from 02:00 to 04:00.",
    type: "system",
    priority: "low",
    timestamp: "2025-03-29 16:45",
    read: false,
  },
  {
    id: "4",
    title: "Officer Shift Change",
    message: "Multiple officer shift changes for tomorrow due to training.",
    type: "personnel",
    priority: "medium",
    timestamp: "2025-03-29 10:30",
    read: true,
  },
  {
    id: "5",
    title: "Patrol Zone Update",
    message: "New patrol zones have been configured for your station.",
    type: "operations",
    priority: "medium",
    timestamp: "2025-03-28 09:15",
    read: false,
  },
  {
    id: "6",
    title: "Missing Person Report",
    message: "New missing person report filed in your jurisdiction.",
    type: "case",
    priority: "high",
    timestamp: "2025-03-28 08:45",
    read: true,
  },
  {
    id: "7",
    title: "Monthly Report Available",
    message: "The monthly crime statistics report is now available for review.",
    type: "report",
    priority: "low",
    timestamp: "2025-03-28 08:00",
    read: false,
  },
];

export default function StationAlertsPage() {
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
          <p className="text-gray-500">Stay updated with important information</p>
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
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Alerts</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="high">High Priority</TabsTrigger>
          <TabsTrigger value="case">Case Alerts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={alertsData}
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
                          {item.priority === "high" ? (
                            <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                          ) : item.priority === "medium" ? (
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
                    key: "type",
                    header: "Type",
                    cell: (item) => (
                      <Badge
                        className={
                          item.type === "case" ? "bg-purple-100 text-purple-800 hover:bg-purple-100" :
                          item.type === "resource" ? "bg-green-100 text-green-800 hover:bg-green-100" :
                          item.type === "personnel" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" :
                          item.type === "system" ? "bg-gray-100 text-gray-800 hover:bg-gray-100" :
                          item.type === "operations" ? "bg-blue-100 text-blue-800 hover:bg-blue-100" :
                          "bg-indigo-100 text-indigo-800 hover:bg-indigo-100"
                        }
                      >
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </Badge>
                    ),
                  },
                  {
                    key: "priority",
                    header: "Priority",
                    cell: (item) => (
                      <Badge
                        className={
                          item.priority === "high" ? "bg-red-100 text-red-800 hover:bg-red-100" :
                          item.priority === "medium" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" :
                          "bg-green-100 text-green-800 hover:bg-green-100"
                        }
                      >
                        {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
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
                    header: "Actions",
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
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="unread" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Unread Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={alertsData.filter(alert => !alert.read)}
                columns={[
                  {
                    key: "title",
                    header: "Alert",
                    cell: (item) => (
                      <div>
                        <div className="font-medium flex items-center">
                          {item.priority === "high" ? (
                            <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                          ) : item.priority === "medium" ? (
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
                    key: "type",
                    header: "Type",
                    cell: (item) => (
                      <Badge
                        className={
                          item.type === "case" ? "bg-purple-100 text-purple-800 hover:bg-purple-100" :
                          item.type === "resource" ? "bg-green-100 text-green-800 hover:bg-green-100" :
                          "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        }
                      >
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </Badge>
                    ),
                  },
                  {
                    key: "priority",
                    header: "Priority",
                    cell: (item) => (
                      <Badge
                        className={
                          item.priority === "high" ? "bg-red-100 text-red-800 hover:bg-red-100" :
                          item.priority === "medium" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" :
                          "bg-green-100 text-green-800 hover:bg-green-100"
                        }
                      >
                        {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
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
                    header: "Actions",
                    cell: (item) => (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleViewAlert(item.id)}
                        >
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleMarkAsRead(item.id)}
                        >
                          Mark Read
                        </Button>
                      </div>
                    ),
                  },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Similar content for high priority and case alerts tabs */}
        <TabsContent value="high" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>High Priority Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={alertsData.filter(alert => alert.priority === "high")}
                columns={[
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
                    key: "type",
                    header: "Type",
                    cell: (item) => (
                      <Badge
                        className={
                          item.type === "case" ? "bg-purple-100 text-purple-800 hover:bg-purple-100" :
                          item.type === "resource" ? "bg-green-100 text-green-800 hover:bg-green-100" :
                          "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        }
                      >
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
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
                    header: "Actions",
                    cell: (item) => (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleViewAlert(item.id)}
                      >
                        View Details
                      </Button>
                    ),
                  },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="case" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Case Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={alertsData.filter(alert => alert.type === "case")}
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
                          {item.priority === "high" ? (
                            <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
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
                    key: "priority",
                    header: "Priority",
                    cell: (item) => (
                      <Badge
                        className={
                          item.priority === "high" ? "bg-red-100 text-red-800 hover:bg-red-100" :
                          item.priority === "medium" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" :
                          "bg-green-100 text-green-800 hover:bg-green-100"
                        }
                      >
                        {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
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
                    header: "Actions",
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
