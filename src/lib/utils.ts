// ============================================
// VentureAI — Utility Functions
// Shared helpers used across the entire app
// ============================================

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { RiskLevel } from "@/types";

// ---- Tailwind class merger ----
// Merges Tailwind classes safely, resolving conflicts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---- Date formatting ----
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

export function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

// ---- Risk level styling ----
export function getRiskColor(risk: RiskLevel | null): string {
  switch (risk) {
    case "Low":
      return "text-success bg-success/10 border-success/20";
    case "Medium":
      return "text-warning bg-warning/10 border-warning/20";
    case "High":
      return "text-danger bg-danger/10 border-danger/20";
    default:
      return "text-gray-400 bg-gray-400/10 border-gray-400/20";
  }
}

// ---- Profitability score color ----
export function getProfitabilityColor(score: number | null): string {
  if (score === null) return "text-gray-400";
  if (score >= 70) return "text-success";
  if (score >= 40) return "text-warning";
  return "text-danger";
}

// ---- Profitability score label ----
export function getProfitabilityLabel(score: number | null): string {
  if (score === null) return "Unknown";
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Moderate";
  if (score >= 20) return "Poor";
  return "Very Low";
}

// ---- Truncate text ----
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

// ---- Copy to clipboard ----
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    return true;
  }
}

// ---- Generate share URL ----
export function generateShareUrl(shareToken: string): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${baseUrl}/share/${shareToken}`;
}

// ---- API response helpers ----
export function successResponse<T>(data: T, status = 200) {
  return Response.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status = 500) {
  return Response.json({ success: false, error: message }, { status });
}