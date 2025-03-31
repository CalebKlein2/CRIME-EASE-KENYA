import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Bell, 
  AlertTriangle, 
  Megaphone, 
  MessageSquare, 
  User, 
  Clock, 
  X, 
  CheckCircle, 
  Flag, 
  ExternalLink,
  Filter,
  AlertCircle
} from 'lucide-react';

// Mock alerts data
const mockAlerts = [
  {
    id: '1',
    title: 'New Emergency Call',
    description: 'Reported burglary at 123 Main Street',
    timestamp: '10 minutes ago',
    type: 'emergency',
    read: false
  },
  {
    id: '2',
    title: 'Case #7843 Updated',
    description: 'New evidence has been submitted',
    timestamp: '1 hour ago',
    type: 'case',
    read: false
  },
  {
    id: '3',
    title: 'Officer Support Requested',
    description: 'Backup requested at Downtown Area',
    timestamp: '2 hours ago',
    type: 'emergency',
    read: true
  },
  {
    id: '4',
    title: 'Station Meeting',
    description: 'Daily briefing at 8:00 AM tomorrow',
    timestamp: '3 hours ago',
    type: 'announcement',
    read: true
  },
  {
    id: '5',
    title: 'Case Assignment',
    description: 'You have been assigned to case #8921',
    timestamp: '5 hours ago',
    type: 'case',
    read: true
  },
  {
    id: '6',
    title: 'System Maintenance',
    description: 'System will be down for maintenance tonight from 2:00 AM to 4:00 AM',
    timestamp: '6 hours ago',
    type: 'system',
    read: true
  },
  {
    id: '7',
    title: 'New Directive from Headquarters',
    description: 'Updated protocols for handling traffic violations',
    timestamp: '1 day ago',
    type: 'announcement',
    read: true
  },
  {
    id: '8',
    title: 'Training Reminder',
    description: 'Mandatory cyber security training due by end of week',
    timestamp: '1 day ago',
    type: 'announcement',
    read: true
  }
];

// Alert notification settings
const notificationSettings = [
  {
    id: 'emergency',
    title: 'Emergency Alerts',
    description: 'High-priority incidents requiring immediate attention',
    enabled: true
  },
  {
    id: 'cases',
    title: 'Case Updates',
    description: 'Updates to cases you are assigned to or following',
    enabled: true
  },
  {
    id: 'announcements',
    title: 'Station Announcements',
    description: 'General announcements from station administration',
    enabled: true
  },
  {
    id: 'system',
    title: 'System Notifications',
    description: 'Technical updates and maintenance information',
    enabled: false
  },
  {
    id: 'assignments',
    title: 'New Assignments',
    description: 'Notifications when you are assigned to a new case',
    enabled: true
  },
  {
    id: 'deadlines',
    title: 'Deadlines & Reminders',
    description: 'Reminders for upcoming deadlines and scheduled events',
    enabled: true
  }
];

