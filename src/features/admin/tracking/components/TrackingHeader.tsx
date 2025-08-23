'use client';

import { ChartBarIcon } from '@heroicons/react/24/outline';

interface TrackingHeaderProps {
  selectedCohort: number;
  availableCohorts: number[];
  onCohortChange: (cohort: number) => void;
}

export default function TrackingHeader({ 
  selectedCohort, 
  availableCohorts, 
  onCohortChange 
}: TrackingHeaderProps) {
  return (
    <div className="bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 rounded-2xl p-8 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <ChartBarIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">미션 달성</h1>
            <p className="text-slate-100 text-lg">{selectedCohort}기 수강생들의 전체 제출 현황</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-slate-100 font-medium text-sm">기수</label>
            <select
              value={selectedCohort}
              onChange={(e) => onCohortChange(parseInt(e.target.value))}
              className="px-4 py-2 bg-white/20 border border-white/30 rounded-xl text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              {availableCohorts.map(cohort => (
                <option key={cohort} value={cohort} className="text-slate-800">{cohort}기</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}