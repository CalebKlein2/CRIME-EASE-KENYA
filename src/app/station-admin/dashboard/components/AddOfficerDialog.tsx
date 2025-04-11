import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addOfficer, Officer } from "@/lib/officerService";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface AddOfficerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function AddOfficerDialog({
  isOpen,
  onOpenChange,
  onSuccess,
}: AddOfficerDialogProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    badge: '',
    rank: 'Constable',
    status: 'On duty',
    phone: '',
    email: '',
    department: 'General Duties',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.badge) {
      toast({
        title: "Validation Error",
        description: "Name and Badge Number are required fields.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create officer object
      const newOfficerData: Omit<Officer, 'id'> = {
        name: formData.name,
        badge: formData.badge,
        rank: formData.rank,
        status: formData.status,
        phone: formData.phone,
        email: formData.email,
        department: formData.department,
        cases: 0,
        station_id: user?.station_id,
      };
      
      const officerId = await addOfficer(newOfficerData);
      
      if (officerId) {
        toast({
          title: "Success",
          description: "Officer added successfully",
        });
        
        // Reset form
        setFormData({
          name: '',
          badge: '',
          rank: 'Constable',
          status: 'On duty',
          phone: '',
          email: '',
          department: 'General Duties',
        });
        
        // Close dialog
        onOpenChange(false);
        
        // Refresh officer list
        onSuccess();
      } else {
        toast({
          title: "Error",
          description: "Failed to add officer",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error adding officer:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while adding the officer",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Officer</DialogTitle>
          <DialogDescription>
            Fill out the form below to add a new officer to your station.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Officer Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="badge">Badge Number *</Label>
              <Input
                id="badge"
                name="badge"
                placeholder="e.g. KPS-1234"
                value={formData.badge}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rank">Rank</Label>
                <Select
                  value={formData.rank}
                  onValueChange={(value) => handleSelectChange('rank', value)}
                >
                  <SelectTrigger id="rank">
                    <SelectValue placeholder="Select Rank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Constable">Constable</SelectItem>
                    <SelectItem value="Corporal">Corporal</SelectItem>
                    <SelectItem value="Sergeant">Sergeant</SelectItem>
                    <SelectItem value="Inspector">Inspector</SelectItem>
                    <SelectItem value="Chief Inspector">Chief Inspector</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="On duty">On duty</SelectItem>
                    <SelectItem value="Off duty">Off duty</SelectItem>
                    <SelectItem value="On leave">On leave</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => handleSelectChange('department', value)}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General Duties">General Duties</SelectItem>
                  <SelectItem value="Traffic">Traffic</SelectItem>
                  <SelectItem value="Criminal Investigation">Criminal Investigation</SelectItem>
                  <SelectItem value="Community Policing">Community Policing</SelectItem>
                  <SelectItem value="Patrol">Patrol</SelectItem>
                  <SelectItem value="Cybercrime">Cybercrime</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="e.g. +254 712 345 678"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="e.g. officer.name@police.gov.ke"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="mr-2">Adding...</span>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                </>
              ) : (
                "Add Officer"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
