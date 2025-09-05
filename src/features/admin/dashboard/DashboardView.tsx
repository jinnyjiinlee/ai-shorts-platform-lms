'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from './DashboardHeader';
import StatCard from './StatCard';
import WeeklySubmissionChart from './WeeklySubmissionChart';
import {
  TrophyIcon,
  CheckCircleIcon,
  ChartBarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import {
  fetchDashboardStats,
  fetchCohortData,
  DashboardStats,
  CohortDashboardData,
  getApprovedStudents,
  getPendingStudents,
  getMissionsWithSubmissions,
  calculateDashboardStats,
  calculateCohortData,
} from '@/features/admin/dashboard/adminDashboardService';
import { CohortData } from './types';
import { useMemo } from 'react';

// CohortDashboardData를 CohortData로 변환하는 어댑터 함수
const convertToCohortData = (dashboardData: CohortDashboardData): CohortData => {
  return {
    ...dashboardData,
    name: `${dashboardData.cohort}기`,
    completedMissions: Math.floor(dashboardData.totalMissions * (dashboardData.submissionRate / 100)),
    color:
      parseInt(dashboardData.cohort) % 3 === 0 ? 'blue' : parseInt(dashboardData.cohort) % 2 === 0 ? 'green' : 'purple',
    statusColor:
      dashboardData.status === 'active'
        ? 'bg-green-100 text-green-800'
        : dashboardData.status === 'completed'
        ? 'bg-gray-100 text-gray-800'
        : 'bg-yellow-100 text-yellow-800',
    weeklySubmissions: dashboardData.weeklySubmissions.map((w) => ({
      week: w.week,
      submissions: w.submitted,
      totalStudents: w.total,
      rate: w.rate,
      perfectStudents: w.perfectStudents,
    })),
  };
};

export default function DashboardView() {
  const router = useRouter();
  const [activeCohorts, setActiveCohorts] = useState<string[]>(['1']); // 진행 중인 기수
  const [selectedCohort, setSelectedCohort] = useState<string | null>('1'); // 선택된 기수 (상세 보기용)
  const [weeklyViewMode, setWeeklyViewMode] = useState<'compact' | 'detailed'>('compact'); // 주차별 보기 모드

  // 데이터 상태
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [cohortData, setCohortData] = useState<CohortDashboardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigateToUserManagement = (status: string, tab: 'students' | 'admins' = 'students') => {
    router.push(`/admin/studentManagement?status=${status}&tab=${tab}`);
  };

  // 데이터 불러오기
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 성능 측정 시작
        const startTime = performance.now();
        console.log('🚀 대시보드 로딩 시작...');

        const [students, pendingStudents, missions] = await Promise.all([
          getApprovedStudents(),
          getPendingStudents(),
          getMissionsWithSubmissions(),
        ]);

        const stats = calculateDashboardStats(students, pendingStudents, [], []);
        const cohorts = calculateCohortData(students, missions);

        // 성능 측정 완료
        const endTime = performance.now();
        const loadTime = Math.round(endTime - startTime);
        console.log(`✅ 대시보드 로딩 완료: ${loadTime}ms (${(loadTime / 1000).toFixed(2)}초)`);

        // 상세 통계
        console.log(
          `📊 통계: 학생 ${stats.totalActiveStudents}명, 미션 ${stats.totalActiveMissions}개, 기수 ${cohorts.length}개`
        );

        setDashboardStats(stats);
        setCohortData(cohorts);

        // 첫 번째 기수를 기본 선택으로 설정
        if (cohorts.length > 0) {
          setActiveCohorts([cohorts[0].cohort]);
          setSelectedCohort(cohorts[0].cohort);
        }
      } catch (err) {
        console.error('대시보드 데이터 로드 오류:', err);
        setError(err instanceof Error ? err.message : '데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // 기수별 필터링 및 데이터 변환
  const convertedCohortData = useMemo(() => cohortData.map(convertToCohortData), [cohortData]);
  const activeCohortData = convertedCohortData.filter((c) => c.status === 'active');
  const displayCohortData = convertedCohortData.filter((c) => activeCohorts.includes(c.cohort));
  const selectedCohortData = convertedCohortData.find((c) => c.cohort === selectedCohort);

  const toggleActiveCohort = (cohortId: string) => {
    const cohort = convertedCohortData.find((c) => c.cohort === cohortId);
    if (cohort?.status === 'upcoming') return; // 예정 기수는 클릭 불가

    setActiveCohorts((prev) => (prev.includes(cohortId) ? prev.filter((id) => id !== cohortId) : [...prev, cohortId]));

    // 기수를 활성화하면 자동으로 선택
    if (!activeCohorts.includes(cohortId)) {
      setSelectedCohort(cohortId);
    }
  };

  const selectCohort = (cohortId: string) => {
    if (activeCohorts.includes(cohortId)) {
      setSelectedCohort(cohortId);
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='bg-white rounded-xl border border-slate-200 p-8 text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-slate-600'>대시보드 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 오류 상태
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
    <div className='space-y-4 sm:space-y-6 lg:space-y-8'>
      {/* Dashboard Header */}
      <DashboardHeader
        activeCohortData={activeCohortData}
        allCohortData={convertedCohortData}
        activeCohorts={activeCohorts}
        onToggleActiveCohort={toggleActiveCohort}
      />

      {/* Statistics Cards - 완벽 수강생 중심으로 재구성 */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
        <StatCard
          title='완벽 수강생'
          value={selectedCohortData?.perfectCompletionCount || 0}
          icon={<TrophyIcon className='w-6 h-6 text-white' />}
          theme='amber'
          badge={{
            text: '최우수',
            variant: 'success',
          }}
        />
        <StatCard
          title='이번주 완료'
          value={
            selectedCohortData?.weeklySubmissions?.[selectedCohortData?.weeklySubmissions.length - 1]?.submissions || 0
          }
          icon={<CheckCircleIcon className='w-6 h-6 text-white' />}
          theme='emerald'
          badge={{
            text: '진행중',
            variant: 'info',
          }}
        />
        <StatCard
          title='지난주 완료'
          value={
            selectedCohortData?.weeklySubmissions?.find((w) => w.week === (selectedCohortData?.currentWeek || 1) - 1)
              ?.submissions || 0
          }
          icon={<ChartBarIcon className='w-6 h-6 text-white' />}
          theme='violet'
          badge={{
            text: '완료',
            variant: 'default',
          }}
        />
        <StatCard
          title='승인 대기'
          value={dashboardStats?.pendingApprovals || 0}
          icon={<ClockIcon className='w-6 h-6 text-white' />}
          theme='rose'
          badge={{
            text: '처리 필요',
            variant: 'warning',
          }}
          onClick={() => navigateToUserManagement('pending')}
        />
      </div>

      {/* Weekly Submission Chart */}
      {selectedCohortData && selectedCohortData.weeklySubmissions.length > 0 && (
        <WeeklySubmissionChart
          selectedCohortData={selectedCohortData}
          weeklyViewMode={weeklyViewMode}
          onViewModeChange={setWeeklyViewMode}
        />
      )}

      {/* 완벽 수강생 추적 섹션 */}
      <div className='bg-white rounded-2xl border-2 border-slate-300 shadow-md p-6'>
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center'>
              <TrophyIcon className='w-6 h-6 text-white' />
            </div>
            <div>
              <h3 className='text-lg font-bold text-slate-900 flex items-center space-x-2'>
                <span>완벽 수강생 현황</span>
                <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-700'>
                  BEST
                </span>
              </h3>
              <p className='text-sm text-slate-600'>매주 모든 미션을 100% 완료하는 학생들</p>
            </div>
          </div>
          <div className='text-right bg-slate-50 rounded-xl p-4 border border-slate-200'>
            <span className='text-2xl font-bold text-slate-700'>
              {selectedCohortData?.perfectCompletionCount || 0}명
            </span>
            <p className='text-xs text-slate-500'>현재까지 유지중</p>
          </div>
        </div>

        {/* 완벽 수강생 명단 */}
        <div className='bg-slate-50 rounded-xl p-4 border border-slate-200'>
          <div className='mb-4'>
            <h4 className='font-semibold text-slate-800 mb-2 flex items-center space-x-2'>
              <span>완벽 수강생 명단</span>
              <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-200 text-slate-600'>
                {selectedCohortData?.perfectCompletionCount || 0}명
              </span>
            </h4>
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2'>
              {selectedCohortData &&
              selectedCohortData.perfectStudents &&
              selectedCohortData.perfectStudents.length > 0 ? (
                selectedCohortData.perfectStudents.map((student) => (
                  <div
                    key={student.id}
                    className='bg-white rounded-lg px-3 py-2 text-sm font-medium text-slate-700 shadow-sm border-2 border-slate-300 hover:border-slate-400 transition-colors'
                  >
                    {student.nickname}
                  </div>
                ))
              ) : (
                <div className='col-span-full text-center text-slate-500 py-4'>완벽 수강생이 없습니다</div>
              )}
            </div>
          </div>

          {/* 주차별 통계 */}
          <div className='grid grid-cols-2 gap-4 pt-4 border-t border-slate-200'>
            <div className='text-center bg-white rounded-lg p-3 border border-slate-200'>
              <p className='text-sm text-slate-600'>현재까지 완벽 완료</p>
              <p className='text-xl font-bold text-slate-700'>{selectedCohortData?.perfectCompletionCount || 0}명</p>
            </div>
            <div className='text-center bg-white rounded-lg p-3 border border-slate-200'>
              <p className='text-sm text-slate-600'>완료율</p>
              <p className='text-xl font-bold text-slate-700'>{selectedCohortData?.perfectCompletionRate || 0}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
