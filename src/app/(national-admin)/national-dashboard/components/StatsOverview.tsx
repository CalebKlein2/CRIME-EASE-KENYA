// @ts-nocheck
import React from "react";
import { 
  UsersIcon, 
  Building2Icon, 
  ClockIcon, 
  CheckCircle2Icon 
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";

// Mock data
const nationalStats = {
  total_cases: 2458,
  active_officers: 345,
  stations: 47,
  response_time_avg: 18, // minutes
  case_clearance_rate: 62, // percentage
  incident_growth: -3.2, // percentage
};

export const StatsOverview = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total Cases"
        value={nationalStats.total_cases.toString()}
        description="Across all stations"
        icon={<ClockIcon className="h-8 w-8 text-blue-600" />}
        trendValue={nationalStats.incident_growth}
        trendLabel="vs last month"
      />
      
      <StatsCard
        title="Active Officers"
        value={nationalStats.active_officers.toString()}
        description="Currently on duty"
        icon={<UsersIcon className="h-8 w-8 text-green-600" />}
      />
      
      <StatsCard
        title="Police Stations"
        value={nationalStats.stations.toString()}
        description="Nationwide"
        icon={<Building2Icon className="h-8 w-8 text-purple-600" />}
      />
      
      <StatsCard
        title="Case Clearance"
        value={`${nationalStats.case_clearance_rate}%`}
        description="Resolution rate"
        icon={<CheckCircle2Icon className="h-8 w-8 text-amber-600" />}
      />
    </div>
  );
};

