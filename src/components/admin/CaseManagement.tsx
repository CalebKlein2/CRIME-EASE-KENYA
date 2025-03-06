import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import CaseCard from "../CaseCard";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { MapContainer } from "./MapContainer";

interface Case {
  id: string;
  ob_number: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "closed";
  priority: "low" | "medium" | "high";
  location: string;
  location_details: {
    lat: number;
    lng: number;
  };
  created_at: string;
  station: {
    name: string;
  };
  team?: {
    name: string;
  };
}

export default function CaseManagement() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  useEffect(() => {
    // Load mock data
    const mockCases: Case[] = [
      {
        id: "1",
        ob_number: "OB001/2025",
        title: "Theft at Central Market",
        description: "Report of stolen goods from a market stall",
        status: "open",
        priority: "medium",
        location: "Central Market, Nairobi",
        location_details: {
          lat: -1.2864,
          lng: 36.8172
        },
        created_at: "2025-03-06T10:00:00Z",
        station: {
          name: "Central Police Station"
        }
      },
      {
        id: "2",
        ob_number: "OB002/2025",
        title: "Traffic Incident on Moi Avenue",
        description: "Multiple vehicle collision",
        status: "in-progress",
        priority: "high",
        location: "Moi Avenue, CBD",
        location_details: {
          lat: -1.2833,
          lng: 36.8252
        },
        created_at: "2025-03-06T09:30:00Z",
        station: {
          name: "Central Police Station"
        },
        team: {
          name: "Traffic Response Team"
        }
      },
      {
        id: "3",
        ob_number: "OB003/2025",
        title: "Vandalism Report",
        description: "Property damage at local business",
        status: "closed",
        priority: "low",
        location: "Kimathi Street",
        location_details: {
          lat: -1.2819,
          lng: 36.8243
        },
        created_at: "2025-03-05T15:20:00Z",
        station: {
          name: "Central Police Station"
        }
      }
    ];

    setCases(mockCases);
    setLoading(false);
  }, []);

  const assignTeam = (caseId: string, teamId: string) => {
    setCases(cases.map(c => 
      c.id === caseId 
        ? { ...c, team: { name: "Assigned Team " + teamId } }
        : c
    ));
  };

  const updateStatus = (caseId: string, status: Case["status"]) => {
    setCases(cases.map(c => 
      c.id === caseId 
        ? { ...c, status }
        : c
    ));
  };

  const filteredCases = cases.filter(c => 
    filter === "all" || c.status === filter
  ).filter(c =>
    searchTerm === "" ||
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.ob_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <div className="mb-4 flex gap-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cases</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Search cases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[300px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {loading ? (
            <p>Loading cases...</p>
          ) : (
            filteredCases.map((caseItem) => (
              <div
                key={caseItem.id}
                onClick={() => setSelectedCase(caseItem)}
                className="cursor-pointer"
              >
                <CaseCard
                  caseNumber={caseItem.ob_number}
                  status={caseItem.status}
                  title={caseItem.title}
                  description={caseItem.description}
                  location={caseItem.location}
                  date={new Date(caseItem.created_at).toLocaleDateString()}
                  priority={caseItem.priority}
                />
              </div>
            ))
          )}
        </div>
      </div>

      <div className="col-span-1">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Case Location</h3>
          <MapContainer
            center={selectedCase?.location_details || { lat: -1.2921, lng: 36.8219 }}
            markers={filteredCases.map((c) => ({
              lat: c.location_details.lat,
              lng: c.location_details.lng
            }))}
          />
        </Card>
      </div>
    </div>
  );
}
