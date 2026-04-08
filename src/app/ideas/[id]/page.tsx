// ============================================
// VentureAI — Idea Detail Page (protected)
// Shows the full AI-generated validation report
// Includes: all 8 analysis sections, export, share, delete
// ============================================

import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Idea } from "@/types";
import Navbar from "@/components/layout/Navbar";
import IdeaReport from "@/components/ideas/IdeaReport";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("ideas")
    .select("title")
    .eq("id", id)
    .single();
  return { title: data?.title ?? "Idea Report" };
}

export default async function IdeaDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Verify authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Fetch the idea — RLS ensures ownership
  const { data: idea, error } = await supabase
    .from("ideas")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  // 404 if idea not found or doesn't belong to user
  if (error || !idea) notFound();

  return (
    <div className="min-h-screen bg-[#05060a]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <IdeaReport idea={idea as Idea} />
      </main>
    </div>
  );
}