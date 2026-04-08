// ============================================
// VentureAI — Stats Bar Component
// Shows aggregate analytics across user's ideas
// ============================================

import { Idea, DashboardStats } from "@/types";
import { BarChart3, Lightbulb, TrendingUp, Shield } from "lucide-react";

interface StatsBarProps {
  ideas: Idea[];
}

function computeStats(ideas: Idea[]): DashboardStats {
  const completed = ideas.filter((i) => i.status === "completed");

  const avgProfitability =
    completed.length > 0
      ? Math.round(
          completed.reduce((sum, i) => sum + (i.profitability ?? 0), 0) /
            completed.length
        )
      : 0;

  const riskDistribution = { Low: 0, Medium: 0, High: 0 };
  completed.forEach((i) => {
    if (i.risk_level) riskDistribution[i.risk_level]++;
  });

  return {
    totalIdeas: ideas.length,
    completedIdeas: completed.length,
    averageProfitability: avgProfitability,
    riskDistribution,
  };
}

export default function StatsBar({ ideas }: StatsBarProps) {
  const stats = computeStats(ideas);

  const cards = [
    {
      icon: Lightbulb,
      label: "Total Ideas",
      value: stats.totalIdeas,
      color: "text-[#9b59d0]",
      bg: "bg-[rgba(155,89,208,0.1)]",
    },
    {
      icon: BarChart3,
      label: "Avg. Profitability",
      value: `${stats.averageProfitability}/100`,
      color: "text-[#00d4ff]",
      bg: "bg-[rgba(0,212,255,0.1)]",
    },
    {
      icon: TrendingUp,
      label: "Completed Analyses",
      value: stats.completedIdeas,
      color: "text-[#10b981]",
      bg: "bg-[rgba(16,185,129,0.1)]",
    },
    {
      icon: Shield,
      label: "Low Risk Ideas",
      value: stats.riskDistribution.Low,
      color: "text-[#f59e0b]",
      bg: "bg-[rgba(245,158,11,0.1)]",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="glass rounded-xl p-4 border border-[rgba(155,89,208,0.1)]"
        >
          <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center mb-3`}>
            <card.icon className={`w-4 h-4 ${card.color}`} />
          </div>
          <div className={`font-heading text-2xl font-bold ${card.color} mb-0.5`}>
            {card.value}
          </div>
          <div className="text-slate-500 text-xs">{card.label}</div>
        </div>
      ))}
    </div>
  );
}