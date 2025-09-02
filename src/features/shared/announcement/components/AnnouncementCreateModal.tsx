/**
 * 공지사항 작성 모달 컴포넌트 (UniversalCreateModal 사용)
 * - UniversalCreateModal을 사용하여 코드 중복 제거
 * - 제목, 마크다운 내용, 발행여부, 고정여부 필드를 동적으로 구성
 * - 기존 기능과 100% 동일하게 작동
 */

'use client';

import React from 'react';
import { FormField } from '@/types/ui/universalModal';
import UniversalCreateModal from '@/features/shared/ui/Modal/UniversalCreateModal';

interface AnnouncementCreateModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: { 
    title: string; 
    content: string; 
    isPublished: boolean; 
    isPinned: boolean 
  }) => Promise<void>;
}

/**
 * AnnouncementCreateModal 컴포넌트
 * @param show 모달 표시 여부
 * @param onClose 모달 닫기 콜백
 * @param onSubmit 폼 제출 콜백 (비동기)
 */
export default function AnnouncementCreateModal({
  show,
  onClose,
  onSubmit,
}: AnnouncementCreateModalProps) {

  /**
   * UniversalCreateModal용 필드 설정
   * - 제목 입력
   * - 마크다운 내용 입력
   * - 즉시 발행 체크박스
   * - 상단 고정 체크박스
   */
  const fields: FormField[] = [
    {
      name: 'title',
      label: '제목',
      type: 'text',
      placeholder: '공지사항 제목을 입력하세요',
      required: true,
      maxLength: 200,
      showCharacterCount: true
    },
    {
      name: 'content',
      label: '내용',
      type: 'markdown',
      placeholder: '마크다운으로 공지사항 내용을 작성하세요!\n\n예시:\n## 📢 중요 공지\n\n안녕하세요, 수강생 여러분!\n\n### 주요 내용\n- 첫 번째 안내사항\n- 두 번째 안내사항\n\n**문의사항이 있으시면 언제든 연락주세요!**',
      required: true,
      className: 'min-h-[300px]'
    },
    {
      name: 'isPublished',
      label: '즉시 발행 (체크 해제시 임시저장됩니다)',
      type: 'checkbox',
      defaultValue: true,
      className: 'p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200'
    },
    {
      name: 'isPinned',
      label: '상단 고정 (중요한 공지를 맨 위에 고정합니다)',
      type: 'checkbox',
      defaultValue: false,
      className: 'p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200'
    }
  ];

  /**
   * 폼 제출 핸들러
   * - UniversalCreateModal의 formData를 기존 인터페이스로 변환
   * - 기존 onSubmit과 동일한 인터페이스 유지
   */
  const handleSubmit = async (formData: Record<string, any>) => {
    const announcementData = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      isPublished: formData.isPublished,
      isPinned: formData.isPinned,
    };
    
    await onSubmit(announcementData);
  };

  return (
    <UniversalCreateModal
      show={show}
      title="새 공지사항 작성"
      onClose={onClose}
      onSubmit={handleSubmit}
      fields={fields}
      submitText="작성 완료"
      size="2xl"
      description="마크다운을 사용하여 풍부한 내용의 공지사항을 작성할 수 있습니다"
    />
  );
}

/**
 * 사용 예시:
 * 
 * <AnnouncementCreateModal
 *   show={showModal}
 *   onClose={() => setShowModal(false)}
 *   onSubmit={async (data) => {
 *     await createAnnouncement(data);
 *   }}
 * />
 */