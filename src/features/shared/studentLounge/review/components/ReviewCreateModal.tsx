/**
 * 리뷰 작성 모달 컴포넌트
 * - 제목, 내용, 기수 선택 폼 제공
 * - QnA의 QuestionCreateModal 패턴을 재사용
 * - 기수 선택 드롭다운이 추가된 것이 주요 차이점
 * - 폼 검증 및 비동기 제출 처리
 */

'use client';

import React from 'react';
import { ReviewFormData, CohortOption } from '@/types/domains/review';
import { FormField } from '@/types/ui/universalModal';
import UniversalCreateModal from '@/features/shared/ui/Modal/UniversalCreateModal';

interface ReviewCreateModalProps {
  show: boolean;                                    // 모달 표시 여부
  onClose: () => void;                             // 모달 닫기 함수
  onSubmit: (formData: ReviewFormData) => Promise<void>;  // 제출 처리 함수
  availableCohorts: CohortOption[];                // 선택 가능한 기수 목록
}

/**
 * ReviewCreateModal 컴포넌트
 * @param show 모달 표시 여부
 * @param onClose 모달 닫기 콜백
 * @param onSubmit 폼 제출 콜백 (비동기)
 * @param availableCohorts 선택 가능한 기수 옵션들
 */
export default function ReviewCreateModal({
  show,
  onClose,
  onSubmit,
  availableCohorts,
}: ReviewCreateModalProps) {

  /**
   * UniversalCreateModal용 필드 설정
   * - 기수 선택 드롭다운
   * - 제목 입력 (글자수 제한 포함)
   * - 내용 입력 (긴 텍스트)
   */
  const fields: FormField[] = [
    {
      name: 'cohort',
      label: '기수 선택',
      type: 'select',
      required: true,
      defaultValue: availableCohorts[0]?.value || '1',
      options: availableCohorts.map(cohort => ({
        value: cohort.value,
        label: `${cohort.label} 후기`
      }))
    },
    {
      name: 'title',
      label: '후기 제목',
      type: 'text',
      placeholder: '제목을 자유롭게 적어주세요.',
      required: true,
      maxLength: 100,
      showCharacterCount: true
    },
    {
      name: 'content',
      label: '후기 내용',
      type: 'textarea',
      placeholder: `솔직한 후기를 작성해주세요. 예시:

## 👍 좋았던 점
- 실무진의 1:1 피드백이 정말 도움이 되었습니다
- 단계별로 체계적인 커리큘럼이 좋았어요

## 💡 배운 점
- AI 쇼츠 제작의 전체 프로세스를 이해할 수 있었습니다
- 실제 수익화까지 경험해볼 수 있어서 값진 경험이었어요

## 🎯 추천 대상
- AI에 관심있지만 어디서부터 시작해야 할지 모르는 분들께 추천드려요`,
      required: true,
      maxLength: 2000,
      showCharacterCount: true
    }
  ];

  /**
   * 폼 제출 핸들러
   * - UniversalCreateModal의 formData를 ReviewFormData로 변환
   * - 기존 onSubmit과 동일한 인터페이스 유지
   */
  const handleSubmit = async (formData: Record<string, any>) => {
    const reviewData: ReviewFormData = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      cohort: formData.cohort,
    };
    
    await onSubmit(reviewData);
  };

  return (
    <>
      <UniversalCreateModal
        show={show}
        title="후기 작성하기"
        onClose={onClose}
        onSubmit={handleSubmit}
        fields={fields}
        submitText="후기 작성"
        size="2xl"
        description="수강생들의 솔직한 후기와 경험담을 공유하는 공간입니다"
      />
      
      {/* 작성 가이드라인 - 모달 표시 시에만 보이도록 */}
      {show && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 shadow-lg">
            <h4 className="text-sm font-medium text-purple-800 mb-2">
              📝 작성 가이드라인
            </h4>
            <ul className="text-xs text-purple-700 space-y-1">
              <li>• 솔직하고 구체적인 경험을 공유해주세요</li>
              <li>• 다른 수강생들에게 도움이 될 수 있는 내용을 포함해주세요</li>
              <li>• 개인정보나 부적절한 내용은 포함하지 말아주세요</li>
              <li>• 작성한 후기는 수정 및 삭제가 가능합니다</li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}