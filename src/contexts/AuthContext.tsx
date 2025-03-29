import { createContext, useContext, useEffect, useState } from "react";
import { useClerk, useUser } from "@clerk/clerk-react";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { UserResource } from "@clerk/types";
import type { Id } from "../../convex/_generated/dataModel";

// Define a more comprehensive role type to match our application needs
export type UserRole = "citizen" | "officer" | "station_admin" | "national_admin";

interface ConvexUser {
  _id: Id<"users">;
  id: string;
  clerk_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  profile_image?: string;
  phone_number?: string;
  created_at: number;
  officer?: {
    badge_number?: string;
    station_id?: string;
    station_code?: string;
  };
}

interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  station_id?: string;
  badge_number?: string;
  station_code?: string;
  security_code?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  isLoaded: boolean;
  refreshUser: () => Promise<void>;
  login: (credentials?: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  setUserRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded: clerkLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Convex mutations
  const updateUserRole = useMutation(api.users.updateUserRole);
  const convexUser = useQuery(
    api.users.getByClerkId, 
    clerkUser?.id ? { clerkId: clerkUser.id } : "skip"
  );

  useEffect(() => {
    if (!clerkLoaded) return;

    const syncUserWithDatabase = async () => {
      if (!clerkUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        // Get role from Clerk metadata first
        const clerkUserResource = clerkUser as UserResource;
        const clerkRole = (clerkUserResource.publicMetadata?.role as UserRole) || "citizen";
        console.log(`[AuthContext] Role from Clerk metadata:`, clerkRole);

        // Try to get user from Convex
        if (convexUser) {
          const typedConvexUser = convexUser as unknown as ConvexUser;
          console.log(`[AuthContext] Found user in Convex:`, {
            convexRole: typedConvexUser.role,
            clerkRole: clerkRole
          });

          // If roles don't match, prefer Clerk's role and update Convex
          if (clerkRole && clerkRole !== typedConvexUser.role) {
            console.log(`[AuthContext] Role mismatch - updating Convex role to match Clerk:`, {
              from: typedConvexUser.role,
              to: clerkRole
            });
            await updateUserRole({
              userId: typedConvexUser._id,
              role: clerkRole
            });
          }

          // Extract officer data if available
          const officerData = typedConvexUser.officer || {};
          
          // Set user data with the correct role
          setUser({
            id: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress || "",
            full_name: typedConvexUser.full_name || `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
            role: clerkRole || typedConvexUser.role,
            badge_number: officerData.badge_number,
            station_id: officerData.station_id,
            station_code: officerData.station_code,
            security_code: (clerkRole || typedConvexUser.role) === "national_admin" ? "NAT-ADMIN-001" : undefined
          });
        } else {
          console.log(`[AuthContext] User not found in Convex, using Clerk data`);
          // Set basic user data from Clerk
          setUser({
            id: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress || "",
            full_name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
            role: clerkRole,
          });
        }
      } catch (error) {
        console.error("[AuthContext] Error syncing user:", error);
      }
      
      setIsLoading(false);
    };

    syncUserWithDatabase();
  }, [clerkUser, clerkLoaded, convexUser]);

  // Function to update user role
  const setUserRole = async (role: UserRole) => {
    if (!user) return;
    
    try {
      console.log(`[AuthContext] Updating user role to ${role}`);
      
      // First update Clerk metadata
      const clerkUserResource = clerkUser as UserResource;
      // @ts-ignore - Clerk type definitions don't properly expose publicMetadata
      await clerkUserResource.update({
        publicMetadata: {
          ...clerkUserResource.publicMetadata,
          role: role
        }
      });
      console.log(`[AuthContext] Updated Clerk metadata with role ${role}`);

      // Then update Convex if we have a Convex user
      if (convexUser) {
        const typedConvexUser = convexUser as unknown as ConvexUser;
        await updateUserRole({
          userId: typedConvexUser._id,
          role: role
        });
        console.log(`[AuthContext] Updated Convex with role ${role}`);
      }

      // Update local state
      setUser(prev => prev ? { ...prev, role } : null);
    } catch (error) {
      console.error("[AuthContext] Error updating user role:", error);
      throw error;
    }
  };

  const refreshUser = async () => {
    if (!clerkUser) return;
    setIsLoading(true);
    
    try {
      // Try to get updated user from Convex
      if (convexUser) {
        const typedConvexUser = convexUser as unknown as ConvexUser;
        // Extract officer data if available
        const officerData = typedConvexUser.officer || {};
        
        setUser(prev => ({
          ...prev!,
          role: typedConvexUser.role as UserRole,
          badge_number: officerData.badge_number,
          station_id: officerData.station_id,
          station_code: officerData.station_code,
          security_code: typedConvexUser.role === "national_admin" ? "NAT-ADMIN-001" : undefined
        }));
      } else if (import.meta.env.DEV) {
        // For development, just simulate loading
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        // Fallback to Supabase in production
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("clerk_id", clerkUser.id)
          .single();

        if (data) {
          setUser(prev => ({
            ...prev!,
            ...data
          }));
        }
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials?: { email: string; password: string }) => {
    setIsLoading(true);
    // In a real app, you'd use these credentials to authenticate
    console.log("Login called with credentials:", credentials);
    setIsLoading(false);
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isSignedIn: !!isSignedIn,
        isLoaded: clerkLoaded,
        refreshUser,
        login,
        logout,
        setUserRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
