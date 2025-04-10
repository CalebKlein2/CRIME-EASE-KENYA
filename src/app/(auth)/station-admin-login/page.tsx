// src/app/(auth)/station-admin-login/page.tsx
"use client";

import React from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export default function StationAdminLogin() {
  return (
    <AuthForm
      title="Station Admin Login"
      subtitle="Enter your credentials to access the station administration portal"
      role="station_admin"
      redirectUrl="/station-dashboard"
      showExtraLinks={false}
      extraFields={
        <div className="space-y-2">
          <label htmlFor="stationCode" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Station Code
          </label>
          <input
            id="stationCode"
            name="stationCode"
            placeholder="e.g., NRB-CENTRAL"
            required
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      }
    />
  );
}