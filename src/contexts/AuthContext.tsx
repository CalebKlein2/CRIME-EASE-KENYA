import { createContext, useContext, useEffect, useState } from "react";
import { useClerk, useUser } from "@clerk/clerk-react";
import { supabase } from "@/lib/supabase";

interface User {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "officer" | "civilian";
  station_id?: string;
  badge_number?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { signOut } = useClerk();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!clerkLoaded) return;

    const syncUserWithSupabase = async () => {
      if (!clerkUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        // For development, use mock data
        if (import.meta.env.DEV) {
          setUser({
            id: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress || "",
            full_name: `${clerkUser.firstName} ${clerkUser.lastName}`,
            role: "admin", // Default to admin in dev
            station_id: "station-1",
            badge_number: "ADMIN001"
          });
        } else {
          // In production, fetch user data from Supabase
          const { data: userData, error } = await supabase
            .from("users")
            .select("*")
            .eq("clerk_id", clerkUser.id)
            .single();

          if (error) throw error;

          setUser({
            id: userData.id,
            email: userData.email,
            full_name: userData.full_name,
            role: userData.role,
            station_id: userData.station_id,
            badge_number: userData.badge_number
          });
        }
      } catch (error) {
        console.error("Error syncing user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    syncUserWithSupabase();
  }, [clerkUser, clerkLoaded]);

  const refreshUser = async () => {
    if (!clerkUser) return;
    setIsLoading(true);
    try {
      if (import.meta.env.DEV) {
        // Refresh mock data in development
        setUser({
          id: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress || "",
          full_name: `${clerkUser.firstName} ${clerkUser.lastName}`,
          role: "admin",
          station_id: "station-1",
          badge_number: "ADMIN001"
        });
      } else {
        // In production, refresh from Supabase
        const { data: userData, error } = await supabase
          .from("users")
          .select("*")
          .eq("clerk_id", clerkUser.id)
          .single();

        if (error) throw error;

        setUser({
          id: userData.id,
          email: userData.email,
          full_name: userData.full_name,
          role: userData.role,
          station_id: userData.station_id,
          badge_number: userData.badge_number
        });
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    throw new Error("Direct login is not supported. Please use Clerk components.");
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, refreshUser, login, logout }}>
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
