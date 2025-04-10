import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import ReportCrimeForm from "@/components/ReportCrimeForm";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { crimeReportService, CrimeReportFormData } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";

const CitizenReportPage = () => {
  const { user, isSignedIn } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    console.log("Citizen dashboard - submitting report with Supabase:", data);
    setIsSubmitting(true);

    try {
      // Format the data for Supabase
      const formData: CrimeReportFormData = {
        ...data,
        isAnonymous: Boolean(data.isAnonymous),
        // Add user ID only if authenticated and not anonymous
        // Store Clerk user ID as a string to avoid UUID validation issues
        userId: isSignedIn && !data.isAnonymous && user?.id ? user.id.toString() : undefined,
        // Ensure location has the correct structure
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
        address: data.address || "",
      };
      
      console.log("Sending crime report to Supabase:", formData);
      
      // Use the Supabase service to create the report
      const reportId = await crimeReportService.createReport(formData);
      console.log("Report saved with ID:", reportId);
      
      // Show success toast notification
      toast({
        title: "Success!",
        description: "Your crime report has been successfully submitted. Thank you for helping keep our community safe.",
        variant: "default",
        duration: 5000,
      });
      
      // Redirect to reports page after successful submission
      setTimeout(() => {
        navigate("/citizen-dashboard/reports/");
      }, 2000);
      
      return reportId;
    } catch (error: any) {
      console.error("Error submitting report:", error);
      
      // Show error toast notification
      toast({
        title: "Error submitting report",
        description: error.message || "An error occurred while submitting your report. Please try again.",
        variant: "destructive", 
        duration: 7000,
      });
      
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Report a Crime</h2>
      <Card>
        <CardContent className="pt-6">
          <ReportCrimeForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
};

export default CitizenReportPage;
