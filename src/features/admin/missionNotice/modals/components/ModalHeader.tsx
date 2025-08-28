import { XMarkIcon } from '@heroicons/react/24/outline';
import { Mission } from '@/lib/types/mission.types';
import { Button } from '@/features/shared/ui/Button';

interface ModalHeaderProps {
  mission: Mission;
  onClose: () => void;
}

export default function ModalHeader({ mission, onClose }: ModalHeaderProps) {
  return (
    <div className='flex justify-between items-start'>
      <div>
        <h3 className='text-xl font-semibold text-slate-900'>{mission.title}</h3>
        <p className='text-sm text-slate-600 mt-1'>
          {mission.week}주차 • {mission.cohort}기 • 총 {mission.submissions?.length || 0}건 제출
        </p>
      </div>
      <Button 
        onClick={onClose} 
        variant="ghost"
        size="md"
        isIconOnly
        className='text-slate-400 hover:text-slate-600'
      >
        <XMarkIcon className='w-6 h-6' />
      </Button>
    </div>
  );
}
