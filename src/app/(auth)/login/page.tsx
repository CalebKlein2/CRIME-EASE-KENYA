// src/app/(auth)/login/page.tsx
"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Users, 
  Building, 
  Globe, 
  ArrowRight,
  GraduationCap 
} from "lucide-react";
import { motion } from "framer-motion";

export default function LoginSelector() {
  const navigate = useNavigate();

  const roleOptions = [
    {
      title: "Citizen",
      description: "Report crimes and track your cases",
      icon: <Users className="h-8 w-8" />,
      path: "/citizen-login",
      color: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
      textColor: "text-blue-600"
    },
    {
      title: "Police Officer",
      description: "Manage cases and evidence",
      icon: <Shield className="h-8 w-8" />,
      path: "/officer-login",
      color: "bg-green-600",
      hoverColor: "hover:bg-green-700",
      textColor: "text-green-600"
    },
    {
      title: "Station Admin",
      description: "Manage station resources and officers",
      icon: <Building className="h-8 w-8" />,
      path: "/station-admin-login",
      color: "bg-purple-600",
      hoverColor: "hover:bg-purple-700",
      textColor: "text-purple-600"
    },
    {
      title: "National Admin",
      description: "Country-wide crime analytics and oversight",
      icon: <Globe className="h-8 w-8" />,
      path: "/national-admin-login",
      color: "bg-red-600",
      hoverColor: "hover:bg-red-700",
      textColor: "text-red-600"
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <AuthLayout 
      title="Welcome to CrimeEase Kenya"
      subtitle="Please select the appropriate portal to access your account"
    >
      <div className="max-w-md mx-auto w-full">
        <motion.div 
          className="grid gap-4 mt-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {roleOptions.map((option, index) => (
            <motion.div key={option.title} variants={item}>
              <Button
                variant="outline"
                className={`group relative flex w-full justify-start items-center gap-4 p-5 h-auto border-2 transition-all duration-300 hover:border-${option.color.split('-')[1]}-600`}
                onClick={() => navigate(option.path)}
              >
                <div className={`p-3 rounded-full ${option.color} text-white`}>
                  {option.icon}
                </div>
                <div className="text-left">
                  <h3 className={`font-semibold text-lg ${option.textColor}`}>{option.title}</h3>
                  <p className="text-sm text-gray-500">{option.description}</p>
                </div>
                <ArrowRight className={`absolute right-4 opacity-0 transition-opacity duration-200 ${option.textColor} group-hover:opacity-100`} />
              </Button>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-10 pt-6 border-t border-gray-200">
          <div className="flex justify-center items-center gap-3 text-gray-500">
            <GraduationCap className="h-5 w-5" />
            <span className="text-sm">Training available for law enforcement officers</span>
          </div>
          
          <p className="mt-6 text-center text-sm text-gray-500">
            Need help? Contact support at{" "}
            <a href="mailto:support@crimeease.go.ke" className="text-blue-600 hover:text-blue-800">
              support@crimeease.go.ke
            </a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}