// src/components/layout/DashboardLayout.tsx
'use client';

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Shield, Menu, Bell, LogOut, Settings, User } from "lucide-react";
import { Button } from "../ui/button";
import { UserButton, useUser } from "@clerk/clerk-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  navItems: {
    label: string;
    href: string;
    icon: React.ReactNode;
    active?: boolean;
  }[];
  userName?: string;
  userRole?: string;
  role?: string; // Added for backward compatibility
  userProfileImageUrl?: string;
  userAvatarFallback?: string;
  notifications?: number;
  stationCode?: string; // Added for station admin dashboard
  badgeNumber?: string; // Added for officer dashboard
}

export function DashboardLayout({
  children,
  title,
  subtitle,
  navItems,
  userName,
  userRole,
  role, // Added for backward compatibility
  userProfileImageUrl,
  userAvatarFallback = "U",
  notifications = 0,
  stationCode,
  badgeNumber
}: DashboardLayoutProps) {
  // Use role prop if userRole is not provided
  const effectiveUserRole = userRole || role || "user";
  const { logout } = useAuth();
  const { isLoaded: clerkLoaded } = useUser();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [isClerkAvailable, setIsClerkAvailable] = useState(false);

  useEffect(() => {
    // Check if Clerk is available on the client side
    setIsClerkAvailable(!!clerkLoaded);
  }, [clerkLoaded]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 ${
          sidebarOpen ? "block" : "hidden"
        } lg:hidden`}
      >
        <div 
          className="absolute inset-0 bg-gray-600 opacity-75"
          onClick={toggleSidebar}
        />
        <div className="fixed inset-y-0 left-0 flex flex-col z-40 w-64 bg-white dark:bg-gray-800 shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">{title}</h2>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleSidebar}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
          <Sidebar navItems={navItems} />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 border-r bg-white dark:bg-gray-800">
        <div className="flex items-center h-16 px-4 border-b">
          <h1 className="text-xl font-semibold flex items-center">
            <Shield className="mr-2 h-6 w-6 text-primary" />
            {title}
          </h1>
        </div>
        <Sidebar navItems={navItems} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:pl-64">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 flex h-16 items-center justify-between px-4 border-b shadow-sm">
          <div className="flex lg:hidden">
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="flex-1 lg:ml-0 ml-4">
            <h2 className="text-lg font-semibold">{subtitle || title}</h2>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>New case assigned</DropdownMenuItem>
                <DropdownMenuItem>Case #123 updated</DropdownMenuItem>
                <DropdownMenuItem>Emergency alert</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <div className="flex items-center">
              {/* Clerk UserButton (when available) */}
              {isClerkAvailable && (
                <UserButton afterSignOutUrl="/login" />
              )}
              
              {/* Custom User Menu (when Clerk is not available) */}
              {!isClerkAvailable && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2 flex items-center">
                      <Avatar className="h-8 w-8">
                        {userProfileImageUrl && (
                          <AvatarImage src={userProfileImageUrl} alt={userName} />
                        )}
                        <AvatarFallback>{userAvatarFallback}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start text-sm">
                        <span className="font-medium">{userName}</span>
                        <span className="text-xs text-muted-foreground">{userRole}</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}