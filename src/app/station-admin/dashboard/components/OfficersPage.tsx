import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { getAllOfficers, getOfficerById, Officer } from "@/lib/officerService";
import { useAuth } from "@/contexts/AuthContext";
import OfficerDetailsDialog from "./OfficerDetailsDialog";
import AddOfficerDialog from "./AddOfficerDialog";
import { toast } from "@/components/ui/use-toast";

export default function StationOfficersPage() {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { user } = useAuth();
  
  const fetchOfficers = async () => {
    try {
      setLoading(true);
      // Pass station_id if available from user context
      const stationId = user?.station_id;
      const officersData = await getAllOfficers(stationId);
      setOfficers(officersData);
    } catch (error) {
      console.error('Error fetching officers:', error);
      toast({
        title: "Error fetching officers",
        description: "Could not retrieve officer data. Using fallback data instead.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch officers when component mounts
    fetchOfficers();
  }, [user]);
  
  const handleViewOfficer = async (id: string) => {
    try {
      const officer = await getOfficerById(id);
      if (officer) {
        setSelectedOfficer(officer);
        setDialogOpen(true);
      } else {
        toast({
          title: "Officer not found",
          description: "Could not retrieve officer details.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error fetching officer details:", error);
      toast({
        title: "Error",
        description: "Could not retrieve officer details.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Station Officers</h2>
        <Button onClick={() => setAddDialogOpen(true)}>Add New Officer</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>
            {loading ? 'Loading officers...' : `All Officers (${officers.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <DataTable
              data={officers}
              columns={[
                {
                  key: "name",
                  header: "Name",
                  cell: (item) => <span className="font-medium">{item.name}</span>,
                },
                {
                  key: "badge",
                  header: "Badge Number",
                  cell: (item) => item.badge,
                },
                {
                  key: "rank",
                  header: "Rank",
                  cell: (item) => item.rank,
                },
                {
                  key: "status",
                  header: "Status",
                  cell: (item) => (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === "On duty" ? "bg-green-100 text-green-800" :
                        item.status === "Off duty" ? "bg-gray-100 text-gray-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  ),
                },
                {
                  key: "cases",
                  header: "Active Cases",
                  cell: (item) => item.cases,
                },
                {
                  key: "phone",
                  header: "Contact",
                  cell: (item) => item.phone,
                },
                {
                  key: "actions",
                  header: "Actions",
                  cell: (item) => (
                    <Button size="sm" variant="outline" onClick={() => handleViewOfficer(item.id)}>
                      View Details
                    </Button>
                  ),
                },
              ]}
            />
          )}
        </CardContent>
      </Card>

      {/* Officer Details Dialog */}
      <OfficerDetailsDialog 
        officer={selectedOfficer} 
        isOpen={dialogOpen} 
        onOpenChange={setDialogOpen} 
      />
      
      {/* Add Officer Dialog */}
      <AddOfficerDialog
        isOpen={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSuccess={fetchOfficers}
      />
    </div>
  );
}
