// @ts-nocheck
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
  profile?: {
    full_name?: string;
    avatar_url?: string;
  };
  station?: {
    name?: string;
    id?: string;
    code?: string;
  };
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
  const createUser = useMutation(api.users.createFromClerk);
  const convexUser = useQuery(
    api.users.getByClerkId, 
    clerkUser?.id ? { clerkId: clerkUser.id } : "skip"
  );
  
  // Debug logging for Convex query status
  useEffect(() => {
    if (clerkUser?.id) {
      console.log("[AuthContext] Convex query status:", {
        hasClerkId: !!clerkUser?.id,
        convexQueryParam: clerkUser?.id ? { clerkId: clerkUser.id } : "skip",
        convexUserResult: convexUser
      });
    }
  }, [clerkUser?.id, convexUser]);

  useEffect(() => {
    if (!clerkLoaded) return;

    const syncUserWithDatabase = async () => {
      console.log("[AuthContext] Starting user sync", { 
        isSignedIn, 
        clerkLoaded,
        hasClerkUser: !!clerkUser,
        hasConvexUser: !!convexUser
      });
      
      // If the user has logged out, clear user state
      if (!clerkUser) {
        console.log("[AuthContext] No Clerk user, setting user to null");
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Get the user's role from Clerk metadata
      let clerkRole: UserRole = "citizen"; // Default role
      
      // Try to get role from JWT first
      if (clerkUser.publicMetadata && clerkUser.publicMetadata.role) {
        clerkRole = clerkUser.publicMetadata.role as UserRole;
        console.log(`[AuthContext] Role from Clerk metadata: ${clerkRole}`);
      } else {
        // If not in JWT, try to get it directly from Clerk
        console.log(`[AuthContext] Role not found in JWT, fetching from Clerk directly`);
        try {
          // @ts-ignore - Clerk type definitions don't properly expose publicMetadata
          const metadata = clerkUser.publicMetadata || {};
          if (metadata.role) {
            clerkRole = metadata.role as UserRole;
            console.log(`[AuthContext] Role fetched from Clerk: ${clerkRole}`);
          } else {
            console.log(`[AuthContext] No role found in Clerk, using default: ${clerkRole}`);
          }
        } catch (metadataError) {
          console.error("[AuthContext] Error getting metadata from Clerk:", metadataError);
          console.log(`[AuthContext] Using default role: ${clerkRole}`);
        }
      }

      // Set a timeout for Convex connection
      let convexTimeout: NodeJS.Timeout | null = setTimeout(() => {
        console.log("[AuthContext] Convex connection timed out, using fallback user");
        
        // If Convex is taking too long, create a fallback user
        setUser({
          id: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress || "",
          full_name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
          role: clerkRole,
          // Add role-specific fields for fallback functionality
          badge_number: clerkRole === "officer" || clerkRole === "station_admin" ? 
            `TEMP-${clerkUser.id.substring(0, 6)}` : undefined,
          station_code: clerkRole === "officer" || clerkRole === "station_admin" ? 
            "PLACEHOLDER" : undefined,
          security_code: clerkRole === "national_admin" ? 
            "NAT-ADMIN-FALLBACK" : undefined
        });
        setIsLoading(false);
      }, 4000); // 4 second timeout

      try {
        // Set basic user data from Clerk
        setUser({
          id: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress || "",
          full_name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
          role: clerkRole,
        });

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
            role: clerkRole,
            badge_number: officerData.badge_number,
            station_id: officerData.station_id,
            station_code: officerData.station_code,
            security_code: clerkRole === "national_admin" ? "NAT-ADMIN-001" : undefined
          });
        } else {
          console.log(`[AuthContext] User not found in Convex, creating new user`);
          
          // User doesn't exist in Convex yet, create them
          // Add retry logic for initial user creation
          let retries = 0;
          const maxRetries = 3;
          let success = false;
          
          while (!success && retries < maxRetries) {
            try {
              // Create the user in Convex
              const result = await createUser({
                clerkId: clerkUser.id,
                email: clerkUser.primaryEmailAddress?.emailAddress || "",
                fullName: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
                profileImage: clerkUser.imageUrl,
                phoneNumber: clerkUser.phoneNumbers?.[0]?.phoneNumber,
                role: clerkRole
              });
              
              console.log(`[AuthContext] Created new user in Convex:`, result);
              success = true;
              
              // Set basic user data from Clerk
              setUser({
                id: clerkUser.id,
                email: clerkUser.primaryEmailAddress?.emailAddress || "",
                full_name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
                role: clerkRole,
              });
            } catch (error) {
              retries++;
              console.error(`[AuthContext] Error creating user in Convex (attempt ${retries}/${maxRetries}):`, error);
              
              if (retries < maxRetries) {
                // Wait before retrying (exponential backoff)
                const waitTime = Math.pow(2, retries) * 500;
                console.log(`[AuthContext] Retrying in ${waitTime}ms...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
              } else {
                console.error("[AuthContext] Failed to create user after multiple attempts");
                
                // CRITICAL: Create a fallback user even if Convex is down
                console.log("[AuthContext] Creating fallback local-only user with role from Clerk");
                setUser({
                  id: clerkUser.id,
                  email: clerkUser.primaryEmailAddress?.emailAddress || "",
                  full_name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
                  role: clerkRole,
                  // Add role-specific fields for fallback functionality
                  badge_number: clerkRole === "officer" || clerkRole === "station_admin" ? 
                    `TEMP-${clerkUser.id.substring(0, 6)}` : undefined,
                  station_code: clerkRole === "officer" || clerkRole === "station_admin" ? 
                    "PLACEHOLDER" : undefined,
                  security_code: clerkRole === "national_admin" ? 
                    "NAT-ADMIN-FALLBACK" : undefined
                });
                console.log("[AuthContext] Fallback user created:", {
                  role: clerkRole, 
                  name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim()
                });
              }
            }
          }
        }
      } catch (error) {
        console.error("[AuthContext] Error syncing user:", error);
      }
      
      clearTimeout(convexTimeout as NodeJS.Timeout);
      setIsLoading(false);
    };

    syncUserWithDatabase();
  }, [clerkUser, clerkLoaded, convexUser]);

  // Function to update user role with retry logic
  const setUserRole = async (role: UserRole) => {
    if (!user) return;
    
    try {
      console.log(`[AuthContext] Updating user role to ${role}`);
      
      // First update Clerk metadata
      try {
        // @ts-ignore - Clerk type definitions don't properly expose publicMetadata
        await clerkUser.update({
          publicMetadata: {
            ...(clerkUser.publicMetadata || {}),
            role: role
          }
        });
        console.log(`[AuthContext] Updated Clerk metadata with role ${role}`);
        
        // Force a session refresh to ensure the token has the updated metadata
        try {
          // @ts-ignore - Using window.Clerk directly
          if (typeof window !== 'undefined' && window.Clerk) {
            await window.Clerk.session.touch();
            console.log(`[AuthContext] Refreshed Clerk session`);
          }
        } catch (refreshError) {
          console.error("[AuthContext] Error refreshing session:", refreshError);
          // Continue anyway
        }
      } catch (error) {
        console.error("[AuthContext] Error updating Clerk metadata:", error);
        // Continue anyway to try updating Convex
      }

      // Then update Convex if we have a Convex user
      if (convexUser) {
        const typedConvexUser = convexUser as unknown as ConvexUser;
        
        // Add retry logic for Convex operations
        let retries = 0;
        const maxRetries = 3;
        let success = false;
        
        while (!success && retries < maxRetries) {
          try {
            await updateUserRole({
              userId: typedConvexUser._id,
              role: role
            });
            console.log(`[AuthContext] Updated Convex with role ${role}`);
            success = true;
          } catch (error) {
            retries++;
            console.error(`[AuthContext] Error updating Convex role (attempt ${retries}/${maxRetries}):`, error);
            if (retries < maxRetries) {
              // Wait before retrying (exponential backoff)
              const waitTime = Math.pow(2, retries) * 500;
              console.log(`[AuthContext] Retrying in ${waitTime}ms...`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
            } else {
              throw error;
            }
          }
        }
      } else {
        // If we don't have a Convex user yet, create one
        console.log(`[AuthContext] No Convex user found, creating new user with role ${role}`);
        
        // Add retry logic for user creation
        let retries = 0;
        const maxRetries = 3;
        let success = false;
        
        while (!success && retries < maxRetries) {
          try {
            const result = await createUser({
              clerkId: clerkUser.id,
              email: clerkUser.primaryEmailAddress?.emailAddress || "",
              fullName: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
              profileImage: clerkUser.imageUrl,
              phoneNumber: clerkUser.phoneNumbers?.[0]?.phoneNumber,
              role: role
            });
            console.log(`[AuthContext] Created new user in Convex with role ${role}:`, result);
            success = true;
          } catch (error) {
            retries++;
            console.error(`[AuthContext] Error creating user in Convex (attempt ${retries}/${maxRetries}):`, error);
            if (retries < maxRetries) {
              // Wait before retrying (exponential backoff)
              const waitTime = Math.pow(2, retries) * 500;
              console.log(`[AuthContext] Retrying in ${waitTime}ms...`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
            } else {
              console.error("[AuthContext] Failed to create user after multiple attempts");
            }
          }
        }
      }

      // Update local state
      setUser(prev => prev ? { ...prev, role } : null);
      console.log(`[AuthContext] Updated local state with role ${role}`);
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
    console.log("[AuthContext] Login function called", credentials ? "with credentials" : "without credentials");
    setIsLoading(true);
    // In a real app, you'd use these credentials to authenticate
    console.log("Login called with credentials:", credentials);
    console.log("[AuthContext] Would use credentials here, but Clerk handles auth");
    // Clerk handles the actual authentication
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
