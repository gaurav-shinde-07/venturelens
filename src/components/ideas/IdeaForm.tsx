// ============================================
// VentureAI — Idea Form Component
// Title + Description form with live validation
// ============================================

"use client";

import { useState } from "react";
import { IdeaFormData } from "@/types";
import { createIdeaSchema } from "@/lib/validations";
import { Loader2, Sparkles } from "lucide-react";

interface IdeaFormProps {
  onSubmit: (data: IdeaFormData) => Promise<void>;
  defaultValues?: IdeaFormData;
}

export default function IdeaForm({ onSubmit, defaultValues }: IdeaFormProps) {
  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [description, setDescription] = useState(defaultValues?.description ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate before submitting
    const validation = createIdeaSchema.safeParse({ title, description });
    if (!validation.success) {
      const fieldErrors: { title?: string; description?: string } = {};
      validation.error.errors.forEach((err) => {
        const field = err.path[0] as "title" | "description";
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ title, description });
    } finally {
      // Parent handles navigation on success, so only reset on error
      setIsSubmitting(false);
    }
  };

  const descriptionLength = description.length;
  const maxDescription = 2000;
  const isDescriptionNearLimit = descriptionLength > maxDescription * 0.85;

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-8">
      {/* Title Field */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Startup Title
          <span className="text-[#ef4444] ml-1">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., AI-powered legal document reviewer for freelancers"
          disabled={isSubmitting}
          maxLength={100}
          className={`w-full bg-[#13141f] border rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 transition-all ${
            errors.title
              ? "border-[rgba(239,68,68,0.5)] focus:ring-[rgba(239,68,68,0.3)]"
              : "border-[rgba(155,89,208,0.2)] focus:ring-[rgba(0,212,255,0.3)] focus:border-[rgba(0,212,255,0.4)]"
          }`}
        />
        <div className="flex justify-between items-center mt-1.5">
          {errors.title ? (
            <p className="text-[#ef4444] text-xs">{errors.title}</p>
          ) : (
            <span />
          )}
          <span className="text-slate-600 text-xs">{title.length}/100</span>
        </div>
      </div>

      {/* Description Field */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Describe Your Idea
          <span className="text-[#ef4444] ml-1">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the problem you're solving, your target customer, and how your solution works. Include any unique advantages or business model thoughts..."
          disabled={isSubmitting}
          maxLength={maxDescription}
          rows={7}
          className={`w-full bg-[#13141f] border rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 transition-all resize-none ${
            errors.description
              ? "border-[rgba(239,68,68,0.5)] focus:ring-[rgba(239,68,68,0.3)]"
              : "border-[rgba(155,89,208,0.2)] focus:ring-[rgba(0,212,255,0.3)] focus:border-[rgba(0,212,255,0.4)]"
          }`}
        />
        <div className="flex justify-between items-center mt-1.5">
          {errors.description ? (
            <p className="text-[#ef4444] text-xs">{errors.description}</p>
          ) : (
            <span className="text-slate-600 text-xs">Minimum 20 characters</span>
          )}
          <span className={`text-xs ${isDescriptionNearLimit ? "text-[#f59e0b]" : "text-slate-600"}`}>
            {descriptionLength}/{maxDescription}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 rounded-xl font-semibold text-white btn-accent relative z-10 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Analyze My Idea
          </>
        )}
      </button>

      <p className="text-center text-slate-600 text-xs mt-4">
        Analysis typically takes 5-15 seconds
      </p>
    </form>
  );
}