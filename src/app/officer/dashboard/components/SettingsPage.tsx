import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User,
  Bell,
  Shield,
  Lock,
  Globe,
  Calendar,
  LayoutGrid,
  FileText,
  HelpCircle,
  Settings,
  LogOut,
  Smartphone
} from 'lucide-react';

// Profile settings component
const ProfileSettings = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0 sm:items-start sm:justify-start">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/officer-profile.jpg" alt="Officer Smith" />
              <AvatarFallback>OS</AvatarFallback>
            </Avatar>
            <div className="space-y-1 text-center sm:text-left">
              <div>
                <h3 className="font-medium text-lg">Officer Smith</h3>
                <p className="text-sm text-muted-foreground">Badge #KPS-1234</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button size="sm" variant="outline">Upload Photo</Button>
                <Button size="sm" variant="ghost">Remove Photo</Button>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2.5">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="First name" defaultValue="Officer" />
            </div>
            <div className="grid gap-2.5">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Last name" defaultValue="Smith" />
            </div>
            <div className="grid gap-2.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Email address" defaultValue="officer.smith@police.gov.ke" />
            </div>
            <div className="grid gap-2.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="Phone number" defaultValue="+254712345678" />
            </div>
            <div className="grid gap-2.5 sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" placeholder="Your address" defaultValue="123 Police Housing, Nairobi" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Officer Details</CardTitle>
          <CardDescription>Your professional information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2.5">
              <Label htmlFor="badgeNumber">Badge Number</Label>
              <Input id="badgeNumber" placeholder="Badge number" defaultValue="KPS-1234" disabled />
            </div>
            <div className="grid gap-2.5">
              <Label htmlFor="rank">Rank</Label>
              <Select defaultValue="constable">
                <SelectTrigger>
                  <SelectValue placeholder="Select rank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="constable">Constable</SelectItem>
                  <SelectItem value="corporal">Corporal</SelectItem>
                  <SelectItem value="sergeant">Sergeant</SelectItem>
                  <SelectItem value="inspector">Inspector</SelectItem>
                  <SelectItem value="chief-inspector">Chief Inspector</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2.5">
              <Label htmlFor="station">Police Station</Label>
              <Input id="station" placeholder="Station" defaultValue="Central Police Station" disabled />
            </div>
            <div className="grid gap-2.5">
              <Label htmlFor="department">Department</Label>
              <Select defaultValue="patrol">
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patrol">Patrol</SelectItem>
                  <SelectItem value="investigation">Investigation</SelectItem>
                  <SelectItem value="traffic">Traffic</SelectItem>
                  <SelectItem value="cyber">Cyber Crime</SelectItem>
                  <SelectItem value="admin">Administration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2.5">
              <Label htmlFor="years">Years of Service</Label>
              <Input id="years" placeholder="Years of service" defaultValue="5" />
            </div>
            <div className="grid gap-2.5">
              <Label htmlFor="supervisor">Supervisor</Label>
              <Input id="supervisor" placeholder="Supervisor name" defaultValue="Captain Johnson" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

// Account settings component
const AccountSettings = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2.5">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input id="currentPassword" type="password" placeholder="Enter current password" />
          </div>
          <div className="grid gap-2.5">
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" placeholder="Enter new password" />
          </div>
          <div className="grid gap-2.5">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto">Update Password</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>Add additional security to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex-1 space-y-1">
              <p className="font-medium">Text Message (SMS)</p>
              <p className="text-sm text-muted-foreground">Receive verification codes via SMS</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <div className="flex-1 space-y-1">
              <p className="font-medium">Authenticator App</p>
              <p className="text-sm text-muted-foreground">Use an authenticator app to generate codes</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <div className="flex-1 space-y-1">
              <p className="font-medium">Email Verification</p>
              <p className="text-sm text-muted-foreground">Receive verification codes via email</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">Configure Two-Factor Authentication</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-red-500">Danger Zone</CardTitle>
          <CardDescription>Irreversible account actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border border-red-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Log Out of All Devices</h4>
                <p className="text-sm text-muted-foreground">
                  This will log you out from all devices except the current one
                </p>
              </div>
              <Button variant="outline" size="sm">
                Log Out
              </Button>
            </div>
          </div>
          <div className="rounded-md border border-red-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Request Account Deactivation</h4>
                <p className="text-sm text-muted-foreground">
                  Initiate a request to deactivate your account
                </p>
              </div>
              <Button variant="destructive" size="sm">
                Deactivate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Notification settings component
