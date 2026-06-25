'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log telemetry error data
    console.error('Captured by Next.js Global Error Boundary:', error);
  }, [error]);

  return (
    <div className="flex-grow flex flex-col items-center justify-center py-12 md:py-24 relative overflow-hidden px-4">
      {/* Background ambient orbs */}
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[40%] left-[20%] w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="glass-spatial max-w-md w-full rounded-3xl p-8 border border-rose-500/20 shadow-2xl relative z-10 flex flex-col items-center text-center">
        {/* macOS Windows Control Dots */}
        <div className="flex items-center gap-1.5 self-start mb-6 select-none">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
        </div>

        {/* Warning Icon Badge */}
        <div className="w-12 h-12 rounded-2xl bg-rose-950/40 border border-rose-900/30 flex items-center justify-center text-rose-400 mb-6 shadow-spatial-glow-rose/10">
          <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
        </div>

        <h2 className="text-xl font-black text-white tracking-tight mb-2">
          Runtime Exception Encountered
        </h2>
        
        <p className="text-xs text-slate-400 font-semibold leading-relaxed mb-6">
          The application context has crashed or failed to load. Don't worry — local drafts and progress states are preserved safely.
        </p>

        {/* Detailed error console log replica */}
        <div className="w-full bg-slate-950/60 border border-white/5 rounded-xl p-3 text-left font-mono text-[10px] text-slate-400 mb-6 max-h-24 overflow-y-auto break-all select-all">
          <span className="text-rose-400 font-bold block mb-1">LOGIC2CODE_EXCEPTION:</span>
          {error.message || 'Unknown runtime error. Check developer logs.'}
          {error.digest && <span className="text-slate-600 block mt-1">Digest: {error.digest}</span>}
        </div>

        {/* Control Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={() => reset()}
            className="flex-1 flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-xs font-black text-white transition-all shadow-md cursor-pointer active:scale-[0.98]"
          >
            <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Try Again</span>
          </button>
          
          <Link
            href="/"
            className="flex-1 flex h-10 items-center justify-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-black text-slate-200 transition-all cursor-pointer active:scale-[0.98]"
          >
            <Home className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Go Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
