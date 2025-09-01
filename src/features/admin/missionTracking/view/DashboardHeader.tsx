'use client';

import { ChartBarIcon } from '@heroicons/react/24/outline';
import { Select } from '@/features/shared/ui/Select';

interface TrackingHeaderProps {
  selectedCohort: string;
  availableCohorts: string[];
  onCohortChange: (cohort: string) => void;
}

export default function DashboardHeader({ selectedCohort, availableCohorts, onCohortChange }: TrackingHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <ChartBarIcon className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">미션 달성</h1>
          <p className="text-slate-600">수강생들의 전체 제출 현황</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* 기수 선택 */}
        <Select
          value={selectedCohort}
          onChange={onCohortChange}
          options={availableCohorts.map((cohort) => ({
            value: cohort,
            label: `${cohort}기`,
          }))}
          className="w-24"
        />
      </div>
    </div>
  );
}
