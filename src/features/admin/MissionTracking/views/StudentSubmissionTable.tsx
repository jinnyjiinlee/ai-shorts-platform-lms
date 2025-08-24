import { WeeklyData, StudentSubmissionDetail } from '../models/types';
import { calculateStudentStats, getStudentSubmissionForWeek } from '../models/trackingCalculations';

interface StudentSubmissionTableProps {
  selectedCohort: number;
  weeklyData: WeeklyData[];
  allStudents: StudentSubmissionDetail[];
  studentSubmissions: Map<
    string,
    Map<
      string,
      {
        submitted: boolean;
        content?: string;
        submittedAt?: string;
      }
    >
  >;
  onSubmissionClick: (submission: {
    studentName: string;
    week: number;
    missionTitle: string;
    content: string;
    submittedAt: string;
    studentId: string;
  }) => void;
}

export default function StudentSubmissionTable({
  selectedCohort,
  weeklyData,
  allStudents,
  studentSubmissions,
  onSubmissionClick,
}: StudentSubmissionTableProps) {
  if (weeklyData.length === 0) {
    return (
      <div className='text-center py-12 text-slate-500'>
        <div className='text-6xl mb-4'>📋</div>
        <p className='text-lg mb-2'>{selectedCohort}기에 등록된 미션이 없습니다.</p>
        <p className='text-sm'>관리자가 미션을 등록하면 여기에 표시됩니다.</p>
      </div>
    );
  }

  return (
    <div className='min-w-max'>
      {/* 테이블 헤더 */}
      <div className='sticky top-0 bg-white border-b border-slate-200 pb-2 mb-4'>
        <div className='grid grid-cols-[200px_120px_1fr] gap-6'>
          <div className='font-semibold text-slate-900 text-sm p-2'>수강생명</div>
          <div className='font-semibold text-slate-900 text-sm p-2 text-center'>제출률</div>
          <div className='font-semibold text-slate-900 text-xs p-2 text-center'>주차별 상세</div>
        </div>
      </div>

      {/* 학생별 제출 현황 */}
      <div className='space-y-2'>
        {allStudents.map((student) => {
          // 계산 로직을 model 함수로 대체
          const { submittedCount, submissionRate } = calculateStudentStats(
            student, 
            weeklyData, 
            studentSubmissions
          );

          return (
            <div
              key={student.studentId}
              className='grid grid-cols-[200px_120px_1fr] gap-6 hover:bg-slate-50 rounded-lg p-3 border border-transparent hover:border-slate-200'
            >
              {/* 수강생명 */}
              <div className='font-medium text-slate-900 text-sm flex items-center'>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-medium mr-3">
                  {student.studentName[0]}
                </div>
                {student.studentName}
              </div>
              
              {/* 제출률 */}
              <div className='flex items-center justify-center'>
                <div className='flex items-center space-x-2'>
                  <div className={`text-xl font-bold ${
                    submissionRate >= 80 ? 'text-green-600' : 
                    submissionRate >= 60 ? 'text-yellow-600' : 
                    'text-red-600'
                  }`}>
                    {submissionRate}%
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    submissionRate >= 80 ? 'bg-green-500' : 
                    submissionRate >= 60 ? 'bg-yellow-500' : 
                    'bg-red-500'
                  }`}></div>
                </div>
              </div>
              
              {/* 주차별 상세 */}
              <div className='flex items-center space-x-1 overflow-x-auto'>
                {weeklyData.map((week) => {
                // 제출 정보를 model 함수로 가져오기
                const { hasSubmission, content, submittedAt } = getStudentSubmissionForWeek(
                  student.studentId,
                  week.missionId,
                  studentSubmissions
                );

                return (
                  <div key={week.missionId} className='flex flex-col items-center'>
                    <button
                      onClick={() =>
                        hasSubmission &&
                        onSubmissionClick({
                          studentName: student.studentName,
                          week: week.week,
                          missionTitle: week.missionTitle,
                          content: content,
                          submittedAt: submittedAt,
                          studentId: student.studentId,
                        })
                      }
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                        hasSubmission
                          ? 'bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer hover:scale-105'
                          : 'bg-red-100 text-red-800'
                      }`}
                      disabled={!hasSubmission}
                      title={`${week.week}주차 - ${hasSubmission ? '제출완료' : '미제출'}`}
                    >
                      {week.week}
                    </button>
                    <div className={`text-xs mt-1 ${hasSubmission ? 'text-green-600' : 'text-red-600'}`}>
                      {hasSubmission ? '✓' : '✗'}
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
