import { Mission, MissionSubmission } from '@/types/domains/mission';
import { Badge } from '@/features/shared/ui/Badge';

interface SubmissionListTabProps {
  mission: Mission;
  onGradeSubmission?: (submission: MissionSubmission) => void;
}

export default function SubmissionListTab({ mission, onGradeSubmission }: SubmissionListTabProps) {
  console.log('SubmissionListTab - 미션 제출 데이터:', mission.submissions);

  if (!mission.submissions || mission.submissions.length === 0) {
    return (
      <div className='text-center py-12 text-slate-500'>
        <div className='w-16 h-16 mx-auto mb-4 opacity-50'>📋</div>
        <p className='text-lg mb-2'>아직 제출된 과제가 없습니다.</p>
        <p className='text-sm'>수강생들이 과제를 제출하면 여기에 표시됩니다.</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {mission.submissions.map((submission) => (
        <div key={submission.id} className='border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors'>
          <div className='flex items-center justify-between'>
            <div className='flex-1'>
              <div className='flex items-center space-x-3 mb-3'>
                <h4 className='font-medium text-slate-900'>{submission.studentName}</h4>
                <Badge variant='info' size='sm'>제출완료</Badge>
                {submission.grade && (
                  <Badge variant='success' size='sm'>
                    {submission.grade}점
                  </Badge>
                )}
              </div>

              <div className='space-y-3 text-sm text-slate-600 mb-3'>
                <div>
                  <span className='font-medium text-slate-700'>제출일:</span>
                  <p className='mt-1'>{submission.submitted_at}</p>
                </div>
                <div>
                  <span className='font-medium text-slate-700'>제출 내용:</span>
                  <div className='mt-2 p-3 bg-slate-50 rounded-lg border'>
                    <p className='whitespace-pre-wrap break-words leading-relaxed text-slate-700'>
                      {submission.content || '내용 없음'}
                    </p>
                  </div>
                </div>
              </div>

              {submission.feedback && (
                <div className='mt-3 p-3 bg-slate-50 rounded-lg'>
                  <p className='text-sm'>
                    <span className='font-medium text-slate-700'>피드백:</span> {submission.feedback}
                  </p>
                </div>
              )}
            </div>

            {onGradeSubmission && (
              <div className='flex space-x-2 ml-4'>
                <button
                  onClick={() => onGradeSubmission(submission)}
                  className='px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium'
                >
                  {submission.grade ? '재채점' : '채점하기'}
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
