// src/features/shared/ui/Button/Button.tsx
  import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
  import { Loader2 } from 'lucide-react';
  import { cn } from '@/lib/utils/buttonClassName'; // className 합치는 유틸리티

  export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    // 버튼 스타일 변형
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';

    // 버튼 크기
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

    // 로딩 상태
    isLoading?: boolean;
    loadingText?: string;

    // 아이콘
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;

    // 전체 너비
    fullWidth?: boolean;

    // 아이콘만 있는 버튼
    isIconOnly?: boolean;

    children?: ReactNode;
  }

  // 각 variant별 스타일 정의
  const variantStyles = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 active:bg-blue-800',

    secondary:
      'bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-500',

    outline:
      'border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-500',

    ghost:
      'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-500',

    danger:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:bg-red-800',

    gradient:
      'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 
  hover:to-indigo-700 shadow-lg hover:shadow-xl'
  };

  // 각 size별 스타일 정의
  const sizeStyles = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-3 text-xl'
  };

  // 아이콘 전용 버튼 사이즈
  const iconSizeStyles = {
    xs: 'p-1',
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
    xl: 'p-4'
  };

  const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
      {
        variant = 'primary',
        size = 'md',
        isLoading = false,
        loadingText = '처리중...',
        leftIcon,
        rightIcon,
        fullWidth = false,
        isIconOnly = false,
        className,
        disabled,
        children,
        ...props
      },
      ref
    ) => {
      // 로딩 중이거나 disabled일 때 클릭 방지
      const isDisabled = disabled || isLoading;

      // 아이콘 크기 결정
      const iconSize = {
        xs: 14,
        sm: 16,
        md: 18,
        lg: 20,
        xl: 24
      }[size];

      return (
        <button
          ref={ref}
          disabled={isDisabled}
          className={cn(
            // 기본 스타일
            'inline-flex items-center justify-center',
            'font-medium rounded-lg',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            
            // Variant 스타일
            variantStyles[variant],
            
            // Size 스타일
            isIconOnly ? iconSizeStyles[size] : sizeStyles[size],
            
            // 전체 너비
            fullWidth && 'w-full',
            
            // Disabled 스타일
            isDisabled && 'opacity-50 cursor-not-allowed',
            
            // 사용자 정의 className
            className
          )}
          {...props}
        >
          {/* 로딩 스피너 또는 왼쪽 아이콘 */}
          {isLoading ? (
            <Loader2 
              className={cn(
                'animate-spin',
                !isIconOnly && children && 'mr-2'
              )}
              size={iconSize}
            />
          ) : leftIcon ? (
            <span className={cn(!isIconOnly && children && 'mr-2')}>
              {leftIcon}
            </span>
          ) : null}

          {/* 버튼 텍스트 */}
          {!isIconOnly && (
            isLoading && loadingText ? loadingText : children
          )}

          {/* 오른쪽 아이콘 */}
          {!isLoading && rightIcon && (
            <span className={cn(!isIconOnly && children && 'ml-2')}>
              {rightIcon}
            </span>
          )}
        </button>
      );
    }
  );

  Button.displayName = 'Button';

  export default Button;