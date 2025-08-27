import { ReactNode } from 'react';
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon, 
  CalendarIcon, 
  UserIcon 
} from '@heroicons/react/24/outline';

interface AdminContentCardProps {
  title: string;
  content: string;
  cohort: string | number | 'all';
  author: string;
  createdAt: string;
  badges?: ReactNode[];
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  extraActions?: ReactNode[];
}

export default function AdminContentCard({
  title,
  content,
  cohort,
  author,
  createdAt,
  badges = [],
  onView,
  onEdit,
  onDelete,
  extraActions = []
}: AdminContentCardProps) {
  return (
    <div className='p-6 hover:bg-slate-50 transition-colors'>
      <div className='flex items-start justify-between'>
        <div className='flex-1'>
          <div className='flex items-center space-x-3 mb-2'>
            <h3 className='text-lg font-semibold text-slate-900'>{title}</h3>
            
            {/* 배지들 (고정, 발행상태 등) */}
            {badges.map((badge, index) => (
              <span key={index}>{badge}</span>
            ))}
            
            {/* 기수 배지 */}
            <span className='px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs'>
              {cohort === 'all' ? '전체' : `${cohort}기`}
            </span>
          </div>

          <p className='text-slate-600 mb-3 line-clamp-2'>{content}</p>

          <div className='flex items-center space-x-6 text-sm text-slate-500'>
            <div className='flex items-center space-x-1'>
              <UserIcon className='w-4 h-4' />
              <span>{author}</span>
            </div>
            <div className='flex items-center space-x-1'>
              <CalendarIcon className='w-4 h-4' />
              <span>{createdAt}</span>
            </div>
          </div>
        </div>

        <div className='flex items-center space-x-2'>
          {/* 상세보기 */}
          <button
            onClick={onView}
            className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
            title='상세보기'
          >
            <EyeIcon className='w-5 h-5' />
          </button>

          {/* 수정 */}
          <button
            onClick={onEdit}
            className='p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors'
            title='수정'
          >
            <PencilIcon className='w-5 h-5' />
          </button>

          {/* 추가 액션들 (고정, 발행상태 등) */}
          {extraActions.map((action, index) => (
            <span key={index}>{action}</span>
          ))}

          {/* 삭제 */}
          <button
            onClick={onDelete}
            className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
            title='삭제'
          >
            <TrashIcon className='w-5 h-5' />
          </button>
        </div>
      </div>
    </div>
  );
}