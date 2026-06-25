'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import languageStore from '../stores/languageStore';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  initials: string;
  signOut: () => Promise<void>;
  syncAuthData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getInitials = (currentUser: User | null): string => {
    if (!currentUser) return '';
    
    // Check user metadata for name
    const fullName = currentUser.user_metadata?.full_name || currentUser.user_metadata?.name;
    if (fullName) {
      const parts = fullName.split(' ').filter(Boolean);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return parts[0].substring(0, 2).toUpperCase();
    }
    
    // Fallback to email
    const email = currentUser.email || '';
    const namePart = email.split('@')[0];
    if (namePart) {
      return namePart.substring(0, 2).toUpperCase();
    }
    
    return 'U';
  };

  const syncAuthData = async () => {
    try {
      const { supabase } = await import('@/database/supabaseClient');

      if (supabase) {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Trigger profile sync in languageStore in the background
          languageStore.syncFromDb().catch((e) => console.warn('Language sync error:', e));
        } else {
          setSession(null);
          setUser(null);
        }
      } else {
        setSession(null);
        setUser(null);
      }
    } catch (err) {
      console.warn('Error fetching active session in AuthProvider:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncAuthData();

    let authSubscription: any = null;
    
    const setupListener = async () => {
      try {
        const { supabase } = await import('@/database/supabaseClient');
        if (supabase) {
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
            setSession(currentSession);
            setUser(currentSession?.user || null);
            
            if (currentSession) {
              languageStore.syncFromDb().catch((e) => console.warn('Language sync error:', e));
              // Dispatch a custom event to notify useProgress hook to reload data
              window.dispatchEvent(new CustomEvent('l2c_auth_change', { detail: currentSession }));
            } else {
              // Clear state on logout
              window.dispatchEvent(new CustomEvent('l2c_auth_change', { detail: null }));
            }
          });
          authSubscription = subscription;
        }
      } catch (err) {
        console.warn('Failed to listen to auth state changes in AuthProvider:', err);
      }
    };

    setupListener();

    return () => {
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  const signOut = async () => {
    try {
      const { supabase } = await import('@/database/supabaseClient');
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('Failed to sign out of Supabase:', err);
    }

    localStorage.removeItem('l2c_dev_logged_in');
    localStorage.removeItem('l2c_preferred_language');
    localStorage.removeItem('l2c_career_goal');
    localStorage.removeItem('l2c_experience_level');
    localStorage.removeItem('l2c_editor_drafts');
    localStorage.removeItem('l2c_progress');

    // Reset language store
    await languageStore.setCareerGoal('');
    await languageStore.setExperienceLevel('');
    await languageStore.setLanguage('python');

    setSession(null);
    setUser(null);
    router.replace('/');
  };

  const value = {
    session,
    user,
    loading,
    initials: getInitials(user),
    signOut,
    syncAuthData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
