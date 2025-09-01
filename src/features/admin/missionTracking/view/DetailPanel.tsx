import { useFeedback } from '@/features/shared/feedback/hooks/useFeedback';
import { useState, useEffect } from 'react';

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
  const { createFeedback, updateFeedback, feedbacks, loading } = useFeedback(selectedSubmission?.submissionId);

  useEffect(() => {
    if (feedbacks.length > 0) {
      setFeedbackComment(feedbacks[0].feedback_comment || '');
    } else {
      setFeedbackComment('');
    }
  }, [feedbacks]);

  const saveFeedback = async () => {
    if (!selectedSubmission) {
      console.error('선택된 제출물이 없습니다.');
      return;
    }

    if (feedbacks.length > 0) {
      // 수정
      await updateFeedback(feedbacks[0].id, {
        feedback_comment: feedbackComment,
      });
    } else {
      // 새로 생성
      await createFeedback({
        mission_submit_id: selectedSubmission.submissionId,
        feedback_comment: feedbackComment,
      });
    }
  };

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
              <textarea
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                placeholder='수강생에게 전달할 피드백을 입력하세요.'
                className='w-full p-3 border border-slate-300 rounded-lg resize-none'
                rows={4}
              />
              <button
                onClick={saveFeedback}
                disabled={loading}
                className='mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-500'
              >
                {loading ? '저장 중...' : '피드백 저장'}
              </button>
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
