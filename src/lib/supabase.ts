import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Mock data for development
const mockData = {
  users: [
    {
      id: "mock-user-1",
      clerk_id: "clerk-user-1",
      email: "admin@police.go.ke",
      full_name: "Admin User",
      role: "admin",
      station_id: "station-1",
      badge_number: "ADMIN001"
    }
  ],
  police_stations: [
    {
      id: "station-1",
      name: "Central Police Station",
      location: "Nairobi CBD",
      jurisdiction: "Nairobi Central",
      contact_number: "+254700000000"
    }
  ],
  cases: [
    {
      id: "case-1",
      title: "Sample Case",
      description: "Test case description",
      status: "open",
      reporter_id: "mock-user-1",
      assigned_officer_id: "mock-user-1",
      station_id: "station-1"
    }
  ]
};

// Mock Supabase client for development
const mockSupabase = {
  auth: {
    getUser: async () => ({ data: { user: mockData.users[0] }, error: null }),
    signUp: async () => ({ data: null, error: null }),
    signIn: async () => ({ data: null, error: null }),
    signOut: async () => ({ error: null }),
  },
  from: (table: string) => ({
    select: (columns = "*") => ({
      eq: (column: string, value: any) => ({
        single: async () => {
          const data = mockData[table]?.find(item => item[column] === value);
          return { data, error: null };
        },
        async get() {
          const data = mockData[table]?.filter(item => item[column] === value);
          return { data, error: null };
        }
      }),
      async get() {
        return { data: mockData[table] || [], error: null };
      }
    }),
    insert: async (data: any) => {
      const newItem = { id: `mock-${Date.now()}`, ...data };
      mockData[table] = [...(mockData[table] || []), newItem];
      return { data: newItem, error: null };
    },
    update: async (data: any) => ({
      eq: async (column: string, value: any) => {
        const index = mockData[table]?.findIndex(item => item[column] === value);
        if (index > -1) {
          mockData[table][index] = { ...mockData[table][index], ...data };
          return { data: mockData[table][index], error: null };
        }
        return { data: null, error: new Error("Not found") };
      }
    }),
    delete: () => ({
      eq: async (column: string, value: any) => {
        const index = mockData[table]?.findIndex(item => item[column] === value);
        if (index > -1) {
          mockData[table].splice(index, 1);
          return { error: null };
        }
        return { error: new Error("Not found") };
      }
    }),
  }),
};

// Create real Supabase client if credentials are available
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials not found, using mock client");
    return mockSupabase;
  }

  try {
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error("Error creating Supabase client:", error);
    return mockSupabase;
  }
};

// Export Supabase client
export const supabase = createSupabaseClient();
