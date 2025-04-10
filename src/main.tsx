import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const basename = import.meta.env.BASE_URL;
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const CONVEX_URL = import.meta.env.VITE_CONVEX_URL || "https://notable-alpaca-532.convex.cloud";

console.log("Using Convex URL:", CONVEX_URL);

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

// Initialize Convex client
const convex = new ConvexReactClient(CONVEX_URL);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
      afterSignOutUrl="/sign-in"
      appearance={{
        elements: {
          // Customize the appearance of the UserButton
          userButtonBox: "rounded-full border-2 border-blue-500 hover:border-blue-600",
          // Hide the default Clerk components when our custom components are used
          formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
          footerActionLink: "text-blue-600 hover:text-blue-700",
          card: "shadow-lg border-0"
        },
        layout: {
          socialButtonsVariant: "iconButton",
          socialButtonsPlacement: "bottom",
          termsPageUrl: "/terms",
          privacyPageUrl: "/privacy",
          showOptionalFields: false
        }
      }}
    >
      <ConvexProvider client={convex}>
        <BrowserRouter basename={basename}>
          <App />
        </BrowserRouter>
      </ConvexProvider>
    </ClerkProvider>
  </React.StrictMode>,
);
