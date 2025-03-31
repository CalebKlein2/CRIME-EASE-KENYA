import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/tables/DataTable";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Download, 
  Printer, 
  Eye, 
  Search, 
  Calendar, 
  ArrowUpDown,
  Filter,
  Building,
  FileBarChart,
  FileClock
} from 'lucide-react';

// Mock reports data
const reportsData = [
  {
    id: "1",
    title: "Monthly Crime Statistics Report",
    type: "Statistical",
    region: "All Regions",
    period: "March 2025",
    created_at: "2025-04-01",
    status: "Published",
    size: "2.4 MB",
    creator: "System Generated"
  },
  {
    id: "2",
    title: "Regional Crime Analysis - Nairobi",
    type: "Analytical",
    region: "Nairobi",
    period: "Q1 2025",
    created_at: "2025-03-25",
    status: "Published",
    size: "4.1 MB",
    creator: "Intelligence Dept."
  },
  {
    id: "3",
    title: "Officer Performance Evaluation",
    type: "Performance",
    region: "All Regions",
    period: "January-March 2025",
    created_at: "2025-03-28",
    status: "Under Review",
    size: "3.7 MB",
    creator: "HR Department"
  },
  {
    id: "4",
    title: "Coastal Region Security Analysis",
    type: "Security",
    region: "Coast",
    period: "February 2025",
    created_at: "2025-03-10",
    status: "Published",
    size: "5.2 MB",
    creator: "Regional Command"
  },
  {
    id: "5",
    title: "Traffic Incidents Analysis",
    type: "Statistical",
    region: "All Regions",
    period: "March 2025",
    created_at: "2025-03-30",
    status: "Draft",
    size: "2.8 MB",
    creator: "Traffic Division"
  },
  {
    id: "6",
    title: "Resource Allocation Report",
    type: "Administrative",
    region: "All Regions",
    period: "Q1 2025",
    created_at: "2025-03-20",
    status: "Published",
    size: "1.9 MB",
    creator: "Administration"
  },
  {
    id: "7",
    title: "Cyber Crime Trends Report",
    type: "Analytical",
    region: "All Regions",
    period: "January-March 2025",
    created_at: "2025-03-22",
    status: "Published",
    size: "3.5 MB",
    creator: "Cyber Crime Unit"
  },
  {
    id: "8",
    title: "Western Region Performance Review",
    type: "Performance",
    region: "Western",
    period: "Q1 2025",
    created_at: "2025-03-27",
    status: "Under Review",
    size: "2.3 MB",
    creator: "Regional Command"
  },
];

// Mock regions and report types data
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

