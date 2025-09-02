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

      setColumns(data);
    } catch (err) {
      setError('칼럼을 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 칼럼 작성 (관리자만) - 표준화된 boolean 패턴 사용
  const handleCreateColumn = async (
    title: string, 
    content: string, 
    isPublished = true,
    isFeatured = false
  ) => {
    if (userRole !== 'admin') return;

    try {
      await ColumnService.create({
        title,
        content,
        isPublished,
        isFeatured,
      });
      await loadColumns();
      setShowCreateModal(false);
    } catch (err) {
      console.error('칼럼 작성 실패:', err);
      throw err;
    }
  };

  // 칼럼 수정 (관리자만) - 표준화된 boolean 패턴 사용
  const handleEditColumn = async (
    columnId: string,
    updates: {
      title?: string;
      content?: string;
      isPublished?: boolean;
      isFeatured?: boolean;
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



  // 칼럼 상세보기
  const handleViewColumn = (column: Column) => {
    setSelectedColumn(column);
    setShowDetailModal(true);
  };



  // 초기 로드
  useEffect(() => {
    loadColumns();
  }, [userRole]);

  return {
    // 상태
    columns,
    loading,
    error,
    showCreateModal,
    showDetailModal,
    selectedColumn,
    currentUserId,

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
    handleViewColumn,
  };
};