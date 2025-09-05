'use client';

import { Badge } from '@/features/shared/ui/Badge';
import { CohortData } from '../../admin/dashboard/types';
import { statusColors, progressColors } from './StatCard';

interface WeeklyDetailedViewProps {
  selectedCohortData: CohortData;
}

export default function WeeklyDetailedView({ selectedCohortData }: WeeklyDetailedViewProps) {
  // 제출률에 따른 색상 선택 헬퍼 함수
  const getStatusStyle = (rate: number) => {
    if (rate >= 80) return statusColors.excellent;
    if (rate >= 60) return statusColors.good;
    return statusColors.needsImprovement;
  };

  const getProgressColor = (rate: number) => {
    if (rate >= 80) return progressColors.excellent;
    if (rate >= 60) return progressColors.good;
    return progressColors.needsImprovement;
  };
  return (
    <div className='p-4'>
      <div className='max-h-96 overflow-y-auto'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4'>
          {selectedCohortData.weeklySubmissions.map((week) => (
            <div key={week.week} className='bg-slate-50 rounded-lg p-3 hover:bg-slate-100 transition-colors'>
              <div className='flex items-center justify-between mb-2'>
                <h3 className='text-sm font-semibold text-slate-900'>{week.week}주차</h3>
                <Badge
                  variant={
                    week.rate >= 80
                      ? 'success'
                      : week.rate >= 60
                      ? 'info'
                      : 'warning'
                  }
                  size='sm'
                >
                  {week.rate}%
                </Badge>
              </div>

              <div className='space-y-2'>
                <div className='flex justify-between text-xs text-slate-600'>
                  <span>제출</span>
                  <span>
                    {week.submissions}명 / {week.totalStudents}명
                  </span>
                </div>

                <div className='w-full bg-slate-200 rounded-full h-2 overflow-hidden'>
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ease-out ${getProgressColor(week.rate)}`}
                    style={{ width: `${week.rate}%` }}
                  ></div>
                </div>
              </div>

              <div className='mt-3 text-center'>
                <span 
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(week.rate)}`}
                >
                  {week.rate >= 80 ? '우수' : week.rate >= 60 ? '양호' : '독려필요'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
