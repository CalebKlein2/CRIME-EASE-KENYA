import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { supabase } from "@/lib/supabase";
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

export default function CaseManagement() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCase, setSelectedCase] = useState(null);

  useEffect(() => {
    loadCases();
  }, [filter]);

  const loadCases = async () => {
    try {
      let query = supabase.from("cases").select(`
          *,
          station:station_id(name),
          team:assigned_team_id(name)
        `);

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setCases(data);
    } catch (error) {
      console.error("Error loading cases:", error);
    } finally {
      setLoading(false);
    }
  };

  const assignTeam = async (caseId: string, teamId: string) => {
    try {
      const { error } = await supabase
        .from("cases")
        .update({ assigned_team_id: teamId })
        .eq("id", caseId);

      if (error) throw error;
      loadCases();
    } catch (error) {
      console.error("Error assigning team:", error);
    }
  };

  const updateStatus = async (caseId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("cases")
        .update({ status })
        .eq("id", caseId);

      if (error) throw error;
      loadCases();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

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
            cases
              .filter(
                (c) =>
                  c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  c.ob_number.toLowerCase().includes(searchTerm.toLowerCase()),
              )
              .map((caseItem) => (
                <div
                  key={caseItem.id}
                  onClick={() => setSelectedCase(caseItem)}
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
            location={selectedCase?.location_details}
            markers={cases.map((c) => ({
              position: c.location_details,
              title: c.title,
              description: c.description,
            }))}
          />
        </Card>
      </div>
    </div>
  );
}
