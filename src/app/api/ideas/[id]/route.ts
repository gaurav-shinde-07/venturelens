// ============================================
// VentureAI — Single Idea API
// GET    /api/ideas/[id] — Get idea + report
// DELETE /api/ideas/[id] — Delete idea
// ============================================

import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { successResponse, errorResponse } from "@/lib/utils";

type RouteParams = { params: Promise<{ id: string }> };

// ---- GET /api/ideas/[id] ----
// Returns a single idea with full AI report
// User can only access their own ideas
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return errorResponse("Unauthorized", 401);
    }

    // Fetch the idea — RLS ensures user can only get their own
    const { data: idea, error } = await supabase
      .from("ideas")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id) // Extra safety beyond RLS
      .single();

    if (error || !idea) {
      return errorResponse("Idea not found", 404);
    }

    return successResponse(idea);
  } catch (error) {
    console.error("Unexpected error in GET /api/ideas/[id]:", error);
    return errorResponse("Internal server error", 500);
  }
}

// ---- DELETE /api/ideas/[id] ----
// Permanently deletes an idea and its AI report
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return errorResponse("Unauthorized", 401);
    }

    // Delete the idea — RLS ensures user can only delete their own
    const { error } = await supabase
      .from("ideas")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("DB error deleting idea:", error);
      return errorResponse("Failed to delete idea", 500);
    }

    return successResponse({ message: "Idea deleted successfully" });
  } catch (error) {
    console.error("Unexpected error in DELETE /api/ideas/[id]:", error);
    return errorResponse("Internal server error", 500);
  }
}