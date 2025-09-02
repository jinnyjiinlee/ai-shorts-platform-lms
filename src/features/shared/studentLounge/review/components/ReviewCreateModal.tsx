/**
 * 리뷰 작성 모달 컴포넌트
 * - 제목, 내용, 기수 선택 폼 제공
 * - QnA의 QuestionCreateModal 패턴을 재사용
 * - 기수 선택 드롭다운이 추가된 것이 주요 차이점
 * - 폼 검증 및 비동기 제출 처리
 */

'use client';

import { useState } from 'react';
import { Modal } from '@/features/shared/ui/Modal';
import { Button } from '@/features/shared/ui/Button';
import { InputField } from '@/features/shared/ui/InputField';
import { ReviewFormData, CohortOption } from '@/types/domains/review';
import { useAsyncSubmit } from '@/features/shared/hooks/useAsyncSubmit';

interface ReviewCreateModalProps {
  show: boolean; // 모달 표시 여부
  onClose: () => void; // 모달 닫기 함수
  onSubmit: (formData: ReviewFormData) => Promise<void>; // 제출 처리 함수
  availableCohorts: CohortOption[]; // 선택 가능한 기수 목록
}

/**
 * ReviewCreateModal 컴포넌트
 * @param show 모달 표시 여부
 * @param onClose 모달 닫기 콜백
 * @param onSubmit 폼 제출 콜백 (비동기)
 * @param availableCohorts 선택 가능한 기수 옵션들
 */
export default function ReviewCreateModal({ show, onClose, onSubmit, availableCohorts }: ReviewCreateModalProps) {
  /**
   * 폼 상태 관리
   * - 제목, 내용, 기수를 각각 state로 관리
   * - 초기값: 빈 문자열과 첫 번째 기수
   */
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCohort, setSelectedCohort] = useState(
    availableCohorts[0]?.value || '1' // 첫 번째 기수를 기본값으로
  );

  /**
   * 비동기 제출 처리를 위한 커스텀 훅
   * - 제출 중 상태 관리
   * - 에러 처리
   * - 중복 제출 방지
   */
  const { submitting, submit } = useAsyncSubmit(async () => {
    // 폼 데이터 객체 생성
    const formData: ReviewFormData = {
      title: title.trim(),
      content: content.trim(),
      cohort: selectedCohort,
    };

    await onSubmit(formData); // 상위 컴포넌트의 제출 함수 호출
    handleClose(); // 성공 시 모달 닫기 및 폼 초기화
  });

  /**
   * 모달 닫기 및 폼 초기화 함수
   * - 모달을 닫을 때 입력된 데이터 초기화
   * - 다음 번 열 때 깨끗한 상태로 시작
   */
  const handleClose = () => {
    setTitle('');
    setContent('');
    setSelectedCohort(availableCohorts[0]?.value || '1');
    onClose();
  };

  /**
   * 폼 제출 핸들러
   * - 기본 폼 제출 동작 방지
   * - 비동기 제출 실행
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 기본 폼 제출 방지
    submit(); // 비동기 제출 실행
  };

  return (
    <Modal
      show={show}
      title='후기 작성하기'
      onClose={handleClose}
      size='2xl' // 내용이 많으므로 큰 크기 모달 사용
    >
      <form onSubmit={handleSubmit}>
        <div className='space-y-6'>
          {/* 기수 선택 드롭다운 */}
          <div>
            <label
              className='block text-sm font-medium text-slate-700 
  mb-2'
            >
              기수 선택 <span className='text-red-500'>*</span>
            </label>
            <select
              value={selectedCohort}
              onChange={(e) => setSelectedCohort(e.target.value)}
              className='w-full px-4 py-3 border border-slate-300
  rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent
  transition-all'
              required
            >
              {availableCohorts.map((cohort) => (
                <option key={cohort.value} value={cohort.value}>
                  {cohort.label} 후기
                </option>
              ))}
            </select>
            <p className='text-xs text-slate-500 mt-1'>수강하신 기수를 선택해주세요</p>
          </div>

          {/* 제목 입력 */}
          <InputField
            label='후기 제목'
            value={title}
            onChange={setTitle}
            placeholder='제목을 자유롭게 적어주세요.'
            required
            maxLength={100}              // 제목 길이 제한
            showCharacterCount={true}    // 글자수 표시
          />

          {/* 내용 입력 (마크다운 지원) */}
          <div>
            <label
              className='block text-sm font-medium text-slate-700 
  mb-2'
            >
              후기 내용 <span className='text-red-500'>*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`솔직한 후기를 작성해주세요. `}
              className='w-full px-4 py-3 border border-slate-300
  rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent
  transition-all min-h-[300px] resize-vertical'
              required
              maxLength={2000} // 내용 길이 제한
            />
            <div
              className='flex justify-between text-xs text-slate-500 
  mt-1'
            >
              <span>마크다운 문법을 사용하실 수 있습니다</span>
              <span>{content.length}/2000자</span>
            </div>
          </div>

          {/* 작성 가이드라인 */}
          <div
            className='bg-purple-50 border border-purple-200 rounded-lg 
  p-4'
          >
            <h4 className='text-sm font-medium text-purple-800 mb-2'>📝 작성 가이드라인</h4>
            <ul className='text-xs text-purple-700 space-y-1'>
              <li>• 솔직하고 구체적인 경험을 공유해주세요</li>
              <li>• 다른 수강생들에게 도움이 될 수 있는 내용을 포함해주세요</li>
              <li>• 개인정보나 부적절한 내용은 포함하지 말아주세요</li>
              <li>• 작성한 후기는 수정 및 삭제가 가능합니다</li>
            </ul>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div
          className='flex justify-end space-x-3 mt-6 pt-4 border-t 
  border-slate-200'
        >
          <Button
            type='button'
            onClick={handleClose}
            variant='outline'
            disabled={submitting} // 제출 중에는 비활성화
          >
            취소
          </Button>
          <Button
            type='submit'
            variant='primary'
            disabled={submitting || !title.trim() || !content.trim()}  // 필수 필드 검증
            isLoading={submitting}
          >
            {submitting ? '작성 중...' : '후기 작성'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
