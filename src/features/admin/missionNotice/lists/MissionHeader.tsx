import { PlusIcon, ClipboardDocumentListIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { Select } from '@/features/shared/ui/Select';

interface MissionHeaderProps {
  selectedCohort: string | 'all';
  availableCohorts: string[];
  onCohortChange: (cohort: string | 'all') => void;
  onCreateMission: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export default function MissionHeader({
  selectedCohort,
  availableCohorts,
  onCohortChange,
  onCreateMission,
  onRefresh,
  isLoading = false
}: MissionHeaderProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
            <ClipboardDocumentListIcon className="w-6 h-6 text-slate-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">미션 공지</h1>
            <p className="text-slate-600 text-sm">수강생들에게 공지된 미션을 관리합니다</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select
            value={selectedCohort}
            onChange={(value) => onCohortChange(value as string)}
            options={[
              { value: 'all', label: '전체 기수' },
              ...availableCohorts.map(cohort => ({
                value: cohort,
                label: `${cohort}기`
              }))
            ]}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
              title="제출 목록 새로고침"
            >
              <ArrowPathIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? '새로고침...' : '새로고침'}</span>
            </button>
          )}
          
          <button
            onClick={onCreateMission}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            <span>새 미션 추가</span>
          </button>
        </div>
      </div>
    </div>
  );
}