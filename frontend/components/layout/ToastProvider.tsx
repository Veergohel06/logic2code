'use client';

import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

// ── Types ───────────────────────────────────────────────────────────────────

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
}

interface ToastContextType {
  toast: {
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
  };
}

// ── Context ─────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.toast;
}

// ── Toast Item Component ────────────────────────────────────────────────────

const ICON_MAP: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
  error: <XCircle className="w-4 h-4 text-red-400 shrink-0" />,
  info: <Info className="w-4 h-4 text-blue-400 shrink-0" />,
};

const BG_MAP: Record<ToastType, string> = {
  success: 'bg-emerald-950/80 border-emerald-800/40',
  error: 'bg-red-950/80 border-red-800/40',
  info: 'bg-blue-950/80 border-blue-800/40',
};

const PROGRESS_MAP: Record<ToastType, string> = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const [progress, setProgress] = useState(100);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const step = 100 / (toast.duration / 50);
    const id = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          clearInterval(id);
          onDismiss(toast.id);
          return 0;
        }
        return prev - step;
      });
    }, 50);
    intervalRef.current = id;

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`relative flex items-start gap-3 px-4 py-3 rounded-2xl border shadow-lg max-w-sm overflow-hidden ${BG_MAP[toast.type]}`}
    >
      {ICON_MAP[toast.type]}
      <span className="text-xs font-semibold text-slate-200 leading-relaxed flex-grow pr-4">
        {toast.message}
      </span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="absolute top-2 right-2 p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
      >
        <X className="w-3 h-3" />
      </button>
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
        <div
          className={`h-full transition-none ${PROGRESS_MAP[toast.type]}`}
          style={{ width: `${Math.max(0, progress)}%` }}
        />
      </div>
    </motion.div>
  );
}

// ── Provider ────────────────────────────────────────────────────────────────

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idCounter = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, message: string, duration = 4000) => {
    const id = `toast-${++idCounter.current}-${Date.now()}`;
    setToasts(prev => [...prev.slice(-4), { id, type, message, duration }]); // Max 5 visible
  }, []);

  const toast = {
    success: (message: string, duration?: number) => addToast('success', message, duration),
    error: (message: string, duration?: number) => addToast('error', message, duration),
    info: (message: string, duration?: number) => addToast('info', message, duration),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Container — fixed bottom-right */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-3 pointer-events-auto">
        <AnimatePresence mode="popLayout">
          {toasts.map(t => (
            <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
