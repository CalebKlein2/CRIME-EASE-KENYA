import React from "react";
import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Bell,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Siren,
} from "lucide-react";

interface DashboardHeaderProps {
  userName?: string;
  userAvatar?: string;
  unreadNotifications?: number;
  unreadMessages?: number;
  onSosClick?: () => void;
  onLogout?: () => void;
}

const DashboardHeader = ({
  userName = "John Doe",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  unreadNotifications = 3,
  unreadMessages = 2,
  onSosClick = () => {},
  onLogout = () => {},
}: DashboardHeaderProps) => {
  return (
    <header className="w-full h-20 bg-white border-b shadow-sm px-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2">
          <Menu className="h-6 w-6 text-gray-500" />
          <h1 className="text-xl font-bold text-gray-900">CrimeEase</h1>
        </div>

        {/* Navigation */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Dashboard</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="p-4 w-[200px]">
                  <NavigationMenuLink className="block p-2 hover:bg-gray-100 rounded">
                    Overview
                  </NavigationMenuLink>
                  <NavigationMenuLink className="block p-2 hover:bg-gray-100 rounded">
                    My Cases
                  </NavigationMenuLink>
                  <NavigationMenuLink className="block p-2 hover:bg-gray-100 rounded">
                    Statistics
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="flex items-center gap-4">
        {/* SOS Button */}
        <Button
          variant="destructive"
          className="bg-red-600 hover:bg-red-700"
          onClick={onSosClick}
        >
          <Siren className="h-4 w-4 mr-2" />
          Emergency SOS
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[300px]">
            <DropdownMenuItem>New case update</DropdownMenuItem>
            <DropdownMenuItem>Officer assigned</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Messages */}
        <Button variant="ghost" size="icon" className="relative">
          <MessageSquare className="h-5 w-5" />
          {unreadMessages > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {unreadMessages}
            </span>
          )}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={userAvatar} />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline">{userName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
