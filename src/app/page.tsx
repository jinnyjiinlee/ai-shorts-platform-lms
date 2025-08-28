'use client';

import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { InputField } from '@/features/shared/ui/InputField';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { supabase } from '@/lib/supabase/client';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const { isLoading, rememberMe, setRememberMe, handleLogin } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(formData);
  };

  async function signInWithKakao() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        console.error('카카오 로그인 에러:', error);
        alert(`로그인 실패: ${error.message}`);
      }
    } catch (err) {
      console.error('예상치 못한 에러:', err);
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden'>
      {/* 배경 장식 요소 */}
      <div className='absolute inset-0'>
        <div className='absolute top-10 left-10 w-20 h-20 bg-blue-200/30 rounded-full animate-bounce'></div>
        <div className='absolute top-32 right-20 w-16 h-16 bg-purple-200/30 rounded-full animate-pulse'></div>
        <div className='absolute bottom-20 left-32 w-12 h-12 bg-indigo-200/30 rounded-full animate-bounce delay-300'></div>
        <div className='absolute bottom-32 right-16 w-24 h-24 bg-blue-100/30 rounded-full animate-pulse delay-500'></div>
      </div>

      <div className='max-w-md w-full space-y-6 sm:space-y-8 relative z-10'>
        <div className='text-center'>
          {/* YouTube Shorts Logo */}
          <div className='mx-auto h-16 w-16 sm:h-20 sm:w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-2xl hover:scale-105 transition-transform duration-300'>
            <svg className='w-8 h-8 sm:w-10 sm:h-10 text-white' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z' />
            </svg>
          </div>
          <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3 sm:mb-4'>
            하대표의 숏폼 수익화 부스트
          </h1>
          <p className='text-base sm:text-lg text-slate-700 font-medium mb-1 sm:mb-2'>함께 이뤄가는 성공 스토리</p>
          <p className='text-sm sm:text-base text-slate-500'>전문가의 노하우로 새로운 세상을 열어보세요</p>
        </div>

        {/* TO-DO: Refactor 삭제 */}

        <div className='bg-white/80 backdrop-blur-sm py-6 px-6 sm:py-8 sm:px-8 shadow-2xl rounded-2xl border border-white/20 hover:shadow-3xl transition-all duration-300'>
          <div className='space-y-6'>
            {/* 카카오 로그인 버튼 */}
            <button
              type='button'
              onClick={signInWithKakao}
              className='w-full rounded-xl bg-[#FEE500] hover:bg-[#FDD835] px-4 py-4 font-medium text-[#000000D9] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl'
            >
              <svg className='w-5 h-5' viewBox='0 0 24 24' fill='currentColor'>
                <path d='M12 3c5.514 0 10 3.592 10 8.007 0 4.917-5.145 7.961-9.91 7.961-1.937 0-3.383-.397-4.394-.644-.36.293-.722.586-1.084.879-1.163.94-2.318 1.797-3.612 1.797a.5.5 0 0 1-.5-.5c0-.426.263-1.136.611-1.823.258-.508.545-1.015.818-1.498C2.178 15.31 2 13.21 2 11.007 2 6.592 6.486 3 12 3zm0 1.5c-4.687 0-8.5 2.916-8.5 6.507 0 1.994.222 3.833 1.695 5.402a.5.5 0 0 1-.015.718c-.31.372-.641.84-.952 1.373.69-.228 1.315-.642 1.931-1.124.477-.374.953-.79 1.429-1.165a.5.5 0 0 1 .464-.075c.917.236 2.265.614 3.948.614 4.378 0 8.41-2.404 8.41-6.46 0-3.591-3.813-6.507-8.41-6.507z' />
              </svg>
              카카오 로그인
            </button>

            {/* 간단한 안내 */}
            <div className='text-center text-sm text-slate-600'>
              <p>수강생 여러분은 위 버튼을 클릭해주세요</p>
            </div>
          </div>

          {/* 관리자 로그인 토글 - 작고 연하게 */}
          <div className='text-center mt-8 pt-6 border-t border-slate-100'>
            <button
              type='button'
              onClick={() => setShowAdminLogin(!showAdminLogin)}
              className='text-xs text-slate-400 hover:text-slate-600 transition-colors duration-200'
            >
              {showAdminLogin ? '관리자 로그인 닫기 ▲' : '관리자이신가요? ▼'}
            </button>
          </div>

          {/* 관리자 로그인 폼 - 숨김/표시 */}
          {showAdminLogin && (
            <form className='space-y-4 mt-6 pt-6 border-t border-slate-200 animate-fadeIn' onSubmit={handleSubmit}>
              <div className='bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4'>
                <p className='text-xs text-amber-800 font-medium'>⚠️ 관리자 전용 로그인</p>
              </div>

              {/* ID/PW 로그인 폼 */}
            <InputField
              label='아이디'
              value={formData.userId}
              onChange={(value: string) => setFormData({ ...formData, userId: value })}
              placeholder='아이디를 입력하세요'
              required
            />

            <div>
              <label htmlFor='password' className='block text-sm font-medium text-slate-700 mb-2'>
                비밀번호
              </label>
              <div className='relative'>
                <input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='current-password'
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className='appearance-none relative block w-full px-4 py-3 pr-12 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50'
                  placeholder='비밀번호를 입력하세요'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors'
                >
                  {showPassword ? <EyeSlashIcon className='w-5 h-5' /> : <EyeIcon className='w-5 h-5' />}
                </button>
              </div>
            </div>

            {/* 로그인 옵션 */}
            <div className='flex items-center justify-between text-sm'>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className='w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500'
                />
                <span className='ml-2 text-slate-700'>30일 동안 로그인 유지</span>
              </label>
            </div>

              <button
                type='submit'
                disabled={isLoading}
                className='group relative w-full flex justify-center py-3 px-6 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'
              >
                {isLoading ? (
                  <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                  </svg>
                ) : null}
                관리자 로그인
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
