import { useFeedback } from '@/features/shared/feedback/hooks/useFeedback';
import { useState, useEffect, useCallback } from 'react';

interface SelectedSubmission {
  studentName: string;
  week: number;
  missionTitle: string;
  content: string;
  submittedAt: string;
  studentId: string;
  submissionId: string;
}

interface SubmissionDetailPanelProps {
  selectedSubmission: SelectedSubmission | null;
}

export default function DetailPanel({ selectedSubmission }: SubmissionDetailPanelProps) {
  const [feedbackComment, setFeedbackComment] = useState('');
  const [currentAction, setCurrentAction] = useState<'idle' | 'saving' | 'updating' | 'deleting'>('idle');
  const [showSuccess, setShowSuccess] = useState(false);
  const { createFeedback, updateFeedback, deleteFeedback, feedbacks } = useFeedback(selectedSubmission?.submissionId);

  useEffect(() => {
    if (feedbacks.length > 0) {
      setFeedbackComment(feedbacks[0].feedback_comment || '');
    } else {
      setFeedbackComment('');
    }
  }, [feedbacks]);

  const saveFeedback = useCallback(async () => {
    if (!selectedSubmission) {
      console.error('선택된 제출물이 없습니다.');
      return;
    }

    try {
      setCurrentAction('saving');
      await createFeedback({
        mission_submit_id: selectedSubmission.submissionId,
        feedback_comment: feedbackComment,
      });
      
      // 성공 피드백 표시
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000); // 3초 후 사라짐
    } finally {
      setCurrentAction('idle');
    }
  }, [selectedSubmission, feedbackComment, createFeedback]);

  const updateExistingFeedback = useCallback(async () => {
    if (!selectedSubmission || feedbacks.length === 0) {
      console.error('수정할 피드백이 없습니다.');
      return;
    }

    try {
      setCurrentAction('updating');
      await updateFeedback(feedbacks[0].id, {
        feedback_comment: feedbackComment,
      });
      
      // 성공 피드백 표시
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000); // 3초 후 사라짐
    } finally {
      setCurrentAction('idle');
    }
  }, [selectedSubmission, feedbacks, feedbackComment, updateFeedback]);

  const handleDeleteFeedback = useCallback(async () => {
    if (feedbacks.length === 0) return;
    
    if (window.confirm('정말로 이 피드백을 삭제하시겠습니까?')) {
      try {
        setCurrentAction('deleting');
        await deleteFeedback(feedbacks[0].id);
        setFeedbackComment(''); // 삭제 후 입력창 비우기
      } finally {
        setCurrentAction('idle');
      }
    }
  }, [feedbacks, deleteFeedback]);

  return (
    <div className='w-96'>
      <div className='p-6 border-b border-slate-200'>
        <h3 className='text-lg font-semibold text-slate-900'>제출 내용 상세</h3>
      </div>

      <div className='p-6'>
        {selectedSubmission ? (
          <div className='space-y-6'>
            {/* 기본 정보 */}
            <div className='space-y-3'>
              <div>
                <label className='text-sm font-medium text-slate-700'>수강생</label>
                <p className='text-base text-slate-900'>{selectedSubmission.studentName}</p>
              </div>
              <div>
                <label className='text-sm font-medium text-slate-700'>미션</label>
                <p className='text-base text-slate-900'>
                  {selectedSubmission.week}주차 - {selectedSubmission.missionTitle}
                </p>
              </div>
              <div>
                <label className='text-sm font-medium text-slate-700'>제출일</label>
                <p className='text-base text-slate-900'>{selectedSubmission.submittedAt}</p>
              </div>
            </div>

            {/* 제출 내용 */}
            <div>
              <label className='text-sm font-medium text-slate-700 mb-2 block'>제출 내용</label>
              <div className='bg-slate-50 rounded-lg p-4 border max-h-96 overflow-y-auto'>
                <div className='text-slate-800 leading-relaxed break-words'>
                  {selectedSubmission.content.split('\n').map((line, index) => {
                    // URL 감지 및 링크로 변환
                    const urlRegex = /(https?:\/\/[^\s]+)/g;
                    const parts = line.split(urlRegex);

                    return (
                      <div key={index} className='mb-2'>
                        {parts.map((part, partIndex) => {
                          if (urlRegex.test(part)) {
                            return (
                              <a
                                key={partIndex}
                                href={part}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-blue-600 hover:text-blue-800 underline break-all block my-1'
                              >
                                {part}
                              </a>
                            );
                          }
                          return <span key={partIndex}>{part}</span>;
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 피드백 영역 (미래 기능) */}
            <div>
              <label className='text-sm font-medium text-slate-700 mb-2 block'>피드백</label>
              {showSuccess && (
                <div className='mb-3 p-3 bg-green-50 border border-green-200 rounded-lg'>
                  <div className='flex items-center text-green-800 text-sm'>
                    <span className='mr-2'>✅</span>
                    피드백이 성공적으로 저장되었습니다!
                  </div>
                </div>
              )}
              <textarea
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                placeholder='수강생에게 전달할 피드백을 입력하세요.'
                className='w-full p-3 border border-slate-300 rounded-lg resize-none'
                rows={4}
              />
              <div className='flex justify-end space-x-2 mt-3'>
                {feedbacks.length > 0 ? (
                  <>
                    <button
                      onClick={updateExistingFeedback}
                      disabled={currentAction !== 'idle'}
                      className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-500'
                    >
                      수정
                    </button>
                    <button
                      onClick={handleDeleteFeedback}
                      disabled={currentAction !== 'idle'}
                      className='px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:bg-slate-200 disabled:text-slate-500'
                    >
                      삭제
                    </button>
                  </>
                ) : (
                  <button
                    onClick={saveFeedback}
                    disabled={currentAction !== 'idle'}
                    className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-500'
                  >
                    저장
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className='text-center py-12 text-slate-500'>
            <div className='text-4xl mb-4'>👆</div>
            <p className='text-base mb-2'>제출 내용을 확인하려면</p>
            <p className='text-sm'>왼쪽 테이블의 ✅ 셀을 클릭하세요</p>
          </div>
        )}
      </div>
    </div>
  );
}
