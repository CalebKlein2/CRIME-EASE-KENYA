// @ts-nocheck
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatisticsChart } from '@/components/charts/StatisticsChart';
import { 
  Activity, 
  AlertTriangle, 
  Calendar, 
  CheckCircle, 
  Clock, 
  FileText, 
  LayoutGrid, 
  MapPin,
  Shield, 
  Users,
  ChevronRight
} from 'lucide-react';
// import { useQuery } from 'convex/react';
// import { api } from '@/convex/_generated/api';

// Mock data for statistics until we connect to the real data
const mockCaseStatistics = {
  totalCases: 247,
  activeCases: 58,
  closedCases: 189,
  casesThisMonth: 32,
  casesTrend: [
    { name: 'Jan', value: 28 },
    { name: 'Feb', value: 35 },
    { name: 'Mar', value: 42 },
    { name: 'Apr', value: 32 },
    { name: 'May', value: 38 },
    { name: 'Jun', value: 30 }
  ],
  casesByType: [
    { name: 'Theft', value: 84 },
    { name: 'Assault', value: 56 },
    { name: 'Fraud', value: 38 },
    { name: 'Traffic', value: 42 },
    { name: 'Drugs', value: 15 },
    { name: 'Other', value: 12 }
  ],
  responseTime: {
    average: 18, // minutes
    improvement: 12 // percentage
  }
};

// Mock recent cases
const mockRecentCases = [
  {
    id: 'case-001',
    title: 'Armed Robbery at Main Street Convenience Store',
    type: 'Robbery',
    status: 'Active',
    priority: 'High',
    location: '123 Main St',
    reportedAt: '2025-03-31T08:30:00Z',
    assignedOfficer: 'Officer Smith'
  },
  {
    id: 'case-002',
    title: 'Vehicle Theft from Shopping Mall Parking Lot',
    type: 'Theft',
    status: 'Active',
    priority: 'Medium',
    location: 'Westlands Mall',
    reportedAt: '2025-03-30T14:15:00Z',
    assignedOfficer: 'Officer Johnson'
  },
  {
    id: 'case-003',
    title: 'Residential Break-in at Parklands Estate',
    type: 'Burglary',
    status: 'Active',
    priority: 'Medium',
    location: '45 Parklands Ave',
    reportedAt: '2025-03-30T09:45:00Z',
    assignedOfficer: 'Officer Smith'
  },
  {
    id: 'case-004',
    title: 'Physical Assault at Downtown Bar',
    type: 'Assault',
    status: 'Active',
    priority: 'High',
    location: 'Night Owl Bar, Downtown',
    reportedAt: '2025-03-29T23:20:00Z',
    assignedOfficer: 'Officer Lee'
  },
  {
    id: 'case-005',
    title: 'Credit Card Fraud Report',
    type: 'Fraud',
    status: 'In Progress',
    priority: 'Medium',
    location: 'Online',
    reportedAt: '2025-03-29T16:10:00Z',
    assignedOfficer: 'Officer Smith'
  }
];

// Mock upcoming events
const mockUpcomingEvents = [
  {
    id: 'event-001',
    title: 'Morning Briefing',
    date: '2025-03-31',
    time: '08:00 AM',
    type: 'Meeting'
  },
  {
    id: 'event-002',
    title: 'Community Patrol',
    date: '2025-03-31',
    time: '10:00 AM',
    type: 'Patrol'
  },
  {
    id: 'event-003',
    title: 'Case Review Meeting',
    date: '2025-04-01',
    time: '09:30 AM',
    type: 'Meeting'
  },
  {
    id: 'event-004',
    title: 'Training Session: New Evidence Collection Procedures',
    date: '2025-04-02',
    time: '02:00 PM',
    type: 'Training'
  }
];

// Format date for display
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
};

export default function DashboardHome() {
  // Try to fetch real data from Convex - commented out until properly connected
  // const stationCases = useQuery(api.cases.getStationCases, { 
  //   stationId: 'NRB-001' // Hardcoded for demo, should come from user context
  // });

  // Use real data if available, otherwise use mock data
  // const recentCases = stationCases || mockRecentCases;
  const recentCases = mockRecentCases;
  
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCaseStatistics.totalCases}</div>
            <p className="text-xs text-muted-foreground">
              +{mockCaseStatistics.casesThisMonth} this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCaseStatistics.activeCases}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((mockCaseStatistics.activeCases / mockCaseStatistics.totalCases) * 100)}% of total cases
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCaseStatistics.responseTime.average} min</div>
            <p className="text-xs text-muted-foreground">
              {mockCaseStatistics.responseTime.improvement}% faster than last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Case Closure Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((mockCaseStatistics.closedCases / mockCaseStatistics.totalCases) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {mockCaseStatistics.closedCases} cases closed
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Case Trends</CardTitle>
            <CardDescription>Monthly case volume over time</CardDescription>
          </CardHeader>
          <CardContent>
            <StatisticsChart
              title="Monthly Cases"
              type="line"
              data={mockCaseStatistics.casesTrend}
              dataKeys={["value"]}
              xAxisDataKey="name"
              colors={["#3b82f6"]}
              height={300}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Cases by Type</CardTitle>
            <CardDescription>Distribution across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <StatisticsChart
              title="Case Types"
              type="pie"
              data={mockCaseStatistics.casesByType}
              dataKeys={["value"]}
              colors={["#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6", "#6b7280"]}
              height={300}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Cases & Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Recent Cases</CardTitle>
              <CardDescription>
                Latest cases reported or updated
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ChevronRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCases.slice(0, 4).map((caseItem) => (
                <div key={caseItem.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{caseItem.title}</h3>
                      {caseItem.priority === 'High' && (
                        <Badge variant="destructive">High Priority</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" />
                        <span>{caseItem.type}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{caseItem.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formatDate(caseItem.reportedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={caseItem.status === 'Active' ? 'default' : 'secondary'}>
                    {caseItem.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Cases</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>
              Scheduled meetings and activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockUpcomingEvents.map((event) => (
                <div key={event.id} className="flex items-start space-x-4 border-b pb-4 last:border-0 last:pb-0">
                  <div className="min-w-[48px] rounded-md bg-muted p-2 text-center">
                    <div className="text-xs font-medium">{event.date.split('-')[1]}/{event.date.split('-')[2]}</div>
                    <div className="text-xs">{event.time}</div>
                  </div>
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <Badge variant="outline" className="mt-1">
                      {event.type === 'Meeting' ? (
                        <Users className="mr-1 h-3 w-3" />
                      ) : event.type === 'Patrol' ? (
                        <Shield className="mr-1 h-3 w-3" />
                      ) : (
                        <Calendar className="mr-1 h-3 w-3" />
                      )}
                      {event.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View Calendar</Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Emergency Alerts Section */}
      <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/10 dark:border-red-900/50">
        <CardHeader>
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <CardTitle className="text-red-700 dark:text-red-400">Active Emergency Alerts</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold">Armed Robbery in Progress</h3>
                <p className="text-sm text-muted-foreground">Main Street & 5th Avenue - Reported 10 minutes ago</p>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" className="bg-red-500 hover:bg-red-600">Respond</Button>
                  <Button size="sm" variant="outline">View Details</Button>
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-amber-100 dark:bg-amber-900/20 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold">Missing Person Report</h3>
                <p className="text-sm text-muted-foreground">Central Park Area - Reported 45 minutes ago</p>
                <div className="mt-2 flex gap-2">
                  <Button size="sm">View Details</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant="outline">View All Alerts</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

