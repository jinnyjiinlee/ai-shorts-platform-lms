'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabase/client';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'student';
  status: 'pending' | 'approved' | 'rejected';
  name?: string;
  nickname?: string;
}

export function useAuth(requiredRole?: 'admin' | 'student') {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          if (mounted) {
            router.push('/auth/login');
          }
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role, status, name, nickname')
          .eq('id', session.user.id)
          .single();

        if (!profile) {
          if (mounted) {
            router.push('/auth/login');
          }
          return;
        }

        // Check if user is approved
        if (profile.status !== 'approved') {
          if (mounted) {
            router.push('/auth/pending');
          }
          return;
        }

        // Check role access
        if (requiredRole && profile.role !== requiredRole) {
          const redirectPath = profile.role === 'admin' ? '/admin' : '/student';
          if (mounted) {
            router.push(redirectPath);
          }
          return;
        }

        if (mounted) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            role: profile.role,
            status: profile.status,
            name: profile.name,
            nickname: profile.nickname,
          });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (mounted) {
          router.push('/auth/login');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          if (mounted) {
            setUser(null);
            router.push('/auth/login');
          }
        } else if (event === 'SIGNED_IN') {
          checkAuth();
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router, requiredRole]);

  return { user, loading };
}