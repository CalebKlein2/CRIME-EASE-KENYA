// @ts-nocheck
import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useAuth } from "@/contexts/AuthContext";

interface Officer {
  id: string;
  full_name: string;
  badge_number: string;
  rank: string;
  status: "active" | "inactive";
}

interface Team {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  members: Officer[];
}

interface TeamMember {
  officer_id: string;
  role: string;
  officer: {
    user: {
      full_name: string;
    };
  };
}

interface Team {
  id: string;
  name: string;
  lead_officer_id: string;
  lead_officer: {
    user: {
      full_name: string;
    };
  };
  status: "active" | "inactive";
  members: TeamMember[];
}

export default function TeamManagement() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Load mock data
    const mockOfficers: Officer[] = [
      {
        id: "1",
        full_name: "John Doe",
        badge_number: "KPS001",
        rank: "Sergeant",
        status: "active"
      },
      {
        id: "2",
        full_name: "Jane Smith",
        badge_number: "KPS002",
        rank: "Inspector",
        status: "active"
      },
      {
        id: "3",
        full_name: "Mike Johnson",
        badge_number: "KPS003",
        rank: "Corporal",
        status: "active"
      }
    ];

    const mockTeams: Team[] = [
      {
        id: "1",
        name: "Rapid Response Team",
        description: "Emergency response unit for high-priority cases",
        status: "active",
        members: [mockOfficers[0], mockOfficers[1]]
      },
      {
        id: "2",
        name: "Investigation Unit",
        description: "Specialized team for complex investigations",
        status: "active",
        members: [mockOfficers[2]]
      }
    ];

    setOfficers(mockOfficers);
    setTeams(mockTeams);
    setLoading(false);
  }, []);

  const createTeam = async (formData: FormData) => {
    try {
      const name = formData.get("name") as string;
      const leadOfficerId = formData.get("leadOfficer") as string;

      // Create team
      const { data: teamData, error: teamError } = await supabase
        .from("investigation_teams")
        .insert([
          {
            name,
            station_id: user?.station_id,
            lead_officer_id: leadOfficerId,
            status: "active",
          },
        ])
        .select()
        .single();

      if (teamError) throw teamError;

      // Add team members
      const members = selectedMembers.map((officerId) => ({
        team_id: teamData.id,
        officer_id: officerId,
        role: "member",
      }));

      const { error: membersError } = await supabase
        .from("team_members")
        .insert(members);

      if (membersError) throw membersError;

      loadTeams();
      setShowAddDialog(false);
      setSelectedMembers([]);
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  const loadTeams = async () => {
    try {
      const { data, error } = await supabase
        .from("investigation_teams")
        .select(
          `
          *,
          lead_officer:lead_officer_id(user:user_id(full_name)),
          members:team_members(officer_id, role, officer:police_officers(user:user_id(full_name)))
        `,
        )
        .eq("station_id", user?.station_id);

      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      console.error("Error loading teams:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Investigation Teams</h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>Create Team</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Investigation Team</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createTeam(new FormData(e.currentTarget));
              }}
              className="space-y-4"
            >
              <div>
                <Input name="name" placeholder="Team Name" required />
              </div>

              <div>
                <Select name="leadOfficer" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Team Lead" />
                  </SelectTrigger>
                  <SelectContent>
                    {officers.map((officer) => (
                      <SelectItem key={officer.id} value={officer.id}>
                        {officer.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select
                  value={selectedMembers.join(",")}
                  onValueChange={(value) => setSelectedMembers(value.split(",").filter(Boolean))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Team Members" />
                  </SelectTrigger>
                  <SelectContent>
                    {officers.map((officer) => (
                      <SelectItem key={officer.id} value={officer.id}>
                        {officer.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit">Create Team</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teams.map((team) => (
          <Card key={team.id} className="p-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">{team.name}</h3>
                <p className="text-sm text-gray-600">
                  Lead: {team.lead_officer.user.full_name}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Team Members</h4>
                <ul className="space-y-1">
                  {team.members.map((member) => (
                    <li key={member.officer_id} className="text-sm">
                      {member.officer.user.full_name} - {member.role}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" size="sm">
                  Manage Team
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
