'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Award, Zap, Sparkles, Check } from 'lucide-react';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'milestone' | 'certificate';
  title: string;
  rewardXp: number;
  objectives?: string[];
}

export default function CelebrationModal({
  isOpen,
  onClose,
  type,
  title,
  rewardXp,
  objectives = [],
}: CelebrationModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Trigger canvas-confetti burst
      import('canvas-confetti').then((confetti) => {
        const duration = 2.5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

        const randomInRange = (min: number, max: number) => {
          return Math.random() * (max - min) + min;
        };

        const interval: any = setInterval(function() {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          // since particles fall down, animate a bit higher than they would
          confetti.default(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
          confetti.default(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);

        return () => clearInterval(interval);
      });
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="w-full max-w-lg relative overflow-hidden glass-modal border border-purple-500/30 p-8 md:p-10"
          >
            {/* Ambient background glows */}
            <div className="absolute -left-16 -top-16 -z-10 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute -right-16 -bottom-16 -z-10 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl" />

            {/* Rotating backdrop beam */}
            <div className="absolute left-1/2 top-1/2 -z-20 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 animate-[spin_20s_linear_infinite] bg-[radial-gradient(circle_300px_at_center,rgba(168,85,247,0.06),transparent_100%)]" />

            <div className="flex flex-col items-center text-center">
              {/* Badge Icon bubble */}
              <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-purple-400/30 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-4 shadow-[0_0_30px_rgba(168,85,247,0.25)]">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 0.95, 1] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                >
                  {type === 'milestone' ? (
                    <Trophy className="h-12 w-12 text-purple-400" />
                  ) : (
                    <Award className="h-12 w-12 text-amber-400" />
                  )}
                </motion.div>
                
                {/* Floating sparkles */}
                <Sparkles className="absolute -right-2 -top-2 h-6 w-6 animate-pulse text-yellow-400" />
                <Sparkles className="absolute -left-2 -bottom-2 h-5 w-5 animate-pulse text-indigo-400 delay-300" />
              </div>

              {/* Title Header */}
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 bg-purple-950/45 px-3 py-1 rounded-full border border-purple-500/20 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{type === 'milestone' ? 'Milestone Achieved' : 'Certification Earned'}</span>
              </span>

              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-2 leading-tight">
                {title}
              </h2>

              <p className="text-sm text-slate-300 font-semibold leading-relaxed max-w-sm mb-6">
                {type === 'milestone' 
                  ? 'Fantastic work! You have cleared this checkpoint and unlocked the next phase of your journey.'
                  : 'Congratulations! You have completed the entire roadmap. You are officially certified!'}
              </p>

              {/* Reward stats pill */}
              <div className="flex items-center gap-3 bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-3 mb-6 shadow-inner">
                <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-sm">
                  <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>+{rewardXp} XP Collected</span>
                </div>
                <div className="w-px h-4 bg-white/10" />
                <div className="flex items-center gap-1.5 text-emerald-400 font-extrabold text-sm">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                  </div>
                  <span>Objectives Completed</span>
                </div>
              </div>

              {/* Objectives details list */}
              {objectives.length > 0 && (
                <div className="w-full max-w-sm text-left bg-slate-950/30 border border-white/5 p-5 rounded-2xl mb-8">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Mastered Skills
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-300 font-semibold leading-relaxed">
                    {objectives.map((obj, i) => (
                      <li key={i} className="flex gap-2.5 items-start">
                        <span className="w-4 h-4 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                          ✓
                        </span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action button */}
              <button
                onClick={onClose}
                className="w-full max-w-sm h-12 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-xs font-black uppercase tracking-wider text-white transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer hover:shadow-indigo-500/30 flex items-center justify-center"
              >
                <span>{type === 'milestone' ? 'Continue Journey' : 'Claim Certificate Badge'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
