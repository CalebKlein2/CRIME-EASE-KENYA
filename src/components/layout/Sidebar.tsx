// src/components/layout/Sidebar.tsx
'use client';

import React from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  navItems: {
    label: string;
    href: string;
    icon: React.ReactNode;
    active?: boolean;
  }[];
}

export function Sidebar({ navItems }: SidebarProps) {
  const location = useLocation();
  const pathname = location.pathname;
  
  return (
    <div className="flex-1 overflow-hidden">
      <nav className="h-full overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            // Determine if the item is active based on pathname or the provided active state
            const isActive = item.active || 
                            pathname === item.href || 
                            // Handle exact route matches
                            (pathname === item.href) ||
                            // Handle child routes (e.g. /citizen-dashboard/reports)
                            (item.href !== '/' && 
                             item.href !== '' && 
                             pathname.startsWith(item.href + '/')) ||
                            // Special case for index routes (e.g. /citizen-dashboard matching /citizen-dashboard/reports)
                            (pathname.startsWith(item.href + '/') && item.href !== '' && item.href !== '/');
            
            return (
              <li key={item.href || item.label}>
                <Link
                  to={item.href}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-800 font-medium border-l-4 border-blue-600 pl-2 dark:bg-blue-900/20 dark:text-blue-200"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                  }`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}