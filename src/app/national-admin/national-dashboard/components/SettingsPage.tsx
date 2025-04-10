import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings, 
  User,
  Lock, 
  Bell,
  Shield,
  Monitor,
  Globe,
  Database,
  FileText,
  CheckCircle,
  Save,
  RefreshCw
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SettingsPage() {
  const [userInfo, setUserInfo] = useState({
    name: "John Kamau",
    email: "john.kamau@police.go.ke",
    role: "National Administrator",
    department: "Kenya Police Service",
    office: "Headquarters, Nairobi",
    phone: "+254 712 345 678"
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    loginNotifications: true,
    sessionTimeout: "30",
    passwordExpiry: "90"
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: true,
    browserNotifications: true,
    criticalIncidents: true,
    systemUpdates: true,
    dailyReports: false
  });
  
  const [displaySettings, setDisplaySettings] = useState({
    theme: "light",
    language: "en",
    dashboardLayout: "standard",
    timezone: "Africa/Nairobi"
  });
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // API call to save profile information
    console.log("Saving profile:", userInfo);
  };
  
  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    // API call to save security settings
    console.log("Saving security settings:", securitySettings);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Settings</h2>
          <p className="text-gray-500">Manage your account and system preferences</p>
        </div>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Manage your personal information and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="flex flex-col items-center space-y-2">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder-user.jpg" alt="Profile" />
                      <AvatarFallback>JK</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      Change Photo
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={userInfo.name}
                        onChange={e => setUserInfo({...userInfo, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={userInfo.email}
                        onChange={e => setUserInfo({...userInfo, email: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input 
                        id="role" 
                        value={userInfo.role}
                        disabled
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input 
                        id="department" 
                        value={userInfo.department}
                        onChange={e => setUserInfo({...userInfo, department: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="office">Office Location</Label>
                      <Input 
                        id="office" 
                        value={userInfo.office}
                        onChange={e => setUserInfo({...userInfo, office: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        value={userInfo.phone}
                        onChange={e => setUserInfo({...userInfo, phone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your security preferences and password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveSecurity} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Password Management</h3>
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input id="current-password" type="password" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input id="new-password" type="password" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input id="confirm-password" type="password" />
                          </div>
                          <Button type="button" variant="outline">
                            Change Password
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Security Preferences</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="two-factor">Two-factor Authentication</Label>
                              <p className="text-xs text-gray-500">
                                Secure your account with two-factor authentication
                              </p>
                            </div>
                            <Switch 
                              id="two-factor" 
                              checked={securitySettings.twoFactorAuth}
                              onCheckedChange={(checked) => 
                                setSecuritySettings({...securitySettings, twoFactorAuth: checked})
                              }
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="login-notifications">Login Notifications</Label>
                              <p className="text-xs text-gray-500">
                                Receive notifications for new login attempts
                              </p>
                            </div>
                            <Switch 
                              id="login-notifications" 
                              checked={securitySettings.loginNotifications}
                              onCheckedChange={(checked) => 
                                setSecuritySettings({...securitySettings, loginNotifications: checked})
                              }
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                            <Select 
                              value={securitySettings.sessionTimeout}
                              onValueChange={(value) => 
                                setSecuritySettings({...securitySettings, sessionTimeout: value})
                              }
                            >
                              <SelectTrigger id="session-timeout">
                                <SelectValue placeholder="Select timeout" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="15">15 minutes</SelectItem>
                                <SelectItem value="30">30 minutes</SelectItem>
                                <SelectItem value="60">1 hour</SelectItem>
                                <SelectItem value="120">2 hours</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                            <Select
                              value={securitySettings.passwordExpiry}
                              onValueChange={(value) => 
                                setSecuritySettings({...securitySettings, passwordExpiry: value})
                              }
                            >
                              <SelectTrigger id="password-expiry">
                                <SelectValue placeholder="Select expiry period" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="30">30 days</SelectItem>
                                <SelectItem value="60">60 days</SelectItem>
                                <SelectItem value="90">90 days</SelectItem>
                                <SelectItem value="never">Never</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">
                    <Shield className="h-4 w-4 mr-2" />
                    Save Security Settings
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Channels</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-alerts">Email Alerts</Label>
                        <p className="text-xs text-gray-500">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch 
                        id="email-alerts" 
                        checked={notificationSettings.emailAlerts}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, emailAlerts: checked})
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sms-alerts">SMS Alerts</Label>
                        <p className="text-xs text-gray-500">
                          Receive critical notifications via SMS
                        </p>
                      </div>
                      <Switch 
                        id="sms-alerts" 
                        checked={notificationSettings.smsAlerts}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, smsAlerts: checked})
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="browser-notifications">Browser Notifications</Label>
                        <p className="text-xs text-gray-500">
                          Receive notifications in your browser
                        </p>
                      </div>
                      <Switch 
                        id="browser-notifications" 
                        checked={notificationSettings.browserNotifications}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, browserNotifications: checked})
                        }
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Types</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="critical-incidents">Critical Incidents</Label>
                        <p className="text-xs text-gray-500">
                          High-priority alerts for critical incidents
                        </p>
                      </div>
                      <Switch 
                        id="critical-incidents" 
                        checked={notificationSettings.criticalIncidents}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, criticalIncidents: checked})
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="system-updates">System Updates</Label>
                        <p className="text-xs text-gray-500">
                          Notifications about system changes and maintenance
                        </p>
                      </div>
                      <Switch 
                        id="system-updates" 
                        checked={notificationSettings.systemUpdates}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, systemUpdates: checked})
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="daily-reports">Daily Reports</Label>
                        <p className="text-xs text-gray-500">
                          Daily summary of system activity
                        </p>
                      </div>
                      <Switch 
                        id="daily-reports" 
                        checked={notificationSettings.dailyReports}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, dailyReports: checked})
                        }
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>
                    <Bell className="h-4 w-4 mr-2" />
                    Save Notification Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="display" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>Customize how the application looks and behaves</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={displaySettings.theme}
                      onValueChange={(value) => 
                        setDisplaySettings({...displaySettings, theme: value})
                      }
                    >
                      <SelectTrigger id="theme">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System Default</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={displaySettings.language}
                      onValueChange={(value) => 
                        setDisplaySettings({...displaySettings, language: value})
                      }
                    >
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="sw">Swahili</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dashboard-layout">Dashboard Layout</Label>
                    <Select
                      value={displaySettings.dashboardLayout}
                      onValueChange={(value) => 
                        setDisplaySettings({...displaySettings, dashboardLayout: value})
                      }
                    >
                      <SelectTrigger id="dashboard-layout">
                        <SelectValue placeholder="Select layout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="compact">Compact</SelectItem>
                        <SelectItem value="statistics">Statistics-focused</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={displaySettings.timezone}
                      onValueChange={(value) => 
                        setDisplaySettings({...displaySettings, timezone: value})
                      }
                    >
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Africa/Nairobi">East Africa Time (EAT)</SelectItem>
                        <SelectItem value="UTC">Coordinated Universal Time (UTC)</SelectItem>
                        <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>
                    <Monitor className="h-4 w-4 mr-2" />
                    Save Display Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure system-wide settings and maintenance options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">System Maintenance</h3>
                  
                  <div className="border rounded-md p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">System Backup</h4>
                        <p className="text-sm text-gray-500">Last backup: 2025-03-29 06:00</p>
                      </div>
                      <Button variant="outline">
                        <Database className="h-4 w-4 mr-2" />
                        Backup Now
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Clear Cache</h4>
                        <p className="text-sm text-gray-500">Improve system performance</p>
                      </div>
                      <Button variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Clear Cache
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Export System Logs</h4>
                        <p className="text-sm text-gray-500">Download system logs for troubleshooting</p>
                      </div>
                      <Button variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Export Logs
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">System Information</h3>
                  
                  <div className="bg-gray-50 p-4 rounded-md space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Version:</span>
                      <span className="text-sm">CrimeEase Kenya v2.5.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Last Updated:</span>
                      <span className="text-sm">March 28, 2025</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Database Status:</span>
                      <span className="text-sm flex items-center">
                        <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
                        Connected
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">API Status:</span>
                      <span className="text-sm flex items-center">
                        <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
                        Operational
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