const NotificationSettings = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Manage how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-3">Email Notifications</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="new-cases" className="flex-1">
                  New case assignments
                </Label>
                <Switch id="new-cases" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="case-updates" className="flex-1">
                  Case updates
                </Label>
                <Switch id="case-updates" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="emergency-alerts" className="flex-1">
                  Emergency alerts
                </Label>
                <Switch id="emergency-alerts" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="system-alerts" className="flex-1">
                  System maintenance alerts
                </Label>
                <Switch id="system-alerts" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="announcements" className="flex-1">
                  Department announcements
                </Label>
                <Switch id="announcements" defaultChecked />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium mb-3">SMS Notifications</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="sms-emergency" className="flex-1">
                  Emergency alerts
                </Label>
                <Switch id="sms-emergency" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="sms-critical" className="flex-1">
                  Critical case updates
                </Label>
                <Switch id="sms-critical" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="sms-shifts" className="flex-1">
                  Shift changes
                </Label>
                <Switch id="sms-shifts" defaultChecked />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium mb-3">In-App Notifications</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="app-all" className="flex-1">
                  All notifications
                </Label>
                <Switch id="app-all" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="app-sound" className="flex-1">
                  Notification sounds
                </Label>
                <Switch id="app-sound" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="app-badge" className="flex-1">
                  Badge counters
                </Label>
                <Switch id="app-badge" defaultChecked />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Save Notification Preferences</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

// App preferences component
const AppPreferences = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Display Settings</CardTitle>
          <CardDescription>Customize how the application looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex-1 space-y-1">
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground">Use dark theme for the application</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <div className="flex-1 space-y-1">
              <p className="font-medium">High Contrast</p>
              <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <div className="flex-1 space-y-1">
              <p className="font-medium">Reduced Motion</p>
              <p className="text-sm text-muted-foreground">Minimize animations</p>
            </div>
            <Switch />
          </div>
          
          <div className="grid gap-2.5 pt-2">
            <Label htmlFor="fontSize">Font Size</Label>
            <Select defaultValue="medium">
              <SelectTrigger id="fontSize">
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="x-large">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2.5">
            <Label htmlFor="language">Language</Label>
            <Select defaultValue="en">
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="sw">Swahili</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Display Preferences</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Preferences</CardTitle>
          <CardDescription>Customize your dashboard experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="defaultPage" className="mb-2 block">Default Landing Page</Label>
            <Select defaultValue="home">
              <SelectTrigger id="defaultPage">
                <SelectValue placeholder="Select default page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">Dashboard Home</SelectItem>
                <SelectItem value="cases">Cases</SelectItem>
                <SelectItem value="reports">Reports</SelectItem>
                <SelectItem value="map">Map</SelectItem>
                <SelectItem value="alerts">Alerts</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="mb-2 block">Dashboard Widgets</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="widget-recent" className="flex-1">
                  Recent Cases
                </Label>
                <Switch id="widget-recent" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="widget-stats" className="flex-1">
                  Case Statistics
                </Label>
                <Switch id="widget-stats" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="widget-alerts" className="flex-1">
                  Emergency Alerts
                </Label>
                <Switch id="widget-alerts" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="widget-calendar" className="flex-1">
                  Calendar Events
                </Label>
                <Switch id="widget-calendar" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="widget-map" className="flex-1">
                  Mini Map
                </Label>
                <Switch id="widget-map" defaultChecked />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Save Dashboard Preferences</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

// Main settings page component
export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" /> Profile
          </TabsTrigger>
          <TabsTrigger value="account">
            <Lock className="h-4 w-4 mr-2" /> Account
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Settings className="h-4 w-4 mr-2" /> Preferences
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <ProfileSettings />
        </TabsContent>
        
        <TabsContent value="account" className="space-y-4">
          <AccountSettings />
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <NotificationSettings />
        </TabsContent>
        
        <TabsContent value="preferences" className="space-y-4">
          <AppPreferences />
        </TabsContent>
      </Tabs>
    </div>
  );
}
