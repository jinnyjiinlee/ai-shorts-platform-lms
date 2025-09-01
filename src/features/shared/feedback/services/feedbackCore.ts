//기본 CRUD 작업

// 데이터 베이스를 직접 조작, 비즈니스 로직

import { supabase } from '@/lib/supabase/client';
import { MissionFeedback, CreateFeedbackDTO, UpdateFeedbackDTO } from '@/types/domains/feedback';

export class FeedbackService {
  // 1. 피드백 생성 (관리자만)
  static async createFeedback(data: CreateFeedbackDTO): Promise<MissionFeedback> {
    // 관리자가 학생들에게 피드백 작성
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('로그인이 필요합니다.');
      }

      const { data: feedback, error } = await supabase
        .from('mission_feedback')
        .insert({
          mission_submit_id: data.mission_submit_id,
          admin_id: user.id,
          feedback_comment: data.feedback_comment,
        })
        .select('*')
        .single();

      if (error) throw error;
      return feedback;
    } catch (error) {
      console.error('피드백 생성 오류: ', error);
      throw error;
    }
  }

  // 2. 특정 제출물의 피드백 목록 조회
  static async getFeedbackBySubmission(submissionId: string): Promise<MissionFeedback[]> {
    // 학생이 자신의 제출물에 달린 피드백 보기
    try {
      const { data, error } = await supabase
        .from('mission_feedback')
        .select(
          `
        *,
        admin:profiles!admin_id ( nickname )
      `
        )
        .eq('mission_submit_id', submissionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      // JOIN 데이터를 flat하게 변환
      return (data || []).map((item) => ({
        ...item,
        admin_nickname: item.admin?.nickname,
      }));
    } catch (error) {
      console.error('피드백 조회 오류: ', error);
      throw error;
    }
  }

  // 3. 피드백 수정 (관리자만)
  static async updateFeedback(feedbackId: number, data: UpdateFeedbackDTO): Promise<MissionFeedback> {
    // 관리자가 잘못 작성한 피드백 수정
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('로그인이 필요합니다.');
      }

      // UPSET 사용 (cors 에러 방지)
      const { data: feedback, error } = await supabase
        .from('mission_feedback')
        .upsert(
          {
            id: feedbackId,
            admin_id: user.id, // 본인 확인
            feedback_comment: data.feedback_comment,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'id',
          }
        )
        .select('*')
        .single();

      if (error) throw error;
      return feedback;
    } catch (error) {
      console.error('피드백 수정 오류: ', error);
      throw error;
    }
  }

  // 4. 피드백 삭제 (작성자만)
  static async deleteFeedback(feedbackId: number): Promise<void> {
    // 잘못된 피드백 삭제
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('로그인이 필요합니다.');
      }

      const { error } = await supabase.from('mission_feedback').delete().eq('id', feedbackId).eq('admin_id', user.id); // 본인 확인

      if (error) throw error;
    } catch (error) {
      console.error('피드백 삭제 오류: ', error);
      throw error;
    }
  }
}
