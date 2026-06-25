'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Terminal, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  const [typedText, setTypedText] = useState('');
  const fullText = `logic2code-ai --resolve-route\n[ERROR] 404 - Route Not Found\n[WARN] Target destination does not exist in route registry.\n[INFO] Fallback navigation protocol: ready.`;

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setTypedText((prev) => prev + fullText.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 15);
    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]" />

      <div className="max-w-md w-full flex flex-col items-center gap-8 relative z-10 animate-fade-in">
        {/* Logo / Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-950/30 border border-rose-900/30 text-rose-400 text-xs font-bold shadow-lg shadow-rose-950/20">
          <AlertTriangle className="w-4 h-4 animate-pulse" />
          <span>Error 404: Route Not Resolved</span>
        </div>

        {/* Header Text */}
        <div className="text-center">
          <h1 className="text-6xl font-black bg-gradient-to-r from-white via-blue-400 to-indigo-300 bg-clip-text text-transparent tracking-tighter mb-2">
            404
          </h1>
          <p className="text-slate-400 text-xs font-semibold max-w-xs mx-auto leading-relaxed">
            You've ventured beyond the application maps. This coordinate does not contain active code.
          </p>
        </div>

        {/* Terminal Window */}
        <div className="w-full glass-spatial rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-slate-950/60 backdrop-blur-xl">
          {/* Window Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-slate-900/40">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-[10px] text-slate-500 font-bold font-mono">guest@logic2code: ~</span>
            <div className="w-12" /> {/* Spacer */}
          </div>

          {/* Window Body */}
          <div className="p-5 font-mono text-[11px] leading-relaxed text-left min-h-[140px] flex flex-col justify-between">
            <div className="whitespace-pre-wrap text-slate-300">
              <span className="text-blue-400">$ </span>
              {typedText}
              <span className="animate-pulse duration-700 text-emerald-400">▮</span>
            </div>
            <div className="text-[10px] text-slate-500 font-bold border-t border-white/5 pt-3 mt-4 flex justify-between">
              <span>Status: ROUTE_NOT_RESOLVED</span>
              <span>L2C-OS v1.0</span>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-300 hover:text-white font-bold text-xs active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Terminal className="w-4 h-4" />
            <span>Go to Landing Page</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
