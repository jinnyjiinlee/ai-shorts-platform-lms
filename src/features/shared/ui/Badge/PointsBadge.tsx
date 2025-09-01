'use client';

export interface PointsBadgeProps {
  /** 포인트 수 */
  points: number;
  /** 배지 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 배지 스타일 */
  variant?: 'gradient' | 'solid' | 'outline';
  /** 색상 테마 */
  theme?: 'violet-purple' | 'blue-indigo' | 'emerald-teal' | 'gold';
  /** 텍스트 형식 */
  format?: 'points' | '점' | 'pt';
  /** 클릭 이벤트 */
  onClick?: () => void;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 호버 효과 활성화 */
  interactive?: boolean;
}

export default function PointsBadge({
  points,
  size = 'md',
  variant = 'gradient',
  theme = 'violet-purple',
  format = '점',
  onClick,
  className = '',
  interactive = true,
}: PointsBadgeProps) {
  // 크기별 스타일
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  // 테마별 색상
  const themeStyles = {
    'violet-purple': {
      gradient: 'bg-gradient-to-r from-violet-500 to-purple-600',
      solid: 'bg-purple-600',
      outline: 'border-purple-500 text-purple-600',
    },
    'blue-indigo': {
      gradient: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      solid: 'bg-indigo-600',
      outline: 'border-indigo-500 text-indigo-600',
    },
    'emerald-teal': {
      gradient: 'bg-gradient-to-r from-emerald-500 to-teal-600',
      solid: 'bg-teal-600',
      outline: 'border-teal-500 text-teal-600',
    },
    'gold': {
      gradient: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      solid: 'bg-yellow-500',
      outline: 'border-yellow-500 text-yellow-600',
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
      case 'points':
        return `${points} points`;
      case 'pt':
        return `${points}pt`;
      case '점':
      default:
        return `${points}점`;
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