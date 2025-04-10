// src/components/case/CasePriorityBadge.tsx
import React from "react";
import { Badge } from "../ui/badge";

type CasePriority = "low" | "medium" | "high";

interface CasePriorityBadgeProps {
  priority: CasePriority;
  size?: "sm" | "md" | "lg";
}

export function CasePriorityBadge({ priority, size = "md" }: CasePriorityBadgeProps) {
  const getPriorityColor = (priority: CasePriority) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "medium":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-100";
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
      className={`font-medium ${getPriorityColor(priority)} ${getSizeClass(size)}`}
      variant="outline"
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
    </Badge>
  );
}