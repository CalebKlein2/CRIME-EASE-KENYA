import { useState } from "react";
import { Button } from "./ui/button";
import { Siren } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

export default function EmergencySOSButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSOS = async () => {
    setIsSending(true);
    try {
      // Get user's location
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        },
      );

      // In a real app, you would:
      // 1. Send SMS/call to emergency contacts
      // 2. Notify nearest police station
      // 3. Create an emergency case

      console.log("Emergency signal sent with location:", {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });

      // Show success message
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error sending SOS:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        size="lg"
        className="gap-2"
        onClick={handleSOS}
        disabled={isSending}
      >
        <Siren className="h-5 w-5" />
        {isSending ? "Sending SOS..." : "Emergency SOS"}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Emergency Signal Sent</DialogTitle>
            <DialogDescription>
              Help is on the way. Stay calm and remain in your current location
              if safe. Emergency services have been notified and will arrive
              shortly.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
