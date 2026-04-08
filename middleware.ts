// ============================================
// VentureAI — Next.js Middleware
// Runs on every request BEFORE the page renders
// Handles session refresh and route protection
// ============================================

import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Run middleware on all paths EXCEPT:
    // - Static files (_next/static, _next/image, favicon.ico)
    // - Public assets
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};