// ============================================
// VentureAI — Supabase Browser Client
// Used in Client Components ("use client")
// ============================================

import { createBrowserClient } from "@supabase/ssr";

// Creates a Supabase client for use in browser/client components
// Uses public anon key — safe to expose to browser
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}