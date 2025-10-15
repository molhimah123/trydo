/**
 * React-Database Developer Example Hook
 * 
 * This file demonstrates the responsibilities and patterns
 * for react-database developers working on the TryDo application.
 */

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { User, Session, AuthError } from '@supabase/supabase-js';

// React-Database Developer Responsibilities:
// 1. Manage Supabase client configuration
// 2. Create reusable data fetching hooks
// 3. Handle authentication state
// 4. Implement real-time subscriptions
// 5. Manage data validation and error handling
// 6. Optimize database queries

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// React-Database developer manages Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const useAuth = (): AuthState & AuthActions => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  // React-Database developer handles authentication state management
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          setState(prev => ({ ...prev, error, loading: false }));
          return;
        }

        setState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          loading: false,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error as AuthError,
          loading: false,
        }));
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          loading: false,
        }));
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // React-Database developer implements authentication methods
  const signIn = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setState(prev => ({ ...prev, error, loading: false }));
        throw error;
      }
    } catch (error) {
      setState(prev => ({ ...prev, error: error as AuthError, loading: false }));
      throw error;
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setState(prev => ({ ...prev, error, loading: false }));
        throw error;
      }
    } catch (error) {
      setState(prev => ({ ...prev, error: error as AuthError, loading: false }));
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setState(prev => ({ ...prev, error, loading: false }));
        throw error;
      }
    } catch (error) {
      setState(prev => ({ ...prev, error: error as AuthError, loading: false }));
      throw error;
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        setState(prev => ({ ...prev, error, loading: false }));
        throw error;
      }
    } catch (error) {
      setState(prev => ({ ...prev, error: error as AuthError, loading: false }));
      throw error;
    }
  }, []);

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
};

// React-Database Developer Notes:
// - This hook manages all authentication state and operations
// - Provides a clean interface for frontend components to use
// - Handles error states and loading states
// - Implements real-time auth state updates
// - Separates data concerns from UI concerns
// - Can be easily tested and mocked for frontend development
