interface SelectedSubmission {
  studentName: string;
  week: number;
  missionTitle: string;
  content: string;
  submittedAt: string;
  studentId: string;
}

interface SubmissionDetailPanelProps {
  selectedSubmission: SelectedSubmission | null;
}

export default function DetailPanel({ selectedSubmission }: SubmissionDetailPanelProps) {
  return (
    <div className="w-96">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">제출 내용 상세</h3>
      </div>
      
      <div className="p-6">
        {selectedSubmission ? (
          <div className="space-y-6">
            {/* 기본 정보 */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-700">수강생</label>
                <p className="text-base text-slate-900">{selectedSubmission.studentName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">미션</label>
                <p className="text-base text-slate-900">{selectedSubmission.week}주차 - {selectedSubmission.missionTitle}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">제출일</label>
                <p className="text-base text-slate-900">{selectedSubmission.submittedAt}</p>
              </div>
            </div>

            {/* 제출 내용 */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">제출 내용</label>
              <div className="bg-slate-50 rounded-lg p-4 border">
                <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {selectedSubmission.content}
                </p>
              </div>
            </div>

            {/* 피드백 영역 (미래 기능) */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">피드백</label>
              <textarea
                placeholder="피드백 기능은 곧 추가될 예정입니다..."
                className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 resize-none"
                rows={4}
                disabled
              />
              <button
                disabled
                className="mt-3 w-full px-4 py-2 bg-slate-200 text-slate-500 rounded-lg cursor-not-allowed"
              >
                피드백 저장 (준비 중)
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            <div className="text-4xl mb-4">👆</div>
            <p className="text-base mb-2">제출 내용을 확인하려면</p>
            <p className="text-sm">왼쪽 테이블의 ✅ 셀을 클릭하세요</p>
          </div>
        )}
      </div>
    </div>
  );
}