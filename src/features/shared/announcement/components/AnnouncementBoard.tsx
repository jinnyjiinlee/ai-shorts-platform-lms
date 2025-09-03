// 메인 게시판 (UniversalBoard 사용)

'use client';

import { MegaphoneIcon } from '@heroicons/react/24/outline';
import { useAnnouncement } from '../hooks/useAnnouncement';
import UniversalBoard, { BoardItem } from '@/features/shared/board/components/UniversalBoard';
import AnnouncementCreateModal from './AnnouncementCreateModal';
import AnnouncementDetailModal from './AnnouncementDetailModal';
import { markdownToPlainText } from '@/features/shared/ui/MarkdownRenderer';

interface AnnouncementBoardProps {
  userRole: 'admin' | 'student';
}

export default function AnnouncementBoard({ userRole }: AnnouncementBoardProps) {
  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const {
    announcements,
    loading,
    error,
    showCreateModal,
    setShowCreateModal,
    showDetailModal,
    selectedAnnouncement,
    setShowDetailModal,

    // 페이지네이션 관련
    paginatedAnnouncements,
    currentPage,
    totalPages,
    handlePageChange,

    handleCreateAnnouncement,
    handleDeleteAnnouncement,
    handleEditAnnouncement,
    handleViewAnnouncement,
  } = useAnnouncement(userRole);

  // Announcement을 BoardItem으로 변환
  const boardItems: BoardItem[] = paginatedAnnouncements.map((announcement) => ({
    id: announcement.id,
    title: announcement.title,
    content: markdownToPlainText(announcement.content),
    author: announcement.profiles?.nickname || '관리자',
    createdAt: formatDate(announcement.created_at),
    isPinned: announcement.is_pinned,
    isPublished: announcement.is_published,
    badges: [],
  }));

  return (
    <div className="space-y-6">
      {/* UniversalBoard 사용 */}
      <UniversalBoard
        title="공지사항"
        description={
          userRole === 'admin'
            ? '중요한 공지사항을 작성하고 관리하세요'
            : '중요한 공지사항을 확인하세요'
        }
        icon={<MegaphoneIcon className="w-6 h-6 text-blue-600" />}
        iconBgColor="bg-blue-100"
        createButtonText="새 공지 작성"
        items={boardItems}
        userRole={userRole}
        loading={loading}
        error={error || undefined}
        onCreateItem={() => setShowCreateModal(true)}
        onViewItem={(item) => {
          const announcement = announcements.find((a) => a.id === item.id);
          if (announcement) handleViewAnnouncement(announcement);
        }}
        onEditItem={(item) => {
          const announcement = announcements.find((a) => a.id === item.id);
          if (announcement) handleViewAnnouncement(announcement);
        }}
        onDeleteItem={(id) => handleDeleteAnnouncement(id)}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* 공지 작성 모달 (관리자만) */}
      {userRole === 'admin' && (
        <AnnouncementCreateModal
          show={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={async (data) => {
            await handleCreateAnnouncement(data.title, data.content, data.isPublished, data.isPinned);
          }}
        />
      )}

      {/* 공지 상세보기 모달 */}
      <AnnouncementDetailModal
        show={showDetailModal}
        announcement={selectedAnnouncement}
        userRole={userRole}
        onClose={() => setShowDetailModal(false)}
        onEditAnnouncement={handleEditAnnouncement}
      />
    </div>
  );
}