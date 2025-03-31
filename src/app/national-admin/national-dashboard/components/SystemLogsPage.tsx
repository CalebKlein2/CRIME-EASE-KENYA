import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/tables/DataTable";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  AlertTriangle,
  Info,
  HardDrive,
  Database, 
  FileDigit,
  DownloadCloud
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';

// Mock system logs data
const systemLogsData = [
  {
    id: "1",
    type: "error",
    message: "Database connection timeout after 30s",
    source: "database",
    timestamp: "2025-03-30 14:23:45",
    user: "system",
    ip: "10.0.12.5"
  },
  {
    id: "2",
    type: "warning",
    message: "High memory usage detected (85%)",
    source: "server",
    timestamp: "2025-03-30 13:15:22",
    user: "system",
    ip: "10.0.12.5"
  },
  {
    id: "3",
    type: "info",
    message: "System backup completed successfully",
    source: "backup",
    timestamp: "2025-03-30 12:00:01",
    user: "admin",
    ip: "10.0.12.8"
  },
  {
    id: "4",
    type: "success",
    message: "User authentication system updated",
    source: "auth",
    timestamp: "2025-03-30 10:45:36",
    user: "admin",
    ip: "10.0.12.8"
  },
  {
    id: "5",
    type: "info",
    message: "New officer account created: John Mwangi",
    source: "users",
    timestamp: "2025-03-30 09:12:08",
    user: "john.kamau@police.go.ke",
    ip: "10.0.12.15"
  },
  {
    id: "6",
    type: "warning",
    message: "Failed login attempt for user admin",
    source: "auth",
    timestamp: "2025-03-29 22:34:19",
    user: "unknown",
    ip: "192.168.1.105"
  },
  {
    id: "7",
    type: "error",
    message: "API rate limit exceeded for reports endpoint",
    source: "api",
    timestamp: "2025-03-29 17:58:43",
    user: "station_api_user",
    ip: "10.0.14.22"
  },
  {
    id: "8",
    type: "info",
    message: "Scheduled maintenance started",
    source: "system",
    timestamp: "2025-03-29 02:00:00",
    user: "system",
    ip: "10.0.12.5"
  },
  {
    id: "9",
    type: "success",
    message: "Database optimization completed",
    source: "database",
    timestamp: "2025-03-28 03:15:47",
    user: "system",
    ip: "10.0.12.5"
  },
  {
    id: "10",
    type: "info",
    message: "System configuration updated",
    source: "config",
    timestamp: "2025-03-27 15:22:31",
    user: "admin",
    ip: "10.0.12.8"
  },
  {
    id: "11",
    type: "warning",
    message: "Storage space below 20% threshold",
    source: "storage",
    timestamp: "2025-03-27 09:08:12",
    user: "system",
    ip: "10.0.12.5"
  },
  {
    id: "12",
    type: "error",
    message: "Report generation failed: timeout",
    source: "reports",
    timestamp: "2025-03-26 16:45:29",
    user: "mary.wanjiku@police.go.ke",
    ip: "10.0.13.42"
  },
];

const performanceData = [
  { id: "1", metric: "CPU Usage", value: "32%", status: "normal" },
  { id: "2", metric: "Memory Usage", value: "68%", status: "normal" },
  { id: "3", metric: "Disk Space", value: "78%", status: "warning" },
  { id: "4", metric: "Network Traffic", value: "45 Mbps", status: "normal" },
  { id: "5", metric: "Database Connections", value: "124/500", status: "normal" },
  { id: "6", metric: "API Response Time", value: "230ms", status: "normal" },
  { id: "7", metric: "Active Sessions", value: "278", status: "normal" },
];

