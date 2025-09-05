'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from './DashboardHeader';
import StatCard from './StatCard';
import WeeklySubmissionChart from './WeeklySubmissionChart';
import { TrophyIcon, CheckCircleIcon, QuestionMarkCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import {
  DashboardStats,
  CohortDashboardData,
  getApprovedStudents,
  getPendingStudents,
  getMissionsWithSubmissions,
  getUnansweredQuestions,
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

  const navigateToQnA = () => {
    router.push('/admin/studentLounge/qna');
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

        const [students, pendingStudents, missions, unansweredQuestions] = await Promise.all([
          getApprovedStudents(),
          getPendingStudents(),
          getMissionsWithSubmissions(),
          getUnansweredQuestions(),
        ]);

        const stats = calculateDashboardStats(students, pendingStudents, [], unansweredQuestions);
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
          theme='violet'
        />
        <StatCard
          title='이번주 미션 완료'
          value={
            selectedCohortData?.weeklySubmissions?.[selectedCohortData?.weeklySubmissions.length - 1]?.submissions || 0
          }
          icon={<CheckCircleIcon className='w-6 h-6 text-white' />}
          theme='emerald'
        />
        <StatCard
          title='미답변 질문'
          value={dashboardStats?.unansweredQuestions || 0}
          icon={<QuestionMarkCircleIcon className='w-6 h-6 text-white' />}
          theme='amber'
          badge={
            (dashboardStats?.unansweredQuestions || 0) > 0
              ? {
                  text: '답변 필요',
                  variant: 'warning',
                }
              : undefined
          }
          onClick={() => navigateToQnA()}
        />
        <StatCard
          title='승인 대기'
          value={dashboardStats?.pendingApprovals || 0}
          icon={<ClockIcon className='w-6 h-6 text-white' />}
          theme='rose'
          badge={
            (dashboardStats?.pendingApprovals || 0) > 0
              ? {
                  text: '대기중',
                  variant: 'default',
                }
              : undefined
          }
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
      <div className='bg-white rounded-xl border border-slate-200'>
        <div className='px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center shadow-lg'>
                <TrophyIcon className='w-6 h-6 text-white' />
              </div>
              <div>
                <div className='flex items-center space-x-3'>
                  <h3 className='text-xl font-bold text-slate-900'>완벽 수강생</h3>
                </div>
                <p className='text-sm text-slate-600 mt-1'>100% 완료 유지 시 환불 보장 대상자</p>
              </div>
            </div>
            <div className='text-right'>
              <div className='flex items-baseline space-x-2'>
                <div className='text-3xl font-bold text-slate-900'>
                  {selectedCohortData?.perfectCompletionCount || 0}
                </div>
                <div className='text-lg text-slate-600'>명</div>
              </div>
              <div className='flex items-center space-x-2 mt-1'>
                <div className='text-sm font-medium text-blue-600'>
                  {selectedCohortData?.perfectCompletionRate || 0}%
                </div>
                <div className='text-xs text-slate-500'>전체 대비</div>
              </div>
            </div>
          </div>
        </div>

        {/* 완벽 수강생 명단 */}
        {selectedCohortData && selectedCohortData.perfectStudents && selectedCohortData.perfectStudents.length > 0 ? (
          <div className='p-6'>
            <div className='mb-4'>
              <div className='flex items-center space-x-2'>
                <h4 className='text-sm font-semibold text-slate-700'>환불 보장 대상자</h4>
                <div className='h-px bg-slate-200 flex-1'></div>
                <span className='text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full font-medium'>
                  {selectedCohortData.perfectStudents.length}명
                </span>
              </div>
            </div>
            <div className='grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3'>
              {selectedCohortData.perfectStudents.map((student) => (
                <div
                  key={student.id}
                  className='group relative bg-white rounded-xl px-4 py-3 text-sm font-medium text-slate-700 text-center border border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md'
                >
                  <div className='absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                    <span className='text-xs text-white font-bold'>✓</span>
                  </div>
                  <div className='truncate'>{student.nickname}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className='p-8 text-center'>
            <div className='w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3'>
              <TrophyIcon className='w-8 h-8 text-slate-400' />
            </div>
            <div className='text-sm text-slate-500 font-medium'>완벽 수강생이 없습니다</div>
            <div className='text-xs text-slate-400 mt-1'>모든 미션을 완료한 학생이 표시됩니다</div>
          </div>
        )}
      </div>
    </div>
  );
}
