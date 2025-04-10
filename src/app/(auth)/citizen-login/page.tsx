"use client";

import React from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export default function CitizenLogin() {
  return (
    <AuthForm
      title="Citizen Portal Login"
      subtitle="Track your cases and communicate with officers"
      role="citizen"
      redirectUrl="/citizen-dashboard"
      showExtraLinks={true}
    />
  );
}