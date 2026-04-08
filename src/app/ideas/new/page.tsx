// ============================================
// VentureAI — New Idea Page (protected)
// Form to submit a new startup idea
// Shows animated processing state during AI analysis
// ============================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import IdeaForm from "@/components/ideas/IdeaForm";
import AnalyzingLoader from "@/components/ideas/AnalyzingLoader";
import { IdeaFormData } from "@/types";
import toast from "react-hot-toast";
import { Lightbulb, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewIdeaPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: IdeaFormData) => {
    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to analyze idea");
      }

      toast.success("Analysis complete! Here's your report.");
      // Redirect to the idea's detail page
      router.push(`/ideas/${result.data.id}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
      setIsAnalyzing(false);
    }
  };

  // Show animated loader while AI is processing
  if (isAnalyzing) {
    return <AnalyzingLoader />;
  }

  return (
    <div className="min-h-screen bg-[#05060a]">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[rgba(155,89,208,0.2)] to-[rgba(0,212,255,0.2)] border border-[rgba(155,89,208,0.3)] flex items-center justify-center mx-auto mb-5">
            <Lightbulb className="w-7 h-7 text-[#9b59d0]" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-white mb-3">
            Validate Your Idea
          </h1>
          <p className="text-slate-400 leading-relaxed">
            Describe your startup idea below. The more detail you provide, the
            more accurate the AI analysis will be.
          </p>
        </div>

        {/* Form */}
        <div className="animate-fade-in-up">
          <IdeaForm onSubmit={handleSubmit} />
        </div>

        {/* Tips */}
        <div className="mt-8 p-5 rounded-xl glass border border-[rgba(155,89,208,0.1)] animate-fade-in-up">
          <p className="text-slate-400 text-sm font-medium mb-3">
            💡 Tips for a better analysis:
          </p>
          <ul className="space-y-1.5 text-slate-500 text-sm">
            <li>• Describe the specific problem you&apos;re solving</li>
            <li>• Mention your target customer or market</li>
            <li>• Include any unique insight or unfair advantage you have</li>
            <li>• Explain your intended business model if you have one</li>
          </ul>
        </div>
      </main>
    </div>
  );
}