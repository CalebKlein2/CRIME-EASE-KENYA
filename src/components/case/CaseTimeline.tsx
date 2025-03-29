// src/components/case/CaseTimeline.tsx
import React from "react";
import { 
  CheckCircle2, 
  Clock, 
  FileText, 
  MessageSquare, 
  UserPlus,
  LucideIcon 
} from "lucide-react";

interface TimelineItem {
  id: string;
  type: "status_change" | "note" | "evidence_added" | "assignment_change" | "message";
  content: string;
  date: string;
  user: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
}

interface CaseTimelineProps {
  items: TimelineItem[];
}

export function CaseTimeline({ items }: CaseTimelineProps) {
  const getIconByType = (type: TimelineItem["type"]): React.ReactNode => {
    switch (type) {
      case "status_change":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "note":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "evidence_added":
        return <FileText className="h-5 w-5 text-purple-500" />;
      case "assignment_change":
        return <UserPlus className="h-5 w-5 text-orange-500" />;
      case "message":
        return <MessageSquare className="h-5 w-5 text-indigo-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTitle = (item: TimelineItem): string => {
    switch (item.type) {
      case "status_change":
        return "Status Update";
      case "note":
        return "Note Added";
      case "evidence_added":
        return "Evidence Added";
      case "assignment_change":
        return "Assignment Change";
      case "message":
        return "Message";
      default:
        return "Update";
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Case Timeline</h3>
      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={item.id} className="relative pl-6">
            {/* Vertical line */}
            {index < items.length - 1 && (
              <div className="absolute left-2.5 top-6 w-0.5 h-full -ml-px bg-gray-200"></div>
            )}
            
            {/* Icon */}
            <div className="absolute left-0 rounded-full bg-white border-2 border-gray-200 p-1">
              {getIconByType(item.type)}
            </div>
            
            {/* Content */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">{getTitle(item)}</h4>
                <span className="text-sm text-gray-500">{item.date}</span>
              </div>
              <p className="mt-2 text-gray-600">{item.content}</p>
              <div className="mt-2 flex items-center">
                {item.user.avatarUrl ? (
                  <img 
                    src={item.user.avatarUrl} 
                    alt={item.user.name} 
                    className="h-5 w-5 rounded-full mr-2"
                  />
                ) : (
                  <div className="h-5 w-5 rounded-full bg-gray-200 mr-2"></div>
                )}
                <span className="text-sm text-gray-500">
                  {item.user.name} ({item.user.role})
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}