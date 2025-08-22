import { WeeklyData, StudentSubmissionDetail } from '../../../../lib/services/tracking/trackingService';

interface StudentSubmissionTableProps {
  selectedCohort: number;
  weeklyData: WeeklyData[];
  allStudents: StudentSubmissionDetail[];
  studentSubmissions: Map<string, Map<string, any>>;
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
  onSubmissionClick
}: StudentSubmissionTableProps) {
  if (weeklyData.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <div className="text-6xl mb-4">📋</div>
        <p className="text-lg mb-2">{selectedCohort}기에 등록된 미션이 없습니다.</p>
        <p className="text-sm">관리자가 미션을 등록하면 여기에 표시됩니다.</p>
      </div>
    );
  }

  return (
    <div className="min-w-max">
      {/* 테이블 헤더 */}
      <div className="sticky top-0 bg-white border-b border-slate-200 pb-2 mb-4">
        <div className="grid grid-cols-[200px_repeat(auto-fit,_100px)_100px] gap-2">
          <div className="font-semibold text-slate-900 text-sm p-2">수강생명</div>
          {weeklyData.map((week) => (
            <div key={week.week} className="font-semibold text-slate-900 text-xs p-2 text-center">
              {week.week}주차
            </div>
          ))}
          <div className="font-semibold text-slate-900 text-sm p-2 text-center">제출률</div>
        </div>
      </div>
      
      {/* 학생별 제출 현황 */}
      <div className="space-y-2">
        {allStudents.map((student) => {
          let submittedCount = 0;
          weeklyData.forEach((week) => {
            const missionSubmissions = studentSubmissions.get(week.missionId);
            const submission = missionSubmissions?.get(student.studentId);
            if (submission?.submitted) {
              submittedCount++;
            }
          });
          
          const submissionRate = weeklyData.length > 0 
            ? Math.round((submittedCount / weeklyData.length) * 100) 
            : 0;
          
          return (
            <div key={student.studentId} className="grid grid-cols-[200px_repeat(auto-fit,_100px)_100px] gap-2 hover:bg-slate-50 rounded-lg p-2">
              <div className="font-medium text-slate-900 text-sm">{student.studentName}</div>
              {weeklyData.map((week) => {
                const missionSubmissions = studentSubmissions.get(week.missionId);
                const submission = missionSubmissions?.get(student.studentId);
                const hasSubmission = submission?.submitted || false;
                
                return (
                  <div key={week.week} className="text-center">
                    <button
                      onClick={() => hasSubmission && onSubmissionClick({
                        studentName: student.studentName,
                        week: week.week,
                        missionTitle: week.missionTitle,
                        content: submission?.content || '제출 내용이 없습니다.',
                        submittedAt: submission?.submittedAt || '제출일 정보 없음',
                        studentId: student.studentId
                      })}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        hasSubmission 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer' 
                          : 'bg-red-100 text-red-800'
                      }`}
                      disabled={!hasSubmission}
                    >
                      {hasSubmission ? '✅' : '❌'}
                    </button>
                  </div>
                );
              })}
              <div className={`text-center text-sm font-medium ${
                submissionRate >= 80 ? 'text-green-600' :
                submissionRate >= 60 ? 'text-blue-600' :
                'text-red-600'
              }`}>
                {submissionRate}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}