import { Shield } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import EmergencySOSButton from "./EmergencySOSButton";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold">CrimeEase</span>
        </Link>

        <div className="flex items-center gap-4">
          <EmergencySOSButton />
          
          <SignedOut>
            <div className="space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link to={getDashboardUrl(user?.role)}>
                  Dashboard
                </Link>
              </Button>
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}

function getDashboardUrl(role?: string) {
  switch (role) {
    case "officer":
      return "/officer-dashboard";
    case "station_admin":
      return "/station-dashboard";
    case "national_admin":
      return "/national-dashboard";
    case "citizen":
      return "/citizen-dashboard";
    default:
      return "/dashboard";
  }
}
