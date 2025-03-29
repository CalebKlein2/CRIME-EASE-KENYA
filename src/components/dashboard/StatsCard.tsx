// src/components/dashboard/StatsCard.tsx
import React from "react";
import { Card, CardContent } from "../ui/card";
import { cva } from "class-variance-authority";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning" | "danger";
}

const cardVariants = cva("", {
  variants: {
    variant: {
      default: "bg-blue-50 text-blue-700",
      success: "bg-green-50 text-green-700",
      warning: "bg-yellow-50 text-yellow-700",
      danger: "bg-red-50 text-red-700",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export function StatsCard({
  title,
  value,
  icon,
  description,
  trend,
  variant = "default",
}: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {description && (
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            )}
            {trend && (
              <div className="flex items-center mt-2">
                <span
                  className={`text-xs font-medium ${
                    trend.isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {trend.isPositive ? "+" : "-"}
                  {Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-gray-500 ml-1">from last period</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${cardVariants({ variant })}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}