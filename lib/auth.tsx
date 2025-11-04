'use client';

import React from 'react';
import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return { user, loading, signOut };
}

export function requireAuth(redirectTo: string = '/auth/login') {
  return (Component: any) => {
    return function AuthenticatedComponent(props: any) {
      const { user, loading } = useAuth();
      const router = useRouter();

      useEffect(() => {
        if (!loading && !user) {
          const currentPath = window.location.pathname;
          router.push(`${redirectTo}?returnUrl=${encodeURIComponent(currentPath)}`);
        }
      }, [user, loading, router]);

      if (loading) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        );
      }

      if (!user) {
        return null;
      }

      return <Component {...props} />;
    };
  };
}

export default function AuthComponent({ loading }: { loading: boolean }) {
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <p>Not loading</p>;
}
