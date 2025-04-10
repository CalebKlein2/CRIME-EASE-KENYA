import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { MapPin, Upload, ChevronLeft, ChevronRight } from "lucide-react";
import { LocationPicker } from "./maps/LocationPicker";

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

interface ReportCrimeFormProps {
  onSubmit?: (data: any) => void;
  initialStep?: number;
  isAnonymousDefault?: boolean;
}

const ReportCrimeForm = ({
  onSubmit = () => {},
  initialStep = 1,
  isAnonymousDefault = false,
}: ReportCrimeFormProps) => {
  // Add loading state
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(initialStep);
  const [isAnonymous, setIsAnonymous] = React.useState(isAnonymousDefault);
  const [location, setLocation] = React.useState<Location | null>(null);
  const [formData, setFormData] = React.useState({
    incidentType: "",
    description: "",
    date: "",
    address: "",
    city: "",
    postalCode: "",
    name: "",
    contact: ""
  });

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleLocationSelect = (loc: Location) => {
    setLocation(loc);
    if (loc.address) {
      const addressParts = loc.address.split(',');
      setFormData(prev => ({
        ...prev,
        address: addressParts[0] || '',
        city: addressParts[1]?.trim() || ''
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Make sure we have a location object even if it's empty
      const locationData = location ? {
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address || ""
      } : { 
        latitude: 0, 
        longitude: 0, 
        address: "" 
      };
      
      // Prepare the formatted data for submission
      const dataToSubmit = {
        ...formData,
        isAnonymous,
        location: locationData
      };
      
      console.log("Submitting properly formatted data:", dataToSubmit);
      
      // Call the parent's onSubmit handler with the form data
      await onSubmit(dataToSubmit);
      
      // Reset the form after successful submission
      setFormData({
        incidentType: "",
        description: "",
        date: "",
        address: "",
        city: "",
        postalCode: "",
        name: "",
        contact: ""
      });
      setLocation(null);
      setCurrentStep(1);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-[90vw] md:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col bg-white">
      <div className="p-6 flex-shrink-0">
        <h2 className="text-2xl font-semibold mb-2">Report a Crime</h2>
        <div className="flex justify-between mb-8">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 1 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              1
            </div>
            <span className="text-sm">Basic Info</span>
          </div>
          <div className="h-[2px] flex-1 bg-gray-200 mx-4 mt-4" />
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 2 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              2
            </div>
            <span className="text-sm">Location</span>
          </div>
          <div className="h-[2px] flex-1 bg-gray-200 mx-4 mt-4" />
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 3 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              3
            </div>
            <span className="text-sm">Evidence</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6">
        <div className="space-y-4 pb-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="incidentType">Type of Incident</Label>
                <Input
                  id="incidentType"
                  placeholder="e.g., Theft, Vandalism, Assault"
                  className="mt-1"
                  value={formData.incidentType}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Please provide detailed information about the incident"
                  className="mt-1"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="date">Date of Incident</Label>
                <Input 
                  id="date" 
                  type="date" 
                  className="mt-1"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="h-[300px] md:h-[400px]">
                <LocationPicker 
                  onLocationSelect={handleLocationSelect}
                  className="w-full h-full"
                />
              </div>
              <div>
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  placeholder="Enter the location of the incident"
                  className="mt-1"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    className="mt-1"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input 
                    id="postalCode" 
                    className="mt-1"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Your Name (Optional)</Label>
                <Input
                  id="name"
                  placeholder="Your Name"
                  className="mt-1"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="contact">Contact Information (Optional)</Label>
                <Input
                  id="contact"
                  placeholder="Email or Phone Number"
                  className="mt-1"
                  value={formData.contact}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="isAnonymous" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                <Label htmlFor="isAnonymous">Report Anonymously</Label>
              </div>
            </div>
          )}
        </div>
      </form>

      <div className="flex justify-between p-6 flex-shrink-0">
        <Button variant="secondary" onClick={handleBack} disabled={currentStep === 1}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        {currentStep < 3 ? (
          <Button onClick={handleNext}>
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className={isSubmitting ? "opacity-70 cursor-not-allowed" : ""}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ReportCrimeForm;
