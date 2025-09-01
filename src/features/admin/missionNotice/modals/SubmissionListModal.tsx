import { Mission, MissionSubmission } from '@/types/domains/mission';
import { useState } from 'react';
import ModalHeader from './components/ModalHeader';
import TabNavigation from './components/TabNavigation';
import MissionInfoTab from './components/MissionInfoTab';
import SubmissionListTab from './components/SubmissionListTab';

interface SubmissionListModalProps {
  show: boolean;
  mission: Mission | null;
  onClose: () => void;
}

export default function SubmissionListModal({ show, mission, onClose }: SubmissionListModalProps) {
  const [activeTab, setActiveTab] = useState<'mission' | 'submissions'>('mission');

  if (!show || !mission) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
        <div className='p-6 border-b border-slate-200'>
          <ModalHeader mission={mission} onClose={onClose} />
          <TabNavigation activeTab={activeTab} mission={mission} onTabChange={setActiveTab} />
        </div>

        <div className='p-6'>
          {activeTab === 'mission' && <MissionInfoTab mission={mission} />}
          {activeTab === 'submissions' && <SubmissionListTab mission={mission} />}
        </div>

        <div className='p-6 border-t border-slate-200 flex justify-end'>
          <button
            onClick={onClose}
            className='px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors'
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
