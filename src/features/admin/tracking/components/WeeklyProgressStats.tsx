'use client';

import { ChartBarIcon } from '@heroicons/react/24/outline';
import { WeeklyProgressStats as StatsType } from '../types';

interface WeeklyProgressStatsProps {
  stats: StatsType;
}

const getProgressBarColor = (rate: number) => {
  if (rate >= 80) return 'bg-green-500';
  if (rate >= 60) return 'bg-blue-500';
  if (rate >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
};

export default function WeeklyProgressStats({ stats }: WeeklyProgressStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-600">전체 달성률</span>
          <ChartBarIcon className="w-5 h-5 text-slate-400" />
        </div>
        <div className="text-3xl font-bold text-slate-900">{stats.overallRate}%</div>
        <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor(stats.overallRate)}`}
            style={{ width: `${stats.overallRate}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-600">제출 완료</span>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-3xl font-bold text-green-600">{stats.totalSubmitted}</div>
        <div className="text-sm text-slate-500 mt-1">/{stats.totalStudents}명</div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-600">진행 중</span>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        </div>
        <div className="text-3xl font-bold text-yellow-600">{stats.totalInProgress}</div>
        <div className="text-sm text-slate-500 mt-1">/{stats.totalStudents}명</div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-600">미시작</span>
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
        </div>
        <div className="text-3xl font-bold text-red-600">{stats.notStarted}</div>
        <div className="text-sm text-slate-500 mt-1">/{stats.totalStudents}명</div>
      </div>
    </div>
  );
}