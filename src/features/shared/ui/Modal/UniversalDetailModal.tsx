/**
 * 범용 상세보기/수정 모달 컴포넌트
 * - 읽기/수정 모드 통합 지원
 * - 다양한 데이터 타입과 필드 구성 지원
 * - 권한 기반 액션 버튼 표시
 * - 기존 ReviewDetailModal, DiaryDetailModal을 대체
 */

'use client';

import React, { useEffect } from 'react';
import { Modal } from '@/features/shared/ui/Modal';
import { Button } from '@/features/shared/ui/Button';
import { InputField } from '@/features/shared/ui/InputField';
import { useAsyncSubmit } from '@/features/shared/hooks/useAsyncSubmit';
import { useFormState } from '@/features/shared/hooks/useFormState';

// 기본 아이템 인터페이스
export interface UniversalDetailItem {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at?: string;
  [key: string]: any; // 추가 필드들
}

// 필드 정의
export interface DetailField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'markdown';
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  placeholder?: string;
  readOnly?: boolean;
}

// 헤더 정보 렌더 함수 타입
export type HeaderRenderer = (item: UniversalDetailItem, isEditing: boolean) => React.ReactNode;

// 액션 버튼 정의
export interface DetailAction {
  label: string;
  variant: 'primary' | 'outline' | 'danger';
  onClick: () => void;
  show?: boolean;
}

export interface UniversalDetailModalProps {
  // 기본 props
  show: boolean;
  item: UniversalDetailItem | null;
  userRole: 'admin' | 'student';
  onClose: () => void;
  
  // 설정
  title: string;
  editTitle?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  
  // 필드 구성
  fields: DetailField[];
  
  // 렌더링 커스터마이징
  renderHeader?: HeaderRenderer;
  
  // 액션들
  onUpdate?: (id: string, formData: Record<string, any>) => Promise<void>;
  customActions?: DetailAction[];
  
  // 권한 제어
  canEdit?: boolean;
  canDelete?: boolean;
}

export default function UniversalDetailModal({
  show,
  item,
  userRole,
  onClose,
  title,
  editTitle,
  size = '2xl',
  fields,
  renderHeader,
  onUpdate,
  customActions = [],
  canEdit = true,
  canDelete = false,
}: UniversalDetailModalProps) {
  
  // 폼 초기 데이터 생성
  const getInitialFormData = () => {
    const initialData: Record<string, any> = {};
    fields.forEach(field => {
      initialData[field.name] = item?.[field.name] || '';
    });
    return initialData;
  };

  // 폼 상태 관리
  const {
    form: editForm,
    updateForm,
    isEditing,
    startEdit,
    cancelEdit,
  } = useFormState(getInitialFormData());

  // 아이템 변경 시 폼 데이터 업데이트
  useEffect(() => {
    if (item) {
      const formData: Record<string, any> = {};
      fields.forEach(field => {
        formData[field.name] = item[field.name] || '';
      });
      updateForm(formData);
    }
  }, [item, fields, updateForm]);

  // 수정 제출 처리
  const { submitting: updateSubmitting, submit: submitUpdate } = useAsyncSubmit(async () => {
    if (!onUpdate || !item) return;
    
    // 필수 필드 검증
    const requiredFields = fields.filter(f => f.required);
    for (const field of requiredFields) {
      const value = editForm[field.name];
      if (!value || (typeof value === 'string' && !value.trim())) {
        alert(`${field.label}을(를) 입력해주세요.`);
        return;
      }
    }
    
    // 폼 데이터 준비
    const formData: Record<string, any> = {};
    fields.forEach(field => {
      formData[field.name] = editForm[field.name];
    });
    
    await onUpdate(item.id, formData);
    cancelEdit();
  });

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 수정 모드 시작
  const handleStartEdit = () => {
    if (item) {
      const formData: Record<string, any> = {};
      fields.forEach(field => {
        formData[field.name] = item[field.name] || '';
      });
      startEdit(formData);
    }
  };

  // 수정 폼 제출
  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitUpdate();
  };

  // 필드 렌더링
  const renderField = (field: DetailField) => {
    const value = editForm[field.name];
    
    switch (field.type) {
      case 'text':
        return (
          <InputField
            key={field.name}
            label={field.label}
            value={value}
            onChange={(newValue) => updateForm({ [field.name]: newValue })}
            placeholder={field.placeholder}
            required={field.required}
            maxLength={field.maxLength}
          />
        );
        
      case 'textarea':
        return (
          <div key={field.name}>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              value={value}
              onChange={(e) => updateForm({ [field.name]: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[300px] resize-vertical"
              placeholder={field.placeholder}
              required={field.required}
              maxLength={field.maxLength}
            />
            {field.maxLength && (
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>마크다운 문법을 사용하실 수 있습니다</span>
                <span>{value?.length || 0}/{field.maxLength}자</span>
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  // 아이템이 없으면 렌더링하지 않음
  if (!item) return null;

  return (
    <Modal 
      show={show} 
      title={isEditing ? (editTitle || `${title} 수정`) : title} 
      onClose={onClose} 
      size={size}
    >
      <div className="space-y-6">
        {/* 헤더 정보 */}
        {renderHeader && !isEditing && (
          <div className="border-b border-slate-200 pb-4">
            {renderHeader(item, isEditing)}
          </div>
        )}

        {/* 메인 콘텐츠 */}
        {isEditing ? (
          // 수정 모드
          <form onSubmit={handleUpdateSubmit}>
            <div className="space-y-6">
              {fields.map(renderField)}
              
              {/* 수정 모드 버튼들 */}
              <div className="flex justify-end space-x-3">
                <Button 
                  type="button" 
                  onClick={cancelEdit} 
                  variant="outline" 
                  disabled={updateSubmitting}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={updateSubmitting}
                  isLoading={updateSubmitting}
                >
                  {updateSubmitting ? '저장 중...' : '저장'}
                </Button>
              </div>
            </div>
          </form>
        ) : (
          // 읽기 모드
          <>
            {/* 제목 */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h2>
            </div>

            {/* 내용 */}
            <div className="prose max-w-none">
              <div className="bg-slate-50 rounded-lg p-6">
                <div className="text-slate-800 whitespace-pre-line leading-relaxed">
                  {item.content}
                </div>
              </div>
            </div>

            {/* 작성/수정 일시 */}
            <div className="text-sm text-slate-500 pt-4 border-t border-slate-200">
              <div>작성일: {formatDate(item.created_at)}</div>
              {item.updated_at && item.updated_at !== item.created_at && (
                <div>수정일: {formatDate(item.updated_at)}</div>
              )}
            </div>

            {/* 액션 버튼들 */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <div className="flex space-x-2">
                {/* 수정 버튼 */}
                {canEdit && onUpdate && (
                  <Button variant="outline" onClick={handleStartEdit}>
                    수정
                  </Button>
                )}
                
                {/* 커스텀 액션 버튼들 */}
                {customActions.map((action, index) => (
                  action.show !== false && (
                    <Button
                      key={index}
                      variant={action.variant}
                      onClick={action.onClick}
                    >
                      {action.label}
                    </Button>
                  )
                ))}
              </div>
              
              <div>
                <Button onClick={onClose} variant="primary">
                  닫기
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}