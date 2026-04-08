// ============================================
// VentureAI — Gemini AI Integration
// Handles all AI analysis logic
// Model: gemini-1.5-flash (free tier)
// ============================================

import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIAnalysisResult } from "@/types";

// Initialize Gemini client with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Use gemini-1.5-flash — fastest, free tier friendly
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    // Force JSON output for reliable parsing
    responseMimeType: "application/json",
    temperature: 0.7,      // Balanced creativity vs consistency
    topP: 0.8,
    maxOutputTokens: 1500, // Enough for full analysis, not wasteful
  },
});

// ---- System Prompt ----
// Carefully crafted for consistent, realistic, structured output
function buildPrompt(title: string, description: string): string {
  return `You are a senior startup consultant and venture capitalist with 20 years of experience evaluating startups. Analyze the following startup idea and return a structured JSON object.

STARTUP IDEA:
Title: ${title}
Description: ${description}

Return ONLY a valid JSON object with EXACTLY these fields:

{
  "problem": "Clear 2-3 sentence description of the core problem being solved",
  "customer": "Detailed customer persona — who they are, their demographics, pain points, and why they need this solution",
  "market": "Market size overview with TAM/SAM/SOM estimates, growth trends, and key market dynamics",
  "competitor": [
    {"name": "Competitor Name 1", "differentiation": "One clear sentence on how this startup differs from them"},
    {"name": "Competitor Name 2", "differentiation": "One clear sentence on how this startup differs from them"},
    {"name": "Competitor Name 3", "differentiation": "One clear sentence on how this startup differs from them"}
  ],
  "tech_stack": ["Technology 1", "Technology 2", "Technology 3", "Technology 4", "Technology 5"],
  "risk_level": "Low" or "Medium" or "High",
  "profitability_score": integer between 0 and 100,
  "justification": "2-3 sentences explaining the profitability score and risk level — be honest and realistic"
}

RULES:
- competitor array must have EXACTLY 3 items
- tech_stack array must have 4-6 items practical for MVP stage
- profitability_score must be an integer (no decimals)
- risk_level must be exactly "Low", "Medium", or "High"
- Be realistic — not every idea is a 90+ scorer
- Return ONLY the JSON object, no markdown, no explanation`;
}

// ---- Main Analysis Function ----
export async function analyzeStartupIdea(
  title: string,
  description: string
): Promise<AIAnalysisResult> {
  const prompt = buildPrompt(title, description);

  let rawText = "";

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    rawText = response.text();

    // Clean the response — remove any accidental markdown fences
    const cleanedText = rawText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const parsed = JSON.parse(cleanedText) as AIAnalysisResult;

    // ---- Validate the parsed response ----
    validateAIResponse(parsed);

    return parsed;
  } catch (error) {
    // If it's a JSON parse error, log the raw text for debugging
    if (error instanceof SyntaxError) {
      console.error("Failed to parse Gemini JSON response:", rawText);
      throw new Error("AI returned malformed JSON. Please try again.");
    }

    // If it's a validation error we threw, re-throw it
    if (error instanceof Error) {
      throw error;
    }

    // Unknown error
    throw new Error("AI analysis failed. Please try again.");
  }
}

// ---- Response Validator ----
// Ensures Gemini didn't hallucinate wrong field types
function validateAIResponse(data: AIAnalysisResult): void {
  const required = [
    "problem",
    "customer",
    "market",
    "competitor",
    "tech_stack",
    "risk_level",
    "profitability_score",
    "justification",
  ];

  // Check all required fields exist
  for (const field of required) {
    if (!(field in data)) {
      throw new Error(`AI response missing required field: ${field}`);
    }
  }

  // Validate competitor array
  if (!Array.isArray(data.competitor) || data.competitor.length !== 3) {
    throw new Error("AI response must have exactly 3 competitors");
  }

  // Validate tech_stack array
  if (!Array.isArray(data.tech_stack) || data.tech_stack.length < 4) {
    throw new Error("AI response must have 4-6 tech stack items");
  }

  // Validate risk_level enum
  const validRisks = ["Low", "Medium", "High"];
  if (!validRisks.includes(data.risk_level)) {
    throw new Error(`Invalid risk_level: ${data.risk_level}`);
  }

  // Validate profitability_score range
  const score = data.profitability_score;
  if (typeof score !== "number" || score < 0 || score > 100) {
    throw new Error(`Invalid profitability_score: ${score}`);
  }

  // Clamp score to integer just in case
  data.profitability_score = Math.round(score);
}