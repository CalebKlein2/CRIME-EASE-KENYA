import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";

type User = any; // Replace with proper type from supabase

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const user = await getCurrentUser();
      setUser(user);
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, refreshUser }}>
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
