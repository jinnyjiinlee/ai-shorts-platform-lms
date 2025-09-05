import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export const useCurrentUser = () => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          throw error;
        }

        setCurrentUserId(user?.id || null);
      } catch (err) {
        console.error('사용자 정보 가져오기 실패:', err);
        setError('사용자 정보를 가져올 수 없습니다.');
        setCurrentUserId(null);
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  return { currentUserId, loading, error };
};