const reportTypes = [
  "All Types",
  "Statistical",
  "Analytical",
  "Performance",
  "Security",
  "Administrative"
];

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All");
  
  // Filter reports based on search query and filters
  const filteredReports = reportsData.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          report.creator.toLowerCase().includes(searchQuery.toLowerCase());
                         
    const matchesRegion = selectedRegion === "All Regions" || report.region === selectedRegion;
    const matchesType = selectedType === "All Types" || report.type === selectedType;
    const matchesStatus = selectedStatus === "All" || report.status === selectedStatus;
    
    return matchesSearch && matchesRegion && matchesType && matchesStatus;
  });
  
  const handleViewReport = (id: string) => {
    console.log("View report:", id);
    // Open report viewer or navigate to report details
  };
  
  const handleDownloadReport = (id: string) => {
    console.log("Download report:", id);
    // Trigger download of report
  };
  
  const handlePrintReport = (id: string) => {
    console.log("Print report:", id);
    // Open print dialog
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Case Reports</h2>
          <p className="text-gray-500">View and manage nationwide police reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Generate New Report
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Available Reports</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search reports by title or creator..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
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
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                </SelectContent>
              </Select>
              
              <DatePickerWithRange className="w-[300px]" />
            </div>
          </div>
          
          <DataTable
            data={filteredReports}
            columns={[
              {
                key: "title",
                header: "Report Title",
                cell: (row) => (
                  <div>
                    <div className="font-medium flex items-center">
                      {row.type === "Statistical" ? (
                        <FileBarChart className="h-4 w-4 mr-2 text-blue-600" />
                      ) : row.type === "Analytical" ? (
                        <FileText className="h-4 w-4 mr-2 text-purple-600" />
                      ) : row.type === "Performance" ? (
                        <FileClock className="h-4 w-4 mr-2 text-green-600" />
                      ) : (
                        <FileText className="h-4 w-4 mr-2 text-gray-600" />
                      )}
                      {row.title}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Period: {row.period}
                    </div>
                  </div>
                ),
              },
              {
                key: "type",
                header: "Type",
                cell: (row) => (
                  <Badge
                    className={
                      row.type === "Statistical" ? "bg-blue-100 text-blue-800 hover:bg-blue-100" :
                      row.type === "Analytical" ? "bg-purple-100 text-purple-800 hover:bg-purple-100" :
                      row.type === "Performance" ? "bg-green-100 text-green-800 hover:bg-green-100" :
                      row.type === "Security" ? "bg-red-100 text-red-800 hover:bg-red-100" :
                      "bg-gray-100 text-gray-800 hover:bg-gray-100"
                    }
                  >
                    {row.type}
                  </Badge>
                ),
              },
              {
                key: "region",
                header: "Region",
                cell: (row) => (
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-1 text-gray-500" />
                    {row.region}
                  </div>
                ),
              },
              {
                key: "created_at",
                header: () => (
                  <div className="flex items-center">
                    Created
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                ),
                cell: (row) => (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                    {row.created_at}
                  </div>
                ),
              },
              {
                key: "status",
                header: "Status",
                cell: (row) => (
                  <Badge
                    className={
                      row.status === "Published" ? "bg-green-100 text-green-800 hover:bg-green-100" :
                      row.status === "Draft" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" :
                      "bg-blue-100 text-blue-800 hover:bg-blue-100"
                    }
                  >
                    {row.status}
                  </Badge>
                ),
              },
              {
                key: "creator",
                header: "Creator",
                cell: (row) => row.creator,
              },
              {
                key: "size",
                header: "Size",
                cell: (row) => row.size,
              },
              {
                key: "actions",
                header: "",
                cell: (row) => (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewReport(row.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadReport(row.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handlePrintReport(row.id)}
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="statistical">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="statistical">Statistical</TabsTrigger>
                <TabsTrigger value="analytical">Analytical</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="statistical" className="mt-4">
                <ul className="space-y-3">
                  {reportsData
                    .filter(report => report.type === "Statistical" && report.status === "Published")
                    .slice(0, 4)
                    .map(report => (
                      <li 
                        key={report.id}
                        className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium flex items-center">
                              <FileBarChart className="h-4 w-4 mr-1 text-blue-600" />
                              {report.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {report.period} • {report.region}
                            </p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                            {report.type}
                          </Badge>
                        </div>
                        <div className="mt-2 text-xs text-gray-500 flex justify-between">
                          <span>{report.created_at}</span>
                          <span>{report.size}</span>
                        </div>
                      </li>
                    ))}
                </ul>
              </TabsContent>
              
              <TabsContent value="analytical" className="mt-4">
                <ul className="space-y-3">
                  {reportsData
                    .filter(report => report.type === "Analytical" && report.status === "Published")
                    .slice(0, 4)
                    .map(report => (
                      <li 
                        key={report.id}
                        className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium flex items-center">
                              <FileText className="h-4 w-4 mr-1 text-purple-600" />
                              {report.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {report.period} • {report.region}
                            </p>
                          </div>
                          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                            {report.type}
                          </Badge>
                        </div>
                        <div className="mt-2 text-xs text-gray-500 flex justify-between">
                          <span>{report.created_at}</span>
                          <span>{report.size}</span>
                        </div>
                      </li>
                    ))}
                </ul>
              </TabsContent>
              
              <TabsContent value="performance" className="mt-4">
                <ul className="space-y-3">
                  {reportsData
                    .filter(report => report.type === "Performance")
                    .slice(0, 4)
                    .map(report => (
                      <li 
                        key={report.id}
                        className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium flex items-center">
                              <FileClock className="h-4 w-4 mr-1 text-green-600" />
                              {report.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {report.period} • {report.region}
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            {report.type}
                          </Badge>
                        </div>
                        <div className="mt-2 text-xs text-gray-500 flex justify-between">
                          <span>{report.created_at}</span>
                          <span>{report.size}</span>
                        </div>
                      </li>
                    ))}
                </ul>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Report Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">Quick Report Generator</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Generate predefined reports with customizable parameters
                </p>
                <div className="space-y-3">
                  <Select defaultValue="monthly">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Report Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly Crime Statistics</SelectItem>
                      <SelectItem value="quarterly">Quarterly Performance</SelectItem>
                      <SelectItem value="regional">Regional Analysis</SelectItem>
                      <SelectItem value="officer">Officer Performance</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select Region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Regions</SelectItem>
                        {regions.filter(r => r !== "All Regions").map(region => (
                          <SelectItem key={region} value={region.toLowerCase()}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <div className="flex-1">
                      <DatePickerWithRange />
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    Generate Report
                  </Button>
                </div>
              </div>
              
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">Scheduled Reports</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Configure automatic report generation
                </p>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">Monthly Crime Statistics</p>
                      <p className="text-xs text-gray-500">Every 1st of the month</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </li>
                  <li className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">Quarterly Performance Review</p>
                      <p className="text-xs text-gray-500">Every quarter end</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </li>
                </ul>
                <Button variant="outline" className="w-full mt-3">
                  Manage Scheduled Reports
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
