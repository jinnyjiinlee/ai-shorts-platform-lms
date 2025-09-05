interface TrackingStatsProps {
  overallRate: number;
  totalSubmissions: number;
  totalMissions: number;
}

import { ChartBarIcon, DocumentTextIcon, FlagIcon } from '@heroicons/react/24/outline';

export default function StatsCards({ 
  overallRate, 
  totalSubmissions, 
  totalMissions 
}: TrackingStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
            <ChartBarIcon className="w-6 h-6 text-white" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-900">{overallRate}%</div>
            <div className="text-sm text-slate-500">전체 제출률</div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
            <DocumentTextIcon className="w-6 h-6 text-white" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-900">{totalSubmissions}</div>
            <div className="text-sm text-slate-500">총 제출 건수</div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center">
            <FlagIcon className="w-6 h-6 text-white" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-900">{totalMissions}</div>
            <div className="text-sm text-slate-500">등록된 미션 수</div>
          </div>
        </div>
      </div>
    </div>
  );
}