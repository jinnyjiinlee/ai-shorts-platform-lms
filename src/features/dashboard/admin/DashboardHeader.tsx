'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { CohortData } from './types';

interface DashboardHeaderProps {
  activeCohortData: CohortData[];
  allCohortData: CohortData[];
  activeCohorts: number[];
  onToggleActiveCohort: (cohortId: number) => void;
}

export default function DashboardHeader({
  activeCohortData,
  allCohortData,
  activeCohorts,
  onToggleActiveCohort,
}: DashboardHeaderProps) {
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    // 현재 로그인한 사용자 정보 가져오기
    const getUserProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase.from('profiles').select('name, nickname').eq('id', user.id).single();

          if (profile) {
            setUserName(profile.name || profile.nickname || '관리자');
          }
        }
      } catch (error) {
        console.error('프로필 조회 오류:', error);
        // localStorage에서 가져오기 (백업)
        setUserName(localStorage.getItem('userName') || '관리자');
      }
    };

    getUserProfile();
  }, []);
  return (
    <div className='relative overflow-hidden bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 rounded-xl p-4 sm:p-6 text-white shadow-lg'>
      <div className='relative z-10'>
        <div className='flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-4 sm:mb-6'>
          <div className='flex items-center space-x-3 sm:space-x-4'>
            <div className='w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm'>
              <span className='text-xl sm:text-2xl'>📊</span>
            </div>
            <div>
              <h1 className='text-xl sm:text-2xl font-bold mb-1'>관리자 대시보드</h1>
              <p className='text-slate-200 text-xs sm:text-sm'>진행 중인 기수들의 과제 달성률을 관리하세요</p>
            </div>
          </div>
          <div className='flex flex-col sm:flex-row sm:items-center gap-3'>
            {/* 진행 기수 정보 */}
            <div className='text-center sm:text-right bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3'>
              <div className='text-xs text-slate-200 mb-1'>진행 중인 기수</div>
              <div className='text-lg sm:text-xl font-bold text-white'>{activeCohortData.length}개 기수</div>
            </div>
          </div>
        </div>

        {/* 진행 기수 설정 */}
        <div className='bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4'>
          <div className='flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-3'>
            <h3 className='text-sm font-semibold text-white'>진행 기수 설정</h3>
            <span className='text-xs text-slate-300'>활성화된 기수만 표시</span>
          </div>
          <div className='flex flex-wrap gap-2 sm:gap-3'>
            {allCohortData.map((cohort) => (
              <button
                key={cohort.cohort}
                onClick={() => onToggleActiveCohort(cohort.cohort)}
                disabled={cohort.status === 'upcoming'}
                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  activeCohorts.includes(cohort.cohort) && cohort.status !== 'upcoming'
                    ? 'bg-white text-slate-700 shadow-sm'
                    : cohort.status === 'upcoming'
                    ? 'bg-white/10 text-slate-400 cursor-not-allowed'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <span className='text-sm sm:text-lg'>
                  {cohort.status === 'completed' ? '✅' : cohort.status === 'active' ? '🚀' : '⏳'}
                </span>
                <span>{cohort.name}</span>
                <span className='text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded-full bg-white/20'>
                  {cohort.status === 'completed' ? '완료' : cohort.status === 'active' ? '진행중' : '예정'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
