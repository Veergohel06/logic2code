'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import LanguageDropdown from './LanguageDropdown';
import CareerDropdown from './CareerDropdown';
import { useAuth } from '@/frontend/contexts/AuthContext';
import { useProgress } from '@/frontend/hooks/useProgress';
import { Sparkles, Terminal, Activity, Award, MessageSquare, LogOut, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { session, user, loading, initials, signOut } = useAuth();
  const { xp, streak } = useProgress();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hysteresis threshold to prevent jittering on minor scroll deviations
      if (Math.abs(lastScrollY - currentScrollY) < 8) {
        return;
      }

      // Hide on scroll down, show on scroll up or at the very top of the page
      const isVisible = currentScrollY < lastScrollY || currentScrollY < 15;
      
      setVisible(isVisible);
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isOnboarding = pathname === '/onboarding';
  const showNavAndDropdowns = !!session && !isOnboarding;

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: Activity },
    { href: '/roadmap', label: 'Roadmap', icon: Sparkles },
    { href: '/problems', label: 'Problems', icon: Terminal },
    { href: '/ai-tutor', label: 'AI Tutor', icon: MessageSquare },
    { href: '/interview-prep', label: 'Interview Prep', icon: Award },
    { href: '/playground', label: 'Playground', icon: CodeIcon }
  ];

  function CodeIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    );
  }

  return (
    <>
      <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-2 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-[1580px] bg-[#0B1120]/96 rounded-2xl border-b border-white/5 shadow-lg ${
        visible ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      <div className="flex h-12 items-center justify-between px-4">
        {/* Brand Logo */}
        <Link href={session ? "/dashboard" : "/"} className="flex items-center gap-2 group shrink-0">
          <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-sm shadow-blue-500/15 group-hover:scale-105 transition-transform duration-200">
            <Terminal className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <span className="text-sm font-bold text-white tracking-tight">
            LOGIC<span className="text-blue-500 font-extrabold">2</span>CODE <span className="text-indigo-400 font-extrabold text-[8px] border border-indigo-900/30 px-1 py-0.1 rounded bg-indigo-950/40">AI</span>
          </span>
        </Link>
 
        {/* Desktop Links */}
        {showNavAndDropdowns && (
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all duration-200 ${
                    isActive
                      ? 'text-blue-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="navbar-active-bg"
                      className="absolute inset-0 bg-blue-950/60 border border-blue-500/25 rounded-lg -z-10 shadow-spatial-glow-blue/10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-3.5 h-3.5 relative z-10 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        )}
 
        {/* Global Controls & Actions */}
        {/* Global Controls & Actions */}
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="flex items-center gap-1.5 animate-pulse">
              <div className="w-20 h-7 rounded-lg bg-slate-800 hidden sm:block" />
              <div className="w-16 h-7 rounded-lg bg-slate-800 hidden sm:block" />
              <div className="w-7 h-7 rounded-lg bg-slate-800" />
            </div>
          ) : session ? (
            <>
              {showNavAndDropdowns && (
                <>
                  <CareerDropdown />
                  <LanguageDropdown />
                </>
              )}
 
              <div className="flex items-center gap-1.5">
                {showNavAndDropdowns && (
                  <div className="hidden sm:flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-lg px-2 h-7 text-[10px] font-bold select-none text-slate-300">
                    {/* Streak */}
                    <div className="flex items-center gap-1 text-amber-500" title={`${streak} Days Streak`}>
                      <Zap className="w-3 h-3 fill-current" />
                      <span>{streak}d</span>
                    </div>
                    <div className="w-[1px] h-3 bg-white/10" />
                    {/* XP */}
                    <div className="flex items-center gap-1 text-indigo-400" title={`${xp} XP Points`}>
                      <Award className="w-3 h-3 text-indigo-400" />
                      <span>{xp} XP</span>
                    </div>
                  </div>
                )}

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/settings"
                    title={user?.email || "User Profile Settings"}
                    className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-[10px] text-white font-bold shadow-sm select-none shrink-0 cursor-pointer"
                  >
                    {initials}
                  </Link>
                </motion.div>
 
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={signOut}
                  className="flex items-center gap-1.5 px-3 h-7 bg-rose-950/20 hover:bg-rose-900/30 border border-rose-900/30 rounded-lg text-[10px] font-bold text-rose-400 transition-all shadow-sm cursor-pointer shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                  <span>Logout</span>
                </motion.button>
              </div>
            </>
          ) : (
            pathname !== '/login' && (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/login"
                  className="flex h-8 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-4 text-[10px] font-black text-white transition-all shadow-sm cursor-pointer btn-shine"
                >
                  Sign In
                </Link>
              </motion.div>
            )
          )}
        </div>
      </div>
    </motion.header>
    {/* Mobile Bottom Navigation Bar */}
    {showNavAndDropdowns && (
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex items-center justify-around bg-[#0B1120]/96 border-t border-white/5 py-2 pb-safe px-2 shadow-[0_-4px_12px_rgba(0,0,0,0.4)]">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all duration-200 relative ${
                isActive ? 'text-blue-400 font-extrabold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400 animate-pulse' : 'text-slate-500'}`} />
              <span className="text-[9px] tracking-tight">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    )}
    </>
  );
}
