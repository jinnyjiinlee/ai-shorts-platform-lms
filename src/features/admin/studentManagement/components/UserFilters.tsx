import React from 'react';
import { AcademicCapIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/features/shared/ui/Badge';
import { FilterTagProps, StatusCounts } from '../types/userManagement.types';

interface UserFiltersProps {
  activeTab: 'students' | 'admins';
  statusFilter: string;
  statusCounts: StatusCounts;
  studentCount: number;
  adminCount: number;
  onTabChange: (tab: 'students' | 'admins') => void;
  onStatusFilterChange: (status: string) => void;
}

const FilterTag: React.FC<FilterTagProps> = ({ label, count, active, onClick, variant = 'default' }) => (
  <Badge
    size='sm'
    selectable
    selected={active}
    onClick={onClick}
    variant={variant}
    className={`cursor-pointer hover:opacity-80 transition-all px-3 py-1 ${
      active ? 'ring-2 ring-blue-500 ring-offset-1' : ''
    }`}
  >
    <span>{label}</span>
    <span className='ml-2 text-gray-500 text-xs'>{count}</span>
  </Badge>
);

export const UserFilters: React.FC<UserFiltersProps> = ({
  activeTab,
  statusFilter,
  statusCounts,
  studentCount,
  adminCount,
  onTabChange,
  onStatusFilterChange,
}) => {
  return (
    <div className='bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300'>
      {/* 탭 메뉴와 필터를 한 줄로 */}
      <div className='border-b border-slate-200'>
        <div className='flex items-center justify-between px-4'>
          {/* 왼쪽: 탭 메뉴 */}
          <nav className='-mb-px flex'>
            <button
              onClick={() => onTabChange('students')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'students'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className='flex items-center space-x-2'>
                <AcademicCapIcon className='w-4 h-4' />
                <span>수강생 관리</span>
                <span className='bg-blue-50 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold'>
                  {studentCount}
                </span>
              </div>
            </button>
            <button
              onClick={() => onTabChange('admins')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'admins'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className='flex items-center space-x-2'>
                <ShieldCheckIcon className='w-4 h-4' />
                <span>관리자 관리</span>
                <span className='bg-purple-50 text-purple-800 px-2 py-1 rounded-full text-xs font-semibold'>
                  {adminCount}
                </span>
              </div>
            </button>
          </nav>

          {/* 오른쪽: 상태 필터 태그들 */}
          <div className='flex gap-2'>
            <FilterTag
              label='전체'
              count={statusCounts.all}
              active={statusFilter === 'all'}
              onClick={() => onStatusFilterChange('all')}
              variant='default'
            />
            <FilterTag
              label='승인됨'
              count={statusCounts.approved}
              active={statusFilter === 'approved'}
              onClick={() => onStatusFilterChange('approved')}
              variant='success'
            />
            <FilterTag
              label='대기중'
              count={statusCounts.pending}
              active={statusFilter === 'pending'}
              onClick={() => onStatusFilterChange('pending')}
              variant='warning'
            />
            <FilterTag
              label='거부됨'
              count={statusCounts.rejected}
              active={statusFilter === 'rejected'}
              onClick={() => onStatusFilterChange('rejected')}
              variant='danger'
            />
            {statusCounts.unknown > 0 && (
              <FilterTag
                label='알 수 없음'
                count={statusCounts.unknown}
                active={statusFilter === 'unknown'}
                onClick={() => onStatusFilterChange('unknown')}
                variant='default'
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
