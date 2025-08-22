'use client';

import { useState } from 'react';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

export default function ResetPasswordPage() {
  const [step, setStep] = useState(1); // 1: 아이디/이메일 입력, 2: 성공 메시지
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    userId: '',
    name: '',
    email: ''
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors(prev => ({ ...prev, email: '올바른 이메일 형식이 아닙니다.' }));
      return false;
    }
    setErrors(prev => ({ ...prev, email: '' }));
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let isValid = true;

    if (!formData.userId.trim()) {
      setErrors(prev => ({ ...prev, userId: '아이디를 입력해주세요.' }));
      isValid = false;
    } else {
      setErrors(prev => ({ ...prev, userId: '' }));
    }

    if (!formData.name.trim()) {
      setErrors(prev => ({ ...prev, name: '이름을 입력해주세요.' }));
      isValid = false;
    } else {
      setErrors(prev => ({ ...prev, name: '' }));
    }

    if (!validateEmail(formData.email)) {
      isValid = false;
    }

    if (!isValid) {
      setIsLoading(false);
      return;
    }

    try {
      // 실제로는 서버 API 호출하여 비밀번호 재설정 이메일 발송
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep(2);
    } catch (error) {
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* 헤더 */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5 mr-1" />
            로그인으로 돌아가기
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {step === 1 ? (
            <>
              {/* 헤더 */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">
                <div className="mx-auto w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3.343a1 1 0 01.293-.707l8.457-8.457A6 6 0 0121 9z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-white">비밀번호 찾기</h1>
                <p className="text-blue-100 mt-2">보안을 위해 정보를 정확히 입력해주세요</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* 아이디 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    아이디 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.userId}
                    onChange={(e) => setFormData({...formData, userId: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="아이디를 입력하세요"
                  />
                  {errors.userId && <p className="text-red-600 text-sm mt-1">{errors.userId}</p>}
                </div>

                {/* 이름 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="실명을 입력하세요"
                  />
                  {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* 이메일 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    이메일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({...formData, email: e.target.value});
                      if (e.target.value) validateEmail(e.target.value);
                    }}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="등록한 이메일을 입력하세요"
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* 안내 메시지 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-800">
                        입력한 정보가 일치하면 비밀번호 재설정 링크를 이메일로 보내드립니다.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 재설정 링크 발송 버튼 */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? '처리 중...' : '재설정 링크 발송'}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* 성공 메시지 */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-8 text-center">
                <div className="mx-auto w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-white">이메일을 확인해주세요</h1>
                <p className="text-green-100 mt-2">비밀번호 재설정 링크를 발송했습니다</p>
              </div>

              <div className="p-6 space-y-6 text-center">
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium mb-2">
                      {formData.email}
                    </p>
                    <p className="text-sm text-green-700">
                      위 이메일 주소로 비밀번호 재설정 링크를 발송했습니다.
                    </p>
                  </div>

                  <div className="text-sm text-slate-600 space-y-2">
                    <p>• 이메일이 도착하지 않으면 스팸함을 확인해주세요</p>
                    <p>• 링크는 24시간 후 만료됩니다</p>
                    <p>• 링크를 클릭하여 새로운 비밀번호를 설정하세요</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setStep(1)}
                    className="w-full bg-slate-100 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                  >
                    다시 시도하기
                  </button>
                  <button
                    onClick={() => window.location.href = '/'}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                  >
                    로그인 화면으로 돌아가기
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}