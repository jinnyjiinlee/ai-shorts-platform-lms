'use client';

import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useLogin } from '../lib/hooks/auth/useLogin';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    userId: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading, rememberMe, setRememberMe, handleLogin } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* 배경 장식 요소 */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200/30 rounded-full animate-bounce"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-purple-200/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-32 w-12 h-12 bg-indigo-200/30 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-blue-100/30 rounded-full animate-pulse delay-500"></div>
      </div>
      
      <div className="max-w-md w-full space-y-6 sm:space-y-8 relative z-10">
        <div className="text-center">
          {/* YouTube Shorts Logo */}
          <div className="mx-auto h-16 w-16 sm:h-20 sm:w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-2xl hover:scale-105 transition-transform duration-300">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            하대표의 숏폼 수익화 부스트
          </h1>
          <p className="text-base sm:text-lg text-slate-700 font-medium mb-1 sm:mb-2">함께 이뤄가는 성공 스토리</p>
          <p className="text-sm sm:text-base text-slate-500">전문가의 노하우로 새로운 세상을 열어보세요</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm py-6 px-6 sm:py-8 sm:px-8 shadow-2xl rounded-2xl border border-white/20 hover:shadow-3xl transition-all duration-300">
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-slate-700 mb-2">
                아이디
              </label>
              <input
                id="userId"
                name="userId"
                type="text"
                autoComplete="username"
                required
                value={formData.userId}
                onChange={(e) => setFormData({...formData, userId: e.target.value})}
                className="appearance-none relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                placeholder="아이디를 입력하세요"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                비밀번호
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="appearance-none relative block w-full px-4 py-3 pr-12 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                  placeholder="비밀번호를 입력하세요"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* 로그인 옵션 */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-slate-700">30일 동안 로그인 유지</span>
              </label>
              <a href="/auth/reset-password" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                비밀번호 찾기
              </a>
            </div>

            <div className="text-xs text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p className="font-medium mb-2 text-slate-700">로그인 방법:</p>
              <div className="space-y-1">
                <p>• 아이디 또는 이메일로 로그인 가능</p>
                <p>• 관리자 승인 후 이용 가능</p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                로그인
              </button>
              
              <div className="text-center">
                <span className="text-slate-600">계정이 없으신가요? </span>
                <a href="/auth/register" className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors">
                  회원가입
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
