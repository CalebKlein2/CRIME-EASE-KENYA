// @ts-nocheck
// src/components/layout/AuthLayout.tsx
import React from "react";
import { Shield } from "lucide-react";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">CrimeEase</span>
          </Link>
          <h1 className="text-2xl font-bold mt-6">{title}</h1>
          {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
}
