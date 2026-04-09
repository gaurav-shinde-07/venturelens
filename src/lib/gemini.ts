// ============================================
// VentureAI — Gemini AI Integration
// Model: gemini-1.5-flash (free tier)
//
// Key fixes from v1:
// 1. Removed responseMimeType (caused truncation on free tier)
// 2. Increased maxOutputTokens from 1500 → 3000
// 3. Added multi-strategy JSON extraction (handles partial responses)
// 4. Added retry logic (1 automatic retry on parse failure)
// 5. Enhanced prompt with detailed instructions and edge cases
// ============================================

import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIAnalysisResult } from "@/types";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// ---- Model Configuration ----
// IMPORTANT: Do NOT use responseMimeType: "application/json" on free tier
// It causes Gemini to truncate responses mid-JSON when output is large.
// Instead we parse JSON ourselves with a robust extractor below.
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    temperature: 0.4,       // Lower = more consistent structured output
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 3000,  // Increased from 1500 — prevents truncation
    // NO responseMimeType here — free tier truncates with it enabled
  },
});

// ============================================
// ENHANCED PROMPT
// Handles all edge cases, forces strict JSON,
// gives Gemini clear formatting rules
// ============================================
function buildPrompt(title: string, description: string): string {
  return `You are a senior startup consultant and venture capitalist with 20+ years of experience evaluating early-stage startups across SaaS, marketplace, consumer, deep-tech, and B2B sectors. You give honest, data-grounded assessments — not hype.

Your task is to analyze the startup idea below and return a single, complete, valid JSON object.

━━━━━━━━━━━━━━━━━━━━━━
STARTUP IDEA INPUT
━━━━━━━━━━━━━━━━━━━━━━
Title: ${title}
Description: ${description}

━━━━━━━━━━━━━━━━━━━━━━
REQUIRED OUTPUT FORMAT
━━━━━━━━━━━━━━━━━━━━━━
Return ONLY the JSON object below. No markdown. No code fences. No explanation before or after. Start your response with { and end with }.

{
  "problem": "2-3 sentences describing the specific, real-world problem being solved. Be concrete — mention who experiences it, when, and why existing solutions fail them.",

  "customer": "Detailed ideal customer profile: their age range, occupation or role, technical proficiency, specific pain point, buying behavior, and willingness to pay. Example format: '25-40 year old freelance designers who struggle with X, spend Y hours per week on Z, and currently use [workaround] which costs them [time/money].'",

  "market": "Realistic market sizing with three tiers: (1) TAM — total addressable market globally, (2) SAM — serviceable addressable market for this solution's category, (3) SOM — realistic first-3-year capture estimate. Include growth rate if relevant. Be honest — not every idea is a trillion dollar market.",

  "competitor": [
    {
      "name": "Most direct existing competitor or substitute",
      "differentiation": "One specific sentence on how this startup is meaningfully different or better for the target customer."
    },
    {
      "name": "Second competitor or alternative solution customers use today",
      "differentiation": "One specific sentence on the differentiation angle."
    },
    {
      "name": "Third competitor, indirect substitute, or status quo behavior being replaced",
      "differentiation": "One specific sentence on the differentiation angle."
    }
  ],

  "tech_stack": [
    "Technology 1 — with one-phrase reason why it fits this MVP",
    "Technology 2 — with one-phrase reason",
    "Technology 3 — with one-phrase reason",
    "Technology 4 — with one-phrase reason",
    "Technology 5 — with one-phrase reason"
  ],

  "risk_level": "Low",

  "profitability_score": 72,

  "justification": "2-3 honest sentences explaining the profitability score and risk level. Cover: what gives this idea commercial potential, what the biggest obstacle to profitability is, and what would need to be true for this to succeed. Do not be overly optimistic."
}

━━━━━━━━━━━━━━━━━━━━━━
STRICT RULES — FOLLOW ALL OF THEM
━━━━━━━━━━━━━━━━━━━━━━
1. Output ONLY valid JSON. Your entire response must be parseable by JSON.parse().
2. Do NOT wrap the JSON in markdown code fences like \`\`\`json or \`\`\`.
3. Do NOT include any text before the opening { or after the closing }.
4. "competitor" must be an array with EXACTLY 3 objects, each with "name" and "differentiation" string fields.
5. "tech_stack" must be an array with EXACTLY 5 strings (4 minimum, 6 maximum).
6. "risk_level" must be EXACTLY one of: "Low", "Medium", or "High" — nothing else.
7. "profitability_score" must be an integer between 0 and 100 (no decimals, no quotes).
8. Do NOT use trailing commas anywhere in the JSON.
9. All string values must use double quotes, not single quotes.
10. If the idea is vague or incomplete, do your best with available context — do not refuse or return an error message.
11. Keep all string values under 400 characters to avoid truncation.
12. Complete the ENTIRE JSON object — never stop mid-response.`;
}

