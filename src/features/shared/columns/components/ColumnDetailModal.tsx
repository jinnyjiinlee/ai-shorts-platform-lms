// 칼럼 상세보기 모달 (UniversalDetailModal 사용)

'use client';

import { Column } from '@/types/domains/community';
import UniversalDetailModal, { DetailItem, EditFormData } from '@/features/shared/board/components/UniversalDetailModal';

interface ColumnDetailModalProps {
  show: boolean;
  column: Column | null;
  userRole: 'admin' | 'student';
  onClose: () => void;
  onEditColumn?: (columnId: string, updates: any) => Promise<void>;
}

export default function ColumnDetailModal({
  show,
  column,
  userRole,
  onClose,
  onEditColumn
}: ColumnDetailModalProps) {
  if (!column) return null;

  // Column을 DetailItem으로 변환
  const detailItem: DetailItem = {
    id: column.id,
    title: column.title,
    content: column.content,
    author: column.author,
    createdAt: column.created_at,
    isPinned: false, // 칼럼은 고정 기능 없음
    isPublished: column.status === 'published',
    isFeatured: column.is_featured,
  };

  // 편집 함수 래핑
  const handleEdit = async (itemId: string, formData: EditFormData) => {
    if (!onEditColumn) return;
    
    await onEditColumn(itemId, {
      title: formData.title,
      content: formData.content,
      status: formData.isPublished ? 'published' : 'draft',
      is_featured: formData.isFeatured,
    });
  };

  // 커스텀 메타데이터 렌더링
  const renderMetadata = (item: DetailItem) => {
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    return (
      <>
        작성자: {item.author} | 작성일: {formatDate(item.createdAt)}
      </>
    );
  };

  return (
    <UniversalDetailModal
      show={show}
      item={detailItem}
      userRole={userRole}
      title="칼럼"
      onClose={onClose}
      onEdit={onEditColumn ? handleEdit : undefined}
      showPinned={false} // 칼럼은 고정 기능 없음
      showFeatured={true}
      featuredLabel="추천 칼럼"
      customMetadata={renderMetadata}
    />
  );
}