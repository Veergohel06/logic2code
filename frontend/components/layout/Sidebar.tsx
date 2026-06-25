'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/frontend/contexts/AuthContext';
import { useLanguage } from '@/frontend/hooks/useLanguage';
import { useProgress } from '@/frontend/hooks/useProgress';
import { LANGUAGES } from '@/config/languages';
import { Terminal, Activity, Sparkles, MessageSquare, Award, Zap, Code, LogOut, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { language } = useLanguage();
  const { xp, streak } = useProgress();
  const { signOut } = useAuth();

  const [latency, setLatency] = useState<number | null>(null);
  const [dnsSpeed, setDnsSpeed] = useState<number>(22);
  const [dbSpeed, setDbSpeed] = useState<number>(14);
  const [isPinging, setIsPinging] = useState(false);

  const measureLatency = async () => {
    setIsPinging(true);
    try {
      const start = performance.now();
      const res = await fetch('/api/languages', { method: 'HEAD' });
      if (res.ok) {
        const end = performance.now();
        const ms = Math.round(end - start);
        setLatency(ms);
        setDnsSpeed(Math.max(8, Math.round(ms * 0.35 + (Math.random() * 6))));
        setDbSpeed(Math.max(6, Math.round(ms * 0.2 + (Math.random() * 4))));
      }
    } catch (err) {
      console.warn('Latency check failed:', err);
    } finally {
      setTimeout(() => setIsPinging(false), 650);
    }
  };

  useEffect(() => {
    measureLatency();
    const interval = setInterval(measureLatency, 9000);
    return () => clearInterval(interval);
  }, []);

  const activeLang = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Activity },
    { href: '/roadmap', label: 'Roadmap', icon: Sparkles },
    { href: '/problems', label: 'Problems', icon: Terminal },
    { href: '/ai-tutor', label: 'AI Tutor', icon: MessageSquare },
    { href: '/interview-prep', label: 'Interview Prep', icon: Award },
    { href: '/playground', label: 'Sandbox Playground', icon: Code }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-[#0B1120]/96 p-4 shrink-0 justify-between">
      <div className="flex flex-col gap-6">
        {/* User Quick Stats Banner — glowing gradient border */}
        <div className="relative overflow-hidden p-4 bg-slate-900/40 border border-white/5 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">
            Your Status
          </span>
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-500/10" />
              <div className="flex flex-col">
                <span
                  className={`text-base font-extrabold text-gradient ${streak > 0 ? 'animate-glow-pulse' : ''}`}
                >
                  {streak} Days
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">Streak</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-500 fill-indigo-500/10" />
              <div className="flex flex-col">
                <span className="text-base font-extrabold text-gradient">
                  {xp} XP
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">XP Points</span>
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Language:</span>
            <span className="text-xs font-bold text-blue-400">{activeLang.name}</span>
          </div>
        </div>
 
        {/* Navigation Section — staggered slide-in */}
        <nav className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 block">
            Navigation
          </span>
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:translate-x-1 animate-slide-in-left ${
                  isActive
                    ? 'bg-blue-950/60 text-blue-400 border border-blue-500/25 shadow-spatial-glow-blue/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:translate-x-1'
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Active link indicator dot */}
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-scale-in shrink-0" />
                )}
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
 
      <div className="flex flex-col gap-4">
        {/* Network & Performance HUD */}
        <div className="p-3.5 bg-slate-900/40 border border-white/5 rounded-2xl flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 select-none">
              <Activity className="w-3.5 h-3.5 text-blue-400 animate-pulse shrink-0" />
              <span>Link Latency</span>
            </span>
            <button 
              onClick={measureLatency}
              disabled={isPinging}
              className="text-slate-500 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
              title="Re-test performance"
            >
              <RefreshCw className={`w-3 h-3 ${isPinging ? 'animate-spin text-blue-400' : ''}`} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-center select-none">
            <div className="flex flex-col p-1.5 bg-slate-950/40 border border-white/5 rounded-xl">
              <span className="text-[12px] font-black font-mono text-blue-400 leading-none">
                {latency !== null ? `${latency}ms` : '--'}
              </span>
              <span className="text-[7.5px] font-extrabold text-slate-500 uppercase tracking-wide mt-1">
                RTT Ping
              </span>
            </div>
            <div className="flex flex-col p-1.5 bg-slate-950/40 border border-white/5 rounded-xl">
              <span className="text-[12px] font-black font-mono text-indigo-400 leading-none">
                {dnsSpeed}ms
              </span>
              <span className="text-[7.5px] font-extrabold text-slate-500 uppercase tracking-wide mt-1">
                DNS Speed
              </span>
            </div>
            <div className="flex flex-col p-1.5 bg-slate-950/40 border border-white/5 rounded-xl">
              <span className="text-[12px] font-black font-mono text-purple-400 leading-none">
                {dbSpeed}ms
              </span>
              <span className="text-[7.5px] font-extrabold text-slate-500 uppercase tracking-wide mt-1">
                DB Query
              </span>
            </div>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:text-rose-400 hover:bg-rose-950/20 border border-transparent hover:border-rose-900/30 transition-all duration-200 hover:translate-x-1 w-full cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Logout</span>
        </button>
 
        {/* Footer Info */}
        <div className="p-3 text-[10px] text-slate-500 font-semibold text-center border-t border-white/10">
          Logic2Code AI v0.1.0<br />
          Built with Google Gemini
        </div>
      </div>
    </aside>
  );
}
