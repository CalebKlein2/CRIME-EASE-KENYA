import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { CalendarDays, MapPin, AlertCircle } from "lucide-react";

interface CaseCardProps {
  caseNumber?: string;
  status?: "open" | "in-progress" | "closed";
  title?: string;
  description?: string;
  location?: string;
  date?: string;
  officer?: {
    name: string;
    avatar: string;
  };
  priority?: "low" | "medium" | "high";
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "open":
      return "bg-yellow-100 text-yellow-800";
    case "in-progress":
      return "bg-blue-100 text-blue-800";
    case "closed":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-orange-100 text-orange-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const CaseCard = ({
  caseNumber = "CR-2024-001",
  status = "open",
  title = "Suspicious Activity Report",
  description = "Suspicious individual observed loitering around residential area during late hours.",
  location = "123 Main St, Cityville",
  date = "2024-04-10",
  officer = {
    name: "Officer Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  },
  priority = "medium",
}: CaseCardProps) => {
  return (
    <Card className="w-[380px] bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Case #{caseNumber}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CalendarDays className="h-4 w-4" />
          <span>{date}</span>
        </div>

        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <Badge className={getPriorityColor(priority)}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center border-t pt-4">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={officer.avatar} />
            <AvatarFallback>OS</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{officer.name}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CaseCard;
