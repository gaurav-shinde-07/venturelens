// ============================================
// VentureAI — Analyzing Loader Component
// Full-screen animated loader shown while AI processes
// Cycles through realistic analysis steps
// ============================================

"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

const steps = [
  { label: "Reading your idea...", duration: 1500 },
  { label: "Identifying the core problem...", duration: 2000 },
  { label: "Building customer persona...", duration: 2000 },
  { label: "Researching market size...", duration: 2500 },
  { label: "Scanning competitor landscape...", duration: 2500 },
  { label: "Recommending tech stack...", duration: 1500 },
  { label: "Calculating risk level...", duration: 1500 },
  { label: "Scoring profitability...", duration: 2000 },
  { label: "Compiling your report...", duration: 1000 },
];

export default function AnalyzingLoader() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Cycle through steps based on their duration
    let stepIndex = 0;
    const totalDuration = steps.reduce((sum, s) => sum + s.duration, 0);
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += 100;
      setProgress(Math.min((elapsed / totalDuration) * 100, 95));

      // Advance to next step when step duration passes
      let cumulativeDuration = 0;
      for (let i = 0; i < steps.length; i++) {
        cumulativeDuration += steps[i].duration;
        if (elapsed < cumulativeDuration) {
          if (i !== stepIndex) {
            stepIndex = i;
            setCurrentStep(i);
          }
          break;
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#05060a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#9b59d0] rounded-full opacity-5 blur-[120px] animate-float pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#00d4ff] rounded-full opacity-5 blur-[120px] animate-float pointer-events-none" style={{ animationDelay: "2s" }} />

      <div className="w-full max-w-md text-center animate-fade-in">
        {/* Animated Logo */}
        <div className="relative inline-flex items-center justify-center mb-8">
          {/* Spinning ring */}
          <div className="absolute w-20 h-20 rounded-full border-2 border-transparent border-t-[#00d4ff] border-r-[#9b59d0] animate-spin" />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00d4ff] to-[#9b59d0] flex items-center justify-center animate-glow-pulse">
            <Zap className="w-8 h-8 text-white" />
          </div>
        </div>

        <h2 className="font-heading text-2xl font-bold text-white mb-2">
          Analyzing Your Idea
        </h2>
        <p className="text-slate-500 text-sm mb-10">
          Our AI is working through 8 dimensions of analysis...
        </p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-[#1a1b2e] rounded-full h-1.5 mb-3 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#9b59d0] to-[#00d4ff] transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[#00d4ff] text-sm font-medium min-h-[1.25rem] transition-all duration-300">
            {steps[currentStep]?.label}
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-1.5 mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-500 ${
                index < currentStep
                  ? "w-4 bg-[#10b981]"
                  : index === currentStep
                  ? "w-6 bg-[#00d4ff]"
                  : "w-2 bg-[#1a1b2e]"
              }`}
            />
          ))}
        </div>

        <p className="text-slate-600 text-xs">
          This usually takes 5-15 seconds. Please don&apos;t close this page.
        </p>
      </div>
    </div>
  );
}