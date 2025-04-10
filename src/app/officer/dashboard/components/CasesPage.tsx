import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Route, Routes } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DataTable } from '@/components/tables/DataTable';
import { CaseStatusBadge } from '@/components/case/CaseStatusBadge';
import { CasePriorityBadge } from '@/components/case/CasePriorityBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Filter, Search, RefreshCw, FileText, Clock, UserCheck, FileCheck2, AlertCircle } from 'lucide-react';

// Mock data - would be replaced with Convex data in production
const mockCases = [
  {
    _id: "1",
    ob_number: "OB-2025-001",
    title: "Theft at Main Street",
    description: "Laptop and personal belongings stolen from parked vehicle on Main Street between 2-3 PM",
    incident_type: "Theft",
    status: "in-progress" as const,
    priority: "high" as const,
    created_at: new Date("2025-03-28").getTime(),
    incident_date: new Date("2025-03-27").getTime(),
    reporter: { name: "John Smith", _id: "user1" },
    is_anonymous: false,
    location: "Main Street, Downtown Area",
    assigned_officer_id: "officer123",
    assigned_officer: { name: "Officer Johnson", badge_number: "KP-472891" },
  },
  {
    _id: "2",
    ob_number: "OB-2025-002",
    title: "Vandalism at Central Park",
    description: "Park benches and playground equipment vandalized overnight at Central Park",
    incident_type: "Vandalism",
    status: "open" as const,
    priority: "medium" as const,
    created_at: new Date("2025-03-27").getTime(),
    incident_date: new Date("2025-03-26").getTime(),
    reporter: { name: "Jane Doe", _id: "user2" },
    is_anonymous: false,
    location: "Central Park, North District",
    assigned_officer_id: null,
    assigned_officer: null,
  },
  {
    _id: "3",
    ob_number: "OB-2025-003",
    title: "Traffic Accident on Highway 5",
    description: "Two-vehicle collision with minor injuries at Highway 5 and Main Street intersection",
    incident_type: "Traffic Accident",
    status: "closed" as const,
    priority: "low" as const,
    created_at: new Date("2025-03-26").getTime(),
    incident_date: new Date("2025-03-26").getTime(),
    reporter: { name: "Robert Johnson", _id: "user3" },
    is_anonymous: false,
    location: "Highway 5 & Main Street Intersection",
    assigned_officer_id: "officer456",
    assigned_officer: { name: "Officer Williams", badge_number: "KP-583902" },
  },
  {
    _id: "4",
    ob_number: "OB-2025-004",
    title: "Missing Person Report",
    description: "16-year-old female missing since yesterday evening, last seen at Westfield Mall",
    incident_type: "Missing Person",
    status: "open" as const,
    priority: "high" as const,
    created_at: new Date("2025-03-25").getTime(),
    incident_date: new Date("2025-03-24").getTime(),
    reporter: { name: "Emily Williams", _id: "user4" },
    is_anonymous: false,
    location: "Westfield Mall, East District",
    assigned_officer_id: "officer123",
    assigned_officer: { name: "Officer Johnson", badge_number: "KP-472891" },
  },
  {
    _id: "5",
    ob_number: "OB-2025-005",
    title: "Domestic Disturbance Call",
    description: "Neighbors reported shouting and possible violence at apartment 4B",
    incident_type: "Domestic Disturbance",
    status: "in-progress" as const,
    priority: "medium" as const,
    created_at: new Date("2025-03-24").getTime(),
    incident_date: new Date("2025-03-24").getTime(),
    reporter: null,
    is_anonymous: true,
    location: "River Road Apartments, Building 4, Apt 4B",
    assigned_officer_id: "officer789",
    assigned_officer: { name: "Officer Davis", badge_number: "KP-629047" },
  },
  {
    _id: "6",
    ob_number: "OB-2025-006",
    title: "Shoplifting at City Market",
    description: "Suspect caught stealing merchandise worth approximately KES 3,500",
    incident_type: "Theft",
    status: "in-progress" as const,
    priority: "low" as const,
    created_at: new Date("2025-03-23").getTime(),
    incident_date: new Date("2025-03-23").getTime(), 
    reporter: { name: "Store Manager", _id: "user5" },
    is_anonymous: false,
    location: "City Market, Downtown Area",
    assigned_officer_id: "officer123",
    assigned_officer: { name: "Officer Johnson", badge_number: "KP-472891" },
  },
  {
    _id: "7",
    ob_number: "OB-2025-007",
    title: "Armed Robbery at Downtown Bank",
    description: "Two masked individuals carried out armed robbery at National Bank branch",
    incident_type: "Armed Robbery",
    status: "open" as const,
    priority: "high" as const,
    created_at: new Date("2025-03-22").getTime(),
    incident_date: new Date("2025-03-22").getTime(),
    reporter: { name: "Bank Manager", _id: "user6" },
    is_anonymous: false,
    location: "National Bank, Downtown Branch",
    assigned_officer_id: null,
    assigned_officer: null,
  },
];

