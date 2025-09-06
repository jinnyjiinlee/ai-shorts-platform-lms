import React, { useState } from 'react';
import { EyeIcon, ShieldCheckIcon, AcademicCapIcon, UserGroupIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '@/features/shared/ui/Button';
import { Badge } from '@/features/shared/ui/Badge';
import { AdminUserView } from '@/types/domains/user';

interface UserTableRowProps {
  user: AdminUserView;
  activeTab: 'students' | 'admins';
  isSelected: boolean;
  onSelect: (userId: string) => void;
  onStatusUpdate: (userId: string, status: string) => void;
  onMakeAdmin: (user: AdminUserView) => void;
  onMakeStudent: (user: AdminUserView) => void;
  onDeleteUser: (user: AdminUserView) => void;
}

export const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  activeTab,
  isSelected,
  onSelect,
  onStatusUpdate,
  onMakeAdmin,
  onMakeStudent,
  onDeleteUser,
}) => {
  const [deleteStep, setDeleteStep] = useState(0);

  // 삭제 버튼 핸들러
  const handleDeleteClick = () => {
    if (deleteStep === 0) {
      setDeleteStep(1);
      // 3초 후 자동으로 원래대로 복원
      setTimeout(() => setDeleteStep(0), 3000);
    } else {
      onDeleteUser(user);
      setDeleteStep(0);
    }
  };

  // 상태 업데이트 확인 핸들러
  const handleStatusUpdate = (userId: string, newStatus: string, userName: string) => {
    const statusText = newStatus === 'approved' ? '승인' : '거부';
    if (confirm(`${userName}님을 ${statusText}하시겠습니까?`)) {
      onStatusUpdate(userId, newStatus);
    }
  };
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { 
        text: 'Active', 
        className: 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium px-3 py-1.5 rounded-full text-xs' 
      },
      pending: { 
        text: 'Pending', 
        className: 'bg-amber-50 text-amber-700 border border-amber-200 font-medium px-3 py-1.5 rounded-full text-xs' 
      },
      rejected: { 
        text: 'Inactive', 
        className: 'bg-slate-100 text-slate-600 border border-slate-200 font-medium px-3 py-1.5 rounded-full text-xs' 
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      text: 'Unknown',
      className: 'bg-gray-50 text-gray-500 border border-gray-200 font-medium px-3 py-1.5 rounded-full text-xs',
    };

    return (
      <span className={config.className}>
        {config.text}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { 
        text: 'Admin', 
        icon: ShieldCheckIcon,
        className: 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium px-3 py-1.5 rounded-lg text-xs inline-flex items-center'
      },
      student: { 
        text: 'Student', 
        icon: AcademicCapIcon,
        className: 'bg-blue-50 text-blue-700 border border-blue-200 font-medium px-3 py-1.5 rounded-lg text-xs inline-flex items-center'
      },
    };

    const config = roleConfig[role as keyof typeof roleConfig] || {
      text: 'User',
      icon: UserGroupIcon,
      className: 'bg-gray-50 text-gray-600 border border-gray-200 font-medium px-3 py-1.5 rounded-lg text-xs inline-flex items-center',
    };

    const IconComponent = config.icon;

    return (
      <span className={config.className}>
        <IconComponent className='w-3 h-3 mr-1.5' />
        {config.text}
      </span>
    );
  };

  return (
    <tr className='hover:bg-slate-50/50 group transition-colors duration-200 border-b border-slate-100'>
      {activeTab === 'students' && (
        <td className='px-4 py-3'>
          <input
            type='checkbox'
            checked={isSelected}
            onChange={() => onSelect(user.id)}
            className='w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-2'
          />
        </td>
      )}
      <td className='px-4 py-3'>
        <div className='space-y-1'>
          <div className='text-sm font-semibold text-slate-900'>{user.nickname || '닉네임 없음'}</div>
          <div className='space-y-0.5'>
            <div className='text-xs text-slate-600 font-medium'>{user.name || '실명 없음'}</div>
            <div className='text-xs text-slate-500'>{user.email}</div>
          </div>
        </div>
      </td>
      <td className='px-4 py-3'>{getRoleBadge(user.role || 'student')}</td>
      <td className='px-4 py-3'>
        {user.cohort ? (
          <span className='bg-slate-100 text-slate-700 border border-slate-200 font-medium px-2.5 py-1 rounded-full text-xs'>
            {user.cohort}
          </span>
        ) : (
          <span className='text-slate-400 text-xs'>-</span>
        )}
      </td>
      <td className='px-4 py-3'>{getStatusBadge(user.status)}</td>
      <td className='px-4 py-3 text-sm text-slate-600'>{new Date(user.created_at).toLocaleDateString('ko-KR')}</td>

      <td className='px-4 py-3'>
        <div className='flex items-center justify-center space-x-2'>
          {/* 승인/거부 그룹 */}
          {activeTab === 'students' && (
            <>
              {user.status !== 'approved' && (
                <Button
                  onClick={() => handleStatusUpdate(user.id, 'approved', user.nickname || user.name || '사용자')}
                  variant='outline'
                  size='xs'
                  className='border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 font-medium px-2.5 py-1 transition-all duration-200 rounded-md shadow-sm text-xs'
                >
                  Approve
                </Button>
              )}
              {user.status !== 'rejected' && (
                <Button
                  onClick={() => handleStatusUpdate(user.id, 'rejected', user.nickname || user.name || '사용자')}
                  variant='outline'
                  size='xs'
                  className='border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-400 font-medium px-2.5 py-1 transition-all duration-200 rounded-md shadow-sm text-xs'
                >
                  Decline
                </Button>
              )}
            </>
          )}

          {/* 관리자 변환 그룹 */}
          {activeTab === 'students' && user.status === 'approved' && user.role !== 'admin' && (
            <Button
              onClick={() => onMakeAdmin(user)}
              variant='outline'
              size='xs'
              className='border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 font-medium px-2.5 py-1 transition-all duration-200 rounded-md shadow-sm text-xs'
            >
              Admin
            </Button>
          )}

          {/* 수강생 변환 그룹 (관리자 탭에서) */}
          {activeTab === 'admins' && user.role === 'admin' && (
            <Button
              onClick={() => onMakeStudent(user)}
              variant='outline'
              size='xs'
              className='border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 font-medium px-2.5 py-1 transition-all duration-200 rounded-md shadow-sm text-xs'
            >
              Student
            </Button>
          )}

          {/* 삭제 버튼 - 항상 표시 */}
          <Button
            onClick={handleDeleteClick}
            variant='ghost'
            size='xs'
            className={`font-medium px-2 py-1 transition-all duration-300 rounded-md ${
              deleteStep === 0
                ? 'text-slate-400 hover:text-red-500 hover:bg-red-50/70'
                : 'text-red-600 bg-red-50 border border-red-200 animate-pulse shadow-sm'
            }`}
          >
            {deleteStep === 0 ? <TrashIcon className='w-3.5 h-3.5' /> : <span className='text-xs px-0.5'>Delete</span>}
          </Button>
        </div>
      </td>
    </tr>
  );
};
