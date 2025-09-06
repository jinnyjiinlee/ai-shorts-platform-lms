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
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { text: '승인됨', variant: 'success' as const },
      pending: { text: '대기중', variant: 'warning' as const },
      rejected: { text: '거부됨', variant: 'danger' as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      text: '알 수 없음',
      variant: 'default' as const,
    };

    return (
      <Badge variant={config.variant} size='sm'>
        {config.text}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { text: '관리자', variant: 'info' as const, icon: ShieldCheckIcon },
      student: { text: '수강생', variant: 'default' as const, icon: AcademicCapIcon },
    };

    const config = roleConfig[role as keyof typeof roleConfig] || {
      text: '사용자',
      variant: 'default' as const,
      icon: UserGroupIcon,
    };

    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} size='sm' className='inline-flex items-center'>
        <IconComponent className='w-3 h-3 mr-1' />
        {config.text}
      </Badge>
    );
  };

  return (
    <tr className='hover:bg-slate-50 group'>
      {activeTab === 'students' && (
        <td className='px-4 py-2'>
          <input
            type='checkbox'
            checked={isSelected}
            onChange={() => onSelect(user.id)}
            className='w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500'
          />
        </td>
      )}
      <td className='px-4 py-2'>
        <div>
          <div className='text-sm font-bold text-slate-900'>{user.nickname || '닉네임 없음'}</div>
          <div className='text-xs text-slate-500 space-y-0'>
            <div>{user.name || '실명 없음'}</div>
            <div>{user.email}</div>
          </div>
        </div>
      </td>
      <td className='px-4 py-2'>{getRoleBadge(user.role || 'student')}</td>
      <td className='px-4 py-2 text-xs text-slate-900'>{user.cohort ? `${user.cohort}기` : '-'}</td>
      <td className='px-4 py-2'>{getStatusBadge(user.status)}</td>
      <td className='px-4 py-2 text-xs text-slate-500'>{new Date(user.created_at).toLocaleDateString('ko-KR')}</td>

      <td className='px-4 py-2'>
        <div className='flex items-center justify-center space-x-2'>
          {/* 승인/거부 그룹 */}
          {activeTab === 'students' && (
            <>
              {user.status !== 'approved' && (
                <Button
                  onClick={() => onStatusUpdate(user.id, 'approved')}
                  variant='outline'
                  size='xs'
                  className='border-slate-300 text-green-700 hover:bg-green-50'
                >
                  승인
                </Button>
              )}
              {user.status !== 'rejected' && (
                <Button
                  onClick={() => onStatusUpdate(user.id, 'rejected')}
                  variant='outline'
                  size='xs'
                  className='border-slate-300 text-red-700 hover:bg-red-50'
                >
                  거부
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
              className='border-slate-300 text-slate-500 hover:bg-slate-50'
            >
              관리자
            </Button>
          )}

          {/* 수강생 변환 그룹 (관리자 탭에서) */}
          {activeTab === 'admins' && user.role === 'admin' && (
            <Button
              onClick={() => onMakeStudent(user)}
              variant='outline'
              size='xs'
              className='border-slate-300 text-slate-500 hover:bg-slate-50'
            >
              수강생
            </Button>
          )}

          {/* 삭제 버튼 - 항상 표시 */}
          <Button
            onClick={handleDeleteClick}
            variant='ghost'
            size='xs'
            className={`transition-all duration-300 ${
              deleteStep === 0
                ? 'text-slate-300 hover:text-red-400'
                : 'text-red-600 bg-red-50 border border-red-200 animate-pulse'
            }`}
          >
            {deleteStep === 0 ? <TrashIcon className='w-3 h-3' /> : <span className='text-xs px-1'>삭제</span>}
          </Button>
        </div>
      </td>
    </tr>
  );
};
