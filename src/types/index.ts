// ============================================
// VentureAI — Global Type Definitions
// Single source of truth for all types
// ============================================

// ---- Database Row Types (match Supabase schema exactly) ----

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export type IdeaStatus = "pending" | "analyzing" | "completed" | "failed";
export type RiskLevel = "Low" | "Medium" | "High";

export interface Competitor {
  name: string;
  differentiation: string;
}

export interface Idea {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: IdeaStatus;
  // AI-generated fields (null until analysis completes)
  problem: string | null;
  customer: string | null;
  market: string | null;
  competitor: Competitor[] | null;
  tech_stack: string[] | null;
  risk_level: RiskLevel | null;
  profitability: number | null;
  justification: string | null;
  // Share functionality
  share_token: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

// ---- AI Response Type (what Gemini returns) ----

export interface AIAnalysisResult {
  problem: string;
  customer: string;
  market: string;
  competitor: Competitor[];
  tech_stack: string[];
  risk_level: RiskLevel;
  profitability_score: number;
  justification: string;
}

// ---- API Request/Response Types ----

export interface CreateIdeaRequest {
  title: string;
  description: string;
}

export interface CreateIdeaResponse {
  success: boolean;
  data?: Idea;
  error?: string;
}

export interface GetIdeasResponse {
  success: boolean;
  data?: Idea[];
  error?: string;
}

export interface GetIdeaResponse {
  success: boolean;
  data?: Idea;
  error?: string;
}

export interface DeleteIdeaResponse {
  success: boolean;
  error?: string;
}

export interface ShareToggleResponse {
  success: boolean;
  data?: { is_public: boolean; share_token: string };
  error?: string;
}

// ---- Dashboard Analytics Type ----

export interface DashboardStats {
  totalIdeas: number;
  completedIdeas: number;
  averageProfitability: number;
  riskDistribution: {
    Low: number;
    Medium: number;
    High: number;
  };
}

// ---- Form Types ----

export interface IdeaFormData {
  title: string;
  description: string;
}

// ---- API Error Type ----

export interface APIError {
  success: false;
  error: string;
  statusCode: number;
}