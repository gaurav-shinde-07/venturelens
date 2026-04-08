// ============================================
// VentureAI — Dashboard Page (protected)
// Shows all user's ideas, stats, and quick actions
// Server Component — fetches data server-side
// ============================================

import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Idea } from "@/types";
import IdeaCard from "@/components/ideas/IdeaCard";
import StatsBar from "@/components/dashboard/StatsBar";
import EmptyState from "@/components/dashboard/EmptyState";
import Navbar from "@/components/layout/Navbar";
import { PlusCircle, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  // Verify authentication — redirect if not logged in
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  // Fetch user's profile for greeting
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  // Fetch all user's ideas, newest first
  const { data: ideas, error } = await supabase
    .from("ideas")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Non-critical error — show empty state rather than crash
  const userIdeas: Idea[] = ideas ?? [];

  const firstName = profile?.full_name?.split(" ")[0] ||
    user.email?.split("@")[0] || "there";

  return (
    <div className="min-h-screen bg-[#05060a]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* ---- Page Header ---- */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <p className="text-slate-500 text-sm mb-1">
              Good {getGreeting()}, {firstName} 👋
            </p>
            <h1 className="font-heading text-3xl font-bold text-white">
              Your Ideas
            </h1>
          </div>
          <Link
            href="/ideas/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white btn-accent relative z-10 text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Validate New Idea
          </Link>
        </div>

        {/* ---- Stats Bar (only show when there are completed ideas) ---- */}
        {userIdeas.some((i) => i.status === "completed") && (
          <div className="mb-8 animate-fade-in-up">
            <StatsBar ideas={userIdeas} />
          </div>
        )}

        {/* ---- Ideas Grid / Empty State ---- */}
        {userIdeas.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userIdeas.map((idea, index) => (
              <div
                key={idea.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <IdeaCard idea={idea} />
              </div>
            ))}
          </div>
        )}

        {/* ---- Pro tip when user has ideas ---- */}
        {userIdeas.length > 0 && userIdeas.length < 3 && (
          <div className="mt-8 p-4 rounded-xl glass border border-[rgba(0,212,255,0.1)] flex items-center gap-3 animate-fade-in">
            <Sparkles className="w-5 h-5 text-[#00d4ff] flex-shrink-0" />
            <p className="text-slate-400 text-sm">
              <span className="text-white font-medium">Pro tip:</span> Validate
              multiple variations of your idea to see which angle scores
              highest.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

// Helper — time-based greeting
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}