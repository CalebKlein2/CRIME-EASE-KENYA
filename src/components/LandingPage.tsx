import { Button } from "./ui/button";
import { Shield, FileText, MessageSquare, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import EmergencySOSButton from "./EmergencySOSButton";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">
              Report Crimes Safely and Securely
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              A modern platform that enables citizens to report crimes and track
              cases with complete anonymity when needed.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild>
                <Link to="/login">Report a Crime</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/anonymous">Report Anonymously</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Emergency SOS Section */}
        <section className="py-12 bg-red-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Emergency Assistance</h2>
            <p className="text-lg text-gray-600 mb-6">
              Need immediate help? Use our Emergency SOS feature
            </p>
            <EmergencySOSButton />
          </div>
        </section>

        {/* Features */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Easy Reporting</h3>
                <p className="text-gray-600">
                  Submit reports quickly with our intuitive form, with optional
                  anonymity.
                </p>
              </div>
              <div className="text-center p-6">
                <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Secure Communication
                </h3>
                <p className="text-gray-600">
                  Direct messaging with law enforcement while maintaining your
                  privacy.
                </p>
              </div>
              <div className="text-center p-6">
                <Bell className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Real-time Updates
                </h3>
                <p className="text-gray-600">
                  Get notifications about your case status and important
                  updates.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 border-t py-12">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2024 CrimeEase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
