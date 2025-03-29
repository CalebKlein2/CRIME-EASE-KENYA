// src/components/layout/DashboardLayout.tsx
import React from "react";
import { UserButton } from "@clerk/clerk-react";
import { Shield, Menu, Bell, LogOut, Settings, Badge } from "lucide-react";
import { Button } from "../ui/button";
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
  role: "officer" | "station_admin" | "national_admin" | "citizen";
  notifications?: number;
  badgeNumber?: string;
  stationCode?: string;
  securityCode?: string;
}

export function DashboardLayout({
  children,
  title,
  subtitle,
  navItems,
  role,
  notifications = 0,
  badgeNumber,
  stationCode,
  securityCode,
}: DashboardLayoutProps) {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar for larger screens */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out md:translate-x-0 md:relative md:h-screen ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col overflow-hidden">
          <div className="py-4 px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-lg font-bold">Crime Ease</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          <Sidebar navItems={navItems} />

          {/* User identifier section */}
          <div className="mt-auto border-t border-gray-200 dark:border-gray-700 pt-4 px-4 pb-4">
            {badgeNumber && (
              <div className="mb-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Badge className="w-4 h-4 mr-2" />
                <span>Badge: {badgeNumber}</span>
              </div>
            )}
            {stationCode && (
              <div className="mb-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Shield className="w-4 h-4 mr-2" />
                <span>Station: {stationCode}</span>
              </div>
            )}
            {securityCode && (
              <div className="mb-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Settings className="w-4 h-4 mr-2" />
                <span>Admin Code: {securityCode}</span>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={() => logout()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white dark:bg-gray-800 shadow z-10">
          <div className="h-16 px-4 flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden mr-2"
                onClick={toggleSidebar}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-5 w-5" />
                    {notifications > 0 && (
                      <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                        {notifications}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View all notifications</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <UserButton afterSignOutUrl="/login" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">{children}</main>
      </div>
    </div>
  );
}