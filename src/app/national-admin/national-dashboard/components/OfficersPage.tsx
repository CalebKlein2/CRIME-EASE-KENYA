import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/tables/DataTable";
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Eye, 
  Plus,
  Building,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock officers data
const officersData = [
  {
    id: "1",
    name: "John Doe",
    rank: "Chief Inspector",
    badge: "KP-0015",
    station: "Central Police Station",
    region: "Nairobi",
    status: "Active",
    cases: 12,
    specialization: "Homicide",
    email: "john.doe@police.gov.ke",
    phone: "+254 712 345 678"
  },
  {
    id: "2",
    name: "Jane Smith",
    rank: "Inspector",
    badge: "KP-0023",
    station: "Mombasa Police Station",
    region: "Coast",
    status: "Active",
    cases: 8,
    specialization: "Cyber Crime",
    email: "jane.smith@police.gov.ke",
    phone: "+254 723 456 789"
  },
  {
    id: "3",
    name: "Samuel Odhiambo",
    rank: "Sergeant",
    badge: "KP-0047",
    station: "Kisumu Central",
    region: "Nyanza",
    status: "Active",
    cases: 10,
    specialization: "Traffic",
    email: "samuel.odhiambo@police.gov.ke",
    phone: "+254 734 567 890"
  },
  {
    id: "4",
    name: "Sarah Kimani",
    rank: "Inspector",
    badge: "KP-0032",
    station: "Eldoret Police Station",
    region: "Rift Valley",
    status: "Active",
    cases: 6,
    specialization: "Domestic Violence",
    email: "sarah.kimani@police.gov.ke",
    phone: "+254 745 678 901"
  },
  {
    id: "5",
    name: "James Mwangi",
    rank: "Sergeant",
    badge: "KP-0056",
    station: "Nakuru Central",
    region: "Rift Valley",
    status: "On Leave",
    cases: 7,
    specialization: "Narcotics",
    email: "james.mwangi@police.gov.ke",
    phone: "+254 756 789 012"
  },
  {
    id: "6",
    name: "Grace Wanjiku",
    rank: "Constable",
    badge: "KP-0098",
    station: "Nyeri Police Station",
    region: "Central",
    status: "Active",
    cases: 5,
    specialization: "General Duties",
    email: "grace.wanjiku@police.gov.ke",
    phone: "+254 767 890 123"
  },
  {
    id: "7",
    name: "Ahmed Hassan",
    rank: "Inspector",
    badge: "KP-0029",
    station: "Garissa Police Station",
    region: "North Eastern",
    status: "Active",
    cases: 9,
    specialization: "Counter-Terrorism",
    email: "ahmed.hassan@police.gov.ke",
    phone: "+254 778 901 234"
  },
  {
    id: "8",
    name: "Mercy Auma",
    rank: "Constable",
    badge: "KP-0112",
    station: "Kakamega Police Station",
    region: "Western",
    status: "Training",
    cases: 3,
    specialization: "General Duties",
    email: "mercy.auma@police.gov.ke",
    phone: "+254 789 012 345"
  },
];

// Mock regions and specializations data
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

const specializations = [
  "All Specializations",
  "Homicide",
  "Cyber Crime",
  "Traffic",
  "Narcotics",
  "Counter-Terrorism",
  "Domestic Violence",
  "General Duties",
  "Forensics"
];

const ranks = [
  "All Ranks",
  "Chief Inspector",
  "Inspector",
  "Sergeant",
  "Corporal",
  "Constable"
];

