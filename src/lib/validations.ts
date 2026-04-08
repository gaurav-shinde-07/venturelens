// ============================================
// VentureAI — Input Validation Schemas
// Using Zod for runtime type-safe validation
// ============================================

import { z } from "zod";

// ---- Idea creation validation ----
export const createIdeaSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be under 100 characters")
    .trim(),

  description: z
    .string()
    .min(20, "Description must be at least 20 characters — the more detail, the better the AI analysis!")
    .max(2000, "Description must be under 2000 characters")
    .trim(),
});

// ---- Auth validation ----
export const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  full_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be under 50 characters")
    .trim(),
});

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// ---- Inferred TypeScript types from schemas ----
export type CreateIdeaInput = z.infer<typeof createIdeaSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;