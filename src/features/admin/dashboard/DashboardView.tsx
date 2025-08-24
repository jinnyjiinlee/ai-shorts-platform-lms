'use client';

import { useState, useEffect } from 'react';
import { UsersIcon } from '@heroicons/react/24/outline';
import DashboardHeader from './DashboardHeader';
import StatCard from './StatCard';
import WeeklySubmissionChart from './WeeklySubmissionChart';
import CohortCard from './CohortCard';
import {
  fetchDashboardStats,
  fetchCohortData,
  DashboardStats,
  CohortDashboardData,
} from '@/features/admin/dashboard/adminDashboardService';
import { CohortData, OverallStats } from './types';

// CohortDashboardData를 CohortData로 변환하는 어댑터 함수
const convertToCohortData = (dashboardData: CohortDashboardData): CohortData => {
  return {
    ...dashboardData,
    name: `${dashboardData.cohort}기`,
    completedMissions: Math.floor(dashboardData.totalMissions * (dashboardData.submissionRate / 100)),
    color: dashboardData.cohort % 3 === 0 ? 'blue' : dashboardData.cohort % 2 === 0 ? 'green' : 'purple',
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
    })),
  };
};

export default function DashboardView() {
  const [activeCohorts, setActiveCohorts] = useState<number[]>([1]); // 진행 중인 기수
  const [selectedCohort, setSelectedCohort] = useState<number | null>(1); // 선택된 기수 (상세 보기용)
  const [weeklyViewMode, setWeeklyViewMode] = useState<'compact' | 'detailed'>('compact'); // 주차별 보기 모드

  // 데이터 상태
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [cohortData, setCohortData] = useState<CohortDashboardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 데이터 불러오기
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [stats, cohorts] = await Promise.all([fetchDashboardStats(), fetchCohortData()]);

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
  const convertedCohortData = cohortData.map(convertToCohortData);
  const activeCohortData = convertedCohortData.filter((c) => c.status === 'active');
  const displayCohortData = convertedCohortData.filter((c) => activeCohorts.includes(c.cohort));
  const selectedCohortData = convertedCohortData.find((c) => c.cohort === selectedCohort);

  // 전체 통계 (선택된 기수들 기준)
  const overallStats: OverallStats = {
    totalActiveStudents: displayCohortData.reduce((sum, c) => sum + c.totalStudents, 0),
    averageSubmissionRate: displayCohortData.length
      ? Math.round(displayCohortData.reduce((s, c) => s + c.submissionRate, 0) / displayCohortData.length)
      : 0,
    totalActiveMissions: displayCohortData.reduce((sum, c) => sum + c.totalMissions, 0),
    activeStudentsCount: displayCohortData.reduce((sum, c) => sum + c.activeStudents, 0),
  };

  const toggleActiveCohort = (cohortId: number) => {
    const cohort = convertedCohortData.find((c) => c.cohort === cohortId);
    if (cohort?.status === 'upcoming') return; // 예정 기수는 클릭 불가

    setActiveCohorts((prev) => (prev.includes(cohortId) ? prev.filter((id) => id !== cohortId) : [...prev, cohortId]));

    // 기수를 활성화하면 자동으로 선택
    if (!activeCohorts.includes(cohortId)) {
      setSelectedCohort(cohortId);
    }
  };

  const selectCohort = (cohortId: number) => {
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

      {/* Statistics Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
        <StatCard
          title='총 수강생'
          value={overallStats.totalActiveStudents}
          subtitle='진행 중인 기수 기준'
          icon={<UsersIcon className='w-5 h-5 sm:w-6 sm:h-6 text-slate-600' />}
          badge={{
            text: `${overallStats.activeStudentsCount}명 활동중`,
            color: 'bg-slate-100 text-slate-600',
          }}
        />
        <StatCard
          title='승인 대기'
          value={dashboardStats?.pendingApprovals || 0}
          subtitle='신규 가입 승인 대기'
          icon={<span className='text-lg sm:text-xl'>📋</span>}
          badge={{
            text: '처리 필요',
            color: 'bg-orange-100 text-orange-600',
          }}
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

      {/* Cohort Cards */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4'>
        {displayCohortData.map((cohort) => (
          <CohortCard
            key={cohort.cohort}
            cohort={cohort}
            isSelected={selectedCohort === cohort.cohort}
            onSelect={selectCohort}
          />
        ))}
      </div>
    </div>
  );
}
