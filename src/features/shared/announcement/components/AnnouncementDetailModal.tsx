// 공지 상세 / 수정 모달 (UniversalDetailModal 사용)

'use client';

import { Announcement } from '@/types/domains/announcement';
import UniversalDetailModal, { DetailItem, EditFormData } from '@/features/shared/board/components/UniversalDetailModal';

interface AnnouncementDetailModalProps {
  show: boolean;
  announcement: Announcement | null;
  userRole: 'admin' | 'student';
  onClose: () => void;
  onEditAnnouncement?: (
    announcementId: string,
    title: string,
    content: string,
    isPublished?: boolean,
    isPinned?: boolean
  ) => Promise<void>;
}

export default function AnnouncementDetailModal({
  show,
  announcement,
  userRole,
  onClose,
  onEditAnnouncement,
}: AnnouncementDetailModalProps) {
  if (!announcement) return null;

  // Announcement을 DetailItem으로 변환
  const detailItem: DetailItem = {
    id: announcement.id,
    title: announcement.title,
    content: announcement.content,
    author: announcement.profiles?.nickname || '관리자',
    createdAt: announcement.created_at,
    isPinned: announcement.is_pinned,
    isPublished: announcement.is_published,
  };

  // 편집 함수 래핑
  const handleEdit = async (itemId: string, formData: EditFormData) => {
    if (!onEditAnnouncement) return;
    
    await onEditAnnouncement(
      itemId,
      formData.title,
      formData.content,
      formData.isPublished,
      formData.isPinned
    );
  };

  return (
    <UniversalDetailModal
      show={show}
      item={detailItem}
      userRole={userRole}
      title="공지사항"
      onClose={onClose}
      onEdit={onEditAnnouncement ? handleEdit : undefined}
      showPinned={true}
      showFeatured={false}
      pinnedLabel="상단 고정"
    />
  );
}