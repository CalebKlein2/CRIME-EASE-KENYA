import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { StatisticsChart } from '@/components/charts/StatisticsChart';
import { 
  FileText, 
  Download, 
  Calendar, 
  BarChart2, 
  PieChart, 
  TrendingUp, 
  Clock, 
  Users, 
  AlertTriangle, 
  MapPin, 
  CheckCircle, 
  Printer,
  Mail
} from 'lucide-react';

const mockChartData = {
  casesByType: [
    { name: "Theft", value: 32 },
    { name: "Assault", value: 18 },
    { name: "Fraud", value: 12 },
    { name: "Vandalism", value: 8 },
    { name: "Traffic", value: 22 },
    { name: "Drugs", value: 5 },
    { name: "Other", value: 14 }
  ],
  casesByMonth: [
    { month: "Jan", Cases: 24 },
    { month: "Feb", Cases: 18 },
    { month: "Mar", Cases: 29 },
    { month: "Apr", Cases: 35 },
    { month: "May", Cases: 27 },
    { month: "Jun", Cases: 32 }
  ],
  casesByStatus: [
    { name: "Open", value: 38 },
    { name: "In Progress", value: 45 },
    { name: "Closed", value: 92 },
    { name: "Archived", value: 17 }
  ],
  casesByPriority: [
    { name: "Low", value: 42 },
    { name: "Medium", value: 53 },
    { name: "High", value: 24 }
  ],
  responseTimeByDay: [
    { day: "Mon", time: 45 },
    { day: "Tue", time: 38 },
    { day: "Wed", time: 52 },
    { day: "Thu", time: 42 },
    { day: "Fri", time: 58 },
    { day: "Sat", time: 72 },
    { day: "Sun", time: 68 }
  ],
  clearanceRate: [
    { month: "Jan", rate: 68 },
    { month: "Feb", rate: 72 },
    { month: "Mar", rate: 65 },
    { month: "Apr", rate: 78 },
    { month: "May", rate: 82 },
    { month: "Jun", rate: 76 }
  ]
};

// Analytics Dashboard component
const AnalyticsDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Cases by Type</CardTitle>
            <CardDescription>Distribution of cases by incident type</CardDescription>
          </CardHeader>
          <CardContent>
            <StatisticsChart
              title="Case Types"
              type="bar"
              data={mockChartData.casesByType}
              dataKeys={["value"]}
              colors={["#3b82f6"]}
              height={350}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Case Priority</CardTitle>
            <CardDescription>Cases by priority level</CardDescription>
          </CardHeader>
          <CardContent>
            <StatisticsChart
              title="Priority Distribution"
              type="pie"
              data={mockChartData.casesByPriority}
              dataKeys={["value"]}
              colors={["#84cc16", "#f59e0b", "#ef4444"]}
              height={350}
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Case Trends</CardTitle>
            <CardDescription>Number of cases by month</CardDescription>
          </CardHeader>
          <CardContent>
            <StatisticsChart
              title="Monthly Cases"
              type="line"
              data={mockChartData.casesByMonth}
              dataKeys={["Cases"]}
              xAxisDataKey="month"
              colors={["#8b5cf6"]}
              height={300}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Response Time</CardTitle>
            <CardDescription>Average response time in minutes by day of week</CardDescription>
          </CardHeader>
          <CardContent>
            <StatisticsChart
              title="Response Times"
              type="bar"
              data={mockChartData.responseTimeByDay}
              dataKeys={["time"]}
              xAxisDataKey="day"
              colors={["#ec4899"]}
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Case Status</CardTitle>
            <CardDescription>Current status of all cases</CardDescription>
          </CardHeader>
          <CardContent>
            <StatisticsChart
              title="Status Distribution"
              type="pie"
              data={mockChartData.casesByStatus}
              dataKeys={["value"]}
              colors={["#f97316", "#06b6d4", "#10b981", "#6b7280"]}
              height={300}
            />
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Case Clearance Rate</CardTitle>
            <CardDescription>Percentage of cases cleared by month</CardDescription>
          </CardHeader>
          <CardContent>
            <StatisticsChart
              title="Clearance Rate"
              type="line"
              data={mockChartData.clearanceRate}
              dataKeys={["rate"]}
              xAxisDataKey="month"
              colors={["#10b981"]}
              height={300}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Report Generator component
