// @ts-nocheck
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import CaseManagement from "./CaseManagement";
import OfficerManagement from "./OfficerManagement";
import TeamManagement from "./TeamManagement";
import StationOverview from "./StationOverview";
import { useAuth } from "@/contexts/AuthContext";

type TabValue = "cases" | "officers" | "teams" | "station";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabValue>("cases");
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Police Station Dashboard
            </h1>
            <p className="text-gray-600">
              {user?.station?.name || "Loading..."}
            </p>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabValue)}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="cases">Cases</TabsTrigger>
            <TabsTrigger value="officers">Officers</TabsTrigger>
            <TabsTrigger value="teams">Investigation Teams</TabsTrigger>
            <TabsTrigger value="station">Station Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="cases" className="space-y-4">
            <CaseManagement />
          </TabsContent>

          <TabsContent value="officers">
            <OfficerManagement />
          </TabsContent>

          <TabsContent value="teams">
            <TeamManagement />
          </TabsContent>

          <TabsContent value="station">
            <StationOverview />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

