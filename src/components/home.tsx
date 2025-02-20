import React, { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import CaseOverview from "./CaseOverview";
import ReportCrimeForm from "./ReportCrimeForm";
import MessagingInterface from "./MessagingInterface";
import { Dialog, DialogContent } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showReportForm, setShowReportForm] = useState(false);
  const [activeTab, setActiveTab] = useState("cases");

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleCaseClick = (caseId: string) => {
    // Handle case click
    console.log("Case clicked:", caseId);
  };

  const handleReportSubmit = async (data: any) => {
    try {
      // Handle report submission
      console.log("Report submitted:", data);
      setShowReportForm(false);
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader
        userName={user?.profile?.full_name || "User"}
        userAvatar={
          user?.profile?.avatar_url ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`
        }
        onLogout={handleLogout}
      />

      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={() => setShowReportForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Report Crime
          </button>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="cases">Cases</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="cases" className="space-y-4">
            <CaseOverview onCaseClick={handleCaseClick} />
          </TabsContent>

          <TabsContent value="messages">
            <div className="flex justify-center">
              <MessagingInterface />
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={showReportForm} onOpenChange={setShowReportForm}>
          <DialogContent className="max-w-[800px] p-0">
            <ReportCrimeForm onSubmit={handleReportSubmit} />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Home;
