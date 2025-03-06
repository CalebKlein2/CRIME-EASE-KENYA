import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface User {
  id: string;
  full_name: string;
  email: string;
  badge_number: string;
  rank: string;
  status: "active" | "inactive";
}

export default function OfficerManagement() {
  const [officers, setOfficers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [badgeNumber, setBadgeNumber] = useState("");
  const [rank, setRank] = useState("");

  useEffect(() => {
    // Load mock data
    setOfficers([
      {
        id: "1",
        full_name: "John Doe",
        email: "john.doe@police.go.ke",
        badge_number: "KPS001",
        rank: "Sergeant",
        status: "active"
      },
      {
        id: "2",
        full_name: "Jane Smith",
        email: "jane.smith@police.go.ke",
        badge_number: "KPS002",
        rank: "Inspector",
        status: "active"
      }
    ]);
    setLoading(false);
  }, []);

  const handleAddOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add mock officer
    const newOfficer: User = {
      id: (officers.length + 1).toString(),
      full_name: fullName,
      email: email,
      badge_number: badgeNumber,
      rank: rank,
      status: "active"
    };

    setOfficers([...officers, newOfficer]);
    
    // Reset form
    setFullName("");
    setEmail("");
    setBadgeNumber("");
    setRank("");
  };

  const handleDeactivateOfficer = async (officerId: string) => {
    // Update mock data
    setOfficers(officers.map(officer => 
      officer.id === officerId 
        ? { ...officer, status: "inactive" }
        : officer
    ));
  };

  if (loading) {
    return <div>Loading officers...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Add New Officer</h3>
        <form onSubmit={handleAddOfficer} className="space-y-4">
          <div>
            <Input
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              placeholder="Badge Number"
              value={badgeNumber}
              onChange={(e) => setBadgeNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              placeholder="Rank"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Add Officer</Button>
        </form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {officers.map((officer) => (
          <Card key={officer.id} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold">{officer.full_name}</h4>
                <p className="text-sm text-gray-500">{officer.email}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                officer.status === "active" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              }`}>
                {officer.status}
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Badge: {officer.badge_number}</p>
              <p>Rank: {officer.rank}</p>
            </div>
            {officer.status === "active" && (
              <div className="mt-4">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeactivateOfficer(officer.id)}
                >
                  Deactivate
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