export default function OfficersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedRank, setSelectedRank] = useState("All Ranks");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedSpecialization, setSelectedSpecialization] = useState("All Specializations");
  
  // Filter officers based on search query and filters
  const filteredOfficers = officersData.filter(officer => {
    const matchesSearch = officer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          officer.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          officer.station.toLowerCase().includes(searchQuery.toLowerCase());
                         
    const matchesRegion = selectedRegion === "All Regions" || officer.region === selectedRegion;
    const matchesRank = selectedRank === "All Ranks" || officer.rank === selectedRank;
    const matchesStatus = selectedStatus === "All" || officer.status === selectedStatus;
    const matchesSpecialization = selectedSpecialization === "All Specializations" || officer.specialization === selectedSpecialization;
    
    return matchesSearch && matchesRegion && matchesRank && matchesStatus && matchesSpecialization;
  });
  
  const handleViewOfficer = (id: string) => {
    console.log("View officer details:", id);
    // Navigate to officer details page
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Police Officers</h2>
          <p className="text-gray-500">Manage police officers across all stations</p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Officer
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>All Police Officers</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search officers by name, badge number or station..."
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
              
              <Select value={selectedRank} onValueChange={setSelectedRank}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select Rank" />
                </SelectTrigger>
                <SelectContent>
                  {ranks.map(rank => (
                    <SelectItem key={rank} value={rank}>
                      {rank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                  <SelectItem value="Training">Training</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <DataTable
            data={filteredOfficers}
            columns={[
              {
                key: "name",
                header: "Officer",
                cell: (row) => (
                  <div>
                    <div className="font-medium">{row.name}</div>
                    <p className="text-sm text-gray-500">Badge: {row.badge}</p>
                  </div>
                ),
              },
              {
                key: "rank",
                header: () => (
                  <div className="flex items-center">
                    Rank
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                ),
                cell: (row) => row.rank,
              },
              {
                key: "station",
                header: "Station",
                cell: (row) => (
                  <div>
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-1 text-gray-500" />
                      {row.station}
                    </div>
                    <p className="text-xs text-gray-500">{row.region}</p>
                  </div>
                ),
              },
              {
                key: "status",
                header: "Status",
                cell: (row) => (
                  <Badge
                    className={
                      row.status === "Active" ? "bg-green-100 text-green-800 hover:bg-green-100" :
                      row.status === "On Leave" ? "bg-blue-100 text-blue-800 hover:bg-blue-100" :
                      row.status === "Training" ? "bg-purple-100 text-purple-800 hover:bg-purple-100" :
                      "bg-red-100 text-red-800 hover:bg-red-100"
                    }
                  >
                    {row.status}
                  </Badge>
                ),
              },
              {
                key: "cases",
                header: () => (
                  <div className="flex items-center">
                    Active Cases
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                ),
                cell: (row) => row.cases,
              },
              {
                key: "specialization",
                header: "Specialization",
                cell: (row) => (
                  <div className="flex items-center">
                    <UserCheck className="h-4 w-4 mr-1 text-gray-500" />
                    {row.specialization}
                  </div>
                ),
              },
              {
                key: "contact",
                header: "Contact",
                cell: (row) => (
                  <div className="text-sm">
                    <div className="flex items-center">
                      <Mail className="h-3 w-3 mr-1 text-gray-500" />
                      {row.email}
                    </div>
                    <div className="flex items-center mt-1">
                      <Phone className="h-3 w-3 mr-1 text-gray-500" />
                      {row.phone}
                    </div>
                  </div>
                ),
              },
              {
                key: "actions",
                header: "",
                cell: (row) => (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewOfficer(row.id)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                ),
              },
            ]}
          />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Officer Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="region">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="region">By Region</TabsTrigger>
                <TabsTrigger value="rank">By Rank</TabsTrigger>
                <TabsTrigger value="specialization">By Specialization</TabsTrigger>
              </TabsList>
              
              <TabsContent value="region" className="mt-4">
                <div className="h-[300px]">
                  {/* Here would be a chart component showing officer distribution by region */}
                  <div className="flex items-center justify-center h-full bg-gray-50 rounded-md border">
                    <p className="text-gray-500">Officer Distribution by Region Chart</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="rank" className="mt-4">
                <div className="h-[300px]">
                  {/* Here would be a chart component showing officer distribution by rank */}
                  <div className="flex items-center justify-center h-full bg-gray-50 rounded-md border">
                    <p className="text-gray-500">Officer Distribution by Rank Chart</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="specialization" className="mt-4">
                <div className="h-[300px]">
                  {/* Here would be a chart component showing officer distribution by specialization */}
                  <div className="flex items-center justify-center h-full bg-gray-50 rounded-md border">
                    <p className="text-gray-500">Officer Distribution by Specialization Chart</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Officer Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="clearance">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="clearance">Case Clearance</TabsTrigger>
                <TabsTrigger value="response">Response Time</TabsTrigger>
              </TabsList>
              
              <TabsContent value="clearance" className="mt-4">
                <div className="h-[300px]">
                  {/* Here would be a chart component showing officer case clearance rates */}
                  <div className="flex items-center justify-center h-full bg-gray-50 rounded-md border">
                    <p className="text-gray-500">Officer Case Clearance Chart</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="response" className="mt-4">
                <div className="h-[300px]">
                  {/* Here would be a chart component showing officer response times */}
                  <div className="flex items-center justify-center h-full bg-gray-50 rounded-md border">
                    <p className="text-gray-500">Officer Response Time Chart</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
