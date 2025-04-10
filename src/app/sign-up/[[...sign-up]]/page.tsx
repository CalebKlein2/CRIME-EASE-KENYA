// src/app/sign-up/[[...sign-up]]/page.tsx
// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { SignUp, useUser } from "@clerk/clerk-react";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, UserPlus, UserRound, BadgeHelp, Building, Globe } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import type { UserResource } from "@clerk/types";

type UserRole = "citizen" | "officer" | "station_admin" | "national_admin";

interface RoleOption {
  id: UserRole;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  redirectPath: string;
}

export default function SignUpPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUserRole } = useAuth();
  const { isSignedIn } = useUser();
  const [selectedRole, setSelectedRole] = useState<UserRole>("citizen");
  
  // Parse role from URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get("role") as UserRole | null;
    
    if (roleParam && ["citizen", "officer", "station_admin", "national_admin"].includes(roleParam)) {
      setSelectedRole(roleParam);
    }
  }, [location]);

  // Redirect to appropriate dashboard if already signed in
  useEffect(() => {
    if (isSignedIn && user) {
      // If they're already signed in, redirect to the appropriate dashboard
      redirectToRoleDashboard(user.role as UserRole);
    }
  }, [isSignedIn, user, navigate]);

  const roleOptions: RoleOption[] = [
    {
      id: "citizen",
      label: "Citizen",
      icon: <UserRound className="h-5 w-5" />,
      description: "Report incidents and track case progress",
      color: "bg-blue-600",
      redirectPath: "/citizen-dashboard"
    },
    {
      id: "officer",
      label: "Police Officer",
      icon: <BadgeHelp className="h-5 w-5" />,
      description: "Manage cases and respond to reports",
      color: "bg-green-600",
      redirectPath: "/officer-dashboard"
    },
    {
      id: "station_admin",
      label: "Station Admin",
      icon: <Building className="h-5 w-5" />,
      description: "Manage station resources and personnel",
      color: "bg-purple-600",
      redirectPath: "/station-dashboard"
    },
    {
      id: "national_admin",
      label: "National Admin",
      icon: <Globe className="h-5 w-5" />,
      description: "Oversee nationwide operations",
      color: "bg-red-600",
      redirectPath: "/national-dashboard"
    },
  ];

  const handleRoleChange = async (role: UserRole) => {
    setSelectedRole(role);
    // Update URL with the selected role
    navigate(`/sign-up?role=${role}`, { replace: true });
    
    // If user is already signed in, update their metadata and role in Convex
    if (isSignedIn && user) {
      try {
        // First update Clerk metadata
        const clerkUser = user as UserResource;
        await clerkUser.update({
          publicMetadata: {
            ...clerkUser.publicMetadata,
            role: role
          }
        });
        console.log(`[SignUp] Updated Clerk metadata with role ${role}`);
        
        // Then update role in Convex via AuthContext
        await setUserRole(role);
        console.log(`[SignUp] Updated Convex with role ${role}`);
      } catch (error) {
        console.error('[SignUp] Error updating user role:', error);
      }
    }
  };

  const redirectToRoleDashboard = (role: UserRole) => {
    const selectedOption = roleOptions.find(option => option.id === role);
    if (selectedOption) {
      navigate(selectedOption.redirectPath);
    }
  };

  const selectedRoleOption = roleOptions.find(option => option.id === selectedRole) || roleOptions[0];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side with image and content */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 text-white flex-col">
        <div className="flex items-center p-8">
          <Shield className="h-8 w-8 mr-2" />
          <span className="text-xl font-bold">Crime Ease Kenya</span>
        </div>
        
        <div className="flex-1 flex flex-col justify-center items-center p-12 space-y-8">
          <div className="max-w-md space-y-4">
            <h1 className="text-4xl font-bold">Join our community</h1>
            <p className="text-lg opacity-90">
              Create an account to report incidents, track cases, and contribute to a safer Kenya.
            </p>
            
            <div className="pt-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-500 p-2 rounded-full">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Easy Reporting</h3>
                  <p className="text-sm opacity-80">Report incidents quickly and securely</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-500 p-2 rounded-full">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Track Progress</h3>
                  <p className="text-sm opacity-80">Follow the status of your reports in real-time</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-auto w-full max-w-md">
            <img 
              src="/images/signup-illustration.svg" 
              alt="Crime Ease Illustration" 
              className="w-full h-auto"
              onError={(e) => {
                // Fallback if image doesn't exist
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
        
        <div className="p-8 text-sm opacity-80">
          &copy; 2025 Crime Ease Kenya. All rights reserved.
        </div>
      </div>
      
      {/* Right side with sign-up form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Choose your role to get started
          </p>
        </div>

        <div className="mt-8">
          <Tabs value={selectedRole} onValueChange={(value) => handleRoleChange(value as UserRole)}>
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
              {roleOptions.map((option) => (
                <TabsTrigger
                  key={option.id}
                  value={option.id}
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  {option.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <Card className="mt-4">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className={`p-2 rounded-full ${selectedRoleOption.color}`}>
                  {selectedRoleOption.icon}
                </div>
                <div>
                  <h3 className="text-lg font-medium">{selectedRoleOption.label}</h3>
                  <p className="text-sm text-gray-500">{selectedRoleOption.description}</p>
                </div>
              </div>

              <SignUp 
                path="/sign-up"
                routing="path"
                signInUrl="/sign-in"
                afterSignUpUrl={selectedRoleOption.redirectPath}
                appearance={{
                  elements: {
                    formButtonPrimary: 
                      "bg-blue-600 hover:bg-blue-700 text-white",
                  },
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
