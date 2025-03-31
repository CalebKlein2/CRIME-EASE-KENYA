import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatisticsChart } from "@/components/charts/StatisticsChart";

// Mock data
const crimeTypeData = [
  { name: "Theft", cases: 845 },
  { name: "Assault", cases: 654 },
  { name: "Fraud", cases: 423 },
  { name: "Burglary", cases: 321 },
  { name: "Vandalism", cases: 215 },
];

const regionCrimeData = [
  { name: "Nairobi", cases: 542 },
  { name: "Mombasa", cases: 423 },
  { name: "Kisumu", cases: 321 },
  { name: "Nakuru", cases: 254 },
  { name: "Eldoret", cases: 187 },
];

// Format chart data to meet ChartData requirements
const formatChartData = (data: any[]) => {
  return data.map(item => ({
    name: item.name,
    value: item.cases // Converts 'cases' field to 'value' field
  }));
};

export const CrimeStatistics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Crime Distribution by Type</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <StatisticsChart 
            title="Crime Distribution by Type"
            data={formatChartData(crimeTypeData)}
            type="pie"
            dataKeys={["value"]}
            colors={["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6"]}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Crime Distribution by Region</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <StatisticsChart 
            title="Crime Distribution by Region"
            data={formatChartData(regionCrimeData)}
            type="pie"
            dataKeys={["value"]}
            colors={["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6"]}
          />
        </CardContent>
      </Card>
    </div>
  );
};
