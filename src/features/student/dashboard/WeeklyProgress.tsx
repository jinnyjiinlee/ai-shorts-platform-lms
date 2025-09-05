'use client';

import React, { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ClockIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface WeekProgressProps {
  weeklyProgress: {
    week: number;
    title: string;
    completed: boolean;
    dueDate?: string;
  }[];
}

function WeeklyProgress({ weeklyProgress }: WeekProgressProps) {
  const router = useRouter();

  // 🎯 현재 주차 계산 최적화
  const currentWeek = useMemo(() => {
    return weeklyProgress.length > 0 ? Math.max(...weeklyProgress.map((w) => w.week)) : 1;
  }, [weeklyProgress]);

  // 🎯 현재 주차 미션 계산 최적화
  const { currentWeekMissions, completedCount, totalCount, completionRate } = useMemo(() => {
    const missions = weeklyProgress
      .filter((week) => week.week === currentWeek)
      .sort((a, b) => a.title.localeCompare(b.title));
    
    const completed = missions.filter((week) => week.completed).length;
    const total = missions.length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return {
      currentWeekMissions: missions,
      completedCount: completed,
      totalCount: total,
      completionRate: rate
    };
  }, [weeklyProgress, currentWeek]);

  // 🎯 라우터 네비게이션 최적화
  const handleClick = useCallback(() => {
    router.push('/student/mission');
  }, [router]);

  return (
    <div
      onClick={handleClick}
      className='relative bg-white rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md overflow-hidden cursor-pointer transition-all duration-300 group h-full flex flex-col'
    >

      {/* 헤더 */}
      <div className='relative px-6 py-4 border-b border-slate-100/50'>
        <div className='flex items-center justify-between'>
          <div>
            <div className='flex items-center space-x-3 mb-2'>
              <div>
                <h3 className='text-xl font-semibold text-slate-900'>이번주 미션</h3>
                <p className='text-sm font-normal text-slate-500'>{currentWeek}주차</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-slate-900'>{completedCount}</div>
                <div className='text-xs font-medium text-slate-500'>완료</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-slate-900'>{totalCount - completedCount}</div>
                <div className='text-xs font-medium text-slate-500'>남은 미션</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-slate-900'>{completionRate}%</div>
                <div className='text-xs font-medium text-slate-500'>진행률</div>
              </div>
            </div>
          </div>
          <ChevronRightIcon className='w-6 h-6 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all duration-200' />
        </div>
      </div>

      {/* 진행률 바 - 세련된 디자인 */}
      <div className='relative px-6 py-3 bg-slate-50/30'>
        <div className='w-full bg-slate-200/60 rounded-full h-2 overflow-hidden'>
          <div
            className='bg-slate-600 h-2 rounded-full transition-all duration-1000 ease-out'
            style={{ width: `${completionRate}%` }}
          >
          </div>
        </div>
      </div>

      {/* 미션 목록 - 그리드 형태로 */}
      <div className='relative px-6 py-4 flex-1 flex flex-col'>
        {currentWeekMissions.length > 0 ? (
          <div className='flex flex-col h-full'>
            {/* 미션 그리드 */}
            <div className='grid grid-cols-2 gap-3 flex-1 content-start'>
              {currentWeekMissions.slice(0, 6).map((week, index) => (
                <div
                  key={`preview-${week.week}-${index}`}
                  className={`relative p-3 rounded-lg border transition-all duration-200 min-h-[80px] flex flex-col justify-between ${
                    week.completed
                      ? 'bg-blue-50/40 border-blue-200/60 shadow-sm'
                      : 'bg-orange-50/30 border-orange-200/50 hover:border-orange-300/70'
                  }`}
                >
                  {/* 완료 표시 */}
                  {week.completed && (
                    <div className='absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-sm'>
                      <svg className='w-2.5 h-2.5 text-white' fill='currentColor' viewBox='0 0 20 20'>
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                  )}

                  {/* 상태 표시 */}
                  <div className='flex items-center space-x-2 mb-2'>
                    <div className={`w-2 h-2 rounded-full ${week.completed ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                    <span className={`text-xs font-semibold ${week.completed ? 'text-blue-700' : 'text-orange-600'}`}>
                      {week.completed ? '제출 완료' : '미제출'}
                    </span>
                  </div>

                  {/* 미션 제목 */}
                  <p
                    className={`text-sm font-medium leading-tight ${
                      week.completed ? 'text-blue-800' : 'text-orange-700'
                    }`}
                  >
                    {week.title.length > 20 ? `${week.title.substring(0, 20)}...` : week.title}
                  </p>
                </div>
              ))}
            </div>

            {/* 더 보기 */}
            {currentWeekMissions.length > 6 && (
              <div className='flex items-end justify-center mt-auto pt-4'>
                <div className='inline-flex items-center space-x-2 px-4 py-2 bg-slate-50 rounded-lg text-xs text-slate-600'>
                  <span>+{currentWeekMissions.length - 6}개 미션 더</span>
                  <ChevronRightIcon className='w-3 h-3' />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center h-full'>
            <div className='w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3'>
              <ClockIcon className='w-6 h-6 text-slate-400' />
            </div>
            <p className='text-slate-500 text-sm'>{currentWeek}주차 미션이 아직 등록되지 않았습니다.</p>
          </div>
        )}
      </div>

      {/* 하단 액션 영역 */}
      <div className='relative px-6 py-3 bg-slate-50/20 border-t border-slate-100/50'>
        <div className='flex items-center justify-between text-xs text-slate-500'>
          <span className='font-medium'>미션 관리</span>
          <span className='flex items-center space-x-1'>
            <span className='text-xs font-medium text-slate-500'>자세히 보기</span>
            <ChevronRightIcon className='w-3 h-3' />
          </span>
        </div>
      </div>
    </div>
  );
}

// 🎯 React.memo로 불필요한 리렌더링 방지
export default React.memo(WeeklyProgress, (prevProps, nextProps) => {
  // weeklyProgress 배열의 길이와 내용이 같으면 리렌더링 스킵
  if (prevProps.weeklyProgress.length !== nextProps.weeklyProgress.length) {
    return false;
  }
  
  return prevProps.weeklyProgress.every((prev, index) => {
    const next = nextProps.weeklyProgress[index];
    return (
      prev.week === next.week &&
      prev.title === next.title &&
      prev.completed === next.completed &&
      prev.dueDate === next.dueDate
    );
  });
});
