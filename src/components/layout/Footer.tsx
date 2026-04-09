// ============================================
// VentureAI — Footer Component
// ============================================

import Link from "next/link";
import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(155,89,208,0.1)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#9b59d0] flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-heading font-bold text-white">
              Venture<span className="gradient-text">Lens</span>
            </span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/dashboard" className="hover:text-slate-300 transition-colors">
              Dashboard
            </Link>
            <Link href="/ideas/new" className="hover:text-slate-300 transition-colors">
              New Idea
            </Link>
            <Link href="/auth/login" className="hover:text-slate-300 transition-colors">
              Sign In
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} VentureLens. Built by Gaurav Shinde.
          </p>
        </div>
      </div>
    </footer>
  );
}