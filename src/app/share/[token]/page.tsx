// ============================================
// VentureAI — Public Share Page
// Viewable by anyone with the share link
// No authentication required
// Uses share_token, not idea ID (security by obscurity)
// ============================================

import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Idea } from "@/types";
import {
  getRiskColor,
  getProfitabilityColor,
  getProfitabilityLabel,
  formatDate,
} from "@/lib/utils";
import Link from "next/link";
import {
  Zap, Shield, CheckCircle, AlertTriangle, Users,
  Globe, TrendingUp, Code, ArrowRight,
} from "lucide-react";
import type { Metadata } from "next";

type PageProps = { params: Promise<{ token: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("ideas")
    .select("title")
    .eq("share_token", token)
    .eq("is_public", true)
    .single();

  return {
    title: data?.title ? `${data.title} — VentureAI Report` : "Shared Report",
    description: "View this AI-generated startup validation report on VentureAI.",
  };
}

export default async function SharePage({ params }: PageProps) {
  const { token } = await params;
  const supabase = await createClient();

  // Fetch idea by share token — only if it's public
  const { data: idea, error } = await supabase
    .from("ideas")
    .select("*")
    .eq("share_token", token)
    .eq("is_public", true)
    .single();

  if (error || !idea) notFound();

  const typedIdea = idea as Idea;

  return (
    <div className="min-h-screen bg-[#05060a]">
      {/* Simple header for public view */}
      <header className="border-b border-[rgba(155,89,208,0.1)] py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#9b59d0] flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-heading font-bold text-white">
              Venture<span className="gradient-text">AI</span>
            </span>
          </Link>
          <Link
            href="/auth/signup"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white btn-accent relative z-10"
          >
            Validate Your Idea
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Public badge */}
        <div className="flex items-center gap-2 mb-6">
          <span className="px-3 py-1 rounded-full text-xs font-medium text-[#9b59d0] bg-[rgba(155,89,208,0.1)] border border-[rgba(155,89,208,0.2)]">
            🔗 Shared Report
          </span>
          <span className="text-slate-600 text-xs">
            Generated on {formatDate(typedIdea.created_at)}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-heading text-3xl font-bold text-white mb-8">
          {typedIdea.title}
        </h1>

        {/* Score Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="glass rounded-xl p-4">
            <p className="text-slate-500 text-xs mb-1">Profitability Score</p>
            <span className={`font-heading text-3xl font-bold ${getProfitabilityColor(typedIdea.profitability)}`}>
              {typedIdea.profitability}
            </span>
            <span className="text-slate-600 text-sm">/100</span>
            <p className={`text-xs font-medium mt-1 ${getProfitabilityColor(typedIdea.profitability)}`}>
              {getProfitabilityLabel(typedIdea.profitability)}
            </p>
          </div>
          <div className={`rounded-xl p-4 border ${getRiskColor(typedIdea.risk_level)}`}>
            <p className="text-xs opacity-70 mb-1">Risk Level</p>
            <div className="flex items-center gap-2 mt-2">
              <Shield className="w-5 h-5" />
              <span className="font-heading font-bold text-xl">{typedIdea.risk_level}</span>
            </div>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-slate-500 text-xs mb-1">Status</p>
            <div className="flex items-center gap-2 text-[#10b981] mt-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-heading font-bold text-xl">Validated</span>
            </div>
          </div>
        </div>

        {/* Report Sections */}
        <div className="space-y-4">
          <PublicSection icon={AlertTriangle} title="Problem Summary" iconColor="text-[#f59e0b]" iconBg="bg-[rgba(245,158,11,0.1)]">
            <p className="text-slate-300 leading-relaxed">{typedIdea.problem}</p>
          </PublicSection>
          <PublicSection icon={Users} title="Customer Persona" iconColor="text-[#9b59d0]" iconBg="bg-[rgba(155,89,208,0.1)]">
            <p className="text-slate-300 leading-relaxed">{typedIdea.customer}</p>
          </PublicSection>
          <PublicSection icon={Globe} title="Market Overview" iconColor="text-[#00d4ff]" iconBg="bg-[rgba(0,212,255,0.1)]">
            <p className="text-slate-300 leading-relaxed">{typedIdea.market}</p>
          </PublicSection>
          <PublicSection icon={TrendingUp} title="Competitor Analysis" iconColor="text-[#10b981]" iconBg="bg-[rgba(16,185,129,0.1)]">
            <div className="space-y-3">
              {(typedIdea.competitor ?? []).map((comp, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]">
                  <div className="w-7 h-7 rounded-lg bg-[rgba(16,185,129,0.15)] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#10b981] text-xs font-bold">{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-0.5">{comp.name}</p>
                    <p className="text-slate-400 text-sm leading-relaxed">{comp.differentiation}</p>
                  </div>
                </div>
              ))}
            </div>
          </PublicSection>
          <PublicSection icon={Code} title="Recommended Tech Stack" iconColor="text-[#b47ee0]" iconBg="bg-[rgba(180,126,224,0.1)]">
            <div className="flex flex-wrap gap-2">
              {(typedIdea.tech_stack ?? []).map((tech) => (
                <span key={tech} className="px-3 py-1.5 rounded-lg bg-[rgba(155,89,208,0.1)] border border-[rgba(155,89,208,0.2)] text-[#b47ee0] text-sm font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </PublicSection>
          <PublicSection icon={Zap} title="AI Justification" iconColor="text-[#00d4ff]" iconBg="bg-[rgba(0,212,255,0.1)]">
            <p className="text-slate-300 leading-relaxed">{typedIdea.justification}</p>
          </PublicSection>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center glass rounded-2xl p-8">
          <p className="text-slate-400 text-sm mb-4">
            Want to validate your own startup idea?
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white btn-accent relative z-10"
          >
            <Zap className="w-4 h-4" />
            Try VentureAI Free
          </Link>
        </div>
      </main>
    </div>
  );
}

function PublicSection({ icon: Icon, title, iconColor, iconBg, children }: {
  icon: React.ElementType; title: string; iconColor: string; iconBg: string; children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl p-6 border border-[rgba(155,89,208,0.08)]">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <h2 className="font-heading font-semibold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}