import { PlusIcon, ClipboardDocumentListIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import AdminPageHeader from '@/features/admin/ui/AdminPageHeader';

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
  const actions = (
    <>
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
    </>
  );

  return (
    <AdminPageHeader
      icon={<ClipboardDocumentListIcon className="w-6 h-6 text-slate-600" />}
      title="미션 공지"
      description="수강생들에게 공지된 미션을 관리합니다"
      selectedCohort={selectedCohort}
      availableCohorts={availableCohorts}
      onCohortChange={onCohortChange}
      actions={actions}
    />
  );
}