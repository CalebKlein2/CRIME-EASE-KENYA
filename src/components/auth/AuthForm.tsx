import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignIn, useSignUp } from "@clerk/clerk-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export type UserRole = "citizen" | "officer" | "station_admin" | "national_admin";

const DEFAULT_EMAILS: Record<UserRole, string> = {
  citizen: "citizen@example.com",
  officer: "officer@police.go.ke",
  station_admin: "station@police.go.ke",
  national_admin: "admin@nationalpolice.go.ke",
};

const DEFAULT_PASSWORDS = "Password123";

export interface AuthFormProps {
  title: string;
  subtitle: string;
  role: UserRole;
  isSignUp?: boolean;
  redirectUrl: string;
  extraFields?: React.ReactNode;
  showExtraLinks?: boolean;
}

export function AuthForm({
  title,
  subtitle,
  role,
  isSignUp = false,
  redirectUrl,
  extraFields,
  showExtraLinks = true,
}: AuthFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { isLoaded: isSignInLoaded, signIn, setActive } = useSignIn();
  const { isLoaded: isSignUpLoaded, signUp } = useSignUp();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: DEFAULT_EMAILS[role] || "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignInLoaded) return;
    
    setIsLoading(true);
    
    try {
      const result = await signIn.create({
        identifier: formData.email,
        password: formData.password,
      });
      
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate(redirectUrl);
      } else {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: err.errors?.[0]?.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignUpLoaded) return;
    
    setIsLoading(true);
    
    try {
      const result = await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        unsafeMetadata: {
          role: role
        }
      });
      
      if (result.status === "complete") {
        navigate(redirectUrl);
      } else {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Signup Failed",
        description: err.errors?.[0]?.message || "Registration failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title={title} subtitle={subtitle}>
      <Link 
        to="/login" 
        className="inline-flex items-center text-sm text-blue-600 mb-4 hover:underline"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to portal selection
      </Link>
      
      <form 
        onSubmit={isSignUp ? handleSignUp : handleSignIn} 
        className="space-y-4"
      >
        {isSignUp && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="First name"
                required={isSignUp}
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Last name"
                required={isSignUp}
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={DEFAULT_EMAILS[role]}
            required
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        
        {extraFields}
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            {!isSignUp && (
              <Link 
                to="/forgot-password" 
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Forgot password?
              </Link>
            )}
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder={isSignUp ? "Create a password" : "Enter password"}
              required
              value={formData.password}
              onChange={handleInputChange}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {isSignUp && (
            <p className="text-xs text-gray-500 mt-1">
              Password must be at least 8 characters and include a number
            </p>
          )}
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading 
            ? (isSignUp ? "Creating Account..." : "Logging in...") 
            : (isSignUp ? "Create Account" : "Log In")}
        </Button>
      </form>
      
      {showExtraLinks && (
        <div className="mt-6 pt-4 border-t text-center text-sm text-gray-500">
          {isSignUp ? (
            <p>
              Already have an account?{" "}
              <Link 
                to={role === "citizen" ? "/citizen-login" : `/${role.replace("_", "-")}-login`} 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Log in
              </Link>
            </p>
          ) : (
            <p>
              {role === "citizen" && (
                <>
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                    Sign up
                  </Link>
                </>
              )}
            </p>
          )}
          
          {role === "citizen" && !isSignUp && (
            <div className="mt-4">
              <Link 
                to="/anonymous" 
                className="text-blue-600 hover:text-blue-800"
              >
                File an anonymous report
              </Link>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-2 rounded">
        <p>Test credentials: {DEFAULT_EMAILS[role]} / {DEFAULT_PASSWORDS}</p>
      </div>
    </AuthLayout>
  );
}
