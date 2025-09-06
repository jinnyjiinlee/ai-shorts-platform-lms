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
    <div className='overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm'>
      <table className='w-full table-fixed'>
        <thead className='bg-gray-50/60'>
          <tr className='border-b border-gray-200'>
            {activeTab === 'students' && (
              <th className='px-4 py-3 text-left w-1/12'>
                <input
                  type='checkbox'
                  checked={selectedAllUser}
                  onChange={onSelectAll}
                  className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2'
                />
              </th>
            )}
            <SortableHeader
              column='nickname'
              className='w-64'
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSort={onSort}
            >
              User Info
            </SortableHeader>
            <SortableHeader
              column='role'
              className='w-28'
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSort={onSort}
            >
              Role
            </SortableHeader>
            <SortableHeader
              column='cohort'
              className='w-20'
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSort={onSort}
            >
              Cohort
            </SortableHeader>
            <SortableHeader
              column='status'
              className='w-24'
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSort={onSort}
            >
              Status
            </SortableHeader>
            <SortableHeader
              column='created_at'
              className='w-28'
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSort={onSort}
            >
              Joined
            </SortableHeader>
            <th className='w-80 px-4 py-3 text-xs font-semibold text-gray-600 tracking-wide'>
              <div className='flex items-center justify-center'>Actions</div>
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-slate-100'>
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
