import { Shield } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import EmergencySOSButton from "./EmergencySOSButton";

export default function Navbar() {
  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold">CrimeEase</span>
        </Link>

        <div className="flex items-center gap-4">
          <EmergencySOSButton />
          <div className="space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
