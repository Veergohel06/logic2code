'use client';

import { useEffect, useState } from 'react';
import { AuthProvider } from '@/frontend/contexts/AuthContext';
import ToastProvider from '@/frontend/components/layout/ToastProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Global mousemove listener to update hover coordinates for all .premium-glow-card elements
  useEffect(() => {
    if (!mounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll('.premium-glow-card');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
        (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0B1120] text-slate-500 font-bold text-xs uppercase tracking-wider">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Initializing environment...</span>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </AuthProvider>
  );
}