// Case detail view component
const CaseDetails = () => {
  const { caseId } = useParams();
  const [caseData, setCaseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // In production, this would fetch from Convex
    const timer = setTimeout(() => {
      const foundCase = mockCases.find(c => c._id === caseId);
      setCaseData(foundCase || null);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [caseId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading case details...</span>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Case Not Found</h1>
        <p>The case you're looking for doesn't exist or has been removed.</p>
        <Button 
          className="mt-4" 
          onClick={() => navigate('/officer-dashboard/cases')}
        >
          Back to Cases
        </Button>
      </div>
    );
  }

  const handleUpdateStatus = async (newStatus: string) => {
    setUpdatingStatus(true);
    
    // In production, this would update the status in Convex
    setTimeout(() => {
      setCaseData({
        ...caseData,
        status: newStatus
      });
      setUpdatingStatus(false);
    }, 1000);
  };

  const handleAssignToMe = async () => {
    setUpdatingStatus(true);
    
    // In production, this would assign the case to the current officer in Convex
    setTimeout(() => {
      // Mock getting current user's info
      const currentOfficer = { 
        name: "Officer Johnson", 
        badge_number: "KP-472891",
        _id: "officer123"
      };
      
      setCaseData({
        ...caseData,
        assigned_officer_id: "officer123",
        assigned_officer: currentOfficer,
        status: caseData.status === "open" ? "in-progress" : caseData.status
      });
      setUpdatingStatus(false);
    }, 1000);
  };

  // Format date nicely
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{caseData.title}</h1>
          <p className="text-gray-500">OB Number: {caseData.ob_number}</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/officer-dashboard/cases')}
        >
          Back to All Cases
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Case details */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Case Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Description</Label>
                <p className="mt-1">{caseData.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Incident Type</Label>
                  <p className="mt-1">{caseData.incident_type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Location</Label>
                  <p className="mt-1">{caseData.location}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Incident Date</Label>
                  <p className="mt-1">{formatDate(caseData.incident_date)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Reported On</Label>
                  <p className="mt-1">{formatDate(caseData.created_at)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Reporter</Label>
                  <p className="mt-1">
                    {caseData.is_anonymous 
                      ? "Anonymous" 
                      : (caseData.reporter?.name || "Unknown")}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Assigned Officer</Label>
                  <p className="mt-1">
                    {caseData.assigned_officer 
                      ? `${caseData.assigned_officer.name} (${caseData.assigned_officer.badge_number})` 
                      : "Unassigned"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Case Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-2 border-blue-500 pl-4 py-2">
                  <p className="font-medium">Case opened</p>
                  <p className="text-sm text-gray-500">{formatDate(caseData.created_at)}</p>
                  <p className="mt-1">Initial report filed and pending review.</p>
                </div>
                
                {caseData.status !== "open" && (
                  <div className="border-l-2 border-yellow-500 pl-4 py-2">
                    <p className="font-medium">Investigation started</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(caseData.created_at + 24 * 60 * 60 * 1000)}
                    </p>
                    <p className="mt-1">Case assigned to {caseData.assigned_officer?.name || "an officer"} for investigation.</p>
                  </div>
                )}
                
                {caseData.status === "closed" && (
                  <div className="border-l-2 border-green-500 pl-4 py-2">
                    <p className="font-medium">Case closed</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(caseData.created_at + 3 * 24 * 60 * 60 * 1000)}
                    </p>
                    <p className="mt-1">Investigation completed and case has been resolved.</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Add Case Note</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right column - Status & Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Current Status</Label>
                <div className="mt-2">
                  <CaseStatusBadge status={caseData.status} />
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-500">Priority</Label>
                <div className="mt-2">
                  <CasePriorityBadge priority={caseData.priority} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Label className="w-full text-sm font-medium mb-1">Update Status</Label>
              <Select 
                disabled={updatingStatus} 
                onValueChange={(value) => handleUpdateStatus(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(!caseData.assigned_officer_id || caseData.assigned_officer_id !== "officer123") && (
                <Button 
                  className="w-full" 
                  onClick={handleAssignToMe}
                  disabled={updatingStatus}
                >
                  {updatingStatus && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Assign to Me
                </Button>
              )}
              
              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
              
              <Button variant="outline" className="w-full">
                <Clock className="mr-2 h-4 w-4" />
                Schedule Follow-up
              </Button>
              
              <Button variant="outline" className="w-full">
                <UserCheck className="mr-2 h-4 w-4" />
                Add Witness
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evidence</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">No evidence files uploaded yet.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Upload Evidence
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Main Cases list component
const CasesList = () => {
  const [cases, setCases] = useState<any[]>([]);
  const [filteredCases, setFilteredCases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  useEffect(() => {
    // In production, this would fetch from Convex
    const timer = setTimeout(() => {
      setCases(mockCases);
      setFilteredCases(mockCases);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // Filter cases based on tab and search term
    let filtered = [...cases];
    
    // Apply tab filter
    if (activeTab === "open") {
      filtered = filtered.filter(c => c.status === "open");
    } else if (activeTab === "in-progress") {
      filtered = filtered.filter(c => c.status === "in-progress");
    } else if (activeTab === "closed") {
      filtered = filtered.filter(c => c.status === "closed" || c.status === "archived");
    } else if (activeTab === "my-cases") {
      // In production, this would filter by current officer ID
      filtered = filtered.filter(c => c.assigned_officer_id === "officer123");
    } else if (activeTab === "high-priority") {
      filtered = filtered.filter(c => c.priority === "high");
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(term) || 
        c.ob_number.toLowerCase().includes(term) ||
        c.incident_type.toLowerCase().includes(term) ||
        c.location.toLowerCase().includes(term) ||
        (c.description && c.description.toLowerCase().includes(term))
      );
    }
    
    setFilteredCases(filtered);
  }, [cases, activeTab, searchTerm]);
  
  const handleCaseClick = (caseId: string) => {
    navigate(`/officer-dashboard/cases/${caseId}`);
  };
  
  const columns = [
    {
      key: "ob_number",
      header: "OB Number",
      cell: (item: any) => <div className="font-medium">{item.ob_number}</div>,
    },
    {
      key: "title",
      header: "Case Title",
      cell: (item: any) => item.title,
    },
    {
      key: "incident_type",
      header: "Type",
      cell: (item: any) => item.incident_type,
    },
    {
      key: "status",
      header: "Status",
      cell: (item: any) => <CaseStatusBadge status={item.status} />,
    },
    {
      key: "priority",
      header: "Priority",
      cell: (item: any) => <CasePriorityBadge priority={item.priority} />,
    },
    {
      key: "date",
      header: "Date",
      cell: (item: any) => new Date(item.created_at).toLocaleDateString(),
    },
    {
      key: "reporter",
      header: "Reporter",
      cell: (item: any) => item.reporter?.name || (item.is_anonymous ? "Anonymous" : "Unknown"),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (item: any) => (
        <Button size="sm" variant="outline" onClick={() => handleCaseClick(item._id)}>
          View Details
        </Button>
      ),
    },
  ];
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading cases...</span>
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Case Management</h1>
        <Button onClick={() => navigate('/report')}>
          <Plus className="mr-2 h-4 w-4" /> New Case
        </Button>
      </div>
      
      <div className="flex items-center justify-between space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search cases by title, OB number, or location..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" /> Advanced Filter
        </Button>
        <Button variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="all">All Cases</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
          <TabsTrigger value="my-cases">My Cases</TabsTrigger>
          <TabsTrigger value="high-priority">High Priority</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="pt-4">
          <DataTable 
            data={filteredCases} 
            columns={columns} 
          />
          
          {filteredCases.length === 0 && (
            <div className="text-center p-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No cases found</h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? "Try adjusting your search or filters" 
                  : "There are no cases matching the selected filter"}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Main Cases Page component
export default function CasesPage() {
  return (
    <Routes>
      <Route index element={<CasesList />} />
      <Route path=":caseId" element={<CaseDetails />} />
    </Routes>
  );
}
