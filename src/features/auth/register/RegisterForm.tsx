'use client';

import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface RegisterFormData {
  userId: string;
  nickname: string;
  password: string;
  confirmPassword: string;
  name: string;
  email: string;
  cohort: number;
}

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void;
  isLoading: boolean;
}

export default function RegisterForm({ onSubmit, isLoading }: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterFormData>({
    userId: '',
    nickname: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    cohort: 1,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 유효성 검사 함수들
  const isUserIdValid = (userId: string) => {
    return /^[a-zA-Z0-9]{4,20}$/.test(userId);
  };

  const isPasswordMatch = () => {
    return formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof RegisterFormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* 아이디 */}
      <div>
        <label className='block text-sm font-medium text-slate-700 mb-2'>
          아이디 <span className='text-red-500'>*</span>
        </label>
        <input
          type='text'
          value={formData.userId}
          onChange={(e) => handleInputChange('userId', e.target.value)}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all hover:border-indigo-400 ${
            formData.userId.length > 0
              ? isUserIdValid(formData.userId)
                ? 'border-green-300 focus:ring-green-500'
                : 'border-red-300 focus:ring-red-500'
              : 'border-slate-300 focus:ring-indigo-500'
          }`}
          placeholder='영문, 숫자 4-20자 (특수문자 불가)'
          required
        />
        {formData.userId.length > 0 && (
          <p className={`mt-1 text-xs ${isUserIdValid(formData.userId) ? 'text-green-600' : 'text-red-500'}`}>
            {isUserIdValid(formData.userId)
              ? '✓ 사용 가능한 아이디입니다'
              : '영문자와 숫자만 사용, 4-20자 이내로 입력해주세요'}
          </p>
        )}
        {formData.userId.length === 0 && (
          <p className='mt-1 text-xs text-slate-500'>영문자와 숫자만 사용, 4-20자 이내로 입력해주세요</p>
        )}
      </div>

      {/* 닉네임 */}
      <div>
        <label className='block text-sm font-medium text-slate-700 mb-2'>
          닉네임 <span className='text-red-500'>*</span>
        </label>
        <input
          type='text'
          value={formData.nickname}
          onChange={(e) => handleInputChange('nickname', e.target.value)}
          className='w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:border-indigo-400'
          placeholder='사용할 닉네임을 입력하세요'
          required
        />
      </div>

      {/* 실명 */}
      <div>
        <label className='block text-sm font-medium text-slate-700 mb-2'>
          실명 <span className='text-red-500'>*</span>
        </label>
        <input
          type='text'
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className='w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:border-indigo-400'
          placeholder='실명을 입력하세요'
          required
        />
      </div>

      {/* 이메일 */}
      <div>
        <label className='block text-sm font-medium text-slate-700 mb-2'>
          이메일 <span className='text-red-500'>*</span>
        </label>
        <input
          type='email'
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className='w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:border-indigo-400'
          placeholder='이메일 주소를 입력하세요'
          required
        />
      </div>

      {/* 비밀번호 */}
      <div>
        <label className='block text-sm font-medium text-slate-700 mb-2'>
          비밀번호 <span className='text-red-500'>*</span>
        </label>
        <div className='relative'>
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className='w-full px-4 py-3 pr-12 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:border-indigo-400'
            placeholder='8자 이상의 비밀번호를 입력하세요'
            required
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600'
          >
            {showPassword ? <EyeSlashIcon className='w-5 h-5' /> : <EyeIcon className='w-5 h-5' />}
          </button>
        </div>
      </div>

      {/* 비밀번호 확인 */}
      <div>
        <label className='block text-sm font-medium text-slate-700 mb-2'>
          비밀번호 확인 <span className='text-red-500'>*</span>
        </label>
        <div className='relative'>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all hover:border-indigo-400 ${
              formData.confirmPassword.length > 0
                ? isPasswordMatch()
                  ? 'border-green-300 focus:ring-green-500'
                  : 'border-red-300 focus:ring-red-500'
                : 'border-slate-300 focus:ring-indigo-500'
            }`}
            placeholder='비밀번호를 다시 입력하세요'
            required
          />
          <button
            type='button'
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className='absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600'
          >
            {showConfirmPassword ? <EyeSlashIcon className='w-5 h-5' /> : <EyeIcon className='w-5 h-5' />}
          </button>
        </div>
        {formData.confirmPassword.length > 0 && (
          <p className={`mt-1 text-xs ${isPasswordMatch() ? 'text-green-600' : 'text-red-500'}`}>
            {isPasswordMatch() ? '✓ 비밀번호가 일치합니다' : '비밀번호가 일치하지 않습니다'}
          </p>
        )}
      </div>

      {/* 기수 선택 */}
      <div>
        <label className='block text-sm font-medium text-slate-700 mb-2'>
          신청 기수 <span className='text-red-500'>*</span>
        </label>
        <select
          value={formData.cohort}
          onChange={(e) => handleInputChange('cohort', parseInt(e.target.value))}
          className='w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:border-indigo-400'
        >
          <option value={1}>1기</option>
          <option value={2}>2기</option>
          <option value={3}>3기</option>
        </select>
      </div>

      {/* 제출 버튼 */}
      <button
        type='submit'
        disabled={isLoading}
        className='w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg hover:shadow-xl'
      >
        {isLoading ? '처리 중...' : '회원가입 신청'}
      </button>
    </form>
  );
}
