// Mock auth functions for development

interface User {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "officer" | "civilian";
  station_id?: string;
  badge_number?: string;
}

interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "officer" | "civilian";
}

export async function signUp(
  email: string,
  password: string,
  fullName: string,
) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock successful signup
  const mockUser: User = {
    id: "mock-" + Date.now(),
    email,
    full_name: fullName,
    role: "civilian"
  };

  return { user: mockUser };
}

export async function signIn(email: string, password: string) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock successful login
  const mockUser: User = {
    id: "mock-user-1",
    email,
    full_name: "Admin User",
    role: "admin",
    station_id: "station-1",
    badge_number: "ADMIN001"
  };

  return { user: mockUser };
}

export async function signOut() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return {};
}

export async function getCurrentUser() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock current user
  const mockUser: User = {
    id: "mock-user-1",
    email: "admin@police.go.ke",
    full_name: "Admin User",
    role: "admin",
    station_id: "station-1",
    badge_number: "ADMIN001"
  };

  const mockProfile: Profile = {
    id: mockUser.id,
    email: mockUser.email,
    full_name: mockUser.full_name,
    role: mockUser.role
  };

  return { ...mockUser, profile: mockProfile };
}
