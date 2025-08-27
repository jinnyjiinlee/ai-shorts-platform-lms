import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { WeeklyData, StudentSubmissionDetail } from '../model/mission.types';
import { calculateStudentStats, getStudentSubmissionForWeek } from '../model/mission.calculator';

type FilterType = 'all' | 'not_started' | 'in_progress' | 'completed';

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

export default function StudentTable({
  selectedCohort,
  weeklyData,
  allStudents,
  studentSubmissions,
  onSubmissionClick,
}: StudentSubmissionTableProps) {
  // 페이지네이션과 필터링 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const studentsPerPage = 15;

  // 제출 상태 분류 함수
  const getSubmissionStatus = (submissionRate: number): FilterType => {
    if (submissionRate === 0) return 'not_started';
    if (submissionRate === 100) return 'completed';
    return 'in_progress';
  };

  // 학생 데이터와 통계 계산
  const studentsWithStats = allStudents.map(student => {
    const { submittedCount, submissionRate } = calculateStudentStats(student, weeklyData, studentSubmissions);
    return {
      ...student,
      submittedCount,
      submissionRate,
      status: getSubmissionStatus(submissionRate)
    };
  });

  // 필터링 및 검색
  const filteredStudents = studentsWithStats.filter(student => {
    const matchesFilter = filterType === 'all' || student.status === filterType;
    const matchesSearch = student.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // 페이지네이션
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, startIndex + studentsPerPage);

  // 필터별 카운트
  const filterCounts = {
    all: studentsWithStats.length,
    not_started: studentsWithStats.filter(s => s.status === 'not_started').length,
    in_progress: studentsWithStats.filter(s => s.status === 'in_progress').length,
    completed: studentsWithStats.filter(s => s.status === 'completed').length,
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 필터 변경 핸들러
  const handleFilterChange = (newFilter: FilterType) => {
    setFilterType(newFilter);
    setCurrentPage(1);
  };

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
    <div className='space-y-4'>
      {/* 검색 및 필터링 */}
      <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
        {/* 검색창 */}
        <div className='relative flex-1 max-w-md'>
          <MagnifyingGlassIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4' />
          <input
            type='text'
            placeholder='수강생 이름 검색...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>

        {/* 필터 버튼 */}
        <div className='flex gap-2 flex-wrap'>
          {[
            { key: 'all' as FilterType, label: '전체', color: 'bg-slate-100 text-slate-700' },
            { key: 'not_started' as FilterType, label: '미제출', color: 'bg-red-100 text-red-700' },
            { key: 'in_progress' as FilterType, label: '제출중', color: 'bg-orange-100 text-orange-700' },
            { key: 'completed' as FilterType, label: '제출완료', color: 'bg-green-100 text-green-700' }
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => handleFilterChange(filter.key)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                filterType === filter.key
                  ? 'ring-2 ring-blue-500 ' + filter.color
                  : filter.color + ' hover:opacity-80'
              }`}
            >
              {filter.label} ({filterCounts[filter.key]})
            </button>
          ))}
        </div>
      </div>

      {/* 현재 페이지 정보 */}
      <div className='text-sm text-slate-600 mb-2'>
        총 {filteredStudents.length}명 중 {startIndex + 1}-{Math.min(startIndex + studentsPerPage, filteredStudents.length)}명 표시
      </div>

      {/* 테이블 컨테이너 */}
      <div className='relative'>
        {/* 고정된 테이블 헤더 */}
        <div className='bg-slate-50 border-b-2 border-slate-200'>
          <div className='grid grid-cols-[200px_120px_1fr] gap-6 px-2 py-3'>
            <div className='font-semibold text-slate-900 text-sm p-2'>수강생명</div>
            <div className='font-semibold text-slate-900 text-sm p-2 text-center'>제출률</div>
            <div className='font-semibold text-slate-900 text-xs p-2 text-center'>주차별 상세</div>
          </div>
        </div>

        {/* 스크롤 가능한 데이터 영역 */}
        <div className='max-h-[600px] overflow-y-auto'>
          <div className='divide-y divide-slate-200'>
        {currentStudents.map((student) => {
          return (
            <div
              key={student.studentId}
              className='grid grid-cols-[200px_120px_1fr] gap-6 hover:bg-slate-50 px-2 py-3'
            >
              {/* 수강생명 */}
              <div className='font-medium text-slate-900 text-sm flex items-center p-2'>
                <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-medium mr-3'>
                  {student.studentName[0]}
                </div>
                {student.studentName}
              </div>

              {/* 제출률 */}
              <div className='flex items-center justify-center p-2'>
                <div className='flex items-center space-x-2'>
                  <div
                    className={`text-xl font-bold ${
                      student.submissionRate >= 80
                        ? 'text-green-600'
                        : student.submissionRate >= 60
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {student.submissionRate}%
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      student.submissionRate >= 80 ? 'bg-green-500' : student.submissionRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  ></div>
                </div>
              </div>

              {/* 주차별 상세 */}
              <div className='flex items-center space-x-1 overflow-x-auto p-2'>
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
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className='mt-6 flex items-center justify-between border-t border-slate-200 pt-4'>
          <div className='text-sm text-slate-600'>
            페이지 {currentPage} / {totalPages}
          </div>
          
          <div className='flex items-center space-x-2'>
            {/* 이전 버튼 */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className='px-3 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white'
            >
              이전
            </button>
            
            {/* 페이지 번호 */}
            <div className='flex space-x-1'>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 text-sm border rounded-lg ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            {/* 다음 버튼 */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className='px-3 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white'
            >
              다음
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
