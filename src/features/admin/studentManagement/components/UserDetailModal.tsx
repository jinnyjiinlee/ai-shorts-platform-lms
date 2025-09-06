import React from 'react';
import { XMarkIcon, ShieldCheckIcon, AcademicCapIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Button } from '@/features/shared/ui/Button';
import { Badge } from '@/features/shared/ui/Badge';
import { AdminUserView } from '@/types/domains/user';

interface UserDetailModalProps {
  user: AdminUserView | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (userId: string, status: string) => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  isOpen,
  onClose,
  onStatusUpdate,
}) => {
  if (!isOpen || !user) return null;

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

  const handleStatusUpdateAndClose = (status: string) => {
    onStatusUpdate(user.id, status);
    onClose();
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between p-6 border-b border-slate-200'>
          <h3 className='text-lg font-semibold text-slate-900'>사용자 상세 정보</h3>
          <Button
            onClick={onClose}
            variant='ghost'
            size='md'
            isIconOnly
            className='text-slate-400 hover:text-slate-600'
          >
            <XMarkIcon className='w-6 h-6' />
          </Button>
        </div>

        <div className='p-6 space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-1'>닉네임</label>
              <div className='text-lg font-bold text-slate-900'>{user.nickname || '없음'}</div>
            </div>

            <div>
              <label className='block text-sm font-medium text-slate-700 mb-1'>실명</label>
              <div className='text-sm text-slate-900'>{user.name || '없음'}</div>
            </div>

            <div>
              <label className='block text-sm font-medium text-slate-700 mb-1'>아이디</label>
              <div className='text-sm text-slate-900'>{user.user_id}</div>
            </div>

            <div>
              <label className='block text-sm font-medium text-slate-700 mb-1'>이메일</label>
              <div className='text-sm text-slate-900'>{user.email}</div>
            </div>

            <div>
              <label className='block text-sm font-medium text-slate-700 mb-1'>역할</label>
              <div>{getRoleBadge(user.role || 'student')}</div>
            </div>

            <div>
              <label className='block text-sm font-medium text-slate-700 mb-1'>기수</label>
              <div className='text-sm text-slate-900'>
                {user.cohort ? `${user.cohort}기` : '미지정'}
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-slate-700 mb-1'>상태</label>
              <div>{getStatusBadge(user.status)}</div>
            </div>

            <div>
              <label className='block text-sm font-medium text-slate-700 mb-1'>가입일</label>
              <div className='text-sm text-slate-900'>
                {new Date(user.created_at).toLocaleString('ko-KR')}
              </div>
            </div>
          </div>

          {user.role === 'student' && (
            <div className='pt-4 border-t border-slate-200'>
              <div className='flex space-x-3'>
                {user.status !== 'approved' && (
                  <Button
                    onClick={() => handleStatusUpdateAndClose('approved')}
                    variant='outline'
                    className='flex-1 border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600'
                  >
                    승인하기
                  </Button>
                )}

                {user.status !== 'rejected' && (
                  <Button
                    onClick={() => handleStatusUpdateAndClose('rejected')}
                    variant='outline'
                    className='flex-1 border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600'
                  >
                    거부하기
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};