import React from "react";
import CaseCard from "./CaseCard";
import { ScrollArea } from "./ui/scroll-area";

interface Case {
  id: string;
  caseNumber: string;
  status: "open" | "in-progress" | "closed";
  title: string;
  description: string;
  location: string;
  date: string;
  officer: {
    name: string;
    avatar: string;
  };
  priority: "low" | "medium" | "high";
}

interface CaseOverviewProps {
  cases?: Case[];
  onCaseClick?: (caseId: string) => void;
}

const defaultCases: Case[] = [
  {
    id: "1",
    caseNumber: "CR-2024-001",
    status: "open",
    title: "Suspicious Activity Report",
    description:
      "Suspicious individual observed loitering around residential area during late hours.",
    location: "123 Main St, Cityville",
    date: "2024-04-10",
    officer: {
      name: "Officer Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Smith",
    },
    priority: "medium",
  },
  {
    id: "2",
    caseNumber: "CR-2024-002",
    status: "in-progress",
    title: "Vehicle Break-in",
    description: "Car window smashed and valuables stolen from parked vehicle.",
    location: "456 Oak Avenue, Cityville",
    date: "2024-04-09",
    officer: {
      name: "Officer Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Johnson",
    },
    priority: "high",
  },
  {
    id: "3",
    caseNumber: "CR-2024-003",
    status: "closed",
    title: "Noise Complaint",
    description:
      "Repeated loud music and disturbances from neighboring property.",
    location: "789 Pine Street, Cityville",
    date: "2024-04-08",
    officer: {
      name: "Officer Davis",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Davis",
    },
    priority: "low",
  },
];

const CaseOverview = ({
  cases = defaultCases,
  onCaseClick = () => {},
}: CaseOverviewProps) => {
  return (
    <div className="w-full h-full bg-gray-50 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Recent Cases</h2>
        <p className="text-gray-600">
          Overview of your reported cases and their current status
        </p>
      </div>

      <ScrollArea className="h-[calc(100%-80px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((caseItem) => (
            <div
              key={caseItem.id}
              onClick={() => onCaseClick(caseItem.id)}
              className="cursor-pointer"
            >
              <CaseCard
                caseNumber={caseItem.caseNumber}
                status={caseItem.status}
                title={caseItem.title}
                description={caseItem.description}
                location={caseItem.location}
                date={caseItem.date}
                officer={caseItem.officer}
                priority={caseItem.priority}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CaseOverview;
