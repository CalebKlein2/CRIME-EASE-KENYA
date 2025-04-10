// src/app/(auth)/national-admin-login/page.tsx
"use client";

import React from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export default function NationalAdminLogin() {
  return (
    <AuthForm
      title="National Admin Login"
      subtitle="Enter your credentials to access the national police administration portal"
      role="national_admin"
      redirectUrl="/national-dashboard"
      showExtraLinks={false}
      extraFields={
        <div className="space-y-2">
          <label htmlFor="securityCode" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Security Code
          </label>
          <input
            id="securityCode"
            name="securityCode"
            placeholder="Enter your security code"
            required
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      }
    />
  );
}