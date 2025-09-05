import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils/buttonClassName';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  isIconOnly?: boolean;
  children?: ReactNode;
}

const variantStyles = {
  primary: 'bg-slate-600 text-white hover:bg-slate-700 focus:ring-slate-500 active:bg-slate-800',

  secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-500',

  outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-500',

  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-500',

  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:bg-red-800',

  gradient:
    'bg-gradient-to-r from-slate-500 to-slate-600 text-white hover:from-slate-600 hover:to-slate-700 shadow-lg hover:shadow-xl',
};

const sizeStyles = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-3 text-xl',
};

const iconSizeStyles = {
  xs: 'p-1',
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-3',
  xl: 'p-4',
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
    const isDisabled = disabled || isLoading;

    const iconSize = {
      xs: 14,
      sm: 16,
      md: 18,
      lg: 20,
      xl: 24,
    }[size];

    return (
      <button
        ref={ref}
        disabled={isDisabled || undefined}
        className={cn(
          'inline-flex items-center justify-center',
          'font-medium rounded-lg',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          variantStyles[variant],
          isIconOnly ? iconSizeStyles[size] : sizeStyles[size],
          fullWidth && 'w-full',
          isDisabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className={cn('animate-spin', !isIconOnly && children && 'mr-2')} size={iconSize} />
        ) : leftIcon ? (
          <span className={cn(!isIconOnly && children && 'mr-2')}>{leftIcon}</span>
        ) : null}

        {!isIconOnly && (isLoading && loadingText ? loadingText : children)}

        {!isLoading && rightIcon && <span className={cn(!isIconOnly && children && 'ml-2')}>{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
