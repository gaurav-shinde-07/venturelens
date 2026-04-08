// ============================================
// VentureAI — Landing Page (/)
// Public page — no auth required
// Sections: Hero, Stats, Features, How it works, CTA
// ============================================

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Zap,
  BarChart3,
  Users,
  TrendingUp,
  Shield,
  Share2,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Target,
  Globe,
  Code,
} from "lucide-react";

// ---- Static data for sections ----
const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Analysis",
    description:
      "Gemini 1.5 Flash analyzes your idea across 8 dimensions in under 10 seconds. No fluff — just actionable insights.",
    color: "from-[#00d4ff] to-[#9b59d0]",
  },
  {
    icon: Target,
    title: "Customer Persona",
    description:
      "Know exactly who your customer is — their demographics, pain points, and why they'd pay for your solution.",
    color: "from-[#9b59d0] to-[#00d4ff]",
  },
  {
    icon: Globe,
    title: "Market Overview",
    description:
      "Get TAM/SAM/SOM estimates and market growth trends without spending hours on research.",
    color: "from-[#10b981] to-[#00d4ff]",
  },
  {
    icon: BarChart3,
    title: "Profitability Score",
    description:
      "A 0-100 score with honest justification — we don't sugarcoat. You need the truth to build smart.",
    color: "from-[#f59e0b] to-[#ef4444]",
  },
  {
    icon: Users,
    title: "Competitor Mapping",
    description:
      "Identify your top 3 competitors and your exact differentiation point against each one.",
    color: "from-[#9b59d0] to-[#f59e0b]",
  },
  {
    icon: Code,
    title: "Tech Stack Advice",
    description:
      "Get a practical 4-6 technology recommendation for your MVP — chosen for speed, cost, and scalability.",
    color: "from-[#00d4ff] to-[#10b981]",
  },
  {
    icon: Shield,
    title: "Risk Assessment",
    description:
      "Low, Medium, or High — understand the risk profile before you invest time and money.",
    color: "from-[#ef4444] to-[#9b59d0]",
  },
  {
    icon: Share2,
    title: "Shareable Reports",
    description:
      "Share your validation report with co-founders or investors via a unique public link.",
    color: "from-[#10b981] to-[#9b59d0]",
  },
];

const steps = [
  {
    step: "01",
    title: "Submit Your Idea",
    description:
      "Give your startup a title and describe the problem it solves. The more detail you provide, the sharper the analysis.",
  },
  {
    step: "02",
    title: "AI Analyzes in Seconds",
    description:
      "Gemini 1.5 Flash processes your idea through our structured prompt — market research, competitor lookup, risk scoring.",
  },
  {
    step: "03",
    title: "Get Your Report",
    description:
      "Receive a comprehensive validation report across 8 dimensions. Export it, share it, or iterate on your idea.",
  },
];

const stats = [
  { value: "8", label: "Analysis Dimensions" },
  { value: "<10s", label: "Average Report Time" },
  { value: "100%", label: "AI-Powered" },
  { value: "Free", label: "To Get Started" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#05060a] overflow-x-hidden">
      <Navbar />

      {/* ============ HERO SECTION ============ */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#9b59d0] rounded-full opacity-5 blur-[120px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#00d4ff] rounded-full opacity-5 blur-[120px] animate-float" style={{ animationDelay: "2s" }} />
          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(155,89,208,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(155,89,208,0.5) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[rgba(0,212,255,0.2)] text-[#00d4ff] text-sm font-medium mb-8 animate-fade-in">
            <Zap className="w-4 h-4" />
            Powered by Gemini 1.5 Flash
          </div>

          {/* Headline */}
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 animate-fade-in-up">
            Validate Your
            <br />
            <span className="gradient-text">Startup Idea</span>
            <br />
            in Seconds
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Stop guessing. Get an AI-powered validation report covering market
            fit, competitors, risk level, and profitability — before you write a
            single line of code.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <Link
              href="/auth/signup"
              className="group flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white btn-accent relative z-10 text-base"
            >
              Start Validating Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/auth/login"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-medium text-slate-400 hover:text-white glass border border-[rgba(155,89,208,0.2)] hover:border-[rgba(155,89,208,0.4)] transition-all text-base"
            >
              Sign In
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-slate-500 text-sm animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            {["No credit card required", "Free tier available", "Results in under 10 seconds"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#10b981]" />
                {item}
              </span>
            ))}
          </div>

          {/* Hero visual — mock report card */}
          <div className="mt-20 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="gradient-border rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
              <div className="bg-[#0d0e17] p-6">
                {/* Mock report header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="h-3 w-48 bg-gradient-to-r from-[#9b59d0] to-[#00d4ff] rounded-full mb-2" />
                    <div className="h-2 w-32 bg-[#1a1b2e] rounded-full" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold text-[#10b981] bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)]">
                      Low Risk
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold text-[#00d4ff] bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.2)]">
                      Score: 78
                    </span>
                  </div>
                </div>
                {/* Mock report body */}
                <div className="grid grid-cols-2 gap-4">
                  {["Problem Summary", "Customer Persona", "Market Overview", "Tech Stack"].map((label) => (
                    <div key={label} className="bg-[#13141f] rounded-xl p-4">
                      <div className="h-2 w-20 bg-[#9b59d0] rounded-full mb-3 opacity-60" />
                      <div className="space-y-2">
                        <div className="h-2 w-full bg-[#1a1b2e] rounded-full" />
                        <div className="h-2 w-4/5 bg-[#1a1b2e] rounded-full" />
                        <div className="h-2 w-3/5 bg-[#1a1b2e] rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS SECTION ============ */}
      <section className="py-16 border-y border-[rgba(155,89,208,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-heading text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURES SECTION ============ */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-white mb-4">
              Everything You Need to{" "}
              <span className="gradient-text">Validate Fast</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              8 dimensions of analysis, delivered in one structured report. No
              research rabbit holes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="glass rounded-2xl p-6 card-hover group cursor-default"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-white mb-2 text-sm">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS SECTION ============ */}
      <section className="py-24 border-t border-[rgba(155,89,208,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-white mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-slate-400 text-lg">
              From idea to report in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-px bg-gradient-to-r from-[#9b59d0] to-[#00d4ff] opacity-30" />

            {steps.map((step, index) => (
              <div key={step.step} className="relative text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl glass border border-[rgba(155,89,208,0.2)] mb-6 mx-auto">
                  <span className="font-heading text-3xl font-bold gradient-text">
                    {step.step}
                  </span>
                </div>
                <h3 className="font-heading text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="gradient-border rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(155,89,208,0.05)] to-[rgba(0,212,255,0.05)]" />
            <div className="relative">
              <TrendingUp className="w-12 h-12 mx-auto mb-6 text-[#00d4ff]" />
              <h2 className="font-heading text-4xl font-bold text-white mb-4">
                Ready to Validate Your Idea?
              </h2>
              <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
                Join founders who use VentureAI to make smarter decisions before
                they build. It takes 30 seconds to submit your first idea.
              </p>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white btn-accent relative z-10 text-base"
              >
                <Zap className="w-5 h-5" />
                Get Started — It's Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}