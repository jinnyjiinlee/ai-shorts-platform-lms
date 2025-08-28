import { ReactNode } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/features/shared/ui/Button';

interface AdminModalProps {
  show: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  onSubmit?: (e?: React.FormEvent) => void;
  submitText?: string;
  cancelText?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
  showActions?: boolean;
}

export default function AdminModal({
  show,
  title,
  children,
  onClose,
  onSubmit,
  submitText = '완료',
  cancelText = '취소',
  maxWidth = '4xl',
  showActions = true
}: AdminModalProps) {
  if (!show) return null;

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md', 
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl'
  }[maxWidth];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className={`bg-white rounded-xl shadow-xl ${maxWidthClass} w-full max-h-[90vh] overflow-y-auto`}>
        {/* 헤더 */}
        <div className='p-6 border-b border-slate-200 flex items-center justify-between'>
          <h3 className='text-xl font-semibold text-slate-900'>{title}</h3>
          <Button 
            onClick={onClose}
            variant="ghost"
            isIconOnly
            size="md"
          >
            <XMarkIcon className='w-6 h-6' />
          </Button>
        </div>

        {/* 컨텐츠 */}
        <form onSubmit={handleSubmit}>
          <div className='p-6'>
            {children}
          </div>

          {/* 액션 버튼 */}
          {showActions && (
            <div className='p-6 border-t border-slate-200 flex justify-end space-x-3'>
              <Button
                type='button'
                onClick={onClose}
                variant='outline'
              >
                {cancelText}
              </Button>
              {onSubmit && (
                <Button
                  type='submit'
                  variant='primary'
                >
                  {submitText}
                </Button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

// 단순 확인 모달을 위한 추가 컴포넌트
interface ConfirmModalProps {
  show: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export function ConfirmModal({
  show,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = '확인',
  cancelText = '취소',
  type = 'info'
}: ConfirmModalProps) {
  if (!show) return null;

  const buttonClass = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-orange-600 hover:bg-orange-700', 
    info: 'bg-blue-600 hover:bg-blue-700'
  }[type];

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-xl shadow-xl max-w-md w-full'>
        <div className='p-6'>
          <h3 className='text-lg font-semibold text-slate-900 mb-2'>{title}</h3>
          <p className='text-slate-600 mb-6'>{message}</p>
          
          <div className='flex justify-end space-x-3'>
            <button
              onClick={onCancel}
              className='px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors'
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-white rounded-lg transition-colors ${buttonClass}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}