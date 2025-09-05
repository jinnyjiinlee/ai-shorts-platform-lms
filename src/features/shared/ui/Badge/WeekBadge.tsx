'use client';

import { ReactNode } from 'react';

export interface WeekBadgeProps {
  /** 주차 번호 */
  week: number;
  /** 배지 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 배지 스타일 */
  variant?: 'gradient' | 'solid' | 'outline';
  /** 배지 색상 테마 */
  theme?: 'indigo-purple' | 'blue-cyan' | 'emerald-teal' | 'orange-red' | 'slate';
  /** 텍스트 형식 */
  format?: 'W' | '주차' | 'week';
  /** 클릭 이벤트 */
  onClick?: () => void;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 호버 효과 활성화 */
  interactive?: boolean;
}

export default function WeekBadge({
  week,
  size = 'md',
  variant = 'gradient',
  theme = 'slate',
  format = 'W',
  onClick,
  className = '',
  interactive = true,
}: WeekBadgeProps) {
  // 크기별 스타일
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  // 테마별 색상
  const themeStyles = {
    'indigo-purple': {
      gradient: 'bg-gradient-to-r from-indigo-500 to-purple-600',
      solid: 'bg-indigo-600',
      outline: 'border-indigo-500 text-indigo-600',
    },
    'blue-cyan': {
      gradient: 'bg-gradient-to-r from-blue-500 to-cyan-600',
      solid: 'bg-blue-600',
      outline: 'border-blue-500 text-blue-600',
    },
    'emerald-teal': {
      gradient: 'bg-gradient-to-r from-emerald-500 to-teal-600',
      solid: 'bg-emerald-600',
      outline: 'border-emerald-500 text-emerald-600',
    },
    'orange-red': {
      gradient: 'bg-gradient-to-r from-orange-500 to-red-600',
      solid: 'bg-orange-600',
      outline: 'border-orange-500 text-orange-600',
    },
    'slate': {
      gradient: 'bg-gradient-to-r from-slate-500 to-slate-600',
      solid: 'bg-slate-600',
      outline: 'border-slate-500 text-slate-600',
    },
  };

  // 배경 스타일 결정
  const getBackgroundStyle = () => {
    if (variant === 'outline') {
      return `border-2 bg-transparent ${themeStyles[theme].outline}`;
    }
    if (variant === 'solid') {
      return `${themeStyles[theme].solid} text-white`;
    }
    return `${themeStyles[theme].gradient} text-white`;
  };

  // 텍스트 포맷
  const getDisplayText = () => {
    switch (format) {
      case '주차':
        return `${week}주차`;
      case 'week':
        return `Week ${week}`;
      case 'W':
      default:
        return `${week}W`;
    }
  };

  // 기본 클래스
  const baseClasses = [
    'inline-flex items-center justify-center',
    'font-bold rounded-lg',
    sizeStyles[size],
    getBackgroundStyle(),
  ];

  // 인터랙티브 효과
  if (interactive) {
    baseClasses.push(
      'shadow-md hover:shadow-lg',
      'transform hover:scale-105',
      'transition-all duration-200'
    );
  }

  // 클릭 가능한 경우
  if (onClick) {
    baseClasses.push('cursor-pointer');
  }

  return (
    <span
      className={`${baseClasses.join(' ')} ${className}`}
      onClick={onClick}
    >
      {getDisplayText()}
    </span>
  );
}