// ============================================
// VentureAI — Ideas Collection API
// GET  /api/ideas — List user's ideas
// POST /api/ideas — Submit new idea + trigger AI
// ============================================

import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeStartupIdea } from "@/lib/gemini";
import { createIdeaSchema } from "@/lib/validations";
import { successResponse, errorResponse } from "@/lib/utils";

// ---- GET /api/ideas ----
// Returns all ideas belonging to the authenticated user
// Ordered by newest first
export async function GET() {
  try {
    const supabase = await createClient();

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return errorResponse("Unauthorized", 401);
    }

    // Fetch user's ideas, newest first
    const { data: ideas, error } = await supabase
      .from("ideas")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("DB error fetching ideas:", error);
      return errorResponse("Failed to fetch ideas", 500);
    }

    return successResponse(ideas);
  } catch (error) {
    console.error("Unexpected error in GET /api/ideas:", error);
    return errorResponse("Internal server error", 500);
  }
}

// ---- POST /api/ideas ----
// Creates a new idea, immediately saves it as 'analyzing',
// runs AI analysis, then updates with results
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return errorResponse("Unauthorized", 401);
    }

    // Parse and validate request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse("Invalid JSON body", 400);
    }

    const validation = createIdeaSchema.safeParse(body);
    if (!validation.success) {
      const message = validation.error.errors[0]?.message || "Invalid input";
      return errorResponse(message, 422);
    }

    const { title, description } = validation.data;

    // ---- Step 1: Save idea immediately with 'analyzing' status ----
    // This lets the frontend show the idea in dashboard right away
    const { data: newIdea, error: insertError } = await supabase
      .from("ideas")
      .insert({
        user_id: user.id,
        title,
        description,
        status: "analyzing",
      })
      .select()
      .single();

    if (insertError || !newIdea) {
      console.error("DB error inserting idea:", insertError);
      return errorResponse("Failed to save idea", 500);
    }

    // ---- Step 2: Run AI Analysis ----
    try {
      const aiResult = await analyzeStartupIdea(title, description);

      // ---- Step 3: Update idea with AI results ----
      const { data: updatedIdea, error: updateError } = await supabase
        .from("ideas")
        .update({
          status: "completed",
          problem: aiResult.problem,
          customer: aiResult.customer,
          market: aiResult.market,
          competitor: aiResult.competitor,
          tech_stack: aiResult.tech_stack,
          risk_level: aiResult.risk_level,
          profitability: aiResult.profitability_score,
          justification: aiResult.justification,
        })
        .eq("id", newIdea.id)
        .select()
        .single();

      if (updateError || !updatedIdea) {
        console.error("DB error updating with AI results:", updateError);
        // Mark as failed but don't delete — user can see the idea still
        await supabase
          .from("ideas")
          .update({ status: "failed" })
          .eq("id", newIdea.id);
        return errorResponse("AI analysis succeeded but saving failed", 500);
      }

      return successResponse(updatedIdea, 201);
    } catch (aiError) {
      // AI failed — mark the idea as failed
      console.error("AI analysis error:", aiError);
      await supabase
        .from("ideas")
        .update({ status: "failed" })
        .eq("id", newIdea.id);

      const message =
        aiError instanceof Error ? aiError.message : "AI analysis failed";
      return errorResponse(message, 500);
    }
  } catch (error) {
    console.error("Unexpected error in POST /api/ideas:", error);
    return errorResponse("Internal server error", 500);
  }
}