// src/app/(auth)/officer-login/page.tsx
"use client";

import React from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export default function OfficerLogin() {
  return (
    <AuthForm
      title="Officer Portal Login"
      subtitle="Enter your credentials to access the officer portal"
      role="officer"
      redirectUrl="/officer/dashboard"
      showExtraLinks={false}
      extraFields={
        <div className="space-y-2">
          <label htmlFor="badgeNumber" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Badge Number
          </label>
          <input
            id="badgeNumber"
            name="badgeNumber"
            placeholder="KPS-12345"
            required
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      }
    />
  );
}