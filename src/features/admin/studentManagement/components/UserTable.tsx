import React from 'react';
import { AdminUserView } from '@/types/domains/user';
import { SortableHeader } from './SortableHeader';
import { UserTableRow } from './UserTableRow';

interface UserTableProps {
  users: AdminUserView[];
  activeTab: 'students' | 'admins';
  selectedUserIds: string[];
  selectedAllUser: boolean;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  onSort: (column: string) => void;
  onSelectAll: () => void;
  onSelectUser: (userId: string) => void;
  onStatusUpdate: (userId: string, status: string) => void;
  onMakeAdmin: (user: AdminUserView) => void;
  onMakeStudent: (user: AdminUserView) => void;
  onDeleteUser: (user: AdminUserView) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  activeTab,
  selectedUserIds,
  selectedAllUser,
  sortBy,
  sortDirection,
  onSort,
  onSelectAll,
  onSelectUser,
  onStatusUpdate,
  onMakeAdmin,
  onMakeStudent,
  onDeleteUser,
}) => {
  return (
    <div className='overflow-x-auto'>
      <table className='w-full table-fixed'>
        <thead className='bg-slate-50'>
          <tr>
            {activeTab === 'students' && (
              <th className='px-4 py-2 text-left w-1/12'>
                <input
                  type='checkbox'
                  checked={selectedAllUser}
                  onChange={onSelectAll}
                  className='w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500'
                />
              </th>
            )}
            <SortableHeader
              column='nickname'
              className='w-1/4'
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSort={onSort}
            >
              사용자 정보
            </SortableHeader>
            <SortableHeader
              column='role'
              className='w-1/6'
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSort={onSort}
            >
              역할
            </SortableHeader>
            <SortableHeader
              column='cohort'
              className='w-1/6'
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSort={onSort}
            >
              기수
            </SortableHeader>
            <SortableHeader
              column='status'
              className='w-1/6'
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSort={onSort}
            >
              상태
            </SortableHeader>
            <SortableHeader
              column='created_at'
              className='w-1/6'
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSort={onSort}
            >
              가입일
            </SortableHeader>
            <th className='w-1/6 px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider'>
              <div className='flex items-center justify-center'>작업</div>
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-slate-200'>
          {users.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              activeTab={activeTab}
              isSelected={selectedUserIds.includes(user.id)}
              onSelect={onSelectUser}
              onStatusUpdate={onStatusUpdate}
              onMakeAdmin={onMakeAdmin}
              onMakeStudent={onMakeStudent}
              onDeleteUser={onDeleteUser}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
