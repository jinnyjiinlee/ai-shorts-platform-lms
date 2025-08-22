import { DocumentTextIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { Mission } from '../../types';

interface TabNavigationProps {
  activeTab: 'mission' | 'submissions';
  mission: Mission;
  onTabChange: (tab: 'mission' | 'submissions') => void;
}

export default function TabNavigation({ activeTab, mission, onTabChange }: TabNavigationProps) {
  return (
    <div className="mt-6 border-b border-slate-200">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => onTabChange('mission')}
          className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'mission'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <DocumentTextIcon className="w-5 h-5 inline-block mr-2" />
          미션 정보
        </button>
        <button
          onClick={() => onTabChange('submissions')}
          className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'submissions'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <ClipboardDocumentListIcon className="w-5 h-5 inline-block mr-2" />
          제출 목록 ({mission.submissions?.length || 0})
        </button>
      </nav>
    </div>
  );
}