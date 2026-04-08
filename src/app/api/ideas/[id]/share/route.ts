// ============================================
// VentureAI — Share Toggle API
// PATCH /api/ideas/[id]/share
// Toggles an idea between public and private
// ============================================

import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { successResponse, errorResponse } from "@/lib/utils";

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return errorResponse("Unauthorized", 401);
    }

    // First get current state
    const { data: idea, error: fetchError } = await supabase
      .from("ideas")
      .select("is_public, share_token, status")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !idea) {
      return errorResponse("Idea not found", 404);
    }

    // Can only share completed ideas
    if (idea.status !== "completed") {
      return errorResponse("Only completed analyses can be shared", 400);
    }

    // Toggle the public state
    const newPublicState = !idea.is_public;

    const { error: updateError } = await supabase
      .from("ideas")
      .update({ is_public: newPublicState })
      .eq("id", id)
      .eq("user_id", user.id);

    if (updateError) {
      console.error("DB error toggling share:", updateError);
      return errorResponse("Failed to update share settings", 500);
    }

    return successResponse({
      is_public: newPublicState,
      share_token: idea.share_token,
    });
  } catch (error) {
    console.error("Unexpected error in PATCH /api/ideas/[id]/share:", error);
    return errorResponse("Internal server error", 500);
  }
}