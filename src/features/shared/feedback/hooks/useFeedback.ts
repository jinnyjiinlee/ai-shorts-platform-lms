// react 컴포넌트에서 쉽게 사용, 상태 관ㄹ

import { useState, useEffect, useCallback } from 'react';
import { FeedbackService } from '../services/feedbackCore';
import { MissionFeedback, CreateFeedbackDTO, UpdateFeedbackDTO } from '@/types/domains/feedback';

export const useFeedback = (submissionId?: string) => {
  // 상태 관리
  const [feedbacks, setFeedbacks] = useState<MissionFeedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 피드백 목록 로드
  const loadFeedbacks = useCallback(async () => {
    if (!submissionId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await FeedbackService.getFeedbackBySubmission(submissionId);
      setFeedbacks(data);
    } catch (err: any) {
      setError(err.message || '피드백을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  }, [submissionId]);

  // 피드백 생성
  const createFeedback = useCallback(async (data: CreateFeedbackDTO) => {
    try {
      setCreating(true);
      setError(null);

      const newFeedback = await FeedbackService.createFeedback(data);

      // 상태 업데이트
      setFeedbacks((prev) => [newFeedback, ...prev]);

      return newFeedback;
    } catch (err: any) {
      setError(err.message || '피드백 작성에 실패했습니다.');
      throw err;
    } finally {
      setCreating(false);
    }
  }, []);

  // 피드백 수정
  const updateFeedback = useCallback(async (feedbackId: number, data: UpdateFeedbackDTO) => {
    try {
      setError(null);
      const updatedFeedback = await FeedbackService.updateFeedback(feedbackId, data);

      // 상태 업데이트
      setFeedbacks((prev) => prev.map((f) => (f.id === feedbackId ? updatedFeedback : f)));

      return updatedFeedback;
    } catch (err: any) {
      setError(err.message || '피드백 수정에  실패했습니다.');
      throw err;
    }
  }, []);

  // 피드백 삭제
  const deleteFeedback = useCallback(async (feedbackId: number) => {
    try {
      setError(null);
      await FeedbackService.deleteFeedback(feedbackId);

      // 상태 업데이트
      setFeedbacks((prev) => prev.filter((f) => f.id !== feedbackId));
    } catch (err: any) {
      setError(err.message || '피드백 삭제에 실패했습니다.');
      throw err;
    }
  }, []);

  // 초기 로드
  useEffect(() => {
    if (submissionId) {
      loadFeedbacks();
    }
  }, [submissionId, loadFeedbacks]);

  return {
    // 상태
    feedbacks,
    loading,
    creating,
    error,

    // 액션
    loadFeedbacks,
    createFeedback,
    updateFeedback,
    deleteFeedback,

    // 계산된 값
    feedbackCount: feedbacks.length,
    hasFeedback: feedbacks.length > 0,
    latestFeedback: feedbacks[0] || null,
  };
};
