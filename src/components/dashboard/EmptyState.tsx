// ============================================
// VentureAI — Empty State Component
// Shown when user has no ideas yet
// ============================================

import Link from "next/link";
import { PlusCircle, Lightbulb } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in-up">
      {/* Animated icon */}
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[rgba(155,89,208,0.1)] to-[rgba(0,212,255,0.1)] border border-[rgba(155,89,208,0.2)] flex items-center justify-center mb-6 animate-float">
        <Lightbulb className="w-10 h-10 text-[#9b59d0]" />
      </div>

      <h2 className="font-heading text-2xl font-bold text-white mb-3">
        No ideas yet
      </h2>
      <p className="text-slate-400 text-base max-w-sm mb-8 leading-relaxed">
        Submit your first startup idea and get an AI-powered validation report
        in under 10 seconds.
      </p>

      <Link
        href="/ideas/new"
        className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white btn-accent relative z-10"
      >
        <PlusCircle className="w-5 h-5" />
        Validate Your First Idea
      </Link>
    </div>
  );
}