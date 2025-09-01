// hooks/useGrowthDiary.ts
import { useState, useEffect } from 'react';
import { GrowthDiary } from '@/types/domains/growthDiary';
import { GrowthDiaryService } from '../services/growthDiaryService';
import { usePagination } from '@/features/shared/ui/Pagination/usePagination';
import { supabase } from '@/lib/supabase/client';

/**
 * 성장일기 관련 모든 로직을 관리하는 Custom Hook
 * - API 호출 로직
 * - 상태 관리
 * - 에러 처리
 */
export const useGrowthDiary = (userRole: 'admin' | 'student', cohort: string = '1') => {
  // 상태 관리
  const [diaries, setDiaries] = useState<GrowthDiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDiaryModal, setShowDiaryModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // 일기 상세 모달 상태 관리
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState<GrowthDiary | null>(null);

  // 페이지네이션 설정
  const DIARIES_PER_PAGE = 10;

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedDiaries,
    handlePageChange,
  } = usePagination({
    data: diaries,
    itemsPerPage: DIARIES_PER_PAGE,
  });

  // 일기 목록 불러오기
  const loadDiaries = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await GrowthDiaryService.getAll(cohort);
      setDiaries(data);
      
    } catch (err) {
      setError('성장 일기 목록을 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 일기 작성
  const handleCreateDiary = async (title: string, content: string) => {
    try {
      await GrowthDiaryService.create({ title, content, cohort });
      await loadDiaries();
      setShowDiaryModal(false);
    } catch (err) {
      console.error('일기 작성 실패:', err);
      throw err; // 모달에서 처리하도록 다시 throw
    }
  };

  // 일기 삭제 (수강생)
  const handleDeleteMyDiary = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await GrowthDiaryService.delete(id);
      await loadDiaries();
    } catch (err) {
      alert('삭제 실패했습니다.');
    }
  };

  // 일기 삭제 (관리자)
  const handleAdminDelete = async (id: string) => {
    if (!confirm('이 일기를 삭제하시겠습니까?')) return;

    try {
      await GrowthDiaryService.delete(id);
      await loadDiaries();
    } catch (err) {
      alert('삭제 실패했습니다.');
    }
  };

  // 일기 수정
  const handleEditDiary = async (diaryId: string, title: string, content: string) => {
    try {
      await GrowthDiaryService.update(diaryId, { title, content });
      await loadDiaries();
    } catch (err) {
      console.error('수정 실패:', err);
      throw err;
    }
  };

  // 일기 상세보기 함수 추가
  const handleViewDiary = (diary: GrowthDiary) => {
    setSelectedDiary(diary);
    setShowDetailModal(true);
  };

  // 현재 사용자 정보 가져오기
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);

  // 초기 로드
  useEffect(() => {
    loadDiaries();
  }, [cohort]);

  // 반환값: 컴포넌트에서 필요한 모든 것
  return {
    // 상태
    diaries,
    loading,
    error,
    showDiaryModal,
    showDetailModal,
    selectedDiary,
    currentUserId,

    // 페이지네이션 관련
    paginatedDiaries,
    currentPage,
    totalPages,
    handlePageChange,

    // 상태 변경
    setShowDiaryModal,
    setShowDetailModal,

    // 액션
    loadDiaries,
    handleCreateDiary,
    handleDeleteMyDiary,
    handleAdminDelete,
    handleEditDiary,
    handleViewDiary,
  };
};