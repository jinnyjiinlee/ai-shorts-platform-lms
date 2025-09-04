'use client';

import { CohortData } from './types';

interface WeeklyCompactViewProps {
  selectedCohortData: CohortData;
}

export default function WeeklyCompactView({ selectedCohortData }: WeeklyCompactViewProps) {
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
                        className={`h-1.5 rounded-full ${
                          week.rate >= 80 ? 'bg-green-500' : week.rate >= 60 ? 'bg-blue-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${week.rate}%` }}
                      ></div>
                    </div>
                    <span
                      className={`font-bold text-sm ${
                        week.rate >= 80 ? 'text-green-600' : week.rate >= 60 ? 'text-blue-600' : 'text-orange-600'
                      }`}
                    >
                      {week.rate}%
                    </span>
                  </div>
                </td>
                <td className='py-3 px-2 text-center text-slate-600'>
                  {week.submissions}/{week.totalStudents}명
                </td>
                <td className='py-3 px-2 text-center'>
                  <span className='text-xs'>{week.rate >= 80 ? '🏆' : week.rate >= 60 ? '👍' : '⚠️'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
