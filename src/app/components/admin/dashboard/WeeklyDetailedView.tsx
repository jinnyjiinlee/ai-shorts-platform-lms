'use client';

import { CohortData } from './types';

interface WeeklyDetailedViewProps {
  selectedCohortData: CohortData;
}

export default function WeeklyDetailedView({ selectedCohortData }: WeeklyDetailedViewProps) {
  return (
    <div className="p-4">
      <div className="max-h-96 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {selectedCohortData.weeklySubmissions.map((week) => (
            <div
              key={week.week}
              className="bg-slate-50 rounded-lg p-3 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-slate-900">{week.week}주차</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  week.rate >= 80 ? 'bg-green-100 text-green-800' :
                  week.rate >= 60 ? 'bg-blue-100 text-blue-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {week.rate}%
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>제출</span>
                  <span>{week.submissions}명 / {week.totalStudents}명</span>
                </div>
                
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ease-out ${
                      week.rate >= 80 ? 'bg-green-500' :
                      week.rate >= 60 ? 'bg-blue-500' :
                      'bg-orange-500'
                    }`}
                    style={{ width: `${week.rate}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-3 text-center">
                <span className="text-xs text-slate-500">
                  {week.rate >= 80 ? '🏆 우수' :
                   week.rate >= 60 ? '👍 양호' : '⚠️ 독려필요'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}