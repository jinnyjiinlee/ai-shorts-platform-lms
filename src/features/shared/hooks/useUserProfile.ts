import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useCurrentUser } from './useCurrentUser';

// 프로필 타입 정의
interface UserProfile {
  id: string;
  name: string | null;
  nickname: string | null;
  avatar_url: string | null;
  cohort: string | null;
  role: string | null;
  email: string | null;
  phone: string | null;
  status: string | null;
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useCurrentUser에서 사용자 ID 가져오기
  const { currentUserId } = useCurrentUser();

  // useEffect로 프로필 가져오기

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUserId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id, name, nickname, avatar_url, cohort, role, email, phone, status')
          .eq('id', currentUserId)
          .single();

        if (error) {
          throw error;
        }
        setProfile(profile);
      } catch (err) {
        console.error('프로필 조회 실패:', err);
        setError('프로필 정보를 불러올 수 없습니다.');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [currentUserId]);

  return { profile, loading, error };
};
