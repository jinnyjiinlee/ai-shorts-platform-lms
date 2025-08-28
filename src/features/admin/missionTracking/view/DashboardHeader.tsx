'use client';

import { ChartBarIcon } from '@heroicons/react/24/outline';
import AdminPageHeader from '@/features/admin/ui/AdminPageHeader';

interface TrackingHeaderProps {
  selectedCohort: string;
  availableCohorts: string[];
  onCohortChange: (cohort: string) => void;
}

export default function DashboardHeader({ selectedCohort, availableCohorts, onCohortChange }: TrackingHeaderProps) {
  return (
    <AdminPageHeader
      icon={<ChartBarIcon className='w-6 h-6 text-slate-600' />}
      title='미션 달성'
      description='수강생들의 전체 제출 현황'
      selectedCohort={selectedCohort}
      availableCohorts={availableCohorts}
      onCohortChange={onCohortChange}
    />
  );
}
