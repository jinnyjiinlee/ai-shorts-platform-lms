'use client';

import { CohortData } from './types';
import WeeklyCompactView from './WeeklyCompactView';
import WeeklyDetailedView from './WeeklyDetailedView';

interface WeeklySubmissionChartProps {
  selectedCohortData: CohortData;
  weeklyViewMode: 'compact' | 'detailed';
  onViewModeChange: (mode: 'compact' | 'detailed') => void;
}

export default function WeeklySubmissionChart({
  selectedCohortData,
  weeklyViewMode,
  onViewModeChange,
}: WeeklySubmissionChartProps) {
  if (!selectedCohortData.weeklySubmissions.length) {
    return null;
  }

  return (
    <div className='bg-white rounded-xl border border-slate-200'>
      <div className='p-4 border-b border-slate-200'>
        <div className='flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
          <h2 className='text-base sm:text-lg font-semibold text-slate-900'>{selectedCohortData.name} 주차별 제출률</h2>

          {/* 보기 모드 토글 */}
          <div className='flex items-center space-x-1 bg-slate-100 rounded-lg p-1'>
            <button
              onClick={() => onViewModeChange('compact')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                weeklyViewMode === 'compact'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              간편보기
            </button>
            <button
              onClick={() => onViewModeChange('detailed')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                weeklyViewMode === 'detailed'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              상세보기
            </button>
          </div>
        </div>
      </div>

      {weeklyViewMode === 'compact' ? (
        <WeeklyCompactView selectedCohortData={selectedCohortData} />
      ) : (
        <WeeklyDetailedView selectedCohortData={selectedCohortData} />
      )}
    </div>
  );
}
