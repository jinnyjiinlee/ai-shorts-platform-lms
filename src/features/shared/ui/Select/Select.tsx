'use client';

import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  required?: boolean;
}

export default function Select({
  value,
  onChange,
  options,
  placeholder = '선택하세요',
  disabled = false,
  className = '',
  label,
  required = false,
}: SelectProps) {
  // className이 전달되면 기본 스타일을 사용하지 않고, 전달된 스타일만 사용
  const hasCustomClassName = className.includes('border') || className.includes('bg-') || className.includes('px-') || className.includes('py-');
  
  const baseStyles = hasCustomClassName 
    ? 'w-full transition-all' 
    : 'w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all';

  const getSelectStyles = () => {
    if (disabled) {
      return hasCustomClassName 
        ? `${baseStyles} cursor-not-allowed opacity-60`
        : `${baseStyles} bg-slate-50 text-slate-500 cursor-not-allowed`;
    }
    return baseStyles;
  };

  return (
    <div className={hasCustomClassName ? '' : className}>
      {label && (
        <label className='block text-sm font-medium text-slate-700 mb-2'>
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={hasCustomClassName ? `${getSelectStyles()} ${className}` : getSelectStyles()}
        required={required}
      >
        <option value=''>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}