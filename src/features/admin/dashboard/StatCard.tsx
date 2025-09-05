'use client';

import { Badge } from '@/features/shared/ui/Badge';
import { Button } from '@/features/shared/ui/Button';

// 🎨 세련된 테마 색상 시스템 (눈에 편한 톤다운 버전)
const cardThemes = {
  blue: {
    gradient: 'from-slate-600 to-slate-700',
    shadow: 'shadow-slate-500/15',
    hoverShadow: 'group-hover:shadow-slate-500/25'
  },
  emerald: {
    gradient: 'from-emerald-600 to-emerald-700', 
    shadow: 'shadow-emerald-500/15',
    hoverShadow: 'group-hover:shadow-emerald-500/25'
  },
  violet: {
    gradient: 'from-indigo-600 to-indigo-700',
    shadow: 'shadow-indigo-500/15', 
    hoverShadow: 'group-hover:shadow-indigo-500/25'
  },
  amber: {
    gradient: 'from-amber-600 to-amber-700',
    shadow: 'shadow-amber-500/15',
    hoverShadow: 'group-hover:shadow-amber-500/25'
  },
  rose: {
    gradient: 'from-slate-500 to-slate-600',
    shadow: 'shadow-slate-400/15',
    hoverShadow: 'group-hover:shadow-slate-400/25'
  }
} as const;

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  theme?: keyof typeof cardThemes; // 🎨 테마 속성 추가
  badge?: {
    text: string;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  };
  onClick?: () => void;
}

export default function StatCard({ title, value, subtitle, icon, theme = 'blue', badge, onClick }: StatCardProps) {
  // 🎨 선택된 테마 가져오기
  const selectedTheme = cardThemes[theme];

  return (
    <Button
      variant='ghost'
      onClick={onClick}
      className='group w-full justify-start h-auto p-4 bg-gradient-to-r from-slate-50/50 to-white hover:from-slate-100/50 hover:to-slate-50 border border-slate-100 hover:border-slate-200 rounded-2xl transition-all duration-300 hover:shadow-md hover:shadow-slate-200/20'
    >
      <div className='flex items-center gap-4 w-full'>
        {/* 🎨 동적 테마가 적용된 아이콘 */}
        <div className={`w-12 h-12 bg-gradient-to-br ${selectedTheme.gradient} rounded-xl flex items-center justify-center text-white shadow-lg ${selectedTheme.shadow} group-hover:shadow-xl ${selectedTheme.hoverShadow} transition-all duration-300`}>
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
