'use client';

import { CohortData } from './types';
import { statusColors, progressColors } from './StatCard';

interface WeeklyCompactViewProps {
  selectedCohortData: CohortData;
}

export default function WeeklyCompactView({ selectedCohortData }: WeeklyCompactViewProps) {
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
      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='border-b border-slate-200'>
              <th className='text-left py-2 px-2 font-medium text-slate-700'>주차</th>
              <th className='text-center py-2 px-2 font-medium text-slate-700'>제출률</th>
              <th className='text-center py-2 px-2 font-medium text-slate-700'>제출인원</th>
              <th className='text-center py-2 px-2 font-medium text-slate-700'>상태</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-100'>
            {selectedCohortData.weeklySubmissions.map((week) => (
              <tr key={week.week} className='hover:bg-slate-50 transition-colors'>
                <td className='py-3 px-2'>
                  <span className='font-medium text-slate-900'>{week.week}주차</span>
                </td>
                <td className='py-3 px-2 text-center'>
                  <div className='flex items-center justify-center space-x-2'>
                    <div className='w-12 bg-slate-200 rounded-full h-1.5 overflow-hidden'>
                      <div
                        className={`h-1.5 rounded-full ${getProgressColor(week.rate)}`}
                        style={{ width: `${week.rate}%` }}
                      ></div>
                    </div>
                    <span className='font-bold text-sm text-slate-700'>
                      {week.rate}%
                    </span>
                  </div>
                </td>
                <td className='py-3 px-2 text-center text-slate-600'>
                  {week.submissions}/{week.totalStudents}명
                </td>
                <td className='py-3 px-2 text-center'>
                  <span 
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(week.rate)}`}
                  >
                    {week.rate >= 80 ? '우수' : week.rate >= 60 ? '양호' : '독려필요'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
