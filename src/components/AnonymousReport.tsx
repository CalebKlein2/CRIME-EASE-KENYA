import ReportCrimeForm from "./ReportCrimeForm";
import { Shield } from "lucide-react";

export default function AnonymousReport() {
  const handleSubmit = (data: any) => {
    console.log("Anonymous report submitted:", data);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">CrimeEase</span>
          </div>
        </div>
        <div className="flex justify-center">
          <ReportCrimeForm
            onSubmit={handleSubmit}
            initialStep={1}
            isAnonymousDefault={true}
          />
        </div>
      </div>
    </div>
  );
}
