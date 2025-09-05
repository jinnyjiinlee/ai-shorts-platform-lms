import { Mission } from '@/types/domains/mission';
import ModalHeader from './components/ModalHeader';
import MissionInfoTab from './components/MissionInfoTab';

interface SubmissionListModalProps {
  show: boolean;
  mission: Mission | null;
  onClose: () => void;
}

export default function SubmissionListModal({ show, mission, onClose }: SubmissionListModalProps) {
  if (!show || !mission) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
        <div className='p-6 border-b border-slate-200'>
          <ModalHeader mission={mission} onClose={onClose} />
        </div>

        <div className='p-6'>
          <MissionInfoTab mission={mission} />
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
