'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { ChartBarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { fetchStudentDashboardData } from '@/features/student/dashboard/studentDashboardService';
import WeeklyProgress from './WeeklyProgress';
import ErrorState from './components/ErrorState';
import DashboardSkeleton from './components/DashboardSkeleton';

interface ProgressStats {
  completedMissions: number;
  totalMissions: number;
  completionRate: number;
  streak: number;
  rank: number;
  totalStudents: number;
  weeklyProgress: { week: number; title: string; completed: boolean; dueDate?: string }[];
}

export default function ProgressDashboard() {
  const [stats, setStats] = useState<ProgressStats>({
    completedMissions: 0,
    totalMissions: 0,
    completionRate: 0,
    streak: 0,
    rank: 0,
    totalStudents: 0,
    weeklyProgress: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🎯 현재 주차 계산 최적화 - useMemo 사용
  const currentWeek = useMemo(() => {
    return stats.weeklyProgress.length > 0 ? Math.max(...stats.weeklyProgress.map((w) => w.week)) : 1;
  }, [stats.weeklyProgress]);

  // 🎯 데이터 로딩 최적화 - useCallback 사용
  const loadDashboardData = useCallback(async () => {
    try {
      // 🎯 캐시 확인
      const cacheKey = 'studentDashboardData';
      const cachedData = sessionStorage.getItem(cacheKey);
      const cacheTimestamp = sessionStorage.getItem(`${cacheKey}_timestamp`);
      
      // 5분 내 캐시된 데이터가 있으면 사용
      if (cachedData && cacheTimestamp) {
        const now = Date.now();
        const timestamp = parseInt(cacheTimestamp);
        if (now - timestamp < 5 * 60 * 1000) { // 5분
          const data = JSON.parse(cachedData);
          setStats({
            completedMissions: data.completedMissions,
            totalMissions: data.totalMissions,
            completionRate: data.completionRate,
            streak: Math.min(data.recentSubmissions.length, 3),
            rank: Math.floor(Math.random() * 10) + 1,
            totalStudents: 25,
            weeklyProgress: data.weeklyProgress,
          });
          setIsLoading(false);
          return;
        }
      }

      // 캐시가 없거나 만료되었으면 새로 가져오기
      const data = await fetchStudentDashboardData();
      
      // 캐시 저장
      sessionStorage.setItem(cacheKey, JSON.stringify(data));
      sessionStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());

      setStats({
        completedMissions: data.completedMissions,
        totalMissions: data.totalMissions,
        completionRate: data.completionRate,
        streak: Math.min(data.recentSubmissions.length, 3),
        rank: Math.floor(Math.random() * 10) + 1,
        totalStudents: 25,
        weeklyProgress: data.weeklyProgress,
      });
      setIsLoading(false);
    } catch (err) {
      console.error('대시보드 데이터 로드 오류:', err);
      setError('대시보드 데이터를 불러오는 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (isLoading) return <DashboardSkeleton />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className='min-h-screen '>
      <div className='w-full max-w-7xl mx-auto px-6 py-6'>
        {/* 메인 헤더 - 세련되게 */}
        <div className='mb-12'>
          <h1 className='text-3xl font-bold text-slate-900 mb-3'>학습 대시보드</h1>
          <p className='text-base text-slate-500'>오늘까지 {stats.completedMissions}개의 미션을 완료했습니다</p>
        </div>

        {/* 상단 핵심 지표 카드들 */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
          {/* 진행률 카드 */}
          <div className='bg-white rounded-xl p-6 border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow min-h-[120px] flex flex-col justify-between'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center'>
                <ChartBarIcon className='w-5 h-5 text-blue-600' />
              </div>
              <span className='text-xs font-medium text-slate-400'>진행률</span>
            </div>
            <div className='text-2xl font-bold text-slate-900 mb-3'>{stats.completionRate}%</div>
            <div className='w-full bg-slate-100 rounded-full h-2 mt-auto'>
              <div
                className='bg-blue-800 h-2 rounded-full transition-all duration-700'
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
          </div>

          {/* 완료 미션 카드 */}
          <div className='bg-white rounded-xl p-6 border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow min-h-[120px] flex flex-col justify-between'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center'>
                <svg className='w-5 h-5 text-emerald-700' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <span className='text-xs font-medium text-slate-400'>완료</span>
            </div>
            <div className='text-2xl font-bold text-slate-900 mt-auto'>{stats.completedMissions}</div>
            <p className='text-xs font-normal text-slate-500'>미션 완료</p>
          </div>

          {/* 남은 미션 카드 */}
          <div className='bg-white rounded-xl p-6 border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow min-h-[120px] flex flex-col justify-between'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center'>
                <svg className='w-5 h-5 text-slate-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <span className='text-xs font-medium text-slate-400'>진행중</span>
            </div>
            <div className='text-2xl font-bold text-slate-900 mt-auto'>{stats.totalMissions - stats.completedMissions}</div>
            <p className='text-xs font-normal text-slate-500'>남은 미션</p>
          </div>

          {/* D-Day 카드 */}
          <div className='bg-white rounded-xl p-6 border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow min-h-[120px] flex flex-col justify-between'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center'>
                <ClockIcon className='w-5 h-5 text-amber-700' />
              </div>
              <span className='text-xs font-medium text-slate-400'>마감</span>
            </div>
            <div className='text-2xl font-bold text-slate-900 mt-auto'>D-3</div>
            <p className='text-xs font-normal text-slate-500'>이번주 마감</p>
          </div>
        </div>

        {/* 메인 컨텐츠 영역 */}
        <div className='grid grid-cols-1 lg:grid-cols-13 gap-8'>
          {/* 왼쪽: 전체 진행 상황 */}
          <div className='lg:col-span-8'>
            <div className='bg-white rounded-xl border border-slate-200/50 shadow-sm p-8 h-full flex flex-col'>
              <div className='flex items-center justify-between mb-8'>
                <div>
                  <h2 className='text-xl font-semibold text-slate-900'>전체 학습 진행도</h2>
                  <p className='text-sm font-normal text-slate-700 mt-2'>목표 달성률 {stats.completionRate}%</p>
                </div>
                <div className='text-right'>
                  <div className='text-sm font-medium text-slate-500'>총 미션</div>
                  <div className='text-2xl font-bold text-slate-900'>
                    {stats.completedMissions}/{stats.totalMissions}
                  </div>
                </div>
              </div>

              {/* 대형 진행률 바 */}
              <div className='bg-slate-100 rounded-2xl p-6'>
                <div className='w-full bg-white rounded-xl h-8 overflow-hidden shadow-inner'>
                  <div
                    className='bg-blue-800 h-8 rounded-xl transition-all duration-1000 ease-out flex items-center justify-end pr-3'
                    style={{
                      width: `${stats.totalMissions > 0 ? (stats.completedMissions / stats.totalMissions) * 100 : 0}%`,
                    }}
                  >
                    {stats.completionRate > 10 && (
                      <span className='text-sm text-white font-semibold'>{stats.completionRate}%</span>
                    )}
                  </div>
                </div>
                <div className='flex justify-between mt-6'>
                  <div>
                    <p className='text-base font-medium text-slate-700'></p>
                  </div>
                  <div className='text-right'>
                    <p className='text-base font-medium text-slate-700'>목표</p>
                    <p className='text-xs font-normal text-slate-500'>{stats.totalMissions}개 완료</p>
                  </div>
                </div>
              </div>

              {/* 주차별 진도 */}
              <div className='mt-8 flex-1'>
                <h3 className='text-lg font-medium text-slate-900 mb-4'>주차별 진행 현황</h3>
                <div className='grid grid-cols-10 gap-2'>
                  {Array.from({ length: 17 }, (_, i) => i + 1).map((week) => (
                    <div
                      key={week}
                      className={`text-center py-2 px-3 rounded-lg text-sm font-semibold ${
                        week <= currentWeek
                          ? week === currentWeek
                            ? 'bg-blue-800 text-white'
                            : 'bg-blue-50 text-blue-800'
                          : 'bg-slate-50 text-slate-400'
                      }`}
                    >
                      {week}주
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽: 이번주 미션 */}
          <div className='lg:col-span-5'>
            <WeeklyProgress weeklyProgress={stats.weeklyProgress} />
          </div>
        </div>
      </div>
    </div>
  );
}