// Alert notifications component
const AlertNotifications = () => {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [filter, setFilter] = useState('all');
  
  const filteredAlerts = filter === 'all' 
    ? alerts 
    : filter === 'unread' 
      ? alerts.filter(alert => !alert.read)
      : alerts.filter(alert => alert.type === filter);
  
  const markAsRead = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };
  
  const markAllAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, read: true })));
  };
  
  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Alerts</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
              <SelectItem value="case">Case Updates</SelectItem>
              <SelectItem value="announcement">Announcements</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <Input 
            placeholder="Search alerts..." 
            className="max-w-xs"
          />
        </div>
        <Button variant="outline" onClick={markAllAsRead}>
          Mark All as Read
        </Button>
      </div>
      
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <Card>
            <CardContent className="pt-6 pb-6 text-center text-muted-foreground">
              <Bell className="mx-auto h-8 w-8 mb-2 opacity-50" />
              <p>No alerts to display</p>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map(alert => (
            <Card key={alert.id} className={alert.read ? 'bg-card' : 'bg-muted/20'}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {alert.type === 'emergency' ? (
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                    ) : alert.type === 'case' ? (
                      <MessageSquare className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                    ) : alert.type === 'announcement' ? (
                      <Megaphone className="h-5 w-5 text-amber-500 mt-1 flex-shrink-0" />
                    ) : (
                      <Bell className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">
                          {alert.title}
                        </h3>
                        {!alert.read && (
                          <Badge variant="secondary" className="text-xs">New</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {alert.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{alert.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    {!alert.read && (
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => markAsRead(alert.id)}
                        className="h-8 w-8"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => deleteAlert(alert.id)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
              {alert.type === 'case' && (
                <CardFooter className="px-4 py-2 border-t bg-muted/10">
                  <Button size="sm" variant="outline" className="gap-1">
                    <ExternalLink className="h-3 w-3" /> View Related Case
                  </Button>
                </CardFooter>
              )}
              {alert.type === 'emergency' && (
                <CardFooter className="px-4 py-2 border-t bg-muted/10">
                  <Button size="sm" className="gap-1 bg-red-500 hover:bg-red-600">
                    Respond to Emergency
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

// Alert settings component
const AlertSettings = () => {
  const [settings, setSettings] = useState(notificationSettings);
  
  const toggleSetting = (id: string) => {
    setSettings(settings.map(setting => 
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Configure which alerts you receive and how they're delivered
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.map(setting => (
            <div key={setting.id} className="flex items-start justify-between space-y-0 rounded-md border p-4">
              <div>
                <div className="space-y-0.5">
                  <div className="font-medium">{setting.title}</div>
                  <div className="text-sm text-muted-foreground">{setting.description}</div>
                </div>
              </div>
              <div className="ml-4 flex items-center space-x-2">
                <Switch 
                  checked={setting.enabled} 
                  onCheckedChange={() => toggleSetting(setting.id)} 
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Delivery Methods</CardTitle>
          <CardDescription>
            Choose how you want to receive alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between space-y-0 rounded-md border p-4">
            <div>
              <div className="space-y-0.5">
                <div className="font-medium">In-App Notifications</div>
                <div className="text-sm text-muted-foreground">Receive alerts within the application</div>
              </div>
            </div>
            <div className="ml-4 flex items-center space-x-2">
              <Switch defaultChecked />
            </div>
          </div>
          
          <div className="flex items-start justify-between space-y-0 rounded-md border p-4">
            <div>
              <div className="space-y-0.5">
                <div className="font-medium">Email Notifications</div>
                <div className="text-sm text-muted-foreground">Receive alerts via email</div>
              </div>
            </div>
            <div className="ml-4 flex items-center space-x-2">
              <Switch defaultChecked />
            </div>
          </div>
          
          <div className="flex items-start justify-between space-y-0 rounded-md border p-4">
            <div>
              <div className="space-y-0.5">
                <div className="font-medium">SMS Notifications</div>
                <div className="text-sm text-muted-foreground">Receive alerts via text message</div>
              </div>
            </div>
            <div className="ml-4 flex items-center space-x-2">
              <Switch defaultChecked />
            </div>
          </div>
          
          <div className="flex items-start justify-between space-y-0 rounded-md border p-4">
            <div>
              <div className="space-y-0.5">
                <div className="font-medium">Push Notifications</div>
                <div className="text-sm text-muted-foreground">Receive alerts on your mobile device</div>
              </div>
            </div>
            <div className="ml-4 flex items-center space-x-2">
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Save Preferences</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

// Emergency alerts component
const EmergencyAlerts = () => {
  const emergencies = [
    {
      id: '1',
      title: 'Armed Robbery in Progress',
      location: '123 Main Street, Downtown',
      reportedAt: '5 minutes ago',
      priority: 'critical',
      status: 'active'
    },
    {
      id: '2',
      title: 'Vehicle Accident with Injuries',
      location: 'Highway 101, Mile Marker 24',
      reportedAt: '12 minutes ago',
      priority: 'high',
      status: 'active'
    },
    {
      id: '3',
      title: 'Missing Child Report',
      location: 'Central Park Area',
      reportedAt: '30 minutes ago',
      priority: 'high',
      status: 'active'
    },
    {
      id: '4',
      title: 'Domestic Disturbance',
      location: '456 Oak Avenue, Apartment 3B',
      reportedAt: '45 minutes ago',
      priority: 'medium',
      status: 'assigned'
    }
  ];
  
  const recentlyResolved = [
    {
      id: '5',
      title: 'Store Alarm Triggered',
      location: 'Downtown Electronics Store',
      reportedAt: '2 hours ago',
      resolvedAt: '1 hour ago',
      resolution: 'False alarm, system malfunction'
    },
    {
      id: '6',
      title: 'Suspicious Person',
      location: 'Near Elementary School',
      reportedAt: '3 hours ago',
      resolvedAt: '2 hours ago',
      resolution: 'Individual identified and cleared'
    }
  ];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-red-50 dark:bg-red-950/20">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-red-700 dark:text-red-400">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Active Emergencies
            </CardTitle>
            <Badge variant="destructive" className="font-bold">
              {emergencies.filter(e => e.status === 'active').length} Active
            </Badge>
          </div>
          <CardDescription>
            Critical situations requiring immediate response
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {emergencies.filter(e => e.status === 'active').map(emergency => (
            <div key={emergency.id} className="border border-red-200 dark:border-red-900/50 rounded-lg p-4 bg-red-50/50 dark:bg-red-950/10">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-red-700 dark:text-red-400">{emergency.title}</h3>
                    {emergency.priority === 'critical' && (
                      <Badge variant="destructive">CRITICAL</Badge>
                    )}
                    {emergency.priority === 'high' && (
                      <Badge variant="destructive" className="bg-orange-500">HIGH</Badge>
                    )}
                  </div>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{emergency.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Reported {emergency.reportedAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm">Respond</Button>
                  <Button size="sm" variant="outline">Details</Button>
                </div>
              </div>
            </div>
          ))}
          
          {emergencies.filter(e => e.status === 'assigned').map(emergency => (
            <div key={emergency.id} className="border rounded-lg p-4 bg-amber-50/50 dark:bg-amber-950/10 border-amber-200 dark:border-amber-900/50">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-amber-700 dark:text-amber-400">{emergency.title}</h3>
                    <Badge variant="outline" className="text-amber-700 border-amber-200 bg-amber-100/50 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400">
                      ASSIGNED
                    </Badge>
                  </div>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{emergency.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Reported {emergency.reportedAt}</span>
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline">View Details</Button>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button variant="outline" className="w-full">
            View All Emergency Calls
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recently Resolved</CardTitle>
          <CardDescription>
            Emergency situations that have been addressed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentlyResolved.map(item => (
            <div key={item.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Flag className="h-4 w-4 text-muted-foreground" />
                      <span>{item.resolution}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Resolved {item.resolvedAt}</span>
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="ghost">View</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default function AlertsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Alerts & Notifications</h1>
      
      <Tabs defaultValue="notifications">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="emergency">
            <AlertCircle className="h-4 w-4 mr-2" /> Emergency Alerts
          </TabsTrigger>
          <TabsTrigger value="settings">
            <User className="h-4 w-4 mr-2" /> Alert Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="notifications" className="mt-6">
          <AlertNotifications />
        </TabsContent>
        
        <TabsContent value="emergency" className="mt-6">
          <EmergencyAlerts />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <AlertSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
