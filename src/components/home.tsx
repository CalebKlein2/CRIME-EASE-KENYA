// @ts-nocheck
import React, { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import CaseOverview from "./CaseOverview";
import ReportCrimeForm from "./ReportCrimeForm";
import MessagingInterface from "./MessagingInterface";
import { Dialog, DialogContent } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./ui/use-toast";
import { Toaster } from "./ui/toaster";
import { crimeReportService, CrimeReportFormData } from "../lib/supabaseClient";

const Home = () => {
  const { user, isSignedIn } = useUser();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showReportForm, setShowReportForm] = useState(false);
  const [activeTab, setActiveTab] = useState("cases");

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleCaseClick = (caseId: string) => {
    // Handle case click
    console.log("Case clicked:", caseId);
  };

  const handleReportSubmit = async (data: any) => {
    console.log("Submitting report:", data);

    // Force toast to appear by creating a new toast directly
    const showToastMessage = (title: string, message: string, isError = false) => {
      console.log(`Showing toast: ${title} - ${message}`);
      toast({
        title: title,
        description: message,
        variant: isError ? "destructive" : "default",
        duration: isError ? 7000 : 5000,
      });
    };

    if (!isSignedIn && !data.isAnonymous) {
      showToastMessage(
        "Not authenticated",
        "Please sign in to submit a report, or submit anonymously.", 
        true
      );
      return;
    }

    try {
      // Make sure the data is properly formatted
      const formattedData = {
        ...data,
        isAnonymous: Boolean(data.isAnonymous),
        // Make sure location has the correct structure
        location: data.location || { latitude: 0, longitude: 0, address: "" }
      };
      
      // Add user ID only if authenticated and not anonymous
      if (isSignedIn && !data.isAnonymous && user?.id) {
        formattedData.userId = user.id;
      }
      
      console.log("Sending report to Supabase:", formattedData);
      
      // Use Supabase to create the crime report
      const reportId = await crimeReportService.createReport(formattedData);
      
      console.log("Report saved with ID:", reportId);
      
      // Explicitly show success toast
      showToastMessage(
        "Success!", 
        "Your crime report has been successfully submitted. Thank you for helping keep our community safe."
      );
      
      // Give the toast time to appear before closing dialog
      setTimeout(() => {
        setShowReportForm(false);
      }, 1000);
      
      return reportId;
    } catch (error: any) {
      console.error("Error submitting report:", error);
      
      // Explicitly show error toast
      showToastMessage(
        "Error submitting report",
        error.message || "An error occurred while submitting your report. Please try again.",
        true
      );
      
      // Re-throw the error so the form component can handle it
      throw error;
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
        
        {/* Add Toaster component to show toast notifications */}
        <Toaster />
      </main>
    </div>
  );
};

export default Home;
