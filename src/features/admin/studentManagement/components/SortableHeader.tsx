import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { SortableHeaderProps } from '../types/userManagement.types';

interface SortableHeaderExtendedProps extends SortableHeaderProps {
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  onSort: (column: string) => void;
}

export const SortableHeader: React.FC<SortableHeaderExtendedProps> = ({
  column,
  children,
  className = '',
  sortBy,
  sortDirection,
  onSort,
}) => {
  const isActive = sortBy === column;
  const isAsc = sortDirection === 'asc';

  return (
    <th className={`px-4 py-2 text-left ${className}`}>
      <button
        onClick={() => onSort(column)}
        className={`flex items-center justify-start space-x-2 text-xs font-medium uppercase tracking-wider transition-all duration-200 hover:bg-slate-100 px-2 py-1 rounded-md group w-full ${
          isActive ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        <span>{children}</span>
        {/* 화살표 아이콘 */}
        {isActive && isAsc && <ArrowUpIcon className='w-5 h-5 text-blue-600 font-bold' />}
        {isActive && !isAsc && <ArrowDownIcon className='w-5 h-5 text-blue-600 font-bold' />}
        {/* 비활성 상태일 때는 호버시에만 회색 화살표 */}
        {!isActive && (
          <ArrowUpIcon className='w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-70 transition-all duration-200' />
        )}
      </button>
    </th>
  );
};