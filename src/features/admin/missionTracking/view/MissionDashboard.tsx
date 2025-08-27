'use client';

import { useState } from 'react';
import DashboardHeader from './DashboardHeader';
import StatsCards from './StatsCards';
import StudentTable from './StudentTable';
import DetailPanel from './DetailPanel';
import { useMissionData } from '../controller/useMissionData';
import { calculateOverallStats } from '../model/mission.calculator';

export default function MissionDashboard() {
  const [selectedCohort, setSelectedCohort] = useState<number>(1);
  const [selectedSubmission, setSelectedSubmission] = useState<{
    studentName: string;
    week: number;
    missionTitle: string;
    content: string;
    submittedAt: string;
    studentId: string;
  } | null>(null);

  const { weeklyData, availableCohorts, isLoading, error, allStudents, studentSubmissions } =
    useMissionData(selectedCohort);

  // 전체 제출률 계산 (model 함수 사용)
  const { totalSubmissions, totalExpected, overallRate } = calculateOverallStats(weeklyData);

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='bg-white rounded-xl border border-slate-200 p-8 text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-slate-600'>미션 달성 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='space-y-6'>
        <div className='bg-red-50 border border-red-200 rounded-xl p-6'>
          <div className='flex items-start space-x-3'>
            <div className='text-red-600'>
              <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <div>
              <h3 className='text-red-800 font-medium'>오류 발생</h3>
              <p className='text-red-600 text-sm mt-1'>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <DashboardHeader
        selectedCohort={selectedCohort}
        availableCohorts={availableCohorts}
        onCohortChange={setSelectedCohort}
      />

      <StatsCards overallRate={overallRate} totalSubmissions={totalSubmissions} totalMissions={weeklyData.length} />

      <div className='bg-white rounded-2xl border border-slate-200 shadow-sm'>
        <div className='flex min-h-[600px]'>
          <div className='flex-1 border-r border-slate-200'>
            <div className='p-6 border-b border-slate-200'>
              <h2 className='text-xl font-semibold text-slate-900'>{selectedCohort}기 전체 제출 현황</h2>
              <p className='text-sm text-slate-600 mt-1'>셀을 클릭하면 제출 내용을 확인할 수 있습니다</p>
            </div>

            <div className='p-6 overflow-auto h-full'>
              <StudentTable
                selectedCohort={selectedCohort}
                weeklyData={weeklyData}
                allStudents={allStudents}
                studentSubmissions={studentSubmissions}
                onSubmissionClick={setSelectedSubmission}
              />
            </div>
          </div>

          <DetailPanel selectedSubmission={selectedSubmission} />
        </div>
      </div>
    </div>
  );
}