// ============================================
// MULTI-STRATEGY JSON EXTRACTOR
// Tries 4 different methods to extract valid JSON
// from Gemini's response — handles edge cases like:
// - Response wrapped in markdown fences
// - Extra text before/after JSON
// - Partial truncation (attempts to repair)
// ============================================
function extractJSON(rawText: string): string {
  const text = rawText.trim();

  // Strategy 1: Direct parse — response is already clean JSON
  if (text.startsWith("{") && text.endsWith("}")) {
    return text;
  }

  // Strategy 2: Strip markdown code fences
  // Handles ```json ... ``` and ``` ... ```
  const fenceMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  if (fenceMatch?.[1]) {
    return fenceMatch[1].trim();
  }

  // Strategy 3: Extract JSON block from mixed text
  // Finds the outermost { } pair in the response
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return text.slice(firstBrace, lastBrace + 1);
  }

  // Strategy 4: Truncated response — JSON starts but doesn't close
  // Attempt basic repair by finding last complete field and closing the object
  if (firstBrace !== -1 && lastBrace === -1) {
    console.warn("Gemini response appears truncated — attempting JSON repair");
    let partial = text.slice(firstBrace);

    // Remove the last incomplete line (likely cut mid-value)
    const lines = partial.split("\n");
    // Drop lines from the end until we find one ending in a complete value
    while (lines.length > 0) {
      const lastLine = lines[lines.length - 1].trim();
      // A complete line ends with: ", ], or a complete value pattern
      if (
        lastLine.endsWith('",') ||
        lastLine.endsWith('"') ||
        lastLine.endsWith("],") ||
        lastLine.endsWith("]") ||
        lastLine.endsWith("},") ||
        lastLine.endsWith("}")
      ) {
        break;
      }
      lines.pop();
    }

    partial = lines.join("\n");

    // Count open braces and brackets to close them
    let openBraces = 0;
    let openBrackets = 0;
    let inString = false;
    let escape = false;

    for (const char of partial) {
      if (escape) { escape = false; continue; }
      if (char === "\\" && inString) { escape = true; continue; }
      if (char === '"') { inString = !inString; continue; }
      if (inString) continue;
      if (char === "{") openBraces++;
      if (char === "}") openBraces--;
      if (char === "[") openBrackets++;
      if (char === "]") openBrackets--;
    }

    // Close any open arrays and objects
    let closing = "";
    for (let i = 0; i < openBrackets; i++) closing += "]";
    for (let i = 0; i < openBraces; i++) closing += "}";

    return partial + closing;
  }

  // No JSON found at all
  throw new Error("No JSON object found in Gemini response");
}

