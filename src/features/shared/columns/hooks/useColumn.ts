// 비즈니스 로직 훅 (growth diary 패턴)

import { useState, useEffect } from 'react';
import { Column } from '@/types/domains/community';
import { ColumnService } from '../services/columnService';
import { usePagination } from '@/features/shared/ui/Pagination/usePagination';
import { supabase } from '@/lib/supabase/client';

export const useColumn = (userRole: 'admin' | 'student') => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<Column | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedCohort, setSelectedCohort] = useState<string | 'all'>('all');

  // 페이지네이션 설정
  const COLUMNS_PER_PAGE = 10;

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedColumns,
    handlePageChange,
  } = usePagination({
    data: columns,
    itemsPerPage: COLUMNS_PER_PAGE,
  });

  // 현재 사용자 정보 가져오기
  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);

  // 칼럼 목록 불러오기
  const loadColumns = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = userRole === 'admin' 
        ? await ColumnService.getAllForAdmin()
        : await ColumnService.getAll();

      // 기수별 필터링
      const filteredData = selectedCohort === 'all' 
        ? data 
        : data.filter((column) => column.cohort === selectedCohort);

      setColumns(filteredData);
    } catch (err) {
      setError('칼럼을 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 칼럼 작성 (관리자만)
  const handleCreateColumn = async (
    title: string, 
    content: string, 
    summary?: string,
    cohort = '1',
    status: 'draft' | 'published' = 'published',
    isFeatured = false,
    thumbnailUrl?: string,
    metaDescription?: string
  ) => {
    if (userRole !== 'admin') return;

    try {
      await ColumnService.create({
        title,
        content,
        summary,
        cohort,
        status,
        is_featured: isFeatured,
        thumbnail_url: thumbnailUrl,
        meta_description: metaDescription,
      });
      await loadColumns();
      setShowCreateModal(false);
    } catch (err) {
      console.error('칼럼 작성 실패:', err);
      throw err;
    }
  };

  // 칼럼 수정 (관리자만)
  const handleEditColumn = async (
    columnId: string,
    updates: {
      title?: string;
      content?: string;
      summary?: string;
      cohort?: string;
      status?: 'draft' | 'published' | 'archived';
      is_featured?: boolean;
      thumbnail_url?: string;
      meta_description?: string;
    }
  ) => {
    if (userRole !== 'admin') return;

    try {
      await ColumnService.update(columnId, updates);
      await loadColumns();
    } catch (err) {
      console.error('칼럼 수정 실패:', err);
      throw err;
    }
  };

  // 칼럼 삭제 (관리자만)
  const handleDeleteColumn = async (id: string) => {
    if (userRole !== 'admin') return;
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await ColumnService.delete(id);
      await loadColumns();
    } catch (error) {
      alert('삭제에 실패했습니다.');
    }
  };

  // 추천 상태 토글 (관리자만)
  const handleToggleFeatured = async (id: string) => {
    if (userRole !== 'admin') return;

    try {
      await ColumnService.toggleFeatured(id);
      await loadColumns();
    } catch (err) {
      alert('추천 상태 변경에 실패했습니다.');
    }
  };

  // 발행 상태 변경 (관리자만)
  const handleUpdateStatus = async (id: string, status: 'draft' | 'published' | 'archived') => {
    if (userRole !== 'admin') return;

    try {
      await ColumnService.updateStatus(id, status);
      await loadColumns();
    } catch (err) {
      alert('상태 변경에 실패했습니다.');
    }
  };

  // 칼럼 상세보기
  const handleViewColumn = (column: Column) => {
    setSelectedColumn(column);
    setShowDetailModal(true);
    // 조회수 증가 (학생용일 때만)
    if (userRole === 'student') {
      ColumnService.incrementViewCount(column.id);
    }
  };

  // 좋아요 토글 (로그인 사용자만)
  const handleToggleLike = async (columnId: string) => {
    if (!currentUserId) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const isLiked = await ColumnService.toggleLike(columnId);
      // 좋아요 상태 업데이트를 위해 다시 로드
      await loadColumns();
      return isLiked;
    } catch (err) {
      console.error('좋아요 처리 실패:', err);
      alert('좋아요 처리에 실패했습니다.');
    }
  };

  // 기수 변경
  const handleCohortChange = (cohort: string | 'all') => {
    setSelectedCohort(cohort);
  };

  // 초기 로드 및 기수 변경 시 다시 로드
  useEffect(() => {
    loadColumns();
  }, [userRole, selectedCohort]);

  return {
    // 상태
    columns,
    loading,
    error,
    showCreateModal,
    showDetailModal,
    selectedColumn,
    currentUserId,
    selectedCohort,

    // 페이지네이션 관련
    paginatedColumns,
    currentPage,
    totalPages,
    handlePageChange,

    // 상태 변경
    setShowCreateModal,
    setShowDetailModal,

    // 액션
    loadColumns,
    handleCreateColumn,
    handleEditColumn,
    handleDeleteColumn,
    handleToggleFeatured,
    handleUpdateStatus,
    handleViewColumn,
    handleToggleLike,
    handleCohortChange,
  };
};