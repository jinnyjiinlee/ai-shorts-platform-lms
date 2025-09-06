import { supabase } from '@/lib/supabase/client';
import { AdminUserView } from '@/types/domains/user';

// 🎯 관리자 사용자 관리 서비스

export class AdminUserService {
  // 모든 사용자 데이터 조회
  static async fetchAllUsers(): Promise<AdminUserView[]> {
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });

    if (error) {
      console.error('사용자 데이터 조회 오류:', error);
      throw error;
    }

    return data || [];
  }

  // 사용자 상태 업데이트 - 현재 코드와 동일하게 upsert 사용
  static async updateUserStatus(userId: string, newStatus: string): Promise<void> {
    const { error } = await supabase.from('profiles').upsert({ id: userId, status: newStatus }).eq('id', userId);

    if (error) {
      console.error('상태 업데이트 오류:', error);
      throw error;
    }
  }

  // 사용자 역할 업데이트
  static async updateUserRole(userId: string, newRole: string): Promise<void> {
    const { error } = await supabase.from('profiles').upsert({ id: userId, role: newRole }).eq('id', userId);

    if (error) {
      console.error('역할 업데이트 오류:', error);
      throw error;
    }
  }

  // 일괄 상태 업데이트 - 현재 코드와 동일하게 upsert 사용
  static async bulkUpdateStatus(userIds: string[], newStatus: string): Promise<number> {
    let successCount = 0;

    for (const userId of userIds) {
      try {
        const { error } = await supabase.from('profiles').upsert({ id: userId, status: newStatus }).eq('id', userId);

        if (!error) {
          successCount++;
        } else {
          console.error(`사용자 ${userId} ${newStatus} 오류:`, error);
        }
      } catch (error) {
        console.error(`사용자 ${userId} ${newStatus} 오류:`, error);
      }
    }

    return successCount;
  }

  // 사용자 삭제
  static async deleteUser(userId: string): Promise<void> {
    const { error } = await supabase.from('profiles').delete().eq('id', userId);

    if (error) {
      console.error('사용자 삭제 오류:', error);
      throw error;
    }
  }
}
