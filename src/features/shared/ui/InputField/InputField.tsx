'use client';

import React from 'react';

export interface InputFieldProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  // 길이 제한 관련 props
  maxLength?: number;              // 최대 글자수 제한
  minLength?: number;              // 최소 글자수 제한
  showCharacterCount?: boolean;    // 글자수 표시 여부
}

export default function InputField({
  label,
  value,
  onChange = () => {},
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  error,
  className = '',
  maxLength,
  minLength,
  showCharacterCount = false,
}: InputFieldProps) {
  const baseStyles = 'w-full px-4 py-3 border rounded-xl transition-all focus:ring-2 focus:border-transparent';
  
  /**
   * 글자수 초과 여부 확인
   * - maxLength가 설정되어 있고 현재 값의 길이가 초과하면 true
   */
  const isOverLength = maxLength && value.length > maxLength;
  
  const getInputStyles = () => {
    if (error || isOverLength) {
      return `${baseStyles} border-red-300 focus:ring-red-500`;
    }
    if (disabled) {
      return `${baseStyles} border-slate-300 bg-slate-50 text-slate-500 cursor-not-allowed`;
    }
    return `${baseStyles} border-slate-300 focus:ring-blue-500`;
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        maxLength={maxLength}              // HTML maxlength 속성 적용
        minLength={minLength}              // HTML minlength 속성 적용
        className={getInputStyles()}
      />
      
      {/* 글자수 카운터 표시 */}
      {showCharacterCount && maxLength && (
        <div className="flex justify-end mt-1">
          <span className={`text-xs ${isOverLength ? 'text-red-600' : 'text-slate-500'}`}>
            {value.length}/{maxLength}자
          </span>
        </div>
      )}
      
      {/* 에러 메시지 */}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      
      {/* 글자수 초과 경고 메시지 */}
      {isOverLength && !error && (
        <p className="mt-2 text-sm text-red-600">
          최대 {maxLength}자까지 입력 가능합니다.
        </p>
      )}
    </div>
  );
}