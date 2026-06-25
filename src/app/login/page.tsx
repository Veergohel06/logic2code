'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Terminal, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { supabase } = await import('@/database/supabaseClient');
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            router.replace('/dashboard');
          }
        }
      } catch (err) {
        console.warn('Failed to check user session on login page:', err);
      }
    };
    checkUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const { supabase } = await import('@/database/supabaseClient');
      if (!supabase) {
        throw new Error('Supabase client failed to initialize. Please check your environment configuration.');
      }

      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message || 'Registration failed.');
          setLoading(false);
          return;
        }

        // If email confirmation is enabled, we get a user but session might be null.
        if (data.user && !data.session) {
          setSuccessMsg('Registration successful! Please check your email inbox to verify your account.');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setIsSignUp(false);
        } else {
          // Clear cached local storage values
          localStorage.removeItem('l2c_progress');
          localStorage.removeItem('l2c_preferred_language');
          localStorage.removeItem('l2c_career_goal');
          localStorage.removeItem('l2c_experience_level');
          localStorage.removeItem('l2c_editor_drafts');

          // Logged in immediately
          setSuccessMsg('Registration successful! Redirecting...');
          setTimeout(() => {
            router.replace('/dashboard');
            router.refresh();
          }, 1500);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message || 'Authentication failed. Please verify your connection and credentials.');
          setLoading(false);
          return;
        }

        if (data.session) {
          // Clear cached local storage values
          localStorage.removeItem('l2c_progress');
          localStorage.removeItem('l2c_preferred_language');
          localStorage.removeItem('l2c_career_goal');
          localStorage.removeItem('l2c_experience_level');
          localStorage.removeItem('l2c_editor_drafts');

          setSuccessMsg('Login successful! Redirecting...');
          setTimeout(() => {
            router.replace('/dashboard');
            router.refresh();
          }, 1000);
        } else {
          setErrorMsg('Could not establish an active user session.');
          setLoading(false);
          return;
        }
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setErrorMsg(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Glow behind login card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[radial-gradient(rgba(99,102,241,0.15),transparent_70%)] pointer-events-none -z-10 animate-pulse-slow" />

      <div className="w-full max-w-md glass-card p-8 relative z-10">
        {/* macOS Window Controls */}
        <div className="flex items-center gap-1.5 mb-6 select-none">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 shadow-sm shadow-rose-500/20" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 shadow-sm shadow-amber-500/20" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shadow-sm shadow-emerald-500/20" />
        </div>

        {/* Brand/Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-500/20 mb-3 animate-float">
            <Terminal className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            LOGIC<span className="text-blue-500 font-extrabold">2</span>CODE <span className="text-indigo-400 font-extrabold text-[9px] border border-indigo-900/30 px-1 rounded bg-indigo-950/40">AI</span>
          </h2>
          <p className="text-xs text-slate-400 font-bold mt-1.5">
            {isSignUp ? 'Create your account to start learning' : 'Welcome back! Sign in to resume progress'}
          </p>
        </div>

        {/* Feedback alerts */}
        {errorMsg && (
          <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs font-semibold text-rose-300 flex gap-2 items-start leading-relaxed animate-fade-in shadow-spatial-glow-blue/5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-semibold text-emerald-300 flex gap-2 items-start leading-relaxed animate-fade-in shadow-spatial-glow-blue/5">
            <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold">✓</div>
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email input */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/8 rounded-2xl text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/30 transition-all shadow-sm"
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Password input */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/8 rounded-2xl text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/30 transition-all shadow-sm"
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password input (only for Sign Up) */}
          {isSignUp && (
            <div className="flex flex-col gap-1.5 animate-fade-in">
              <label htmlFor="confirmPassword" className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/8 rounded-2xl text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/30 transition-all shadow-sm"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-2 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:brightness-110 text-xs font-black text-white flex items-center justify-center gap-2 transition-all shadow-[0_10px_30px_rgba(79,70,229,0.35)] hover:scale-[1.01] cursor-pointer active:scale-99 disabled:opacity-50 disabled:pointer-events-none btn-shine"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <>
                <span>{isSignUp ? 'Sign Up' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>

        {/* Auth Toggle */}
        <div className="mt-6 text-center border-t border-white/10 pt-5">
          <p className="text-xs text-slate-400 font-bold">
            {isSignUp ? 'Already have an account?' : 'New to Logic2Code AI?'}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              disabled={loading}
              className="ml-1.5 text-blue-400 hover:text-blue-300 font-extrabold cursor-pointer hover:underline disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSignUp ? 'Sign In' : 'Create an Account'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
