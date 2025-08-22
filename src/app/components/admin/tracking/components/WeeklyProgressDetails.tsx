'use client';

import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { CohortWeeklyData } from '../types';

interface WeeklyProgressDetailsProps {
  cohorts: CohortWeeklyData[];
  selectedWeek: number | 'all';
}

const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
  switch (trend) {
    case 'up':
      return <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />;
    case 'down':
      return <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />;
    case 'stable':
      return <MinusIcon className="w-4 h-4 text-gray-500" />;
  }
};

export default function WeeklyProgressDetails({ cohorts, selectedWeek }: WeeklyProgressDetailsProps) {
  return (
    <div className="space-y-6">
      {cohorts.map((cohort) => (
        <div key={cohort.cohort} className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AcademicCapIcon className="w-6 h-6 text-indigo-600" />
                <h3 className="text-xl font-semibold text-slate-900">{cohort.cohort}기</h3>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                  전체 달성률: {cohort.overallRate}%
                </span>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-200">
            {(selectedWeek === 'all' 
              ? cohort.weeks 
              : cohort.weeks.filter(w => w.week === selectedWeek)
            ).map((week) => (
              <div key={week.week} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        {week.week}주차
                      </span>
                      <h4 className="text-lg font-medium text-slate-900">{week.weekName}</h4>
                      {week.trend && getTrendIcon(week.trend)}
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-slate-600 mb-3">
                      <span>{week.startDate} ~ {week.endDate}</span>
                      <span>총 {week.totalStudents}명</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm text-slate-600">제출 완료: {week.submitted}명</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span className="text-sm text-slate-600">진행 중: {week.inProgress}명</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-sm text-slate-600">미시작: {week.notStarted}명</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                          <div className="h-3 flex">
                            <div 
                              className="bg-green-500 transition-all duration-500"
                              style={{ width: `${(week.submitted / week.totalStudents) * 100}%` }}
                            />
                            <div 
                              className="bg-yellow-500 transition-all duration-500"
                              style={{ width: `${(week.inProgress / week.totalStudents) * 100}%` }}
                            />
                            <div 
                              className="bg-red-500 transition-all duration-500"
                              style={{ width: `${(week.notStarted / week.totalStudents) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          week.submissionRate >= 80 ? 'text-green-600' :
                          week.submissionRate >= 60 ? 'text-blue-600' :
                          week.submissionRate >= 40 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {week.submissionRate}%
                        </div>
                        <div className="text-xs text-slate-600">제출률</div>
                      </div>
                    </div>

                    {week.previousWeekRate > 0 && (
                      <div className="mt-3 text-sm text-slate-500">
                        이전 주차 대비: {week.submissionRate - week.previousWeekRate > 0 ? '+' : ''}{week.submissionRate - week.previousWeekRate}%p
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}