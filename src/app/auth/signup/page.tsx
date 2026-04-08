// ============================================
// VentureAI — Signup Page
// Supports: Email + Password, Google OAuth
// Auto-creates user profile via DB trigger
// ============================================

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { signUpSchema } from "@/lib/validations";
import toast from "react-hot-toast";
import { Zap, Mail, Lock, User, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();
  const supabase = createClient();

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength();
  const strengthColors = ["", "bg-[#ef4444]", "bg-[#f59e0b]", "bg-[#f59e0b]", "bg-[#10b981]"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = signUpSchema.safeParse({ email, password, full_name: fullName });
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            // avatar_url will be null — set from Google OAuth automatically
          },
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("This email is already registered. Try signing in.");
        } else {
          toast.error(error.message);
        }
        return;
      }

      // Show success state — user needs to verify email
      setIsSuccess(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?next=/dashboard`,
        },
      });
      if (error) {
        toast.error("Google sign up failed.");
        setIsGoogleLoading(false);
      }
    } catch {
      toast.error("Something went wrong.");
      setIsGoogleLoading(false);
    }
  };

  // ---- Success State ----
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#05060a] flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center animate-fade-in-up">
          <div className="w-16 h-16 rounded-2xl bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.3)] flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-[#10b981]" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-white mb-3">
            Check your email
          </h1>
          <p className="text-slate-400 mb-6">
            We sent a verification link to{" "}
            <span className="text-[#00d4ff] font-medium">{email}</span>.
            Click it to activate your account.
          </p>
          <Link
            href="/auth/login"
            className="text-[#9b59d0] hover:text-[#b47ee0] font-medium transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05060a] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#9b59d0] rounded-full opacity-5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-[#00d4ff] rounded-full opacity-5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00d4ff] to-[#9b59d0] flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-white">
              Venture<span className="gradient-text">AI</span>
            </span>
          </Link>
          <h1 className="font-heading text-3xl font-bold text-white mb-2">
            Create your account
          </h1>
          <p className="text-slate-400">Start validating ideas in seconds</p>
        </div>

        <div className="glass rounded-2xl p-8">
          {/* Google OAuth */}
          <button
            onClick={handleGoogleSignUp}
            disabled={isGoogleLoading || isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white hover:bg-gray-50 text-gray-800 font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed mb-6"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
            ) : (
              <GoogleIcon />
            )}
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.08)]" />
            <span className="text-slate-500 text-xs uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.08)]" />
          </div>

          <form onSubmit={handleEmailSignUp} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  disabled={isLoading}
                  className={`w-full bg-[#13141f] border rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.full_name
                      ? "border-[rgba(239,68,68,0.5)] focus:ring-[rgba(239,68,68,0.3)]"
                      : "border-[rgba(155,89,208,0.2)] focus:ring-[rgba(0,212,255,0.3)] focus:border-[rgba(0,212,255,0.4)]"
                  }`}
                />
              </div>
              {errors.full_name && (
                <p className="text-[#ef4444] text-xs mt-1">{errors.full_name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={isLoading}
                  className={`w-full bg-[#13141f] border rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? "border-[rgba(239,68,68,0.5)] focus:ring-[rgba(239,68,68,0.3)]"
                      : "border-[rgba(155,89,208,0.2)] focus:ring-[rgba(0,212,255,0.3)] focus:border-[rgba(0,212,255,0.4)]"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[#ef4444] text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  disabled={isLoading}
                  className={`w-full bg-[#13141f] border rounded-xl pl-10 pr-10 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? "border-[rgba(239,68,68,0.5)] focus:ring-[rgba(239,68,68,0.3)]"
                      : "border-[rgba(155,89,208,0.2)] focus:ring-[rgba(0,212,255,0.3)] focus:border-[rgba(0,212,255,0.4)]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password strength bar */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          passwordStrength >= level
                            ? strengthColors[passwordStrength]
                            : "bg-[#1a1b2e]"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">
                    Password strength:{" "}
                    <span className={`font-medium ${passwordStrength >= 3 ? "text-[#10b981]" : passwordStrength >= 2 ? "text-[#f59e0b]" : "text-[#ef4444]"}`}>
                      {strengthLabels[passwordStrength]}
                    </span>
                  </p>
                </div>
              )}
              {errors.password && (
                <p className="text-[#ef4444] text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full py-3 rounded-xl font-semibold text-white btn-accent relative z-10 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[#00d4ff] hover:text-[#33dcff] font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}