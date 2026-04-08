// ============================================
// VentureAI — Navbar Component
// Sticky top nav with auth state awareness
// Shows login/signup for guests, user menu for auth users
// ============================================

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import toast from "react-hot-toast";
import {
  Zap,
  LayoutDashboard,
  PlusCircle,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  // Track scroll position to add blur effect on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    router.push("/");
    router.refresh();
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass border-b border-[rgba(155,89,208,0.15)] shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ---- Logo ---- */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#9b59d0] flex items-center justify-center group-hover:shadow-lg group-hover:shadow-cyan-500/30 transition-all duration-300">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-bold text-lg text-white">
              Venture<span className="gradient-text">AI</span>
            </span>
          </Link>

          {/* ---- Desktop Navigation ---- */}
          <div className="hidden md:flex items-center gap-1">
            {user ? (
              // Authenticated nav
              <>
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive("/dashboard")
                      ? "bg-[rgba(155,89,208,0.2)] text-[#b47ee0]"
                      : "text-slate-400 hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  href="/ideas/new"
                  className="flex items-center gap-2 px-4 py-2 ml-2 rounded-lg text-sm font-semibold btn-accent relative z-10"
                >
                  <PlusCircle className="w-4 h-4" />
                  New Idea
                </Link>

                {/* User menu dropdown */}
                <div className="relative ml-2">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-all"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#9b59d0] to-[#00d4ff] flex items-center justify-center text-white text-xs font-bold">
                      {user.email?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <ChevronDown className={`w-3 h-3 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 glass rounded-xl shadow-xl border border-[rgba(155,89,208,0.2)] py-1 animate-fade-in">
                      <div className="px-3 py-2 border-b border-[rgba(255,255,255,0.05)]">
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-400 hover:text-[#ef4444] hover:bg-[rgba(239,68,68,0.05)] transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Guest nav
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 rounded-lg text-sm font-semibold btn-accent relative z-10"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* ---- Mobile menu button ---- */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ---- Mobile Menu ---- */}
      {isMenuOpen && (
        <div className="md:hidden glass border-t border-[rgba(155,89,208,0.15)] animate-fade-in">
          <div className="px-4 py-4 space-y-2">
            {user ? (
              <>
                <div className="px-3 py-2 border-b border-[rgba(255,255,255,0.05)] mb-2">
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-[rgba(255,255,255,0.05)]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  href="/ideas/new"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-[#00d4ff]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <PlusCircle className="w-4 h-4" />
                  New Idea
                </Link>
                <button
                  onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-[#ef4444]"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block px-3 py-2 rounded-lg text-sm text-slate-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#00d4ff]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}