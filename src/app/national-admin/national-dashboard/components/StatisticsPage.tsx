// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { StatisticsChart } from "@/components/charts/StatisticsChart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, 
  PieChart, 
  LineChart,
  Download, 
  Share2, 
  Filter,
  Calendar,
  ChevronDown,
  MapPin,
  FileSpreadsheet,
  ArrowDownToLine
} from 'lucide-react';

// Mock data for various statistics charts
const crimeTrendData = [
  { name: "Jan", value: 180 },
  { name: "Feb", value: 200 },
  { name: "Mar", value: 220 },
  { name: "Apr", value: 190 },
  { name: "May", value: 210 },
  { name: "Jun", value: 240 },
  { name: "Jul", value: 250 },
  { name: "Aug", value: 230 },
  { name: "Sep", value: 220 },
  { name: "Oct", value: 210 },
  { name: "Nov", value: 200 },
  { name: "Dec", value: 190 },
];

const crimeTypeData = [
  { name: "Theft", value: 32 },
  { name: "Assault", value: 18 },
  { name: "Traffic", value: 15 },
  { name: "Fraud", value: 12 },
  { name: "Domestic", value: 10 },
  { name: "Other", value: 13 },
];

const regionCrimeData = [
  { name: "Nairobi", value: 542 },
  { name: "Coast", value: 328 },
  { name: "Central", value: 298 },
  { name: "Eastern", value: 276 },
  { name: "Western", value: 246 },
  { name: "Nyanza", value: 230 },
  { name: "Rift Valley", value: 310 },
  { name: "North Eastern", value: 180 },
];

const responseTimeData = [
  { name: "Jan", value: 22 },
  { name: "Feb", value: 21 },
  { name: "Mar", value: 20 },
  { name: "Apr", value: 19 },
  { name: "May", value: 18 },
  { name: "Jun", value: 17 },
  { name: "Jul", value: 17 },
  { name: "Aug", value: 16 },
  { name: "Sep", value: 16 },
  { name: "Oct", value: 15 },
  { name: "Nov", value: 15 },
  { name: "Dec", value: 14 },
];

const clearanceRateData = [
  { name: "Jan", value: 48 },
  { name: "Feb", value: 50 },
  { name: "Mar", value: 51 },
  { name: "Apr", value: 53 },
  { name: "May", value: 55 },
  { name: "Jun", value: 56 },
  { name: "Jul", value: 58 },
  { name: "Aug", value: 59 },
  { name: "Sep", value: 60 },
  { name: "Oct", value: 61 },
  { name: "Nov", value: 62 },
  { name: "Dec", value: 62 },
];

const timeOfDayData = [
  { name: "00:00-03:59", value: 15 },
  { name: "04:00-07:59", value: 8 },
  { name: "08:00-11:59", value: 12 },
  { name: "12:00-15:59", value: 25 },
  { name: "16:00-19:59", value: 30 },
  { name: "20:00-23:59", value: 20 },
];