export default function SystemLogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLogType, setSelectedLogType] = useState("All");
  const [selectedSource, setSelectedSource] = useState("All");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  
  // Filter logs based on search query and filters
  const filteredLogs = systemLogsData
    .filter(log => {
      const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            log.ip.toLowerCase().includes(searchQuery.toLowerCase());
                         
      const matchesType = selectedLogType === "All" || log.type === selectedLogType.toLowerCase();
      const matchesSource = selectedSource === "All" || log.source === selectedSource.toLowerCase();
      
      // Date filtering logic would go here if implemented fully
      
      return matchesSearch && matchesType && matchesSource;
    });
  
  const handleRefreshLogs = () => {
    console.log("Refreshing logs...");
    // API call to refresh logs
  };

  const handleDownloadLogs = () => {
    console.log("Downloading logs...");
    // API call to download logs
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">System Logs</h2>
          <p className="text-gray-500">Monitor system activity and troubleshoot issues</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefreshLogs}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleDownloadLogs}>
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">Operational</div>
                <div className="text-sm text-gray-500">All systems running normally</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="border rounded-md p-3">
                <div className="text-sm text-gray-500">Uptime</div>
                <div className="font-medium">99.98%</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-sm text-gray-500">Last Restart</div>
                <div className="font-medium">23 days ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Log Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center border rounded-md p-3">
                <div className="p-2 rounded-full bg-red-100 mb-1">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div className="font-medium text-lg">12</div>
                <div className="text-xs text-gray-500">Errors</div>
              </div>
              <div className="flex flex-col items-center border rounded-md p-3">
                <div className="p-2 rounded-full bg-yellow-100 mb-1">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="font-medium text-lg">28</div>
                <div className="text-xs text-gray-500">Warnings</div>
              </div>
              <div className="flex flex-col items-center border rounded-md p-3">
                <div className="p-2 rounded-full bg-blue-100 mb-1">
                  <Info className="h-5 w-5 text-blue-600" />
                </div>
                <div className="font-medium text-lg">156</div>
                <div className="text-xs text-gray-500">Info</div>
              </div>
              <div className="flex flex-col items-center border rounded-md p-3">
                <div className="p-2 rounded-full bg-green-100 mb-1">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div className="font-medium text-lg">42</div>
                <div className="text-xs text-gray-500">Success</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Resource Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">CPU Usage</span>
                <span className="text-sm text-gray-500">32%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "32%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Memory Usage</span>
                <span className="text-sm text-gray-500">68%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "68%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Disk Space</span>
                <span className="text-sm text-gray-500">78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "78%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>System Logs</CardTitle>
          <CardDescription>View and filter system events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search logs by message, user or IP..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={selectedLogType} onValueChange={setSelectedLogType}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Log Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  <SelectItem value="Error">Error</SelectItem>
                  <SelectItem value="Warning">Warning</SelectItem>
                  <SelectItem value="Info">Info</SelectItem>
                  <SelectItem value="Success">Success</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Sources</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="server">Server</SelectItem>
                  <SelectItem value="auth">Authentication</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                  <SelectItem value="users">Users</SelectItem>
                  <SelectItem value="backup">Backup</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="config">Configuration</SelectItem>
                  <SelectItem value="reports">Reports</SelectItem>
                  <SelectItem value="storage">Storage</SelectItem>
                </SelectContent>
              </Select>
              
              <DatePickerWithRange 
                className="w-[280px]"
                value={dateRange}
                onChange={setDateRange}
              />
            </div>
          </div>
          
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Logs</TabsTrigger>
              <TabsTrigger value="errors">Errors</TabsTrigger>
              <TabsTrigger value="warnings">Warnings</TabsTrigger>
              <TabsTrigger value="auth">Authentication</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <DataTable
                data={filteredLogs}
                columns={[
                  {
                    key: "timestamp",
                    header: "Timestamp",
                    cell: (item) => (
                      <div className="flex items-center text-sm">
                        <Clock className="h-3 w-3 mr-1 text-gray-500" />
                        {item.timestamp}
                      </div>
                    ),
                  },
                  {
                    key: "type",
                    header: "Type",
                    cell: (item) => (
                      <Badge
                        className={
                          item.type === "error" ? "bg-red-100 text-red-800 hover:bg-red-100" :
                          item.type === "warning" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" :
                          item.type === "success" ? "bg-green-100 text-green-800 hover:bg-green-100" :
                          "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        }
                      >
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </Badge>
                    ),
                  },
                  {
                    key: "message",
                    header: "Message",
                    cell: (item) => (
                      <div className="font-medium">{item.message}</div>
                    ),
                  },
                  {
                    key: "source",
                    header: "Source",
                    cell: (item) => (
                      <Badge variant="outline" className="capitalize">
                        {item.source}
                      </Badge>
                    ),
                  },
                  {
                    key: "user",
                    header: "User",
                    cell: (item) => (
                      <div className="text-sm">{item.user}</div>
                    ),
                  },
                  {
                    key: "ip",
                    header: "IP Address",
                    cell: (item) => (
                      <div className="text-sm font-mono">{item.ip}</div>
                    ),
                  },
                ]}
              />
            </TabsContent>
            
            <TabsContent value="errors" className="mt-6">
              <DataTable
                data={filteredLogs.filter(log => log.type === "error")}
                columns={[
                  {
                    key: "timestamp",
                    header: "Timestamp",
                    cell: (item) => (
                      <div className="flex items-center text-sm">
                        <Clock className="h-3 w-3 mr-1 text-gray-500" />
                        {item.timestamp}
                      </div>
                    ),
                  },
                  {
                    key: "message",
                    header: "Error Message",
                    cell: (item) => (
                      <div className="font-medium text-red-600">{item.message}</div>
                    ),
                  },
                  {
                    key: "source",
                    header: "Source",
                    cell: (item) => (
                      <Badge variant="outline" className="capitalize">
                        {item.source}
                      </Badge>
                    ),
                  },
                  {
                    key: "user",
                    header: "User",
                    cell: (item) => (
                      <div className="text-sm">{item.user}</div>
                    ),
                  },
                ]}
              />
            </TabsContent>
            
            <TabsContent value="warnings" className="mt-6">
              <DataTable
                data={filteredLogs.filter(log => log.type === "warning")}
                columns={[
                  {
                    key: "timestamp",
                    header: "Timestamp",
                    cell: (item) => (
                      <div className="flex items-center text-sm">
                        <Clock className="h-3 w-3 mr-1 text-gray-500" />
                        {item.timestamp}
                      </div>
                    ),
                  },
                  {
                    key: "message",
                    header: "Warning Message",
                    cell: (item) => (
                      <div className="font-medium text-yellow-600">{item.message}</div>
                    ),
                  },
                  {
                    key: "source",
                    header: "Source",
                    cell: (item) => (
                      <Badge variant="outline" className="capitalize">
                        {item.source}
                      </Badge>
                    ),
                  },
                  {
                    key: "user",
                    header: "User",
                    cell: (item) => (
                      <div className="text-sm">{item.user}</div>
                    ),
                  },
                ]}
              />
            </TabsContent>
            
            <TabsContent value="auth" className="mt-6">
              <DataTable
                data={filteredLogs.filter(log => log.source === "auth")}
                columns={[
                  {
                    key: "timestamp",
                    header: "Timestamp",
                    cell: (item) => (
                      <div className="flex items-center text-sm">
                        <Clock className="h-3 w-3 mr-1 text-gray-500" />
                        {item.timestamp}
                      </div>
                    ),
                  },
                  {
                    key: "type",
                    header: "Type",
                    cell: (item) => (
                      <Badge
                        className={
                          item.type === "error" ? "bg-red-100 text-red-800 hover:bg-red-100" :
                          item.type === "warning" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" :
                          item.type === "success" ? "bg-green-100 text-green-800 hover:bg-green-100" :
                          "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        }
                      >
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </Badge>
                    ),
                  },
                  {
                    key: "message",
                    header: "Message",
                    cell: (item) => (
                      <div className="font-medium">{item.message}</div>
                    ),
                  },
                  {
                    key: "user",
                    header: "User",
                    cell: (item) => (
                      <div className="text-sm">{item.user}</div>
                    ),
                  },
                  {
                    key: "ip",
                    header: "IP Address",
                    cell: (item) => (
                      <div className="text-sm font-mono">{item.ip}</div>
                    ),
                  },
                ]}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Real-time system performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {performanceData.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 border-b last:border-0">
                  <div className="flex items-center">
                    {item.metric === "CPU Usage" && <HardDrive className="h-4 w-4 mr-2 text-gray-500" />}
                    {item.metric === "Memory Usage" && <Database className="h-4 w-4 mr-2 text-gray-500" />}
                    {item.metric === "Disk Space" && <FileDigit className="h-4 w-4 mr-2 text-gray-500" />}
                    {item.metric === "Network Traffic" && <DownloadCloud className="h-4 w-4 mr-2 text-gray-500" />}
                    {item.metric === "Database Connections" && <Database className="h-4 w-4 mr-2 text-gray-500" />}
                    {item.metric === "API Response Time" && <Clock className="h-4 w-4 mr-2 text-gray-500" />}
                    {item.metric === "Active Sessions" && <Users className="h-4 w-4 mr-2 text-gray-500" />}
                    <span>{item.metric}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.value}</span>
                    {item.status === "normal" && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Normal</Badge>
                    )}
                    {item.status === "warning" && (
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Warning</Badge>
                    )}
                    {item.status === "critical" && (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Critical</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Metrics
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>System Diagnostic Tools</CardTitle>
            <CardDescription>Tools to help diagnose and resolve system issues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer transition">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 mr-3">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Run System Diagnostics</p>
                    <p className="text-xs text-gray-500">Perform full system health check</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer transition">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-purple-100 mr-3">
                    <Database className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Database Optimization</p>
                    <p className="text-xs text-gray-500">Clean and optimize database tables</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer transition">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-green-100 mr-3">
                    <RefreshCw className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Clear Application Cache</p>
                    <p className="text-xs text-gray-500">Clear temporary files and cache</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer transition">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-red-100 mr-3">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium">Security Scan</p>
                    <p className="text-xs text-gray-500">Check for vulnerabilities</p>
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
