import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Bell, 
  Shield, 
  Users, 
  Building,
  Mail,
  Phone,
  FileCheck,
  Save,
  Clock,
  MapPin
} from 'lucide-react';

export default function StationSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Station Settings</h2>
        <p className="text-gray-500">Manage your station preferences and configuration</p>
      </div>
      
      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="profile">Station Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Station Information</CardTitle>
              <CardDescription>
                Update your station's basic information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="station-name">Station Name</Label>
                  <Input 
                    id="station-name" 
                    placeholder="Central Police Station"
                    defaultValue="Central Police Station"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="station-code">Station Code</Label>
                  <Input 
                    id="station-code" 
                    placeholder="CPL-001"
                    defaultValue="CPL-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="station-type">Station Type</Label>
                  <Input 
                    id="station-type" 
                    placeholder="Main Headquarters"
                    defaultValue="Main Headquarters"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jurisdiction">Jurisdiction</Label>
                  <Input 
                    id="jurisdiction" 
                    placeholder="Central Business District"
                    defaultValue="Central Business District"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="station-address">Address</Label>
                <Input 
                  id="station-address" 
                  placeholder="123 Main Street, City Center"
                  defaultValue="123 Main Street, City Center"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="station-email">
                    <Mail className="h-4 w-4 inline mr-2" />
                    Email Address
                  </Label>
                  <Input 
                    id="station-email" 
                    type="email"
                    placeholder="central@police.gov.ke"
                    defaultValue="central@police.gov.ke"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="station-phone">
                    <Phone className="h-4 w-4 inline mr-2" />
                    Phone Number
                  </Label>
                  <Input 
                    id="station-phone" 
                    placeholder="+254 20 123 4567"
                    defaultValue="+254 20 123 4567"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">
                  <MapPin className="h-4 w-4 inline mr-2" />
                  Geo Location
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input 
                    id="latitude" 
                    placeholder="Latitude"
                    defaultValue="-1.2921"
                  />
                  <Input 
                    id="longitude" 
                    placeholder="Longitude"
                    defaultValue="36.8219"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Used for positioning on maps and location-based services
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Station Leadership</CardTitle>
              <CardDescription>
                Update information about station leadership.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="commander-name">Station Commander</Label>
                  <Input 
                    id="commander-name" 
                    placeholder="John Smith"
                    defaultValue="John Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commander-rank">Rank</Label>
                  <Input 
                    id="commander-rank" 
                    placeholder="Chief Inspector"
                    defaultValue="Chief Inspector"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commander-email">Email</Label>
                  <Input 
                    id="commander-email" 
                    placeholder="john.smith@police.gov.ke"
                    defaultValue="john.smith@police.gov.ke"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commander-phone">Phone</Label>
                  <Input 
                    id="commander-phone" 
                    placeholder="+254 712 345 678"
                    defaultValue="+254 712 345 678"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="case-notifications">Case Notifications</Label>
                    <p className="text-sm text-gray-500">
                      Receive alerts about new and updated cases
                    </p>
                  </div>
                  <Switch id="case-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="officer-notifications">Officer Updates</Label>
                    <p className="text-sm text-gray-500">
                      Notifications about officer status changes and shift updates
                    </p>
                  </div>
                  <Switch id="officer-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emergency-alerts">Emergency Alerts</Label>
                    <p className="text-sm text-gray-500">
                      Critical notifications that require immediate attention
                    </p>
                  </div>
                  <Switch id="emergency-alerts" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="report-notifications">Report Notifications</Label>
                    <p className="text-sm text-gray-500">
                      Updates when new reports are available or require review
                    </p>
                  </div>
                  <Switch id="report-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="system-notifications">System Notifications</Label>
                    <p className="text-sm text-gray-500">
                      Updates about system maintenance and performance
                    </p>
                  </div>
                  <Switch id="system-notifications" />
                </div>
              </div>
              
              <div className="pt-4 space-y-2">
                <Label htmlFor="notification-email">Notification Email</Label>
                <Input 
                  id="notification-email" 
                  type="email"
                  placeholder="Enter email for notifications"
                  defaultValue="station.admin@police.gov.ke"
                />
              </div>
              
              <div className="pt-2 space-y-2">
                <Label htmlFor="notification-phone">SMS Notifications</Label>
                <Input 
                  id="notification-phone" 
                  placeholder="Enter phone number for SMS"
                  defaultValue="+254 712 345 678"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and access controls.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
              
              <div className="pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">
                      Add an additional layer of security to your account
                    </p>
                  </div>
                  <Switch id="two-factor" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="session-timeout">Session Timeout</Label>
                    <p className="text-sm text-gray-500">
                      Automatically log out after period of inactivity
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">15 minutes</span>
                    <Button variant="outline" size="sm">Change</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="device-management">Device Management</Label>
                    <p className="text-sm text-gray-500">
                      Manage devices that have access to your account
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Manage Devices</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Update Security Settings</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Access Control</CardTitle>
              <CardDescription>
                Manage user permissions and access levels.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Officer Access Management</Label>
                  <p className="text-sm text-gray-500">
                    Configure what officers can access and modify
                  </p>
                </div>
                <Button variant="outline">Manage Permissions</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>API Access Control</Label>
                  <p className="text-sm text-gray-500">
                    Manage API keys and external system access
                  </p>
                </div>
                <Button variant="outline">Configure API Access</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Preferences</CardTitle>
              <CardDescription>
                Configure system-wide settings and defaults.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-backup">Automatic Backups</Label>
                  <p className="text-sm text-gray-500">
                    Regularly backup system data
                  </p>
                </div>
                <Switch id="auto-backup" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="data-retention">Data Retention</Label>
                  <p className="text-sm text-gray-500">
                    Set how long to keep archived data
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">5 years</span>
                  <Button variant="outline" size="sm">Change</Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="system-logs">System Logs</Label>
                  <p className="text-sm text-gray-500">
                    Configure system logging preferences
                  </p>
                </div>
                <Button variant="outline" size="sm">View Logs</Button>
              </div>
              
              <div className="pt-4 space-y-2">
                <Label>System Maintenance</Label>
                <div className="rounded-md border p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Next Scheduled Maintenance</p>
                      <p className="text-sm text-gray-500">
                        <Clock className="h-4 w-4 inline mr-1" />
                        April 15, 2025 at 02:00 AM
                      </p>
                    </div>
                    <Button variant="outline">Reschedule</Button>
                  </div>
                </div>
              </div>
              
              <div className="pt-2 space-y-2">
                <Label>Database Configuration</Label>
                <div className="rounded-md border p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Database Status</p>
                      <p className="text-sm text-green-600">
                        <FileCheck className="h-4 w-4 inline mr-1" />
                        Connected and Operating Normally
                      </p>
                    </div>
                    <Button variant="outline">Test Connection</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" className="mr-auto">Reset to Defaults</Button>
              <Button>Save System Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
