import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import ReportCrimeForm from "@/components/ReportCrimeForm";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { crimeReportService, CrimeReportFormData } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ArrowLeft, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CitizenReportPage = () => {
  const { user, isSignedIn } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);

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
      
      // Set submission success state instead of redirecting
      setSubmissionSuccess(true);
      setSubmittedReportId(reportId);
      
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
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link to="/citizen-dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Report a Crime</h1>
      </div>
      
      {submissionSuccess ? (
        <Card className="border-green-100 bg-green-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center">
                <Check className="text-green-600 w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-green-800">Report Submitted Successfully!</CardTitle>
                <CardDescription className="text-green-700">
                  Your report has been recorded and will be reviewed by our team.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="my-4 p-4 border border-green-200 rounded-md bg-white">
              <p className="text-sm font-medium text-gray-600">Report Reference Number:</p>
              <p className="text-lg font-mono font-bold">{submittedReportId?.substring(0, 8) || "Unknown"}</p>
              <p className="mt-4 text-sm text-gray-600">Keep this reference number for tracking the status of your report.</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between gap-4 flex-wrap">
            <Button variant="outline" onClick={() => {
              setSubmissionSuccess(false);
              setSubmittedReportId(null);
            }}>
              Submit Another Report
            </Button>
            <Button asChild>
              <Link to="/citizen-dashboard/reports">
                <FileText className="mr-2 h-4 w-4" />
                View My Reports
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Report Information</CardTitle>
            <CardDescription>
              Please provide as much detail as possible about the incident
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReportCrimeForm onSubmit={handleSubmit} />
          </CardContent>
        </Card>
      )}
      <Toaster />
    </div>
  );
};

export default CitizenReportPage;
