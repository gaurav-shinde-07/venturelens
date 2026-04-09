"use client";

import Link from "next/link";
import { Idea } from "@/types";
import {
  formatRelativeTime,
  getRiskColor,
  getProfitabilityColor,
  getProfitabilityLabel,
  truncate,
} from "@/lib/utils";
import {
  Clock,
  CheckCircle,
  Loader2,
  XCircle,
  ArrowRight,
  BarChart3,
  Shield,
} from "lucide-react";
import type { ElementType } from "react"; //  FIX

interface IdeaCardProps {
  idea: Idea;
}

//  FIXED TYPE
const statusConfig: Record<
  string,
  {
    label: string;
    icon: ElementType;
    className: string;
    animate: boolean;
  }
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "text-slate-400 bg-slate-400/10 border-slate-400/20",
    animate: false,
  },
  analyzing: {
    label: "Analyzing...",
    icon: Loader2,
    className:
      "text-[#00d4ff] bg-[rgba(0,212,255,0.1)] border-[rgba(0,212,255,0.2)]",
    animate: true,
  },
  completed: {
    label: "Completed",
    icon: CheckCircle,
    className:
      "text-[#10b981] bg-[rgba(16,185,129,0.1)] border-[rgba(16,185,129,0.2)]",
    animate: false,
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    className:
      "text-[#ef4444] bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.2)]",
    animate: false,
  },
};

export default function IdeaCard({ idea }: IdeaCardProps) {
  const status = statusConfig[idea.status] ?? statusConfig.pending;
  const StatusIcon = status.icon;
  const isClickable = idea.status === "completed";

  const content = (
    <div
      className={`glass rounded-2xl p-6 card-hover border border-[rgba(155,89,208,0.1)] ${
        isClickable ? "cursor-pointer" : "cursor-default"
      } group h-full`}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="font-heading font-semibold text-white text-base leading-snug group-hover:text-[#b47ee0] transition-colors line-clamp-2">
          {idea.title}
        </h3>
        <span
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap flex-shrink-0 ${status.className}`}
        >
          <StatusIcon
            className={`w-3 h-3 ${status.animate ? "animate-spin" : ""}`}
          />
          {status.label}
        </span>
      </div>

      <p className="text-slate-500 text-sm leading-relaxed mb-5">
        {truncate(idea.description, 100)}
      </p>

      {idea.status === "completed" && (
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          {idea.profitability !== null && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
              <BarChart3
                className={`w-3.5 h-3.5 ${getProfitabilityColor(
                  idea.profitability
                )}`}
              />
              <span
                className={`text-xs font-semibold ${getProfitabilityColor(
                  idea.profitability
                )}`}
              >
                {idea.profitability}/100
              </span>
              <span className="text-slate-600 text-xs">
                {getProfitabilityLabel(idea.profitability)}
              </span>
            </div>
          )}

          {idea.risk_level && (
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${getRiskColor(
                idea.risk_level
              )}`}
            >
              <Shield className="w-3.5 h-3.5" />
              {idea.risk_level} Risk
            </div>
          )}
        </div>
      )}

      {idea.status === "analyzing" && (
        <div className="space-y-2 mb-5">
          <div className="skeleton h-2 rounded-full w-full" />
          <div className="skeleton h-2 rounded-full w-4/5" />
          <div className="skeleton h-2 rounded-full w-3/5" />
        </div>
      )}

      {idea.status === "failed" && (
        <p className="text-[#ef4444] text-xs mb-5">
          AI analysis failed. Please try submitting again.
        </p>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.04)]">
        <span className="text-slate-600 text-xs">
          {formatRelativeTime(idea.created_at)}
        </span>
        {isClickable && (
          <span className="flex items-center gap-1 text-[#9b59d0] text-xs font-medium group-hover:text-[#b47ee0] transition-colors">
            View Report
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        )}
      </div>
    </div>
  );

  if (isClickable) {
    return (
      <Link href={`/ideas/${idea.id}`} className="block h-full">
        {content}
      </Link>
    );
  }

  return <div className="h-full">{content}</div>;
}