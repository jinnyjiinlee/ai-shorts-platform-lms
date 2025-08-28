'use client';

import { Badge } from '@/features/shared/ui/Badge';
import { Button } from '@/features/shared/ui/Button';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  badge?: {
    text: string;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  };
}

export default function StatCard({ title, value, subtitle, icon, badge }: StatCardProps) {
  return (
    <Button
      variant='ghost'
      className='group w-full justify-start h-auto p-4 bg-gradient-to-r from-slate-50/50 to-white hover:from-slate-100/50 hover:to-slate-50 border border-slate-100 hover:border-slate-200 rounded-2xl transition-all duration-300 hover:shadow-md hover:shadow-slate-200/20'
    >
      <div className='flex items-center gap-4 w-full'>
        {/* 왼쪽: 아이콘 - 더 세련되게 */}
        <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:shadow-xl group-hover:shadow-blue-500/30 transition-all duration-300'>
          {icon}
        </div>

        {/* 중앙: 정보 - 더 구조적으로 */}
        <div className='flex flex-col items-start flex-1'>
          <div className='flex items-baseline gap-2'>
            <span className='text-sm font-medium text-slate-600 group-hover:text-slate-700 transition-colors'>
              {title}
            </span>
            <span className='text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent'>
              {value}
            </span>
          </div>
          {subtitle && (
            <span className='text-xs text-slate-500 group-hover:text-slate-600 transition-colors mt-0.5'>
              {subtitle}
            </span>
          )}
        </div>

        {/* 오른쪽: 배지 + 화살표 */}
        <div className='flex items-center gap-2'>
          {badge && (
            <Badge variant={badge.variant || 'default'} size='sm'>
              {badge.text}
            </Badge>
          )}
          <div className='w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all duration-200'>
            <svg viewBox='0 0 20 20' fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                clipRule='evenodd'
              />
            </svg>
          </div>
        </div>
      </div>
    </Button>
  );
}
