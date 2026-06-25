'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useLanguage from '@/frontend/hooks/useLanguage';
import { useAuth } from '@/frontend/contexts/AuthContext';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { careerGoal } = useLanguage();
  const { session, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!session) {
      setRedirected(true);
      router.replace('/login');
      return;
    }

    if (!careerGoal && pathname !== '/onboarding') {
      setRedirected(true);
      router.replace('/onboarding');
    }
  }, [session, authLoading, careerGoal, pathname, router]);

  // Show loading spinner while auth state is resolving
  const isLoading = authLoading || redirected || (!session && !authLoading);

  if (isLoading && !session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-transparent">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Loading profile details...</p>
        </div>
      </div>
    );
  }

  // Show loading for onboarding redirect
  if (!careerGoal && pathname !== '/onboarding') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-transparent">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Setting up your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full flex-grow p-4 lg:p-6 min-h-screen bg-transparent">
      {/* Main page content area */}
      <main className="flex-grow min-w-0 flex flex-col">
        {children}
      </main>
    </div>
  );
}
