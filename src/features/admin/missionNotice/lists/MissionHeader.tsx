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
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <ClipboardDocumentListIcon className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">미션 공지</h1>
          <p className="text-slate-600">수강생들에게 공지된 미션을 관리합니다</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* 기수 선택 */}
        <Select
          value={selectedCohort}
          onChange={onCohortChange}
          options={[
            { value: 'all', label: '전체' },
            ...availableCohorts.map((cohort) => ({
              value: cohort,
              label: `${cohort}기`,
            })),
          ]}
          className="w-24"
        />

        {/* 새로고침 버튼 */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center space-x-2 bg-white border border-slate-300 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-50 hover:border-slate-400 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
            title="제출 목록 새로고침"
          >
            <ArrowPathIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? '새로고침...' : '새로고침'}</span>
          </button>
        )}

        {/* 새 미션 추가 버튼 */}
        <button
          onClick={onCreateMission}
          className="flex items-center space-x-2 bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          <span>미션 작성</span>
        </button>
      </div>
    </div>
  );
}