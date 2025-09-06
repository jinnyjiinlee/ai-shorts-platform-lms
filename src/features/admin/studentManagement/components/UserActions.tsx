import React from 'react';
import { Button } from '@/features/shared/ui/Button';

interface UserActionsProps {
  activeTab: 'students' | 'admins';
  selectedCount: number;
  onBulkApproval: () => void;
  onBulkRejection: () => void;
}

export const UserActions: React.FC<UserActionsProps> = ({
  activeTab,
  selectedCount,
  onBulkApproval,
  onBulkRejection,
}) => {
  if (activeTab !== 'students' || selectedCount === 0) {
    return null;
  }

  return (
    <div className='p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200'>
      <div className='flex items-center justify-between'>
        <span className='text-sm text-blue-800 font-bold'>{selectedCount}명이 선택됨</span>
        <div className='flex space-x-2'>
          <Button
            onClick={onBulkApproval}
            variant='outline'
            size='sm'
            className='border-slate-500 text-green-700 hover:bg-green-50 hover:border-green-600'
          >
            선택한 사용자 승인
          </Button>
          <Button
            onClick={onBulkRejection}
            variant='outline'
            size='sm'
            className='border-slate-500 text-red-800 hover:bg-red-50 hover:border-red-600'
          >
            선택한 사용자 거부
          </Button>
        </div>
      </div>
    </div>
  );
};
