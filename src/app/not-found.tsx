import Link from "next/link";
import { Zap, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#05060a] flex items-center justify-center p-4">
      <div className="text-center animate-fade-in-up">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00d4ff] to-[#9b59d0] flex items-center justify-center mx-auto mb-6">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <h1 className="font-heading text-6xl font-bold gradient-text mb-4">404</h1>
        <h2 className="font-heading text-2xl font-bold text-white mb-3">Page not found</h2>
        <p className="text-slate-400 mb-8">
          This page doesn&apos;t exist or may have been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white btn-accent relative z-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}