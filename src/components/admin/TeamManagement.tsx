import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
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

interface Team {
  id: string;
  name: string;
  lead_officer_id: string;
  status: "active" | "inactive";
  members: Array<{
    officer_id: string;
    role: string;
    officer: {
      user: {
        full_name: string;
      };
    };
  }>;
}

export default function TeamManagement() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadTeams();
    loadOfficers();
  }, []);

  const loadTeams = async () => {
    try {
      const { data, error } = await supabase
        .from("investigation_teams")
        .select(
          `
          *,
          lead_officer:lead_officer_id(user_id(full_name)),
          members:team_members(officer_id, role, officer:police_officers(user:user_id(full_name)))
        `,
        )
        .eq("station_id", user?.station_id);

      if (error) throw error;
      setTeams(data);
    } catch (error) {
      console.error("Error loading teams:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadOfficers = async () => {
    try {
      const { data, error } = await supabase
        .from("police_officers")
        .select(
          `
          *,
          user:user_id(full_name)
        `,
        )
        .eq("station_id", user?.station_id)
        .eq("status", "active");

      if (error) throw error;
      setOfficers(data);
    } catch (error) {
      console.error("Error loading officers:", error);
    }
  };

  const createTeam = async (formData: FormData) => {
    try {
      const name = formData.get("name") as string;
      const leadOfficerId = formData.get("leadOfficer") as string;
      const memberIds = formData.getAll("members") as string[];

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
      const members = memberIds.map((officerId) => ({
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
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

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
            >
              <div className="space-y-4">
                <Input name="name" placeholder="Team Name" required />

                <Select name="leadOfficer" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Team Lead" />
                  </SelectTrigger>
                  <SelectContent>
                    {officers.map((officer) => (
                      <SelectItem key={officer.id} value={officer.id}>
                        {officer.user.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select name="members" multiple required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Team Members" />
                  </SelectTrigger>
                  <SelectContent>
                    {officers.map((officer) => (
                      <SelectItem key={officer.id} value={officer.id}>
                        {officer.user.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button type="submit">Create Team</Button>
              </div>
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
                    <li
                      key={member.officer_id}
                      className="text-sm text-gray-600"
                    >
                      {member.officer.user.full_name} - {member.role}
                    </li>
                  ))}
                </ul>
              </div>

              <Select
                value={team.status}
                onValueChange={async (value) => {
                  await supabase
                    .from("investigation_teams")
                    .update({ status: value })
                    .eq("id", team.id);
                  loadTeams();
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
