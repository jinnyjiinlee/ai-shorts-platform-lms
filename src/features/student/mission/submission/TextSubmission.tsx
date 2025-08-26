'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  submitMission,
  getExistingSubmission,
  hasSubmitted,
} from '@/features/student/mission/submission/missionSubmitService';

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
  // 입력창에 입력 중인 값
  const [textContent, setTextContent] = useState('');
  // DB나 부모에서 받은 "이미 제출된 내용"
  const [existingContent, setExistingContent] = useState<string>(existingSubmissionContent || '');
  // 제출 여부 (내부 상태)
  const [isSubmittedState, setIsSubmittedState] = useState<boolean>(!!isSubmittedProp);
  // 편집 모드 여부
  const [isEditing, setIsEditing] = useState(false);

  // UI 제어용 상태
  const [loading, setLoading] = useState(true); // 초기화 중 로딩 상태
  const [isSubmitting, setIsSubmitting] = useState(false); // 제출 버튼 클릭 시 로딩 상태
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // 오류 메시지
  const [okMsg, setOkMsg] = useState<string | null>(null); // 성공 메시지

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
    async function init() {
      setLoading(true);
      setErrorMsg(null);
      setOkMsg(null);
      try {
        if (!missionId) throw new Error('미션 ID가 없습니다.');

        // DB에서 확인: 제출 여부 + 기존 제출 내용
        const [submitted, prev] = await Promise.all([
          isSubmittedProp === undefined ? hasSubmitted(missionId) : Promise.resolve(isSubmittedProp),
          getExistingSubmission(missionId),
        ]);

        if (!cancelled) {
          setIsSubmittedState(!!submitted);
          if (prev) setExistingContent(prev);
        }
      } catch (e: any) {
        if (!cancelled) {
          setErrorMsg(e?.message ?? '초기화 중 오류가 발생했습니다.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    init();
    return () => {
      cancelled = true; // cleanup
    };
  }, [missionId, isSubmittedProp]);

  // 마감일이 지났는지 계산
  const isOverdue = useMemo(() => {
    return dueDate ? new Date(dueDate) < new Date() : false;
  }, [dueDate]);

  // 재제출 가능 여부 = 이미 제출했지만 마감일은 지나지 않은 경우
  const canResubmit = useMemo(() => {
    return isSubmittedState && !isOverdue;
  }, [isSubmittedState, isOverdue]);

  // 편집 시작: 기존 제출 내용을 textarea에 불러오기
  const startEditing = () => {
    setTextContent(existingContent || '');
    setIsEditing(true);
    setOkMsg(null);
    setErrorMsg(null);
  };

  // 편집 취소: 입력값 리셋
  const cancelEditing = () => {
    setTextContent('');
    setIsEditing(false);
    setOkMsg(null);
    setErrorMsg(null);
  };

  // 제출/재제출 처리
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setOkMsg(null);
      setErrorMsg(null);

      if (!missionId) throw new Error('미션 ID가 없습니다.');
      const body = textContent.trim();
      if (!body) throw new Error('제출할 내용을 입력해주세요.');

      // ✅ 실제 제출 로직 (우리가 만든 service 호출)
      await submitMission({ missionId, content: body });

      // 제출 성공 후 상태 업데이트
      setExistingContent(body);
      setIsSubmittedState(true);
      setIsEditing(false);
      setTextContent('');

      setOkMsg(canResubmit ? '재제출(수정) 완료!' : '제출 완료!');
      onSubmissionComplete?.();
    } catch (e: any) {
      setErrorMsg(e?.message ?? '제출 중 알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1) 초기화 중 로딩
  if (loading) {
    return <div className='text-sm text-slate-500'>불러오는 중…</div>;
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
      {/* 마감일 지난 경우 경고 메시지 */}
      {isOverdue && !isSubmittedState && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-3 mb-4'>
          <div className='flex items-center text-red-800'>
            <span className='font-medium text-sm'>마감일이 지나 제출할 수 없습니다</span>
          </div>
        </div>
      )}
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
        <h4 className='font-medium text-slate-900 mb-3'>텍스트 제출 (링크 포함 가능)</h4>
        <textarea
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          className='w-full h-32 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none'
          placeholder='링크나 텍스트 내용을 입력하세요...'
        />
      </div>

      <div className='flex justify-end space-x-3 pt-4 border-t border-slate-200'>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !textContent.trim() || isOverdue}
          className={`px-6 py-2 text-white rounded-lg transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed ${
            canResubmit ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? '제출 중...' : isEditing ? '수정 내용 저장' : canResubmit ? '다시 제출하기' : '제출하기'}
        </button>
      </div>

      {/* 성공/에러 메시지 */}
      {okMsg && <p className='text-green-600 text-sm'>{okMsg}</p>}
      {errorMsg && <p className='text-red-600 text-sm'>{errorMsg}</p>}
    </div>
  );
}

///기존 코드
// 'use client';

// import { useState, useEffect } from 'react';

// interface TextSubmissionProps {
//   missionId?: string;
//   onSubmissionComplete?: () => void;
//   isSubmitted?: boolean;
//   dueDate?: string;
//   existingSubmissionContent?: string;
// }

// import { submitMission, getExistingSubmission } from './missionSubmitService';

// export default function TextSubmission({
//   missionId,
//   onSubmissionComplete,
//   isSubmitted = false,
//   dueDate,
//   existingSubmissionContent,
// }: TextSubmissionProps) {
//   const [textContent, setTextContent] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [existingContent, setExistingContent] = useState<string>(existingSubmissionContent || '');
//   const [isEditing, setIsEditing] = useState(false);

//   // props가 변경되면 existingContent 업데이트 (재제출 후 새로운 데이터 반영)
//   useEffect(() => {
//     if (existingSubmissionContent !== undefined) {
//       setExistingContent(existingSubmissionContent);
//     }
//   }, [existingSubmissionContent]);

//   const handleSubmission = async (retryCount = 0) => {
//     if (!missionId) {
//       alert('미션 ID가 없습니다.');
//       return;
//     }

//     if (!textContent.trim()) {
//       alert('제출할 내용을 입력해주세요.');
//       return;
//     }

//     const maxRetries = 3;

//     try {
//       setIsSubmitting(true);

//       await submitMission({
//         missionId,
//         content: textContent,
//       });

//       // 제출 완료 후 상태 업데이트
//       setExistingContent(textContent);
//       setIsEditing(false);
//       setTextContent('');

//       onSubmissionComplete?.();
//     } catch (error) {
//       console.error('제출 오류:', error);
//       const errorMessage = error instanceof Error ? error.message : '제출 중 알 수 없는 오류가 발생했습니다.';

//       // 네트워크 오류이고 재시도 횟수가 남아있으면 재시도
//       if (errorMessage.includes('네트워크') && retryCount < maxRetries) {
//         console.log(`재시도 ${retryCount + 1}/${maxRetries}...`);
//         setTimeout(() => {
//           handleSubmission(retryCount + 1);
//         }, 2000 * (retryCount + 1)); // 점진적 지연
//         return;
//       }

//       // 재시도 실패하거나 다른 오류인 경우
//       if (retryCount >= maxRetries) {
//         alert(`❌ ${maxRetries}번 시도했지만 실패했습니다. 잠시 후 다시 시도해주세요.\n\n오류: ${errorMessage}`);
//       } else {
//         alert(`❌ ${errorMessage}`);
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // 마감일 확인
//   const isOverdue = dueDate ? new Date(dueDate) < new Date() : false;
//   const canResubmit = isSubmitted && !isOverdue;

//   // 편집 모드 시작
//   const startEditing = () => {
//     setTextContent(existingSubmissionContent || existingContent);
//     setIsEditing(true);
//   };

//   // 편집 취소
//   const cancelEditing = () => {
//     setTextContent('');
//     setIsEditing(false);
//   };

//   // 제출된 내용을 보여주는 화면 (편집 모드가 아닐 때)
//   if (isSubmitted && !isEditing) {
//     if (isOverdue) {
//       return (
//         <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
//           <div className='flex items-center text-green-800'>
//             <svg className='w-5 h-5 mr-2' fill='currentColor' viewBox='0 0 20 20'>
//               <path
//                 fillRule='evenodd'
//                 d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
//                 clipRule='evenodd'
//               />
//             </svg>
//             <div>
//               <p className='font-medium'>제출 완료</p>
//               <p className='text-sm mt-1'>마감일이 지나 수정할 수 없습니다.</p>
//             </div>
//           </div>

//           {/* 제출된 내용 표시 */}
//           <div className='mt-4'>
//             <h4 className='font-medium text-green-900 mb-2'>제출한 내용:</h4>
//             <div className='bg-white border border-green-200 rounded-lg p-3 text-slate-700 whitespace-pre-line'>
//               {existingContent || '제출 내용이 없습니다.'}
//             </div>
//           </div>
//         </div>
//       );
//     }

//     // 마감일 전 - 제출된 내용 보기 + 수정 가능
//     return (
//       <div className='space-y-4'>
//         <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
//           <div className='flex items-center justify-between text-green-800 mb-3'>
//             <div className='flex items-center'>
//               <svg className='w-5 h-5 mr-2' fill='currentColor' viewBox='0 0 20 20'>
//                 <path
//                   fillRule='evenodd'
//                   d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
//                   clipRule='evenodd'
//                 />
//               </svg>
//               <p className='font-medium'>미션 제출 완료</p>
//             </div>
//             <span className='text-xs bg-green-100 px-2 py-1 rounded-full'>마감일까지 수정 가능</span>
//           </div>

//           {/* 제출된 내용 표시 */}
//           <div>
//             <h4 className='font-medium text-green-900 mb-2'>제출한 내용:</h4>
//             <div className='bg-white border border-green-200 rounded-lg p-3 text-slate-700 whitespace-pre-line max-h-40 overflow-y-auto'>
//               {existingContent || '제출 내용이 없습니다.'}
//             </div>
//           </div>

//           {/* 수정 버튼 */}
//           <div className='flex justify-end mt-3'>
//             <button
//               onClick={startEditing}
//               className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
//             >
//               내용 수정하기
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // 편집 모드이거나 처음 제출하는 경우
//   return (
//     <div className='space-y-4'>
//       {/* 편집 모드 헤더 */}
//       {isEditing && (
//         <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
//           <div className='flex items-center justify-between text-blue-800'>
//             <div className='flex items-center'>
//               <svg className='w-5 h-5 mr-2' fill='currentColor' viewBox='0 0 20 20'>
//                 <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
//               </svg>
//               <p className='font-medium text-sm'>내용 수정 중</p>
//             </div>
//             <button
//               onClick={cancelEditing}
//               className='text-xs bg-blue-100 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors'
//             >
//               취소
//             </button>
//           </div>
//         </div>
//       )}

//       {/* 재제출 안내 (편집 모드가 아닐 때만) */}
//       {!isEditing && isSubmitted && canResubmit && (
//         <div className='bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4'>
//           <div className='flex items-center text-blue-800'>
//             <svg className='w-5 h-5 mr-2' fill='currentColor' viewBox='0 0 20 20'>
//               <path
//                 fillRule='evenodd'
//                 d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
//                 clipRule='evenodd'
//               />
//             </svg>
//             <div>
//               <p className='font-medium text-sm'>이미 제출된 미션입니다</p>
//               <p className='text-xs mt-1'>마감일({dueDate})까지 다시 제출할 수 있습니다.</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 텍스트 입력 영역 */}
//       <div>
//         <h4 className='font-medium text-slate-900 mb-3'>텍스트 제출 (링크 포함 가능)</h4>
//         <textarea
//           value={textContent}
//           onChange={(e) => setTextContent(e.target.value)}
//           className='w-full h-32 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none'
//           placeholder='링크나 텍스트 내용을 입력하세요...&#10;예: https://youtube.com/watch?v=...'
//         />
//         <p className='text-sm text-slate-500 mt-2'>
//           유튜브 링크, 구글 드라이브 링크, 또는 텍스트 설명을 입력할 수 있습니다.
//         </p>
//       </div>

//       {/* 제출 버튼 */}
//       <div className='flex justify-end space-x-3 pt-4 border-t border-slate-200'>
//         <button
//           onClick={() => handleSubmission()}
//           disabled={isSubmitting || !textContent.trim()}
//           className={`px-6 py-2 text-white rounded-lg transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed ${
//             canResubmit ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'
//           }`}
//         >
//           {isSubmitting ? '제출 중...' : isEditing ? '수정 내용 저장' : canResubmit ? '다시 제출하기' : '제출하기'}
//         </button>
//       </div>
//     </div>
//   );
// }
