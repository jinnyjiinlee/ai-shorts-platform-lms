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
  // 한글 전용 입력 필드
  koreanOnly?: boolean;            // 한글만 입력 허용 (공백 제외)
  // 휴대폰 번호 전용 입력 필드
  phoneNumber?: boolean;           // 휴대폰 번호 자동 포맷팅 (010-1234-5678)
  // 실시간 상태 피드백
  showValidationIcon?: boolean;    // 검증 상태 아이콘 표시
  successMessage?: string;         // 성공 메시지
  warningMessage?: string;         // 경고 메시지
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
  koreanOnly = false,
  phoneNumber = false,
  showValidationIcon = false,
  successMessage,
  warningMessage,
}: InputFieldProps) {
  const baseStyles = 'w-full px-3 py-3 sm:px-4 text-base border rounded-xl transition-all focus:ring-2 focus:border-transparent touch-manipulation';
  
  /**
   * 한글만 입력 허용하는 함수
   * - 한글 자음, 모음, 완성형 한글만 허용
   * - 공백, 특수문자, 영문, 숫자 제거
   */
  const filterKoreanOnly = (text: string): string => {
    if (!koreanOnly) return text;
    // 한글만 허용 (ㄱ-ㅎ: 자음, ㅏ-ㅣ: 모음, 가-힣: 완성형 한글)
    // \u1100-\u11FF: 한글 자모 확장 영역도 포함
    return text.replace(/[^\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/g, '');
  };

  /**
   * 휴대폰 번호 포맷팅 함수
   * - 숫자만 추출하여 010-1234-5678 형태로 포맷
   * - 최대 11자까지만 허용
   */
  const formatPhoneNumber = (text: string): string => {
    if (!phoneNumber) return text;
    
    // 숫자만 추출
    const numbers = text.replace(/[^\d]/g, '');
    
    // 11자리 넘으면 자르기
    const limitedNumbers = numbers.slice(0, 11);
    
    // 포맷팅 적용
    if (limitedNumbers.length <= 3) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 7) {
      return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3)}`;
    } else {
      return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3, 7)}-${limitedNumbers.slice(7)}`;
    }
  };

  /**
   * 입력 핸들러 - 필터링 및 포맷팅 적용
   */
  const handleInputChange = (inputValue: string) => {
    let processedValue = inputValue;
    
    // 한글 필터링 적용
    if (koreanOnly) {
      processedValue = filterKoreanOnly(processedValue);
    }
    
    // 휴대폰 번호 포맷팅 적용
    if (phoneNumber) {
      processedValue = formatPhoneNumber(processedValue);
    }
    
    onChange(processedValue);
  };
  
  /**
   * 검증 상태 계산
   */
  const getValidationStatus = () => {
    if (error) return 'error';
    
    // 한글 전용 필드 검증
    if (koreanOnly && value) {
      if (value.length < 2) return 'warning';
      // 완성형 한글만 허용 (자음/모음 단독 사용 금지)
      const completeKoreanRegex = /^[가-힣]+$/;
      if (value.length >= 2 && value.length <= 6 && completeKoreanRegex.test(value)) return 'success';
      if (!completeKoreanRegex.test(value)) return 'warning';
    }
    
    // 휴대폰 번호 검증
    if (phoneNumber && value) {
      const numbersOnly = value.replace(/[^\d]/g, '');
      if (numbersOnly.length < 11) return 'warning';
      if (numbersOnly.length === 11 && numbersOnly.startsWith('010')) return 'success';
    }
    
    return 'default';
  };

  const validationStatus = getValidationStatus();
  
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
    
    // 검증 상태에 따른 스타일
    switch (validationStatus) {
      case 'success':
        return `${baseStyles} border-green-300 focus:ring-green-500`;
      case 'warning':
        return `${baseStyles} border-yellow-300 focus:ring-yellow-500`;
      case 'error':
        return `${baseStyles} border-red-300 focus:ring-red-500`;
      default:
        return `${baseStyles} border-slate-300 focus:ring-blue-500`;
    }
  };

  const getValidationIcon = () => {
    if (!showValidationIcon || (!value && !error)) return null;
    
    switch (validationStatus) {
      case 'success':
        return <span className="text-green-600 text-lg">✓</span>;
      case 'warning':
        return <span className="text-yellow-600 text-lg">⚠</span>;
      case 'error':
        return <span className="text-red-600 text-lg">✗</span>;
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    if (error) return null; // 에러 메시지가 있으면 상태 메시지는 표시하지 않음
    
    if (successMessage && validationStatus === 'success') {
      return <p className="mt-1 text-sm text-green-600">{successMessage}</p>;
    }
    
    if (warningMessage && validationStatus === 'warning') {
      return <p className="mt-1 text-sm text-yellow-600">{warningMessage}</p>;
    }
    
    // 한글 이름 필드 기본 메시지
    if (koreanOnly && value) {
      const completeKoreanRegex = /^[가-힣]+$/;
      if (validationStatus === 'warning') {
        if (value.length < 2) {
          return <p className="mt-1 text-sm text-yellow-600">이름이 너무 짧습니다. 2자 이상 입력해주세요.</p>;
        }
        if (!completeKoreanRegex.test(value)) {
          return <p className="mt-1 text-sm text-yellow-600">완성된 한글만 입력해주세요. (자음/모음 단독 입력 불가)</p>;
        }
      }
      if (validationStatus === 'success') {
        return <p className="mt-1 text-sm text-green-600">올바른 이름 형식입니다.</p>;
      }
    }
    
    // 휴대폰 번호 필드 기본 메시지
    if (phoneNumber && value) {
      const numbersOnly = value.replace(/[^\d]/g, '');
      if (validationStatus === 'warning') {
        return <p className="mt-1 text-sm text-yellow-600">휴대폰 번호 11자리를 모두 입력해주세요.</p>;
      }
      if (validationStatus === 'success') {
        return <p className="mt-1 text-sm text-green-600">올바른 휴대폰 번호 형식입니다.</p>;
      }
      if (numbersOnly.length === 11 && !numbersOnly.startsWith('010')) {
        return <p className="mt-1 text-sm text-red-600">010으로 시작하는 번호만 입력 가능합니다.</p>;
      }
    }
    
    return null;
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          maxLength={maxLength}              // HTML maxlength 속성 적용
          minLength={minLength}              // HTML minlength 속성 적용
          className={getInputStyles()}
        />
        {/* 검증 상태 아이콘 */}
        {getValidationIcon() && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {getValidationIcon()}
          </div>
        )}
      </div>
      
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
      
      {/* 검증 상태 메시지 */}
      {getStatusMessage()}
    </div>
  );
}