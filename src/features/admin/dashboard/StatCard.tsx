'use client';

import { Badge } from '@/features/shared/ui/Badge';
import { Button } from '@/features/shared/ui/Button';

// 🎨 전문적 slate 기반 + accent 컬러 시스템
const cardThemes = {
  blue: {
    gradient: 'from-slate-500 to-slate-600',
    shadow: 'shadow-slate-500/15',
    hoverShadow: 'group-hover:shadow-slate-500/25',
  },
  emerald: {
    gradient: 'from-emerald-500 to-emerald-600',
    shadow: 'shadow-emerald-500/15',
    hoverShadow: 'group-hover:shadow-emerald-500/25',
  },
  violet: {
    gradient: 'from-slate-400 to-slate-500',
    shadow: 'shadow-slate-400/15',
    hoverShadow: 'group-hover:shadow-slate-400/25',
  },
  amber: {
    gradient: 'from-amber-500 to-amber-600',
    shadow: 'shadow-amber-500/15',
    hoverShadow: 'group-hover:shadow-amber-500/25',
  },
  rose: {
    gradient: 'from-red-500 to-red-600',
    shadow: 'shadow-red-400/15',
    hoverShadow: 'group-hover:shadow-red-400/25',
  },
} as const;

// 🎨 상태별 차분하고 고급스러운 색상 시스템 (재사용용)
export const statusColors = {
  excellent: 'bg-slate-100 text-slate-800',           // 80%+ (우수) - 차분한 슬레이트
  good: 'bg-blue-100 text-blue-800',                 // 60%+ (양호) - 절제된 블루
  needsImprovement: 'bg-slate-200 text-slate-600',   // 60%- (독려필요) - 부드러운 슬레이트
} as const;

// 프로그레스바용 색상
export const progressColors = {
  excellent: 'bg-slate-700',        // 80%+ 
  good: 'bg-blue-600',             // 60%+
  needsImprovement: 'bg-slate-500', // 60%-
} as const;

interface StatCardProps {
  title: string;
  value: number | string;

  icon: React.ReactNode;
  theme?: keyof typeof cardThemes; // 🎨 테마 속성 추가
  badge?: {
    text: string;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  };
  onClick?: () => void;
}

export default function StatCard({ title, value, icon, theme = 'blue', badge, onClick }: StatCardProps) {
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
        <div
          className={`w-12 h-12 bg-gradient-to-br ${selectedTheme.gradient} rounded-xl flex items-center justify-center text-white shadow-lg ${selectedTheme.shadow} group-hover:shadow-xl ${selectedTheme.hoverShadow} transition-all duration-300`}
        >
          {icon}
        </div>

        {/* 중앙: 정보 - 더 구조적으로 */}
        <div className='flex flex-col items-start flex-1'>
          <span className='text-xs font-semibold text-slate-500 group-hover:text-slate-600 transition-colors uppercase tracking-wide'>
            {title}
          </span>
          <div className='mt-1'>
            <span className='text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent leading-none'>
              {value}
            </span>
          </div>
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