const ageDistributionData = [
  { name: "Under 18", value: 8 },
  { name: "18-24", value: 22 },
  { name: "25-34", value: 30 },
  { name: "35-44", value: 18 },
  { name: "45-54", value: 12 },
  { name: "55+", value: 10 },
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

export default function StatisticsPage() {
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("yearly");
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Crime Statistics</h2>
          <p className="text-gray-500">Comprehensive analysis of nationwide crime data</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Advanced Filters
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Statistics Overview</CardTitle>
              <CardDescription>Select filters to customize the view</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <DatePickerWithRange 
                className="w-[300px]"
                value={dateRange}
                onChange={setDateRange}
              />
              
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map(region => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedTimePeriod} onValueChange={setSelectedTimePeriod}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="trends">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
              <TabsTrigger value="trends">Crime Trends</TabsTrigger>
              <TabsTrigger value="distribution">Crime Distribution</TabsTrigger>
              <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
              <TabsTrigger value="demographics">Demographics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="trends" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Crime Trends</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <StatisticsChart
                      title="Cases by Month"
                      type="line"
                      data={crimeTrendData}
                      dataKeys={["value"]}
                      colors={["#3b82f6"]}
                      xAxisDataKey="name"
                    />
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm">
                        <ArrowDownToLine className="h-4 w-4 mr-2" />
                        Download Chart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Crime Type Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <StatisticsChart
                      title="Crime Distribution"
                      type="pie"
                      data={crimeTypeData}
                      dataKeys={["value"]}
                      colors={["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6", "#6b7280"]}
                    />
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm">
                        <ArrowDownToLine className="h-4 w-4 mr-2" />
                        Download Chart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Regional Crime Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <StatisticsChart
                      title="Cases by Region"
                      type="bar"
                      data={regionCrimeData}
                      dataKeys={["value"]}
                      colors={["#3b82f6"]}
                      xAxisDataKey="name"
                    />
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm">
                        <ArrowDownToLine className="h-4 w-4 mr-2" />
                        Download Chart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="distribution" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Crime Types by Region</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="flex items-center justify-center h-full bg-gray-50 rounded-md border">
                      <p className="text-gray-500">Crime Type by Region Chart</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Crime Hotspots</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="flex items-center justify-center h-full bg-gray-50 rounded-md border">
                      <div className="text-center">
                        <MapPin className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Crime Hotspot Heatmap</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Time of Day Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <StatisticsChart
                      title="Crimes by Time of Day"
                      type="bar"
                      data={timeOfDayData}
                      dataKeys={["value"]}
                      colors={["#3b82f6"]}
                      xAxisDataKey="name"
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Day of Week Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="flex items-center justify-center h-full bg-gray-50 rounded-md border">
                      <p className="text-gray-500">Day of Week Chart</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="performance" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Response Time Trends</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <StatisticsChart
                      title="Avg. Response Time (Minutes)"
                      type="line"
                      data={responseTimeData}
                      dataKeys={["value"]}
                      colors={["#10b981"]}
                      xAxisDataKey="name"
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Case Clearance Rate</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <StatisticsChart
                      title="Clearance Rate (%)"
                      type="line"
                      data={clearanceRateData}
                      dataKeys={["value"]}
                      colors={["#8b5cf6"]}
                      xAxisDataKey="name"
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Station Performance Comparison</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="flex items-center justify-center h-full bg-gray-50 rounded-md border">
                      <p className="text-gray-500">Station Performance Chart</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Officer Productivity</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="flex items-center justify-center h-full bg-gray-50 rounded-md border">
                      <p className="text-gray-500">Officer Productivity Chart</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="demographics" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Age Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <StatisticsChart
                      title="Cases by Age Group"
                      type="bar"
                      data={ageDistributionData}
                      dataKeys={["value"]}
                      colors={["#3b82f6"]}
                      xAxisDataKey="name"
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Gender Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="flex items-center justify-center h-full bg-gray-50 rounded-md border">
                      <p className="text-gray-500">Gender Distribution Chart</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Economic Factors</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="flex items-center justify-center h-full bg-gray-50 rounded-md border">
                      <p className="text-gray-500">Economic Factors Chart</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Education Level</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="flex items-center justify-center h-full bg-gray-50 rounded-md border">
                      <p className="text-gray-500">Education Level Chart</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Statistical Analysis</CardTitle>
            <CardDescription>Detailed analysis of crime trends and patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="trends">
              <TabsList>
                <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
                <TabsTrigger value="correlation">Correlation</TabsTrigger>
                <TabsTrigger value="forecast">Forecasting</TabsTrigger>
              </TabsList>
              
              <TabsContent value="trends" className="mt-4">
                <div className="rounded-md border p-4">
                  <h3 className="font-medium mb-2">Key Insights</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                        <ChevronDown className="h-3 w-3 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Overall crime rates have decreased by 3.2% compared to previous year</p>
                        <p className="text-gray-500">Most significant in urban areas, particularly Nairobi and Mombasa</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mr-2 mt-0.5">
                        <ChevronDown className="h-3 w-3 rotate-180 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">Cyber crime incidents have increased by 15.8%</p>
                        <p className="text-gray-500">Particularly financial fraud and identity theft cases</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                        <ChevronDown className="h-3 w-3 -rotate-90 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Traffic incidents remain relatively stable with minor fluctuations</p>
                        <p className="text-gray-500">Seasonal peaks observed during holiday periods</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="correlation" className="mt-4">
                <div className="rounded-md border p-4">
                  <h3 className="font-medium mb-2">Correlation Analysis</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Examining relationships between different crime types and external factors
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-32 text-sm font-medium">Economic Factors:</div>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: "65%" }}></div>
                      </div>
                      <div className="w-10 text-right text-sm ml-2">0.65</div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-32 text-sm font-medium">Unemployment:</div>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: "72%" }}></div>
                      </div>
                      <div className="w-10 text-right text-sm ml-2">0.72</div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-32 text-sm font-medium">Education Level:</div>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: "58%" }}></div>
                      </div>
                      <div className="w-10 text-right text-sm ml-2">0.58</div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-32 text-sm font-medium">Population Density:</div>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: "81%" }}></div>
                      </div>
                      <div className="w-10 text-right text-sm ml-2">0.81</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="forecast" className="mt-4">
                <div className="rounded-md border p-4">
                  <h3 className="font-medium mb-2">Crime Forecast</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Predictive analysis based on historical trends and patterns
                  </p>
                  
                  <div className="h-[200px]">
                    <div className="flex items-center justify-center h-full bg-gray-50 rounded-md border">
                      <p className="text-gray-500">Crime Forecast Chart</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Export Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 mr-3">
                    <Download className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Export to Excel</p>
                    <p className="text-xs text-gray-500">Download data in XLSX format</p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-red-100 mr-3">
                    <Download className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium">Export to PDF</p>
                    <p className="text-xs text-gray-500">Download as PDF report</p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-green-100 mr-3">
                    <Download className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Export to CSV</p>
                    <p className="text-xs text-gray-500">Download raw data as CSV</p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-purple-100 mr-3">
                    <Share2 className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Share Report</p>
                    <p className="text-xs text-gray-500">Share with other departments</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

