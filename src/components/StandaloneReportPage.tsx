import React, { useState } from "react";
import { SignedIn } from "@clerk/clerk-react";
import ReportCrimeForm from "./ReportCrimeForm";
import { useToast } from "./ui/use-toast";
import { Toaster } from "./ui/toaster";
import { useNavigate } from "react-router-dom";
import { crimeReportService, CrimeReportFormData } from "../lib/supabaseClient";

const StandaloneReportPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    console.log("Standalone report page - submitting report with Supabase:", data);
    setIsSubmitting(true);

    try {
      // Format the data for Supabase
      const formData: CrimeReportFormData = {
        ...data,
        isAnonymous: Boolean(data.isAnonymous),
        // Ensure location has the correct structure
        location: data.location || { latitude: 0, longitude: 0, address: "" }
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
      
      // Reset form and redirect after successful submission
      setTimeout(() => {
        navigate("/");
      }, 3000);
      
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
    <SignedIn>
      <div className="container mx-auto py-8 flex justify-center">
        <div className="w-full max-w-[800px]">
          <h1 className="text-3xl font-bold text-center mb-6">Report a Crime</h1>
          <p className="text-gray-600 mb-8 text-center">
            Help keep our community safe by reporting incidents. All information is kept confidential.
          </p>
          <ReportCrimeForm onSubmit={handleSubmit} />
          <Toaster />
        </div>
      </div>
    </SignedIn>
  );
};

export default StandaloneReportPage;
