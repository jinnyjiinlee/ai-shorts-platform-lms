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
}: InputFieldProps) {
  const baseStyles = 'w-full px-4 py-3 border rounded-xl transition-all focus:ring-2 focus:border-transparent';
  
  const getInputStyles = () => {
    if (error) {
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
        className={getInputStyles()}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}