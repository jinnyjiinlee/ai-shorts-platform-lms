'use client';

import { useState, useEffect } from 'react';
import { AcademicCapIcon, ChartBarIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { fetchStudentDashboardData } from '@/features/student/dashboard/studentDashboardService';
import WeeklyProgress from './WeeklyProgress';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';

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

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchStudentDashboardData();

        setStats({
          completedMissions: data.completedMissions,
          totalMissions: data.totalMissions,
          completionRate: data.completionRate,
          streak: data.recentSubmissions.length >= 3 ? 3 : data.recentSubmissions.length,
          rank: Math.floor(Math.random() * 10) + 1, // TODO: 실제 랭킹 시스템 구현
          totalStudents: 25, // TODO: 전체 학생 수 계산
          weeklyProgress: data.weeklyProgress,
        });
      } catch (err) {
        console.error('대시보드 데이터 로드 오류:', err);
        setError('대시보드 데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className='h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
      <div className='h-full max-w-7xl mx-auto p-4'>
        {/* 헤더 */}
        <div className='text-center mb-4'>
          <h1 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
            나의 학습 현황
          </h1>
          <p className='text-slate-600 text-sm'>꾸준히 성장하는 나의 모습을 확인해보세요</p>
        </div>

        {/* 메인 컨텐츠 */}
        <div className='h-[calc(100%-5rem)] space-y-4'>
          {/* 상단: 이번 주 목표 - 가로로 길게 */}
          <div className='relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 rounded-3xl shadow-2xl p-6 mb-4'>
            <div className='absolute inset-0 bg-gradient-to-br from-white/10 to-transparent'></div>
            <div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl'></div>
            <div className='absolute bottom-0 left-0 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl'></div>

            <div className='relative flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                <div className='w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg'>
                  <TrophyIcon className='w-8 h-8 text-white' />
                </div>
                <div>
                  <h2 className='text-2xl font-bold text-white mb-1'>이번 주 목표</h2>
                  <p className='text-blue-100'>매주 성장하는 나를 만들어가요!</p>
                </div>
              </div>

              <div className='flex-1 max-w-md mx-8'>
                <div className='flex items-center justify-between mb-2 text-white'>
                  <span className='text-sm font-medium'>미션 진행도</span>
                  <span className='text-lg font-bold'>
                    {stats.completedMissions}/{stats.totalMissions}
                  </span>
                </div>
                <div className='w-full bg-white/20 backdrop-blur-sm rounded-full h-3 overflow-hidden'>
                  <div
                    className='h-full bg-gradient-to-r from-white to-blue-200 rounded-full transition-all duration-1000 ease-out relative overflow-hidden'
                    style={{
                      width: `${stats.totalMissions > 0 ? (stats.completedMissions / stats.totalMissions) * 100 : 0}%`,
                    }}
                  >
                    <div className='absolute inset-0 bg-white/30 animate-pulse'></div>
                  </div>
                </div>
                <p className='text-xs text-blue-100 mt-2'>{stats.completionRate}% 달성</p>
              </div>

              <div className='text-center'>
                {stats.completedMissions === stats.totalMissions ? (
                  <div className='bg-white/20 backdrop-blur-sm rounded-2xl p-4'>
                    <div className='text-3xl mb-2'>🎉</div>
                    <p className='text-white font-bold'>목표 달성!</p>
                    <p className='text-blue-100 text-xs'>훌륭해요!</p>
                  </div>
                ) : (
                  <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-4'>
                    <div className='text-3xl mb-2'>💪</div>
                    <p className='text-white font-bold text-lg'>
                      {stats.totalMissions - stats.completedMissions}개 남음
                    </p>
                    <p className='text-blue-100 text-xs'>조금만 더 화이팅!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 중단: 통계 카드들 (2개만) */}
          <div className='grid grid-cols-2 gap-4 mb-4'>
            {/* 완료한 미션 - 더 예쁘게 */}
            <div className='group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1'>
              <div className='absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5'></div>
              <div className='absolute -top-24 -right-24 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl'></div>

              <div className='relative p-6'>
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex items-center space-x-3'>
                    <div className='w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform'>
                      <AcademicCapIcon className='w-7 h-7 text-white' />
                    </div>
                    <div>
                      <h3 className='font-bold text-slate-900 text-lg'>완료한 미션</h3>
                      <p className='text-slate-500 text-sm'>성취한 목표들</p>
                    </div>
                  </div>
                </div>

                <div className='flex items-end justify-between'>
                  <div>
                    <div className='text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
                      {stats.completedMissions}
                    </div>
                    <div className='text-sm text-slate-500 mt-1'>총 {stats.totalMissions}개 중</div>
                  </div>
                  <div className='flex items-center space-x-1'>
                    {[...Array(Math.min(5, stats.completedMissions))].map((_, i) => (
                      <div
                        key={i}
                        className='w-2 h-8 bg-gradient-to-t from-blue-500 to-indigo-500 rounded-full'
                        style={{ height: `${(i + 1) * 20}%`, opacity: 0.6 + i * 0.1 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 완료율 - 더 예쁘게 */}
            <div className='group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1'>
              <div className='absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-teal-500/5'></div>
              <div className='absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl'></div>

              <div className='relative p-6'>
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex items-center space-x-3'>
                    <div className='w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform'>
                      <ChartBarIcon className='w-7 h-7 text-white' />
                    </div>
                    <div>
                      <h3 className='font-bold text-slate-900 text-lg'>완료율</h3>
                      <p className='text-slate-500 text-sm'>달성 비율</p>
                    </div>
                  </div>
                </div>

                <div className='flex items-end justify-between'>
                  <div>
                    <div className='text-4xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent'>
                      {stats.completionRate}%
                    </div>
                    <div className='text-sm text-slate-500 mt-1'>목표 달성률</div>
                  </div>
                  <div className='relative w-20 h-20'>
                    <svg className='w-20 h-20 transform -rotate-90'>
                      <circle cx='40' cy='40' r='36' stroke='#e5e7eb' strokeWidth='8' fill='none' />
                      <circle
                        cx='40'
                        cy='40'
                        r='36'
                        stroke='url(#gradient)'
                        strokeWidth='8'
                        fill='none'
                        strokeDasharray={`${2 * Math.PI * 36}`}
                        strokeDashoffset={`${2 * Math.PI * 36 * (1 - stats.completionRate / 100)}`}
                        className='transition-all duration-1000 ease-out'
                      />
                      <defs>
                        <linearGradient id='gradient' x1='0%' y1='0%' x2='100%' y2='100%'>
                          <stop offset='0%' stopColor='#10b981' />
                          <stop offset='100%' stopColor='#059669' />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <span className='text-xs font-bold text-slate-700'>{stats.completionRate}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 하단: 주차별 진행 현황 */}
          <div className='flex-1'>
            <WeeklyProgress weeklyProgress={stats.weeklyProgress} />
          </div>
        </div>
      </div>
    </div>
  );
}
