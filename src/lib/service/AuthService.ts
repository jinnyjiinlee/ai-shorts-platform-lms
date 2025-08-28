import { supabase } from '@/lib/supabase/client';

export class AuthService {
  static async getAuthUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) {
      throw new Error('인증되지 않은 사용자입니다.');
    }
    return user;
  }

  static async getUserProfile(userId: string) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

    if (error || !data) {
      throw new Error('프로필 정보를 찾을 수 없습니다.');
    }
    return data;
  }
}
