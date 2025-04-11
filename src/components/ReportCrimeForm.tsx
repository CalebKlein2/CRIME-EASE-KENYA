// @ts-nocheck
import React, { useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ChevronLeft, ChevronRight, Info, AlertCircle, Check } from "lucide-react";
import { EvidenceUploader, EvidenceFile } from "./evidence/EvidenceUploader";
import { AudioRecorder } from "./evidence/AudioRecorder";
import { caseTypes, getCaseTypeById, getSeverityColor } from "@/data/caseTypes";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface SimpleLocation {
  address?: string;
  city?: string;
  area?: string;
}

interface EvidenceItem {
  type: 'image' | 'video' | 'audio' | 'document';
  file: File;
  url?: string;
  id: string;
  isStatement?: boolean;
}

interface AudioStatement {
  blob: Blob;
  fileName: string;
  url?: string;
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
  const [formData, setFormData] = React.useState({
    caseTypeId: "",
    description: "",
    date: "",
    address: "",
    city: "",
    postalCode: "",
    name: "",
    contact: "",
    statementText: ""
  });
  
  // Store evidence files
  const [evidenceFiles, setEvidenceFiles] = React.useState<EvidenceFile[]>([]);
  
  // Store audio statement
  const [audioStatement, setAudioStatement] = React.useState<AudioStatement | null>(null);
  
  // Selected case type info
  const [selectedCaseType, setSelectedCaseType] = React.useState(caseTypes[0]);
  
  // Update selected case type when caseTypeId changes
  useEffect(() => {
    if (formData.caseTypeId) {
      const caseType = getCaseTypeById(formData.caseTypeId);
      if (caseType) {
        setSelectedCaseType(caseType);
      }
    }
  }, [formData.caseTypeId]);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    
    // Prevent selection of future dates for incident date field
    if (id === 'date') {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
      
      if (selectedDate > today) {
        alert('Future dates cannot be selected for incident date');
        return; // Don't update state with future date
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation to prevent accidental form submission
    if (currentStep !== 3) {
      handleNext();
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create a simple location object from the form data
      const locationData = {
        address: formData.address || "",
        city: formData.city || "",
        area: formData.area || ""
      };
      
      // Collect all media files with their URLs if available
      const mediaFiles = [...evidenceFiles.map(file => ({
        type: file.type,
        name: file.file.name,
        size: file.file.size,
        url: file.url || null,
        // Not marking regular files as statements
        isStatement: false
      }))];
      
      // Add audio statement if exists
      if (audioStatement?.url) {
        mediaFiles.push({
          type: 'audio',
          name: audioStatement.fileName,
          size: audioStatement.blob.size,
          url: audioStatement.url,
          isStatement: true
        });
      }
      
      // Prepare the formatted data for submission
      const dataToSubmit = {
        ...formData,
        incidentType: selectedCaseType.name, // For backward compatibility
        caseTypeId: formData.caseTypeId,
        caseTypeName: selectedCaseType.name,
        isAnonymous,
        location: locationData,
        mediaFiles,
        hasAudioStatement: !!audioStatement
      };
      
      console.log("Submitting properly formatted data:", dataToSubmit);
      
      // Call the parent's onSubmit handler with the form data
      await onSubmit(dataToSubmit);
      
      // Reset the form after successful submission
      setFormData({
        caseTypeId: "",
        description: "",
        date: "",
        address: "",
        city: "",
        postalCode: "",
        name: "",
        contact: "",
        statementText: ""
      });

      setCurrentStep(1);
      setEvidenceFiles([]);
      setAudioStatement(null);
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
              {currentStep > 1 ? <Check className="w-4 h-4" /> : 1}
            </div>
            <span className="text-sm">Case Details</span>
          </div>
          <div className="h-[2px] flex-1 bg-gray-200 mx-4 mt-4" />
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 2 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {currentStep > 2 ? <Check className="w-4 h-4" /> : 2}
            </div>
            <span className="text-sm">Location & Date</span>
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
            <span className="text-sm">Evidence & Contact</span>
          </div>
        </div>
      </div>

      <form id="crime-report-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6">
        <div className="space-y-4 pb-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="caseTypeId">Type of Case</Label>
                <Select
                  value={formData.caseTypeId}
                  onValueChange={(value) => {
                    setFormData(prev => ({
                      ...prev,
                      caseTypeId: value,
                    }));
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select case type" />
                  </SelectTrigger>
                  <SelectContent>
                    {caseTypes.map((caseType) => (
                      <SelectItem key={caseType.id} value={caseType.id}>
                        <div className="flex items-center gap-2">
                          {caseType.name}
                          <Badge className={`ml-1 ${getSeverityColor(caseType.severity)}`}>
                            {caseType.severity}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.caseTypeId && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex gap-2 items-start">
                    <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm">{selectedCaseType.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{selectedCaseType.description}</p>
                      
                      {selectedCaseType.requiredEvidence && selectedCaseType.requiredEvidence.length > 0 && (
                        <div className="mt-2">
                          <h5 className="text-xs font-medium text-gray-700">Recommended Evidence:</h5>
                          <ul className="text-xs text-gray-600 list-disc list-inside mt-1">
                            {selectedCaseType.requiredEvidence.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

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

            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="mb-4">
                <Label htmlFor="date">Date of Incident</Label>
                <Input 
                  id="date" 
                  type="date" 
                  className="mt-1"
                  value={formData.date}
                  onChange={handleInputChange}
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
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="area">Area/Neighborhood</Label>
                  <Input 
                    id="area" 
                    className="mt-1"
                    placeholder="Area or Neighborhood"
                    value={formData.area || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="postalCode">Postal Code (Optional)</Label>
                <Input 
                  id="postalCode" 
                  className="mt-1"
                  placeholder="Postal Code"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="md:col-span-2">
                  <Label htmlFor="statementText" className="mb-2 block font-medium">Written Statement</Label>
                  <Textarea
                    id="statementText"
                    placeholder="Provide a detailed written statement of what happened"
                    className="mt-1"
                    rows={4}
                    value={formData.statementText}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-3">Audio Statement</h3>
                  <div className="bg-gray-50 p-4 rounded-md h-full">
                    <AudioRecorder 
                      onAudioCaptured={(blob, fileName) => {
                        setAudioStatement({
                          blob,
                          fileName,
                          url: URL.createObjectURL(blob)
                        });
                      }}
                      label="Record Audio Statement"
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-3">Evidence Files</h3>
                  <div className="bg-gray-50 p-4 rounded-md h-full">
                    <EvidenceUploader 
                      onFilesChange={setEvidenceFiles}
                      maxFiles={5}
                      acceptedTypes={['image', 'video', 'audio', 'document']}
                      label="Upload Evidence"
                      description="Photos, videos, or documents"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium mb-2">Contact Information</h3>
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
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8 ml-1">
                          <AlertCircle className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">When reporting anonymously, we won't collect your personal information. However, this may limit our ability to follow up with you about the case.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
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
            type="submit" 
            form="crime-report-form"
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