const ReportGenerator = () => {
  const [reportType, setReportType] = useState("daily");
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() });
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
          <CardDescription>
            Create customized reports for your station
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="report-type">Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger id="report-type" className="mt-1">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily Activity Report</SelectItem>
                <SelectItem value="weekly">Weekly Summary</SelectItem>
                <SelectItem value="monthly">Monthly Statistics</SelectItem>
                <SelectItem value="quarterly">Quarterly Review</SelectItem>
                <SelectItem value="annual">Annual Report</SelectItem>
                <SelectItem value="case">Case-Specific Report</SelectItem>
                <SelectItem value="officer">Officer Performance</SelectItem>
                <SelectItem value="crime">Crime Trend Analysis</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Date Range</Label>
            <div className="mt-1">
              <DatePickerWithRange className="w-full" />
            </div>
          </div>
          
          <div>
            <Label>Include in Report</Label>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="include-cases" defaultChecked />
                <Label htmlFor="include-cases">Cases Summary</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="include-stats" defaultChecked />
                <Label htmlFor="include-stats">Statistics</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="include-charts" defaultChecked />
                <Label htmlFor="include-charts">Charts and Graphs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="include-response" defaultChecked />
                <Label htmlFor="include-response">Response Times</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="include-officers" defaultChecked />
                <Label htmlFor="include-officers">Officer Activities</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="include-resources" defaultChecked />
                <Label htmlFor="include-resources">Resource Utilization</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="include-locations" defaultChecked />
                <Label htmlFor="include-locations">Geographic Analysis</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="include-recommendations" defaultChecked />
                <Label htmlFor="include-recommendations">Recommendations</Label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Preview Report</Button>
          <Button>Generate Report</Button>
        </CardFooter>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Export Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" /> PDF Format
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="mr-2 h-4 w-4" /> Excel Spreadsheet
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Mail className="mr-2 h-4 w-4" /> Email Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Printer className="mr-2 h-4 w-4" /> Print Report
            </Button>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Scheduled Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="border rounded-md p-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">Daily Activity Summary</p>
                  <p className="text-sm text-gray-500">Daily at 8:00 PM • PDF • Email</p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              
              <div className="border rounded-md p-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">Weekly Station Report</p>
                  <p className="text-sm text-gray-500">Mondays at 9:00 AM • PDF • Email</p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              
              <div className="border rounded-md p-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">Monthly Performance Review</p>
                  <p className="text-sm text-gray-500">1st of Month at 10:00 AM • PDF • Email</p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Calendar className="mr-2 h-4 w-4" /> Schedule New Report
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

