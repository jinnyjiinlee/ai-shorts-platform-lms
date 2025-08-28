'use client';

import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  selectable?: boolean; // 선택 가능한 배지
  selected?: boolean; // 현재 선택 상태
  onClick?: () => void; // 클릭 핸들러
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  selectable = false,
  selected = false,
  onClick,
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-slate-100 text-slate-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded ${variantStyles[variant]} 
  ${sizeStyles[size]} ${selectable ? 'cursor-pointer hover:opacity-80 transition-all' : ''} ${
        selected ? 'ring-2 ring-blue-500' : ''
      } ${className}`}
      onClick={selectable ? onClick : undefined}
    >
      {children}
    </span>
  );
}
