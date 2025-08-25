'use client';

import { CohortData } from './types';

interface CohortCardProps {
  cohort: CohortData;
  isSelected: boolean;
  onSelect: (cohortId: string) => void;
}

export default function CohortCard({ cohort, isSelected, onSelect }: CohortCardProps) {
  return (
    <div
      onClick={() => onSelect(cohort.cohort)}
      className={`group relative overflow-hidden bg-white rounded-xl border p-3 sm:p-4 hover:shadow-md transition-all cursor-pointer ${
        isSelected
          ? 'border-blue-500 shadow-lg ring-1 ring-blue-500 ring-opacity-30'
          : 'border-slate-200 hover:border-blue-300'
      }`}
    >
      {/* 배경 그래디언트 */}
      <div
        className={`absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br ${cohort.color} rounded-full -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16 opacity-3 group-hover:opacity-5 transition-opacity duration-300`}
      ></div>

      <div className='relative z-10'>
        {/* 헤더 */}
        <div className='flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-4 sm:mb-6'>
          <div className='flex items-center space-x-3'>
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${cohort.color} rounded-xl flex items-center justify-center shadow-md transition-transform duration-300`}
            >
              <span className='text-white font-bold text-base sm:text-lg'>{cohort.cohort}</span>
            </div>
            <div>
              <h3 className='text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors'>
                {cohort.name}
              </h3>
              <p className='text-sm text-slate-600'>수강생 {cohort.totalStudents}명</p>
            </div>
          </div>
          <div className='text-left sm:text-right'>
            <div className='text-xl sm:text-2xl font-bold text-slate-900'>{cohort.submissionRate}%</div>
            <div className='text-xs text-slate-500'>평균 완료율</div>
          </div>
        </div>

        {/* 진행률 바 */}
        <div className='w-full bg-slate-200 rounded-full h-2 sm:h-3 mb-3 sm:mb-4 overflow-hidden'>
          <div
            className={`h-2 sm:h-3 bg-gradient-to-r ${cohort.color} rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${cohort.submissionRate}%` }}
          ></div>
        </div>

        {/* 상세 통계 - 새로운 지표들 */}
        <div className='grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4'>
          <div className='text-center p-2 sm:p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors duration-300 border border-green-200'>
            <div className='text-base sm:text-lg font-bold text-green-700'>{cohort.perfectCompletionCount}명</div>
            <div className='text-xs text-green-600'>완벽 완료</div>
            <div className='text-xs text-green-500'>({cohort.perfectCompletionRate}%)</div>
          </div>
          <div className='text-center p-2 sm:p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-300 border border-blue-200'>
            <div className='text-base sm:text-lg font-bold text-blue-700'>{cohort.participatingStudents}명</div>
            <div className='text-xs text-blue-600'>참여 학생</div>
          </div>
          <div className='text-center p-2 sm:p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors duration-300 border border-purple-200'>
            <div className='text-base sm:text-lg font-bold text-purple-700'>{cohort.totalMissions}개</div>
            <div className='text-xs text-purple-600'>전체 미션</div>
          </div>
        </div>

        {/* 현재 주차 및 진행 상태 */}
        <div className='mb-3 sm:mb-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-3 border border-indigo-200'>
          <div className='flex items-center justify-between text-sm mb-2'>
            <div className='flex items-center space-x-2'>
              <div className='w-2 h-2 bg-indigo-500 rounded-full animate-pulse'></div>
              <span className='font-medium text-indigo-700'>현재 진행 중</span>
            </div>
            <span className='font-bold text-indigo-800'>{cohort.currentWeek}주차</span>
          </div>
          <div className='text-xs text-indigo-600'>
            🎯 완벽 완료 학생: <span className='font-semibold'>{cohort.perfectCompletionCount}명</span> / 
            👥 참여 학생: <span className='font-semibold'>{cohort.participatingStudents}명</span>
          </div>
        </div>

        {/* 상태 표시 - 개선된 버전 */}
        <div className='flex items-center justify-center pt-3 sm:pt-4 border-t border-slate-100'>
          <div className='flex items-center space-x-2 text-xs sm:text-sm'>
            <div className={`w-2 h-2 bg-gradient-to-r ${cohort.color} rounded-full`}></div>
            <span className='text-slate-600 group-hover:text-slate-800 transition-colors font-medium'>
              {cohort.submissionRate >= 80
                ? '🎉 순조롭게 진행 중'
                : cohort.submissionRate >= 60
                ? '💪 열심히 참여 중'
                : '⚠️ 독려 필요'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
