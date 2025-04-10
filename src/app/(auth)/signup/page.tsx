"use client";

import React from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export default function CitizenSignup() {
  return (
    <AuthForm
      title="Create Your Citizen Account"
      subtitle="Sign up to report crimes and track your cases"
      role="citizen"
      isSignUp={true}
      redirectUrl="/citizen-dashboard"
      showExtraLinks={true}
    />
  );
}
