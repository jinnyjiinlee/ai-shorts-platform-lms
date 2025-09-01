'use client';

export interface DifficultyBadgeProps {
  /** 난이도 레벨 */
  difficulty: 'easy' | 'medium' | 'hard';
  /** 배지 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 배지 스타일 */
  variant?: 'gradient' | 'solid' | 'outline';
  /** 텍스트 형식 */
  format?: 'korean' | 'english' | 'icon';
  /** 클릭 이벤트 */
  onClick?: () => void;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 호버 효과 활성화 */
  interactive?: boolean;
}

export default function DifficultyBadge({
  difficulty = 'medium', // 기본값 추가
  size = 'md',
  variant = 'gradient',
  format = 'korean',
  onClick,
  className = '',
  interactive = true,
}: DifficultyBadgeProps) {
  // 크기별 스타일
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  // 난이도별 설정
  const difficultyConfig = {
    easy: {
      gradient: 'bg-gradient-to-r from-emerald-400 to-green-500',
      solid: 'bg-green-500',
      outline: 'border-green-500 text-green-600',
      korean: '쉬움',
      english: 'Easy',
      icon: '🟢',
    },
    medium: {
      gradient: 'bg-gradient-to-r from-amber-400 to-orange-500',
      solid: 'bg-orange-500',
      outline: 'border-orange-500 text-orange-600',
      korean: '보통',
      english: 'Medium',
      icon: '🟡',
    },
    hard: {
      gradient: 'bg-gradient-to-r from-red-400 to-pink-500',
      solid: 'bg-red-500',
      outline: 'border-red-500 text-red-600',
      korean: '어려움',
      english: 'Hard',
      icon: '🔴',
    },
  };

  const config = difficultyConfig[difficulty] || difficultyConfig.medium; // fallback to medium

  // 배경 스타일 결정
  const getBackgroundStyle = () => {
    if (!config) return 'bg-gray-500 text-white'; // safety fallback
    
    if (variant === 'outline') {
      return `border-2 bg-transparent ${config.outline || 'border-gray-500 text-gray-600'}`;
    }
    if (variant === 'solid') {
      return `${config.solid || 'bg-gray-500'} text-white`;
    }
    return `${config.gradient || 'bg-gray-500'} text-white`;
  };

  // 텍스트 포맷
  const getDisplayText = () => {
    if (!config) return difficulty || 'medium'; // safety fallback
    
    if (format === 'icon') {
      return config.icon;
    }
    return format === 'english' ? config.english : config.korean;
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