// Saved Reports component
const SavedReports = () => {
  const savedReports = [
    {
      id: "1",
      title: "March 2025 Monthly Report",
      type: "Monthly",
      date: "April 2, 2025",
      size: "4.2 MB",
      format: "PDF"
    },
    {
      id: "2",
      title: "Q1 2025 Crime Statistics",
      type: "Quarterly",
      date: "April 2, 2025",
      size: "8.7 MB",
      format: "PDF"
    },
    {
      id: "3",
      title: "Officer Performance Review - March 2025",
      type: "Monthly",
      date: "April 1, 2025",
      size: "3.8 MB",
      format: "PDF"
    },
    {
      id: "4",
      title: "Weekly Case Summary (Mar 25-31)",
      type: "Weekly",
      date: "March 31, 2025",
      size: "2.1 MB",
      format: "PDF"
    },
    {
      id: "5",
      title: "Theft Incident Analysis",
      type: "Case-specific",
      date: "March 30, 2025",
      size: "1.8 MB",
      format: "PDF"
    },
    {
      id: "6",
      title: "Downtown Area Crime Hotspots",
      type: "Geographic",
      date: "March 28, 2025",
      size: "5.4 MB",
      format: "PDF"
    },
    {
      id: "7",
      title: "Response Time Analysis",
      type: "Performance",
      date: "March 25, 2025",
      size: "2.9 MB",
      format: "PDF"
    },
    {
      id: "8",
      title: "February 2025 Monthly Report",
      type: "Monthly",
      date: "March 3, 2025",
      size: "4.5 MB",
      format: "PDF"
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Recently generated reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {savedReports.slice(0, 5).map(report => (
              <div key={report.id} className="border rounded-md p-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">{report.title}</p>
                  <p className="text-sm text-gray-500">{report.date} • {report.type} • {report.size}</p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Reports</Button>
          </CardFooter>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Template Library</CardTitle>
            <CardDescription>Standardized report templates</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-4">
              <BarChart2 className="h-8 w-8 text-blue-500 mb-2" />
              <h3 className="font-medium text-lg">Station Activity</h3>
              <p className="text-sm text-gray-500 mt-1">
                Standard report for daily station activities, response times, and case statistics.
              </p>
              <Button variant="outline" size="sm" className="mt-3">Use Template</Button>
            </div>
            
            <div className="border rounded-md p-4">
              <PieChart className="h-8 w-8 text-purple-500 mb-2" />
              <h3 className="font-medium text-lg">Crime Distribution</h3>
              <p className="text-sm text-gray-500 mt-1">
                Analysis of crime types and their frequency in your jurisdiction.
              </p>
              <Button variant="outline" size="sm" className="mt-3">Use Template</Button>
            </div>
            
            <div className="border rounded-md p-4">
              <TrendingUp className="h-8 w-8 text-green-500 mb-2" />
              <h3 className="font-medium text-lg">Performance Metrics</h3>
              <p className="text-sm text-gray-500 mt-1">
                Officer and station performance metrics compared to targets.
              </p>
              <Button variant="outline" size="sm" className="mt-3">Use Template</Button>
            </div>
            
            <div className="border rounded-md p-4">
              <Clock className="h-8 w-8 text-amber-500 mb-2" />
              <h3 className="font-medium text-lg">Response Analysis</h3>
              <p className="text-sm text-gray-500 mt-1">
                Detailed analysis of response times and factors affecting them.
              </p>
              <Button variant="outline" size="sm" className="mt-3">Use Template</Button>
            </div>
            
            <div className="border rounded-md p-4">
              <Users className="h-8 w-8 text-indigo-500 mb-2" />
              <h3 className="font-medium text-lg">Officer Deployment</h3>
              <p className="text-sm text-gray-500 mt-1">
                Officer scheduling, patrol coverage, and deployment optimization.
              </p>
              <Button variant="outline" size="sm" className="mt-3">Use Template</Button>
            </div>
            
            <div className="border rounded-md p-4">
              <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
              <h3 className="font-medium text-lg">Incident Reports</h3>
              <p className="text-sm text-gray-500 mt-1">
                Detailed accounts of significant incidents requiring documentation.
              </p>
              <Button variant="outline" size="sm" className="mt-3">Use Template</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Reports</h1>
      
      <Tabs defaultValue="analytics">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analytics">
            <BarChart2 className="h-4 w-4 mr-2" /> Analytics
          </TabsTrigger>
          <TabsTrigger value="generator">
            <FileText className="h-4 w-4 mr-2" /> Report Generator
          </TabsTrigger>
          <TabsTrigger value="saved">
            <CheckCircle className="h-4 w-4 mr-2" /> Saved Reports
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics" className="mt-6">
          <AnalyticsDashboard />
        </TabsContent>
        
        <TabsContent value="generator" className="mt-6">
          <ReportGenerator />
        </TabsContent>
        
        <TabsContent value="saved" className="mt-6">
          <SavedReports />
        </TabsContent>
      </Tabs>
    </div>
  );
}
