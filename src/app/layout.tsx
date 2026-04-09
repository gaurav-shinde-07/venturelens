// ============================================
// VentureAI — Root Layout
// Wraps every page with providers and metadata
// ============================================

import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "VentureLens - Validate Your Startup Idea",
    template: "%s | VentureLens",
  },
  description:
    "Get an AI-powered validation report for your startup idea. Analyze market fit, competitors, risk level, and profitability in seconds.",
  keywords: ["startup", "AI", "idea validation", "market research", "venture"],
  authors: [{ name: "VentureLens" }],
  openGraph: {
    title: "VentureLens - Validate Your Startup Idea with AI",
    description:
      "Submit your startup idea and get a comprehensive AI analysis covering market fit, competitors, risk, and profitability.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#05060a] text-slate-200 antialiased min-h-screen">
        {/* Main content */}
        {children}

        {/* Global toast notification system */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#13141f",
              color: "#e2e8f0",
              border: "1px solid rgba(155, 89, 208, 0.3)",
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
              fontFamily: "Inter, sans-serif",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#13141f",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#13141f",
              },
            },
          }}
        />
      </body>
    </html>
  );
}