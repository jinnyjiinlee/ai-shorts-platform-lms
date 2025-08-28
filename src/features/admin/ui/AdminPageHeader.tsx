import { ReactNode } from 'react';
import { Select } from '@/features/shared/ui/Select';

interface AdminPageHeaderProps {
  icon: ReactNode;
  title: string;
  description: string;
  variant?: 'default' | 'gradient';
  selectedCohort?: string | 'all';
  availableCohorts?: string[];
  onCohortChange?: (cohort: string | 'all') => void;
  selectedWeek?: number | null;
  availableWeeks?: Record<string, any>;
  onWeekChange?: (week: number | null) => void;
  actions?: ReactNode;
}

export default function AdminPageHeader({
  icon,
  title,
  description,
  variant = 'default',
  selectedCohort,
  availableCohorts,
  onCohortChange,
  selectedWeek,
  availableWeeks,
  onWeekChange,
  actions
}: AdminPageHeaderProps) {
  const isGradient = variant === 'gradient';
  
  return (
    <div className={isGradient 
      ? "relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-8 text-white"
      : "bg-white rounded-xl border border-slate-200 p-6"
    }>
      {isGradient && (
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-300"></div>
          <div className="absolute top-1/2 left-1/3 w-8 h-8 bg-white/10 rounded-full animate-bounce delay-500"></div>
        </div>
      )}
      
      <div className={isGradient ? "relative z-10" : ""}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={isGradient 
              ? "w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm"
              : "w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center"
            }>
              {typeof icon === 'string' ? <span className="text-3xl">{icon}</span> : icon}
            </div>
            <div>
              <h1 className={isGradient 
                ? "text-3xl font-bold mb-2" 
                : "text-2xl font-bold text-slate-900"
              }>
                {title}
              </h1>
              <p className={isGradient 
                ? "text-blue-100 text-lg" 
                : "text-slate-600 text-sm"
              }>
                {description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {availableCohorts && onCohortChange && (
              <div className="flex items-center space-x-3">
                {isGradient && <label className="text-blue-100 font-medium">기수 선택</label>}
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
                  className={isGradient 
                    ? "px-4 py-2 bg-white/20 border border-white/30 rounded-xl text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all duration-200"
                    : "px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  }
                />
              </div>
            )}
            
            {availableWeeks && onWeekChange && (
              <div className="flex items-center space-x-3">
                <label className="text-blue-100 font-medium">주차 선택</label>
                <Select
                  value={selectedWeek?.toString() || ''}
                  onChange={(value) => onWeekChange(value ? Number(value) : null)}
                  options={[
                    { value: '', label: '전체 보기' },
                    ...Object.keys(availableWeeks).map(week => ({
                      value: week,
                      label: `${week}주차`
                    }))
                  ]}
                  className="px-4 py-2 bg-white/20 border border-white/30 rounded-xl text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all duration-200"
                />
              </div>
            )}
            
            {actions}
          </div>
        </div>
      </div>
    </div>
  );
}