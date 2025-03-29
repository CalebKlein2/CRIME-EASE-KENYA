// src/components/case/CaseStatusBadge.tsx
import React from "react";
import { Badge } from "../ui/badge";

type CaseStatus = "open" | "in-progress" | "closed" | "archived";

interface CaseStatusBadgeProps {
  status: CaseStatus;
  size?: "sm" | "md" | "lg";
}

export function CaseStatusBadge({ status, size = "md" }: CaseStatusBadgeProps) {
  const getStatusColor = (status: CaseStatus) => {
    switch (status) {
      case "open":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "in-progress":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "closed":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "archived":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getSizeClass = (size: "sm" | "md" | "lg") => {
    switch (size) {
      case "sm":
        return "text-xs px-2 py-0.5";
      case "md":
        return "text-sm px-2.5 py-0.5";
      case "lg":
        return "text-base px-3 py-1";
    }
  };

  return (
    <Badge
      className={`font-medium ${getStatusColor(status)} ${getSizeClass(size)}`}
      variant="outline"
    >
      {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
    </Badge>
  );
}