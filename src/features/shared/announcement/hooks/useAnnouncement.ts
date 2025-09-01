// 비즈니스 로직 훅 (growth diary 패턴)

import { useState, useEffect } from 'react';
import { Announcement } from '@/types/domains/announcement';
import { AnnouncementService } from '../services/announcementService';
import { usePagination } from '@/features/shared/ui/Pagination/usePagination';
import { supabase } from '@/lib/supabase/client';

export const useAnnouncement = (userRole: 'admin' | 'student') => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // 페이지네이션 설정
  const ANNOUNCEMENTS_PER_PAGE = 10;

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedAnnouncements,
    handlePageChange,
  } = usePagination({
    data: announcements,
    itemsPerPage: ANNOUNCEMENTS_PER_PAGE,
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

  // 공지사항 목록 불러오기
  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await AnnouncementService.getAll();

      // 학생은 발행된 공지사항만 필터링
      const filteredData = userRole === 'student' ? data.filter((announcement) => announcement.is_published) : data;

      setAnnouncements(filteredData);
    } catch (err) {
      setError('공지사항을 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 공지사항 작성 (관리자만)
  const handleCreateAnnouncement = async (title: string, content: string, isPublished = true, isPinned = false) => {
    if (userRole !== 'admin') return;

    try {
      await AnnouncementService.create({
        title,
        content,
        is_published: isPublished,
        is_pinned: isPinned,
      });
      await loadAnnouncements();
      setShowCreateModal(false);
    } catch (err) {
      console.error('공지사항 작성 실패:', err);
      throw err;
    }
  };

  // 공지사항 수정 (관리자만)
  const handleEditAnnouncement = async (
    announcementId: string,
    title: string,
    content: string,
    isPublished?: boolean,
    isPinned?: boolean
  ) => {
    if (userRole !== 'admin') return;

    try {
      await AnnouncementService.update(announcementId, {
        title,
        content,
        is_published: isPublished,
        is_pinned: isPinned,
      });
      await loadAnnouncements();
    } catch (err) {
      console.error('수정 실패:', err);
      throw err;
    }
  };

  // 공지사항 삭제 (관리자만)
  const handleDeleteAnnouncement = async (id: string) => {
    if (userRole !== 'admin') return;
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await AnnouncementService.delete(id);
      await loadAnnouncements();
    } catch (error) {
      alert('삭제 실패했습니다.');
    }
  };

  // 고정 상태 토글 (관리자만)
  const handleTogglePinned = async (id: string) => {
    if (userRole !== 'admin') return;

    try {
      await AnnouncementService.togglePinned(id);
      await loadAnnouncements();
    } catch (err) {
      alert('고정 상태 변경에 실패했습니다.');
    }
  };

  // 발행 상태 토글 (관리자만)
  const handleTogglePublished = async (id: string) => {
    if (userRole !== 'admin') return;

    try {
      await AnnouncementService.togglePublished(id);
      await loadAnnouncements();
    } catch (err) {
      alert('발행 상태 변경에 실패했습니다.');
    }
  };

  // 공지사항 상세보기
  const handleViewAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setShowDetailModal(true);
  };

  // 초기 로드
  useEffect(() => {
    loadAnnouncements();
  }, [userRole]);

  return {
    // 상태
    announcements,
    loading,
    error,
    showCreateModal,
    showDetailModal,
    selectedAnnouncement,
    currentUserId,

    // 페이지네이션 관련
    paginatedAnnouncements,
    currentPage,
    totalPages,
    handlePageChange,

    // 상태 변경
    setShowCreateModal,
    setShowDetailModal,

    // 액션 (관리자만 실제로 작동)
    loadAnnouncements,
    handleCreateAnnouncement,
    handleEditAnnouncement,
    handleDeleteAnnouncement,
    handleTogglePinned,
    handleTogglePublished,
    handleViewAnnouncement,
  };
};
