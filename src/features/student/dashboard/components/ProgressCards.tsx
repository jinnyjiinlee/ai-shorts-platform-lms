'use client';

import { ProgressCardsProps } from '../types';
import { ChartBarIcon, CheckCircleIcon, AcademicCapIcon, TrophyIcon } from '@heroicons/react/24/outline';

export default function ProgressCards({ stats }: ProgressCardsProps) {
  const { totalMissions, completedMissions, completionRate } = stats;

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
      {/* 전체 진행도 */}
      <div className='group relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-6 '>
        <div className='absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full -translate-y-8 translate-x-8 opacity-10'></div>
        <div className='relative z-10'>
          <div className='flex items-center justify-between mb-4'>
            <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center'>
              <ChartBarIcon className='w-6 h-6 text-white' />
            </div>
            <div className='text-right'>
              <div className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
                {completionRate}%
              </div>
              <div className='text-xs text-slate-500'>달성률</div>
            </div>
          </div>
          <h3 className='font-semibold text-slate-900 mb-3'>전체 진행도</h3>
          <div className='w-full bg-slate-200 rounded-full h-2 mb-2 overflow-hidden'>
            <div
              className='bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-1000 ease-out relative overflow-hidden'
              style={{ width: `${completionRate}%` }}
            >
              <div className='absolute inset-0 bg-white/30 animate-pulse'></div>
            </div>
          </div>
          <p className='text-sm text-slate-600 flex items-center space-x-1'>
            {completionRate === 100 ? (
              <>
                <TrophyIcon className='w-4 h-4 text-yellow-500' />
                <span>목표 달성 완료!</span>
              </>
            ) : (
              <span>목표까지 {100 - completionRate}% 남았어요!</span>
            )}
          </p>
        </div>
      </div>

      {/* 완료한 미션 */}
      <div className='group relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-6'>
        <div className='absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full -translate-y-8 translate-x-8 opacity-10'></div>
        <div className='relative z-10'>
          <div className='flex items-center justify-between mb-4'>
            <div className='w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center'>
              <CheckCircleIcon className='w-6 h-6 text-white' />
            </div>
            <div className='text-right'>
              <div className='text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'>
                {completedMissions}/{totalMissions}
              </div>
              <div className='text-xs text-slate-500'>완료</div>
            </div>
          </div>
          <h3 className='font-semibold text-slate-900 mb-3'>완료한 미션</h3>
          <div className='flex items-center justify-between'>
            <div className='w-full bg-slate-200 rounded-full h-2 overflow-hidden'>
              <div
                className='bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out relative overflow-hidden'
                style={{ width: `${(completedMissions / totalMissions) * 100}%` }}
              >
                <div className='absolute inset-0 bg-white/30 animate-pulse'></div>
              </div>
            </div>
          </div>
          <p className='text-sm text-slate-600 mt-2 flex items-center space-x-1'>
            {completedMissions === totalMissions ? (
              <>
                <TrophyIcon className='w-4 h-4 text-yellow-500' />
                <span>모든 미션 완료!</span>
              </>
            ) : (
              <span>계속 도전하세요!</span>
            )}
          </p>
        </div>
      </div>

      {/* 현재 과정 */}
      <div className='group relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-6 '>
        <div className='absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full -translate-y-8 translate-x-8 opacity-10'></div>
        <div className='relative z-10'>
          <div className='flex items-center justify-between mb-4'>
            <div className='w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center'>
              <AcademicCapIcon className='w-6 h-6 text-white' />
            </div>
            <div className='text-right'>
              <div className='text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent'>
                1기
              </div>
              <div className='text-xs text-slate-500'>참여중</div>
            </div>
          </div>
          <h3 className='font-semibold text-slate-900 mb-3'>현재 과정</h3>
          <div className='flex items-center space-x-2'>
            <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
            <p className='text-sm text-slate-600'>활동 중인 기수</p>
          </div>
        </div>
      </div>
    </div>
  );
}
