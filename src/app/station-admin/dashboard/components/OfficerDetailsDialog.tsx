import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Officer } from '@/lib/officerService';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { 
  PhoneCall, 
  Mail, 
  Calendar, 
  Users, 
  FileText, 
  Award, 
  Shield, 
  Clock
} from 'lucide-react';

interface OfficerDetailsDialogProps {
  officer: Officer | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function OfficerDetailsDialog({
  officer,
  isOpen,
  onOpenChange,
}: OfficerDetailsDialogProps) {
  if (!officer) return null;
  
  // Get officer initials for the avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Determine status color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'On duty': return 'bg-green-100 text-green-800';
      case 'Off duty': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Officer Details</DialogTitle>
          <DialogDescription>
            Detailed information about {officer.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Officer header with avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary">
              <AvatarFallback className="text-lg">{getInitials(officer.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold">{officer.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="font-medium">{officer.rank}</Badge>
                <Badge className={getStatusColor(officer.status)}>{officer.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Badge: {officer.badge}</p>
            </div>
          </div>

          {/* Contact and basic info */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <PhoneCall className="h-4 w-4 text-muted-foreground" />
                  <span>{officer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{officer.email || 'No email provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>Department: {officer.department || 'General'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span>Rank: {officer.rank}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <FileText className="h-8 w-8 text-primary mb-2" />
                  <span className="text-2xl font-bold">{officer.cases}</span>
                  <span className="text-sm text-muted-foreground">Active Cases</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Clock className="h-8 w-8 text-primary mb-2" />
                  <span className="text-2xl font-bold">{officer.status === 'On duty' ? 'Active' : 'Inactive'}</span>
                  <span className="text-sm text-muted-foreground">Current Status</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
