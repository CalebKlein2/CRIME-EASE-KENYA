// src/components/layout/Sidebar.tsx
import React from "react";
import { Link } from "react-router-dom";

interface SidebarProps {
  navItems: {
    label: string;
    href: string;
    icon: React.ReactNode;
    active?: boolean;
  }[];
}

export function Sidebar({ navItems }: SidebarProps) {
  return (
    <div className="flex-1 overflow-hidden">
      <nav className="h-full overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                  item.active
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                replace // Add replace to prevent adding to history stack
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}