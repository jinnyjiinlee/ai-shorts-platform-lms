/**
 * 리뷰 상세보기/수정 모달 컴포넌트
 * - 읽기 모드: 리뷰 내용 표시
 * - 수정 모드: 폼으로 전환하여 편집 가능
 * - 권한 관리: 작성자 본인 또는 관리자만 수정 가능
 * - QnA의 QuestionDetailModal 패턴을 재사용
 */

'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/features/shared/ui/Modal';
import { Button } from '@/features/shared/ui/Button';
import { InputField } from '@/features/shared/ui/InputField';
import { Review, ReviewFormData, CohortOption } from '@/types/domains/review';
import { useAsyncSubmit } from '@/features/shared/hooks/useAsyncSubmit';
import { useFormState } from '@/features/shared/hooks/useFormState';
import CohortBadge from '@/features/shared/ui/Badge/CohortBadge';

interface ReviewDetailModalProps {
  show: boolean; // 모달 표시 여부
  review: Review | null; // 표시할 리뷰 데이터
  userRole: 'admin' | 'student'; // 사용자 역할
  onClose: () => void; // 모달 닫기 함수
  onUpdateReview?: (id: string, formData: ReviewFormData) => Promise<void>;
  // 수정 처리 함수
  availableCohorts: CohortOption[]; // 기수 선택 옵션
}

/**
 * ReviewDetailModal 컴포넌트
 * @param show 모달 표시 여부
 * @param review 표시할 리뷰 객체
 * @param userRole 현재 사용자 역할
 * @param onClose 모달 닫기 콜백
 * @param onUpdateReview 리뷰 수정 콜백
 * @param availableCohorts 기수 선택 옵션들
 */
export default function ReviewDetailModal({
  show,
  review,
  userRole,
  onClose,
  onUpdateReview,
  availableCohorts,
}: ReviewDetailModalProps) {
  /**
   * 폼 상태 관리 훅
   * - 읽기/수정 모드 전환
   * - 폼 데이터 관리
   */
  const {
    form: editForm,
    updateForm,
    isEditing,
    startEdit,
    cancelEdit,
  } = useFormState({
    title: '',
    content: '',
    cohort: '',
  });

  /**
   * 리뷰 수정을 위한 비동기 제출 처리
   */
  const { submitting: updateSubmitting, submit: submitUpdate } = useAsyncSubmit(async () => {
    if (!editForm.title.trim() || !editForm.content.trim() || !onUpdateReview || !review) {
      return;
    }

    const formData: ReviewFormData = {
      title: editForm.title.trim(),
      content: editForm.content.trim(),
      cohort: editForm.cohort,
    };

    await onUpdateReview(review.id, formData);
    cancelEdit(); // 수정 완료 후 읽기 모드로 전환
  });

  /**
   * 리뷰 데이터가 변경될 때 폼 초기화
   * - 새로운 리뷰를 선택했을 때 폼 상태 업데이트
   */
  useEffect(() => {
    if (review) {
      updateForm({
        title: review.title,
        content: review.content,
        cohort: review.cohort,
      });
    }
  }, [review, updateForm]);

  /**
   * 날짜 포맷팅 함수
   * - 생성일과 수정일을 한국어 형식으로 표시
   */
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

  /**
   * 수정 권한 확인
   * - 관리자는 모든 리뷰 수정 가능
   * - 학생은 본인 작성 리뷰만 수정 가능 (실제 권한 체크는 서버에서)
   */
  const canEdit = userRole === 'admin' || userRole === 'student';

  /**
   * 수정 폼 제출 핸들러
   */
  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitUpdate();
  };

  /**
   * 수정 모드 시작 핸들러
   */
  const handleStartEdit = () => {
    if (review) {
      startEdit({
        title: review.title,
        content: review.content,
        cohort: review.cohort,
      });
    }
  };

  // 리뷰 데이터가 없으면 모달을 표시하지 않음
  if (!review) return null;

  return (
    <Modal show={show} title={isEditing ? '후기 수정' : '후기 상세보기'} onClose={onClose} size='2xl'>
      <div className='space-y-6'>
        {/* 리뷰 정보 헤더 */}
        {!isEditing && (
          <div className='border-b border-slate-200 pb-4'>
            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center space-x-3'>
                <CohortBadge cohort={review.cohort} size='md' />
                <span className='text-sm text-slate-600'>{review.student_nickname || '작성자'}</span>
              </div>
              <div className='text-sm text-slate-500'>
                작성일: {formatDate(review.created_at)}
                {review.updated_at !== review.created_at && (
                  <span className='block'>
                    수정일:
                    {formatDate(review.updated_at)}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 수정 모드 */}
        {isEditing ? (
          <form onSubmit={handleUpdateSubmit}>
            <div className='space-y-6'>
              {/* 기수 선택 (수정 모드) */}
              <div>
                <label
                  className='block text-sm font-medium text-slate-700 
  mb-2'
                >
                  기수 선택
                </label>
                <select
                  value={editForm.cohort}
                  onChange={(e) => updateForm({ cohort: e.target.value })}
                  className='w-full px-4 py-3 border border-slate-300
  rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent
  transition-all'
                  required
                >
                  {availableCohorts.map((cohort) => (
                    <option key={cohort.value} value={cohort.value}>
                      {cohort.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 제목 수정 */}
              <InputField
                label='후기 제목'
                value={editForm.title}
                onChange={(value) => updateForm({ title: value })}
                placeholder='후기 제목을 입력하세요'
                required
                maxLength={100}
              />

              {/* 내용 수정 */}
              <div>
                <label
                  className='block text-sm font-medium text-slate-700 
  mb-2'
                >
                  후기 내용
                </label>
                <textarea
                  value={editForm.content}
                  onChange={(e) => updateForm({ content: e.target.value })}
                  className='w-full px-4 py-3 border border-slate-300
  rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent
  transition-all min-h-[300px] resize-vertical'
                  required
                  maxLength={2000}
                />
                <div
                  className='flex justify-between text-xs text-slate-500
   mt-1'
                >
                  <span>마크다운 문법을 사용하실 수 있습니다</span>
                  <span>{editForm.content.length}/2000자</span>
                </div>
              </div>

              {/* 수정 모드 버튼들 */}
              <div className='flex justify-end space-x-3'>
                <Button type='button' onClick={cancelEdit} variant='outline' disabled={updateSubmitting}>
                  취소
                </Button>
                <Button
                  type='submit'
                  variant='primary'
                  disabled={updateSubmitting || !editForm.title.trim() || !editForm.content.trim()}
                  isLoading={updateSubmitting}
                >
                  {updateSubmitting ? '저장 중...' : '저장'}
                </Button>
              </div>
            </div>
          </form>
        ) : (
          // 읽기 모드
          <>
            {/* 제목 */}
            <div>
              <h2 className='text-xl font-bold text-slate-900 mb-4'>{review.title}</h2>
            </div>

            {/* 내용 */}
            <div className='prose max-w-none'>
              <div className='bg-slate-50 rounded-lg p-6'>
                <div
                  className='text-slate-800 whitespace-pre-wrap 
  leading-relaxed'
                >
                  {review.content}
                </div>
              </div>
            </div>

            {/* 읽기 모드 버튼들 */}
            <div
              className='flex justify-between items-center pt-4 border-t
   border-slate-200'
            >
              <div>
                {/* 수정 버튼 - 권한이 있을 때만 표시 */}
                {canEdit && onUpdateReview && (
                  <Button variant='outline' onClick={handleStartEdit}>
                    수정
                  </Button>
                )}
              </div>
              <div>
                <Button onClick={onClose} variant='primary'>
                  닫기
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
