/**
 * 칼럼 작성 모달 컴포넌트 (UniversalCreateModal 사용)
 * - UniversalCreateModal을 사용하여 코드 중복 제거
 * - 제목, 마크다운 내용, 발행상태, 추천여부 필드를 동적으로 구성
 * - 기존 기능과 100% 동일하게 작동
 */

'use client';

import React from 'react';
import { FormField } from '@/types/ui/universalModal';
import UniversalCreateModal from '@/features/shared/ui/Modal/UniversalCreateModal';

interface ColumnCreateModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    content: string;
    isPublished: boolean;
    isFeatured: boolean;
  }) => Promise<void>;
}

/**
 * ColumnCreateModal 컴포넌트
 * @param show 모달 표시 여부
 * @param onClose 모달 닫기 콜백
 * @param onSubmit 폼 제출 콜백 (비동기)
 */
export default function ColumnCreateModal({
  show,
  onClose,
  onSubmit,
}: ColumnCreateModalProps) {

  /**
   * UniversalCreateModal용 필드 설정
   * - 제목 입력
   * - 마크다운 내용 입력
   * - 즉시 발행 체크박스 (공지사항과 동일한 패턴)
   * - 추천 칼럼 체크박스
   */
  const fields: FormField[] = [
    {
      name: 'title',
      label: '제목',
      type: 'text',
      placeholder: '칼럼 제목을 입력하세요',
      required: true,
      maxLength: 200,
      showCharacterCount: true
    },
    {
      name: 'content',
      label: '내용',
      type: 'markdown',
      placeholder: '마크다운으로 칼럼 내용을 작성하세요!\n\n예시:\n# 📝 칼럼 제목\n\n## 소개\n안녕하세요! 오늘은 흥미로운 주제에 대해 이야기해보려고 합니다.\n\n## 주요 내용\n### 첫 번째 포인트\n- 중요한 내용 1\n- 중요한 내용 2\n\n### 두 번째 포인트\n**굵은 텍스트**와 *이탤릭 텍스트*를 활용해보세요.\n\n## 마무리\n감사합니다!',
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
      name: 'isFeatured',
      label: '추천 칼럼 (우수한 칼럼을 추천 칼럼으로 표시합니다)',
      type: 'checkbox',
      defaultValue: false,
      className: 'p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200'
    }
  ];

  /**
   * 폼 제출 핸들러
   * - UniversalCreateModal의 formData를 표준화된 boolean 패턴으로 변환
   * - 공지사항과 동일한 인터페이스 사용
   */
  const handleSubmit = async (formData: Record<string, any>) => {
    const columnData = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      isPublished: formData.isPublished,
      isFeatured: formData.isFeatured,
    };
    
    await onSubmit(columnData);
  };

  return (
    <UniversalCreateModal
      show={show}
      title="새 칼럼 작성"
      onClose={onClose}
      onSubmit={handleSubmit}
      fields={fields}
      submitText="작성 완료"
      size="2xl"
      description="마크다운을 사용하여 풍부한 내용의 칼럼을 작성할 수 있습니다"
    />
  );
}

/**
 * 사용 예시:
 * 
 * <ColumnCreateModal
 *   show={showModal}
 *   onClose={() => setShowModal(false)}
 *   onSubmit={async (data) => {
 *     await createColumn(data);
 *   }}
 * />
 */