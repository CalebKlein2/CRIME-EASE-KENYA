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

interface Officer {
  id: string;
  user_id: string;
  badge_number: string;
  rank: string;
  status: "active" | "inactive" | "suspended";
  full_name: string;
}

export default function OfficerManagement() {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadOfficers();
  }, []);

  const loadOfficers = async () => {
    try {
      const { data, error } = await supabase
        .from("police_officers")
        .select(
          `
          *,
          user:user_id(email, full_name)
        `,
        )
        .eq("station_id", user?.station_id);

      if (error) throw error;
      setOfficers(data);
    } catch (error) {
      console.error("Error loading officers:", error);
    } finally {
      setLoading(false);
    }
  };

  const addOfficer = async (formData: FormData) => {
    try {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const fullName = formData.get("fullName") as string;
      const badgeNumber = formData.get("badgeNumber") as string;
      const rank = formData.get("rank") as string;

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: "officer",
          },
        },
      });

      if (authError) throw authError;

      // Create officer record
      const { error: officerError } = await supabase
        .from("police_officers")
        .insert([
          {
            user_id: authData.user!.id,
            station_id: user?.station_id,
            badge_number: badgeNumber,
            rank,
            status: "active",
          },
        ]);

      if (officerError) throw officerError;

      loadOfficers();
      setShowAddDialog(false);
    } catch (error) {
      console.error("Error adding officer:", error);
    }
  };

  const updateOfficerStatus = async (officerId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("police_officers")
        .update({ status })
        .eq("id", officerId);

      if (error) throw error;
      loadOfficers();
    } catch (error) {
      console.error("Error updating officer status:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Officers</h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>Add Officer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Officer</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addOfficer(new FormData(e.currentTarget));
              }}
            >
              <div className="space-y-4">
                <Input name="fullName" placeholder="Full Name" required />
                <Input name="email" type="email" placeholder="Email" required />
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                />
                <Input name="badgeNumber" placeholder="Badge Number" required />
                <Select name="rank" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Rank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="constable">Constable</SelectItem>
                    <SelectItem value="corporal">Corporal</SelectItem>
                    <SelectItem value="sergeant">Sergeant</SelectItem>
                    <SelectItem value="inspector">Inspector</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit">Add Officer</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {officers.map((officer) => (
          <Card key={officer.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{officer.user.full_name}</h3>
                <p className="text-sm text-gray-600">{officer.badge_number}</p>
                <p className="text-sm text-gray-600 capitalize">
                  {officer.rank}
                </p>
              </div>
              <Select
                value={officer.status}
                onValueChange={(value) =>
                  updateOfficerStatus(officer.id, value)
                }
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
