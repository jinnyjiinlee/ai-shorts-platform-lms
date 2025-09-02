/**
 * 범용 생성 모달 컴포넌트
 * - 다양한 필드 타입을 지원하는 동적 폼 생성
 * - 기존 모든 작성 모달들을 대체 가능
 * - 확장성과 재사용성을 고려한 설계
 */

'use client';

import React, { useState } from 'react';
import { Modal } from '@/features/shared/ui/Modal';
import { Button } from '@/features/shared/ui/Button';
import { InputField } from '@/features/shared/ui/InputField';
import MarkdownEditor from '@/features/shared/ui/MarkdownEditor';
import { useAsyncSubmit } from '@/features/shared/hooks/useAsyncSubmit';
import { 
  UniversalCreateModalProps, 
  FormField, 
  FieldType 
} from '@/types/ui/universalModal';

/**
 * UniversalCreateModal 메인 컴포넌트
 */
export default function UniversalCreateModal({
  show,
  title,
  onClose,
  onSubmit,
  fields,
  submitText = '작성',
  size = '2xl',
  description,
}: UniversalCreateModalProps) {
  
  /**
   * 폼 데이터 상태 관리
   * - 필드들의 기본값으로 초기화
   */
  const initialFormData = fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue ?? '';
    return acc;
  }, {} as Record<string, any>);
  
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * 폼 데이터 업데이트 함수
   */
  const updateFormData = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // 해당 필드의 에러 제거
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  /**
   * 폼 검증 함수
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      const value = formData[field.name];
      
      // 필수 필드 검증
      if (field.required && (!value || (typeof value === 'string' && !value.trim()))) {
        newErrors[field.name] = `${field.label}은(는) 필수 입력 항목입니다.`;
        return;
      }
      
      // 글자수 검증
      if (field.maxLength && typeof value === 'string' && value.length > field.maxLength) {
        newErrors[field.name] = `${field.label}은(는) 최대 ${field.maxLength}자까지 입력 가능합니다.`;
        return;
      }
      
      if (field.minLength && typeof value === 'string' && value.length < field.minLength) {
        newErrors[field.name] = `${field.label}은(는) 최소 ${field.minLength}자 이상 입력해야 합니다.`;
        return;
      }
      
      // 커스텀 검증
      if (field.validation) {
        const validationError = field.validation(value);
        if (validationError) {
          newErrors[field.name] = validationError;
          return;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 비동기 제출 처리
   */
  const { submitting, submit } = useAsyncSubmit(async () => {
    if (!validateForm()) {
      return;
    }
    
    await onSubmit(formData);
    
    // 성공 시 폼 초기화
    setFormData(initialFormData);
    setErrors({});
    onClose();
  });

  /**
   * 모달 닫기 및 초기화
   */
  const handleClose = () => {
    setFormData(initialFormData);
    setErrors({});
    onClose();
  };

  /**
   * 폼 제출 핸들러
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  /**
   * 필드별 렌더링 함수
   */
  const renderField = (field: FormField) => {
    const value = formData[field.name];
    const error = errors[field.name];
    
    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <InputField
            key={field.name}
            label={field.label}
            type={field.type}
            value={value}
            onChange={(newValue) => updateFormData(field.name, newValue)}
            placeholder={field.placeholder}
            required={field.required}
            maxLength={field.maxLength}
            minLength={field.minLength}
            showCharacterCount={field.showCharacterCount}
            error={error}
            className={field.className}
          />
        );

      case 'textarea':
        return (
          <div key={field.name} className={field.className}>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              value={value}
              onChange={(e) => updateFormData(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              maxLength={field.maxLength}
              minLength={field.minLength}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[120px] resize-vertical ${
                error ? 'border-red-300' : 'border-slate-300'
              }`}
            />
            
            {/* 글자수 카운터 */}
            {field.showCharacterCount && field.maxLength && (
              <div className="flex justify-end mt-1">
                <span className={`text-xs ${
                  value.length > field.maxLength ? 'text-red-600' : 'text-slate-500'
                }`}>
                  {value.length}/{field.maxLength}자
                </span>
              </div>
            )}
            
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>
        );

      case 'markdown':
        return (
          <div key={field.name} className={field.className}>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <MarkdownEditor
              value={value}
              onChange={(newValue) => updateFormData(field.name, newValue)}
              placeholder={field.placeholder}
              className="min-h-[200px]"
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className={field.className}>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              value={value}
              onChange={(e) => updateFormData(field.name, e.target.value)}
              required={field.required}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                error ? 'border-red-300' : 'border-slate-300'
              }`}
            >
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.name} className={`flex items-center space-x-3 ${field.className}`}>
            <input
              type="checkbox"
              id={field.name}
              checked={value}
              onChange={(e) => updateFormData(field.name, e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor={field.name} className="text-sm font-medium text-slate-700">
              {field.label}
            </label>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>
        );

      case 'date':
      case 'datetime-local':
        return (
          <div key={field.name} className={field.className}>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type={field.type}
              value={value}
              onChange={(e) => updateFormData(field.name, e.target.value)}
              required={field.required}
              min={field.type === 'datetime-local' ? new Date().toISOString().slice(0, 16) : undefined}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                error ? 'border-red-300' : 'border-slate-300'
              }`}
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal 
      show={show} 
      title={title} 
      onClose={handleClose} 
      size={size}
    >
      {description && (
        <div className="mb-6">
          <p className="text-slate-600">{description}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {fields.map(renderField)}
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-slate-200">
          <Button 
            type="button" 
            onClick={handleClose} 
            variant="outline"
            disabled={submitting}
          >
            취소
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            disabled={submitting}
            isLoading={submitting}
          >
            {submitting ? '처리중...' : submitText}
          </Button>
        </div>
      </form>
    </Modal>
  );
}