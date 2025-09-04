'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  submitMission,
  getExistingSubmission,
  hasSubmitted,
} from '@/features/student/mission/submission/missionSubmitService';
import { useFormState } from '@/features/shared/hooks/useFormState';
import { useAsyncSubmit } from '@/features/shared/hooks/useAsyncSubmit';

interface TextSubmissionProps {
  missionId?: string; // 어떤 미션에 대한 제출인지 (uuid)
  onSubmissionComplete?: () => void; // 제출/재제출 완료 후 부모에게 알림
  isSubmitted?: boolean; // (옵션) 이미 제출 여부를 부모에서 내려줄 수 있음
  dueDate?: string; // 마감일 (ISO 날짜 문자열)
  existingSubmissionContent?: string; // (옵션) 기존 제출 내용 (부모에서 내려주는 경우)
}

export default function TextSubmission({
  missionId,
  onSubmissionComplete,
  isSubmitted: isSubmittedProp,
  dueDate,
  existingSubmissionContent,
}: TextSubmissionProps) {
  // 기본 상태들
  const [existingContent, setExistingContent] = useState<string>(existingSubmissionContent || '');
  const [isSubmittedState, setIsSubmittedState] = useState<boolean>(!!isSubmittedProp);
  const [loading, setLoading] = useState(true); // 초기값을 true로 설정
  const [initialLoading, setInitialLoading] = useState(true); // 초기 로딩 상태 추가
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  // 폼 상태 관리
  const { form, updateForm, resetForm, isEditing, startEdit, cancelEdit } = useFormState({
    textContent: '',
  });

  // 외부 props가 바뀌면 내부 상태도 갱신
  useEffect(() => {
    if (existingSubmissionContent !== undefined) {
      setExistingContent(existingSubmissionContent);
    }
    if (isSubmittedProp !== undefined) {
      setIsSubmittedState(!!isSubmittedProp);
    }
  }, [existingSubmissionContent, isSubmittedProp]);

  // 초기 로드: missionId가 있으면 DB에서 제출 여부와 내용 조회
  useEffect(() => {
    let cancelled = false;
    
    // props로 이미 필요한 데이터가 전달된 경우 로딩 스킵
    if (isSubmittedProp !== undefined && existingSubmissionContent !== undefined) {
      setInitialLoading(false);
      setLoading(false);
      return;
    }
    
    async function init() {
      setLoading(true);
      setErrorMsg(null);
      setOkMsg(null);
      try {
        if (!missionId) throw new Error('미션 ID가 없습니다.');

        // DB에서 확인: 제출 여부 + 기존 제출 내용
        const submitted = isSubmittedProp !== undefined ? isSubmittedProp : await hasSubmitted(missionId);
        const prev = await getExistingSubmission(missionId);

        if (!cancelled) {
          setIsSubmittedState(!!submitted);
          if (prev) setExistingContent(prev);
        }
      } catch (e: any) {
        if (!cancelled) {
          setErrorMsg(e?.message ?? '초기화 중 오류가 발생했습니다.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setInitialLoading(false);
        }
      }
    }
    init();
    return () => {
      cancelled = true; // cleanup
    };
  }, [missionId, isSubmittedProp, existingSubmissionContent]);

  // 마감일이 지났는지 실시간 체크 (5초마다 업데이트)
  const [isOverdue, setIsOverdue] = useState(dueDate ? new Date(dueDate) < new Date() : false);
  
  useEffect(() => {
    const checkDeadline = () => {
      const now = new Date();
      const deadlineTime = dueDate ? new Date(dueDate) : null;
      const newOverdue = deadlineTime ? deadlineTime < now : false;
      
      console.log('🕐 마감일 체크:', {
        dueDate,
        deadlineTime: deadlineTime?.toISOString(),
        now: now.toISOString(),
        isOverdue: newOverdue,
        timeDiff: deadlineTime ? now.getTime() - deadlineTime.getTime() : 0
      });
      
      setIsOverdue(newOverdue);
    };
    
    // 즉시 한 번 체크
    checkDeadline();
    
    const timer = setInterval(checkDeadline, 5000); // 5초마다 체크
    console.log('⏰ 마감일 타이머 시작');
    
    return () => {
      console.log('⏰ 마감일 타이머 종료');
      clearInterval(timer);
    };
  }, [dueDate]);

  // 재제출 가능 여부 = 이미 제출했지만 마감일은 지나지 않은 경우
  const canResubmit = useMemo(() => {
    return isSubmittedState && !isOverdue;
  }, [isSubmittedState, isOverdue]);

  // 제출 로직
  const { submitting: isSubmitting, submit: handleSubmit } = useAsyncSubmit(async () => {
    if (!missionId) throw new Error('미션 ID가 없습니다.');
    
    // 제출 시점에 실시간 마감일 체크 (이중 검증)
    const realTimeOverdue = dueDate ? new Date(dueDate) < new Date() : false;
    if (realTimeOverdue) {
      throw new Error('마감일이 지나 제출할 수 없습니다.');
    }
    
    const body = form.textContent.trim();
    if (!body) throw new Error('제출할 내용을 입력해주세요.');

    setOkMsg(null);
    setErrorMsg(null);

    // 실제 제출 로직
    await submitMission({ missionId, content: body });

    // 제출 성공 후 상태 업데이트
    setExistingContent(body);
    setIsSubmittedState(true);
    cancelEdit();
    
    setOkMsg(canResubmit ? '재제출(수정) 완료!' : '제출 완료!');
    onSubmissionComplete?.();
  }, {
    onError: (e) => {
      setErrorMsg(e?.message ?? '제출 중 알 수 없는 오류가 발생했습니다.');
    }
  });

  // 편집 시작: 기존 제출 내용을 폼에 불러오기
  const startEditing = () => {
    updateForm({ textContent: existingContent || '' });
    startEdit({ textContent: existingContent || '' });
    setOkMsg(null);
    setErrorMsg(null);
  };

  // 편집 취소: 입력값 리셋
  const cancelEditing = () => {
    cancelEdit();
    setOkMsg(null);
    setErrorMsg(null);
  };

  // 1) 초기화 중 로딩 - 스켈레톤 UI로 개선
  if (initialLoading) {
    return (
      <div className='space-y-4'>
        <div className='bg-slate-50 border border-slate-200 rounded-lg p-4'>
          <div className='animate-pulse space-y-3'>
            <div className='flex items-center space-x-2'>
              <div className='w-4 h-4 bg-slate-200 rounded'></div>
              <div className='h-4 bg-slate-200 rounded w-24'></div>
            </div>
            <div className='space-y-2'>
              <div className='h-3 bg-slate-200 rounded w-1/3'></div>
              <div className='h-20 bg-slate-200 rounded w-full'></div>
            </div>
            <div className='h-8 bg-slate-200 rounded w-20'></div>
          </div>
        </div>
      </div>
    );
  }

  // 2) 이미 제출했지만 편집 모드가 아닐 때 → 제출 내용 보여주기
  if (isSubmittedState && !isEditing) {
    return (
      <div className='space-y-4'>
        <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
          <div className='flex items-center justify-between text-green-800 mb-3'>
            <div className='flex items-center'>
              {/* 체크 아이콘 */}
              <svg className='w-5 h-5 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
              <p className='font-medium'>미션 제출 완료</p>
            </div>
            {!isOverdue && <span className='text-xs bg-green-100 px-2 py-1 rounded-full'>마감일까지 수정 가능</span>}
          </div>

          {/* 제출된 내용 표시 */}
          <div>
            <h4 className='font-medium text-green-900 mb-2'>제출한 내용:</h4>
            <div className='bg-white border border-green-200 rounded-lg p-3 text-slate-700 whitespace-pre-line max-h-40 overflow-y-auto'>
              {existingContent || '제출 내용이 없습니다.'}
            </div>
          </div>

          {/* 마감일 전이면 수정 버튼 노출 */}
          {!isOverdue && (
            <div className='flex justify-end mt-3'>
              <button
                onClick={startEditing}
                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
              >
                내용 수정하기
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3) 처음 제출하거나 (아직 제출 X), 편집 모드일 때 → textarea + 제출 버튼
  return (
    <div className='space-y-4'>
      {isEditing && (
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
          <div className='flex items-center justify-between text-blue-800'>
            <p className='font-medium text-sm'>내용 수정 중</p>
            <button
              onClick={cancelEditing}
              className='text-xs bg-blue-100 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors'
            >
              취소
            </button>
          </div>
        </div>
      )}

      <div>
        <h4 className={`font-medium mb-3 ${isOverdue ? 'text-red-700' : 'text-slate-900'}`}>
          {isOverdue ? '제출 마감됨' : '텍스트 제출 (링크 포함 가능)'}
        </h4>
        <textarea
          value={form.textContent}
          onChange={(e) => updateForm({ textContent: e.target.value })}
          disabled={isOverdue}
          className={`w-full h-32 px-4 py-3 border rounded-lg transition-all resize-none ${
            isOverdue
              ? 'border-red-300 bg-red-50 text-red-400 cursor-not-allowed placeholder-red-400'
              : 'border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          }`}
          placeholder={isOverdue ? '마감일이 지나 제출할 수 없습니다' : '링크나 텍스트 내용을 입력하세요...'}
        />
      </div>

      <div className='flex justify-end space-x-3 pt-4 border-t border-slate-200'>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !form.textContent.trim() || isOverdue}
          className={`px-6 py-2 text-white rounded-lg transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed ${
            canResubmit ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isOverdue ? '제출 마감됨' : isSubmitting ? '제출 중...' : isEditing ? '수정 내용 저장' : canResubmit ? '다시 제출하기' : '제출하기'}
        </button>
      </div>

      {/* 성공/에러 메시지 */}
      {okMsg && <p className='text-green-600 text-sm'>{okMsg}</p>}
      {errorMsg && <p className='text-red-600 text-sm'>{errorMsg}</p>}
    </div>
  );
}
