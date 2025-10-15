/**
 * React-Database Developer Example Hook
 * 
 * Data fetching hook for user-related operations.
 * Demonstrates database query patterns and data management.
 */

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

// React-Database Developer Responsibilities:
// 1. Create optimized database queries
// 2. Handle data caching and state management
// 3. Implement real-time data subscriptions
// 4. Manage data validation and error handling
// 5. Provide clean interfaces for frontend components

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

interface UseUserProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
}

interface UseUserProfileActions {
  // eslint-disable-next-line no-unused-vars
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const useUserProfile = (userId: string): UseUserProfileState & UseUserProfileActions => {
  const [state, setState] = useState<UseUserProfileState>({
    profile: null,
    loading: true,
    error: null,
    updating: false,
  });

  // React-Database developer implements optimized data fetching
  const fetchProfile = useCallback(async () => {
    if (!userId) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        setState(prev => ({ ...prev, error: error.message, loading: false }));
        return;
      }

      setState(prev => ({ ...prev, profile: data, loading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Unknown error',
        loading: false 
      }));
    }
  }, [userId]);

  // React-Database developer handles real-time subscriptions
  useEffect(() => {
    if (!userId) return;

    fetchProfile();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          console.log('Profile updated:', payload);
          
          if (payload.eventType === 'UPDATE' && payload.new) {
            setState(prev => ({ ...prev, profile: payload.new as UserProfile }));
          } else if (payload.eventType === 'DELETE') {
            setState(prev => ({ ...prev, profile: null }));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId, fetchProfile]);

  // React-Database developer implements data mutation methods
  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!userId) return;

    setState(prev => ({ ...prev, updating: true, error: null }));

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        setState(prev => ({ ...prev, error: error.message, updating: false }));
        throw error;
      }

      setState(prev => ({ ...prev, updating: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Update failed',
        updating: false 
      }));
      throw error;
    }
  }, [userId]);

  const refreshProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  return {
    ...state,
    updateProfile,
    refreshProfile,
  };
};

// React-Database Developer Notes:
// - This hook encapsulates all user profile data operations
// - Implements real-time updates using Supabase subscriptions
// - Provides optimistic updates and error handling
// - Separates data logic from UI components
// - Can be easily tested and mocked
// - Handles loading states and error states
// - Optimizes database queries with proper filtering
