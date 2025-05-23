import { SignIn } from "@clerk/clerk-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 pt-20">
      <div className="w-full max-w-md">
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-white shadow-xl border-0",
              headerTitle: "text-2xl font-bold text-center text-gray-900",
              headerSubtitle: "text-center text-gray-600",
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
              formFieldInput: "rounded-lg border-gray-300",
              footerActionLink: "text-blue-600 hover:text-blue-700"
            }
          }}
          routing="path"
          path="/login"
          signUpUrl="/signup"
          redirectUrl="/dashboard"
        />
      </div>
    </div>
  );
}
