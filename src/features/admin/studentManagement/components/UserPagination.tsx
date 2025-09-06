import React from 'react';
import { Button } from '@/features/shared/ui/Button';

interface UserPaginationProps {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  indexOfFirstUser: number;
  indexOfLastUser: number;
  onPageChange: (page: number) => void;
}

export const UserPagination: React.FC<UserPaginationProps> = ({
  currentPage,
  totalPages,
  totalUsers,
  indexOfFirstUser,
  indexOfLastUser,
  onPageChange,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className='px-6 py-4 border-t border-slate-200 bg-white'>
      <div className='flex items-center justify-between'>
        <div className='text-sm text-slate-600'>
          총 {totalUsers}명 중 {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, totalUsers)}명 표시
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant='outline'
            size='sm'
          >
            이전
          </Button>

          <div className='flex space-x-1'>
            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              return (
                <Button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  variant={currentPage === pageNum ? 'primary' : 'outline'}
                  size='sm'
                  className={currentPage === pageNum ? '' : 'hover:bg-slate-50'}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant='outline'
            size='sm'
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  );
};
