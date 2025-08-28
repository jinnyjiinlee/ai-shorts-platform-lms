import { ReactNode } from 'react';
import { Select } from '@/features/shared/ui/Select';

interface AdminPageHeaderProps {
  icon: ReactNode;
  title: string;
  description: string;
  selectedCohort?: string | 'all';
  availableCohorts?: string[];
  onCohortChange?: (cohort: string | 'all') => void;
  actions?: ReactNode;
}

export default function AdminPageHeader({
  icon,
  title,
  description,
  selectedCohort,
  availableCohorts,
  onCohortChange,
  actions
}: AdminPageHeaderProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            <p className="text-slate-600 text-sm">{description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {availableCohorts && onCohortChange && (
            <Select
              value={selectedCohort || 'all'}
              onChange={(value) => onCohortChange(value)}
              options={[
                { value: 'all', label: '전체 기수' },
                ...availableCohorts.map(cohort => ({
                  value: cohort,
                  label: `${cohort}기`
                }))
              ]}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}
          
          {actions}
        </div>
      </div>
    </div>
  );
}