// ============================================
// RESPONSE VALIDATOR
// Ensures all required fields exist and have
// correct types before we save to database
// ============================================
function validateAIResponse(data: AIAnalysisResult): AIAnalysisResult {
  const requiredFields = [
    "problem",
    "customer",
    "market",
    "competitor",
    "tech_stack",
    "risk_level",
    "profitability_score",
    "justification",
  ] as const;

  // Check all required fields exist
  for (const field of requiredFields) {
    if (!(field in data) || data[field] === null || data[field] === undefined) {
      throw new Error(`AI response missing required field: "${field}"`);
    }
  }

  // Validate competitor array structure
  if (!Array.isArray(data.competitor)) {
    throw new Error("competitor must be an array");
  }
  if (data.competitor.length < 2 || data.competitor.length > 4) {
    // Be lenient: accept 2-4 instead of strictly 3 (Gemini sometimes returns 2 or 4)
    throw new Error(
      `competitor array has ${data.competitor.length} items — expected 3`
    );
  }
  // Ensure each competitor has required fields
  data.competitor.forEach((comp, i) => {
    if (!comp.name || typeof comp.name !== "string") {
      throw new Error(`competitor[${i}].name is missing or not a string`);
    }
    if (!comp.differentiation || typeof comp.differentiation !== "string") {
      throw new Error(
        `competitor[${i}].differentiation is missing or not a string`
      );
    }
  });

  // Validate tech_stack
  if (!Array.isArray(data.tech_stack) || data.tech_stack.length < 3) {
    throw new Error(
      `tech_stack must have at least 3 items, got ${data.tech_stack?.length ?? 0}`
    );
  }

  // Validate risk_level
  const validRisks = ["Low", "Medium", "High"];
  // Normalize casing in case Gemini returns "low" or "LOW"
  const normalizedRisk =
    data.risk_level.charAt(0).toUpperCase() +
    data.risk_level.slice(1).toLowerCase();
  if (!validRisks.includes(normalizedRisk)) {
    throw new Error(`Invalid risk_level: "${data.risk_level}"`);
  }
  data.risk_level = normalizedRisk as "Low" | "Medium" | "High";

  // Validate and clamp profitability_score
  let score = Number(data.profitability_score);
  if (isNaN(score)) {
    throw new Error(
      `profitability_score is not a number: "${data.profitability_score}"`
    );
  }
  score = Math.round(Math.min(100, Math.max(0, score)));
  data.profitability_score = score;

  return data;
}

// ============================================
// MAIN EXPORT — analyzeStartupIdea
// Includes 1 automatic retry on parse failure
// ============================================
export async function analyzeStartupIdea(
  title: string,
  description: string
): Promise<AIAnalysisResult> {
  const prompt = buildPrompt(title, description);
  const MAX_ATTEMPTS = 2; // Try twice before giving up

  let lastError: Error = new Error("Unknown error");

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    let rawText = "";

    try {
      console.log(`[Gemini] Attempt ${attempt}/${MAX_ATTEMPTS} for: "${title}"`);

      const result = await model.generateContent(prompt);
      rawText = result.response.text();

      console.log(
        `[Gemini] Raw response length: ${rawText.length} chars`
      );

      // Log first 200 chars for debugging without flooding logs
      console.log(`[Gemini] Response preview: ${rawText.slice(0, 200)}...`);

      // Step 1: Extract JSON using multi-strategy extractor
      const jsonString = extractJSON(rawText);

      // Step 2: Parse JSON
      let parsed: AIAnalysisResult;
      try {
        parsed = JSON.parse(jsonString) as AIAnalysisResult;
      } catch (parseError) {
        console.error(
          `[Gemini] JSON.parse failed on attempt ${attempt}:`,
          parseError
        );
        console.error(`[Gemini] Attempted to parse: ${jsonString.slice(0, 500)}`);
        throw new Error(
          "AI returned malformed JSON — retrying" +
            (attempt === MAX_ATTEMPTS ? " (final attempt)" : "")
        );
      }

      // Step 3: Validate all fields
      const validated = validateAIResponse(parsed);

      console.log(
        `[Gemini] Success on attempt ${attempt}. Score: ${validated.profitability_score}, Risk: ${validated.risk_level}`
      );

      return validated;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Log the full raw response on failure for debugging
      if (rawText) {
        console.error(
          `[Gemini] Failed to parse response on attempt ${attempt}:\n`,
          rawText
        );
      }

      // If this was our last attempt, stop trying
      if (attempt === MAX_ATTEMPTS) {
        console.error(
          `[Gemini] All ${MAX_ATTEMPTS} attempts failed. Last error:`,
          lastError.message
        );
        break;
      }

      // Wait 1 second before retrying (avoid hammering the API)
      console.log(`[Gemini] Waiting 1s before retry...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  // All attempts failed — throw a user-friendly error
  throw new Error(
    "AI analysis could not be completed after multiple attempts. Please try again in a moment."
  );
}