import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ReportCrimeForm from "./ReportCrimeForm";
import { useUser } from "@clerk/clerk-react";
import { mockPoliceStations } from "@/lib/supabase";

export function ReportCrimeDialog() {
  const { user, isSignedIn } = useUser();
  const [open, setOpen] = React.useState(false);

  const handleSubmit = async (data: any) => {
    try {
      // In development, we'll just log the data
      console.log("Report data:", data);
      
      // In production, this would be sent to Supabase
      // const { data: report, error } = await supabase
      //   .from('reports')
      //   .insert([
      //     {
      //       ...data,
      //       user_id: user?.id,
      //       status: 'pending'
      //     }
      //   ])
      //   .select()

      setOpen(false);
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="default" 
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Report Crime
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] w-[800px] max-h-[90vh] p-0 gap-0">
        <ReportCrimeForm 
          onSubmit={handleSubmit}
          isAnonymousDefault={!isSignedIn}
        />
      </DialogContent>
    </Dialog>
  );
}
