/**
 * 리뷰 작성 모달 컴포넌트 (UniversalCreateModal 사용)
 * - UniversalCreateModal을 사용하여 공지사항/칼럼과 동일한 패턴 적용
 * - 기수 선택, 제목, 마크다운 내용, 발행상태, 우수후기 필드를 동적으로 구성
 * - 완전히 표준화된 boolean 패턴으로 일관성 확보
 */

'use client';

import React from 'react';
import { ReviewFormData } from '@/types/domains/review';
import { FormField } from '@/types/ui/universalModal';
import UniversalCreateModal from '@/features/shared/ui/Modal/UniversalCreateModal';

interface ReviewCreateModalProps {
  show: boolean; // 모달 표시 여부
  onClose: () => void; // 모달 닫기 함수
  onSubmit: (formData: ReviewFormData) => Promise<void>; // 제출 처리 함수
  // availableCohorts 제거 - 사용자 프로필에서 자동으로 가져옴
}

/**
 * ReviewCreateModal 컴포넌트
 * @param show 모달 표시 여부
 * @param onClose 모달 닫기 콜백
 * @param onSubmit 폼 제출 콜백 (비동기)
 */
export default function ReviewCreateModal({ show, onClose, onSubmit }: ReviewCreateModalProps) {
  /**
   * UniversalCreateModal용 필드 설정
   * - 제목 입력 (글자수 제한 포함)
   * - 마크다운 내용 입력
   * - 기수는 사용자 프로필에서 자동으로 설정됨
   */
  const fields: FormField[] = [
    {
      name: 'title',
      label: '후기 제목',
      type: 'text',
      placeholder: '제목을 자유롭게 적어주세요.',
      required: true,
      maxLength: 100,
      showCharacterCount: true,
    },
    {
      name: 'content',
      label: '후기 내용',
      type: 'markdown',
      placeholder: `여러분의 솔직한 후기를 작성해주세요!`,
      required: true,
      maxLength: 2000,
      showCharacterCount: true,
      className: 'min-h-[300px]',
    },
  ];

  /**
   * 폼 제출 핸들러
   * - UniversalCreateModal의 formData를 ReviewFormData로 변환
   * - 기수는 서비스에서 사용자 프로필로부터 자동으로 설정됨
   */
  const handleSubmit = async (formData: Record<string, any>) => {
    const reviewData: ReviewFormData = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      // cohort는 서비스에서 사용자 프로필로부터 자동으로 가져옴
    };

    await onSubmit(reviewData);
  };

  return (
    <UniversalCreateModal
      show={show}
      title='후기 작성하기'
      onClose={onClose}
      onSubmit={handleSubmit}
      fields={fields}
      submitText='후기 작성'
      size='2xl'
    />
  );
}
