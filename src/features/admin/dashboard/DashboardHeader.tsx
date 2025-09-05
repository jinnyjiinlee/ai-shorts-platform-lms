'use client';

import { CohortData } from './types';

interface DashboardHeaderProps {
  activeCohortData: CohortData[];
  allCohortData: CohortData[];
  activeCohorts: string[];
  onToggleActiveCohort: (cohortId: string) => void;
}

export default function DashboardHeader({
  activeCohortData,
  allCohortData,
  activeCohorts,
  onToggleActiveCohort,
}: DashboardHeaderProps) {
  return (
    <div className='relative overflow-hidden bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 rounded-xl p-4 text-white shadow-lg'>
      <div className='relative z-10'>
        {/* 메인 헤더 - 한줄로 컴팩트하게 */}
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm'>
              <span className='text-xl'>📊</span>
            </div>
            <div>
              <h1 className='text-xl font-bold'>관리자 대시보드</h1>
              <p className='text-slate-200 text-sm'>진행 중인 기수들의 과제 달성률을 관리하세요</p>
            </div>
          </div>
          <div className='text-right bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2'>
            <div className='text-xs text-slate-200'>진행 중인 기수</div>
            <div className='text-lg font-bold text-white'>{activeCohortData.length}개 기수</div>
          </div>
        </div>

        {/* 기수 선택 - 컴팩트한 한줄 배치 */}
        <div className='flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg p-3'>
          <span className='text-sm font-medium text-white'>진행 기수 설정</span>
          <div className='flex items-center space-x-2'>
            {allCohortData.map((cohort) => (
              <button
                key={cohort.cohort}
                onClick={() => onToggleActiveCohort(cohort.cohort)}
                disabled={cohort.status === 'upcoming'}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeCohorts.includes(cohort.cohort) && cohort.status !== 'upcoming'
                    ? 'bg-white text-slate-700 shadow-sm'
                    : cohort.status === 'upcoming'
                    ? 'bg-white/10 text-slate-400 cursor-not-allowed'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <span className='text-sm'>
                  {cohort.status === 'completed' ? '✅' : cohort.status === 'active' ? '🚀' : '⏳'}
                </span>
                <span>{cohort.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
