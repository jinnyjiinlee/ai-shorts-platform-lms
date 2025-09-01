// 조회 로직 JOIN 활용

// 복잡한 조회 로직 분리, 관리자용 대시보드

import { supabase } from '@/lib/supabase/client';
import { MissionFeedback, FeedbackFilter } from '@/types/domains/feedback';

// 복잡한 조회, 로직 분리, 관리자용 대시보드

export class FeedbackQueryService {
  // 1. 관리자용: 모든 피드백 조회 (필터링 포함)
  static async getAllFeedbacks(filters?: FeedbackFilter): Promise<MissionFeedback[]> {
    // 왜 필요? → 관리자가 전체 피드백 현황 파악
    try {
      let query = supabase.from('mission_feedback').select(`
            *,
            admin:profiles!admin_id (name, nickname),
            mission_submit!inner (
              id,
              student_id,
              mission_id,
              profiles!student_id (name, nickname),
              mission_notice!mission_id (title)
            )
          `);

      // 필터 적용
      if (filters?.mission_id) {
        query = query.eq('mission_submit.mission_id', filters.mission_id);
      }
      if (filters?.student_id) {
        query = query.eq('mission_submit.student_id', filters.student_id);
      }
      if (filters?.admin_id) {
        query = query.eq('admin_id', filters.admin_id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // 복잡한 JOIN 데이터 정리
      return (data || []).map((item) => ({
        ...item,
        admin_name: item.admin?.name,
        admin_nickname: item.admin?.nickname,
        student_name: item.mission_submit?.profiles?.name,
        mission_title: item.mission_submit?.mission_notice?.title,
      }));
    } catch (error) {
      console.error('전체 피드백 조회 오류:', error);
      throw error;
    }
  }

  // 2. 특정 학생의 모든 피드백 조회
  static async getFeedbacksByStudent(studentId: string): Promise<MissionFeedback[]> {
    // 왜 필요? → 학생이 자신이 받은 모든 피드백 한 눈에

    try {
      const { data, error } = await supabase
        .from('mission_feedback')
        .select(
          `
            *,
            admin:profiles!admin_id (nickname),
            mission_submit!inner (
              mission_id,
              mission_notice!mission_id (title, description)
            )
          `
        )
        .eq('mission_submit.student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((item) => ({
        ...item,
        admin_nickname: item.admin?.nickname,
        mission_title: item.mission_submit?.mission_notice?.title,
      }));
    } catch (error) {
      console.error('학생별 피드백 조회 오류:', error);
      throw error;
    }
  }

  // 3. 통계 데이터 조회
  static async getFeedbackStats(): Promise<{
    totalFeedbacks: number;
    todayFeedbacks: number;
    avgFeedbackLength: number;
  }> {
    // 왜 필요? → 관리자 대시보드용 통계
    try {
      const { count: totalFeedbacks } = await supabase
        .from('mission_feedback')
        .select('*', { count: 'exact', head: true });

      const today = new Date().toISOString().split('T')[0];
      const { count: todayFeedbacks } = await supabase
        .from('mission_feedback')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00.000Z`);

      return {
        totalFeedbacks: totalFeedbacks || 0,
        todayFeedbacks: todayFeedbacks || 0,
        avgFeedbackLength: 0, // 나중에 구현
      };
    } catch (error) {
      console.error('피드백 통계 조회 오류:', error);
      return { totalFeedbacks: 0, todayFeedbacks: 0, avgFeedbackLength: 0 };
    }
  }
}
