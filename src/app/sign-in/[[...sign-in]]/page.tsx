// src/app/sign-in/[[...sign-in]]/page.tsx
import React, { useState, useEffect } from "react";
import { SignIn, useUser } from "@clerk/clerk-react";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Bell, UserRound, BadgeHelp, Building, Globe } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";

type UserRole = "citizen" | "officer" | "station_admin" | "national_admin";

interface RoleOption {
  id: UserRole;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  redirectPath: string;
}

export default function SignInPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUserRole } = useAuth();
  const { isSignedIn, isLoaded } = useUser();
  const [selectedRole, setSelectedRole] = useState<UserRole>("citizen");
  
  // Parse role from URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role') as UserRole | null;
    if (roleParam && ["citizen", "officer", "station_admin", "national_admin"].includes(roleParam)) {
      setSelectedRole(roleParam);
      console.log(`[SignIn] Role set from URL: ${roleParam}`);
    }
  }, [location]);

  // Automatically redirect if already signed in
  useEffect(() => {
    // If a user is already signed in, check if they're on the sign-in page
    if (isSignedIn && isLoaded) {
      console.log("[SignIn] User already signed in, redirecting to appropriate dashboard");
      
      // Get the current role and redirect to appropriate dashboard
      const currentRole = user?.role || selectedRole || "citizen";
      const redirectOption = roleOptions.find(option => option.id === currentRole) || roleOptions[0];
      
      // Redirect to the appropriate dashboard
      console.log(`[SignIn] Auto-redirecting to: ${redirectOption.redirectPath}`);
      window.location.href = redirectOption.redirectPath;
    }
  }, [isSignedIn, isLoaded, user, selectedRole]);

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

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    // Update URL with the selected role
    navigate(`/sign-in?role=${role}`, { replace: true });
  };

  const redirectToRoleDashboard = (role: UserRole) => {
    const selectedOption = roleOptions.find(option => option.id === role);
    if (selectedOption) {
      navigate(selectedOption.redirectPath);
    }
  };

  // Function to handle sign-in completion
  const handleSignInComplete = async (result: any) => {
    console.log("[SignIn] Sign-in completed", {
      selectedRole: selectedRole
    });
    
    try {
      // Wait for auth context to initialize (longer delay to ensure Clerk is ready)
      console.log("[SignIn] Waiting for auth context to initialize...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Debug: Log the current user from Clerk
      const clerkClient = (window as any).Clerk;
      if (clerkClient && clerkClient.user) {
        console.log("[SignIn] Current Clerk user:", {
          id: clerkClient.user.id,
          firstName: clerkClient.user.firstName,
          lastName: clerkClient.user.lastName,
          metadata: clerkClient.user.publicMetadata
        });
        
        // Ensure the role is set in Clerk metadata
        try {
          // Check if role is already set and matches selected role
          const currentRole = clerkClient.user.publicMetadata?.role;
          
          if (currentRole !== selectedRole) {
            console.log(`[SignIn] Current role (${currentRole}) doesn't match selected role (${selectedRole}), updating...`);
            
            // Update the role in Clerk
            await clerkClient.user.update({
              publicMetadata: {
                ...(clerkClient.user.publicMetadata || {}),
                role: selectedRole
              }
            });
            console.log(`[SignIn] Updated Clerk metadata with role ${selectedRole}`);
            
            // Force a session refresh
            await clerkClient.session.touch();
            console.log("[SignIn] Refreshed Clerk session");
          } else {
            console.log(`[SignIn] Role already set to ${selectedRole}, no update needed`);
          }
        } catch (e) {
          console.error("[SignIn] Error updating Clerk metadata:", e);
        }
      }
      
      // Set the role explicitly using the AuthContext
      if (setUserRole) {
        console.log(`[SignIn] Setting user role to ${selectedRole}`);
        
        try {
          await setUserRole(selectedRole);
          console.log(`[SignIn] User role set to ${selectedRole}`);
          
          // Wait for role to be properly set in both Clerk and Convex
          console.log("[SignIn] Waiting for role to propagate...");
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (roleError) {
          console.error("[SignIn] Error in setUserRole:", roleError);
        }
      }
      
      // Redirect to the appropriate dashboard
      console.log(`[SignIn] Redirecting to: ${selectedRoleOption.redirectPath}`);
      redirectToRoleDashboard(selectedRole);
    } catch (error) {
      console.error("[SignIn] Error setting user role:", error);
    }
  };

  const selectedRoleOption = roleOptions.find(option => option.id === selectedRole) || roleOptions[0];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side with image and content */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-700 text-white flex-col">
        <div className="flex items-center p-8">
          <Shield className="h-8 w-8 mr-2" />
          <span className="text-xl font-bold">Crime Ease Kenya</span>
        </div>
        
        <div className="flex-1 flex flex-col justify-center items-center p-12 space-y-8">
          <div className="max-w-md space-y-4">
            <h1 className="text-4xl font-bold">Welcome back</h1>
            <p className="text-lg opacity-90">
              Sign in to your account to access your dashboard, reports, and notifications.
            </p>
            
            <div className="pt-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-600 p-2 rounded-full">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Secure Access</h3>
                  <p className="text-sm opacity-80">Your data is protected with end-to-end encryption</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-600 p-2 rounded-full">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Real-time Updates</h3>
                  <p className="text-sm opacity-80">Get notified about case updates instantly</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-auto w-full max-w-md">
            <img 
              src="/images/signin-illustration.svg" 
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
      
      {/* Right side with sign in form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6">
        <div className="lg:hidden flex items-center mb-8">
          <Shield className="h-8 w-8 mr-2 text-blue-700" />
          <span className="text-xl font-bold">Crime Ease Kenya</span>
        </div>
        
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardContent className="p-0">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">Sign in as a {selectedRoleOption.label}</h2>
              <p className="text-gray-500 mt-1">
                Enter your credentials to access your {selectedRoleOption.label.toLowerCase()} dashboard
              </p>
            </div>
            
            <div className="px-6 pt-4">
              <Tabs value={selectedRole} onValueChange={(value) => handleRoleChange(value as UserRole)}>
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="citizen">Citizen</TabsTrigger>
                  <TabsTrigger value="officer">Police</TabsTrigger>
                </TabsList>
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="station_admin">Station Admin</TabsTrigger>
                  <TabsTrigger value="national_admin">National Admin</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="flex items-center p-3 mb-6 bg-gray-50 rounded-lg border border-gray-100">
                <div className={`${selectedRoleOption.color} p-2 rounded-full text-white mr-3`}>
                  {selectedRoleOption.icon}
                </div>
                <div>
                  <h4 className="font-medium text-sm">{selectedRoleOption.label} Access</h4>
                  <p className="text-xs text-gray-500">{selectedRoleOption.description}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <SignIn 
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none p-0",
                    header: "hidden",
                    footer: "hidden",
                    formButtonPrimary: 
                      `${selectedRoleOption.color} hover:opacity-90 text-white w-full py-2 rounded`,
                    formFieldInput: 
                      "border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-700 focus:border-transparent",
                    formFieldLabel: "text-gray-700 font-medium",
                  }
                }}
                routing="path"
                path="/sign-in"
                redirectUrl={selectedRoleOption.redirectPath}
                signUpUrl={`/sign-up?role=${selectedRole}`}
                afterSignInUrl={selectedRoleOption.redirectPath}
                afterSignIn={handleSignInComplete}
              />
            </div>
          </CardContent>
        </Card>
        
        <p className="mt-8 text-center text-gray-600 lg:hidden">
          &copy; 2025 Crime Ease Kenya. All rights reserved.
        </p>
      </div>
    </div>
  );
}
