import { ReactNode } from 'react';

interface AdminPageHeaderProps {
  icon: ReactNode;
  title: string;
  description: string;
  selectedCohort?: number | string | 'all';
  availableCohorts?: (number | string)[];
  onCohortChange?: (cohort: number | string | 'all') => void;
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
            <select
              value={selectedCohort}
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'all') {
                  onCohortChange('all');
                } else {
                  // 숫자인지 문자인지 판단
                  const numValue = parseInt(value);
                  onCohortChange(isNaN(numValue) ? value : numValue);
                }
              }}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {selectedCohort === 'all' && <option value="all">전체 기수</option>}
              {availableCohorts.map(cohort => (
                <option key={cohort} value={cohort}>{cohort}기</option>
              ))}
            </select>
          )}
          
          {actions}
        </div>
      </div>
    </div>
  );
}