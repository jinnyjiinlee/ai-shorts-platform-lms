'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { InputField } from '@/features/shared/ui/InputField';
import { Select } from '@/features/shared/ui/Select';

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    nickname: '',
    cohort: '1기',
    // profile_image: 1,
  });

  // 실명과 전화번호 입력시 별명 자동 생성
  useEffect(() => {
    const phoneNumbers = formData.phone.replace(/[^\d]/g, ''); // 숫자만 추출
    if (formData.name.length >= 2 && phoneNumbers.length >= 4) {
      const lastTwoChars = formData.name.slice(-2);
      const lastFourDigits = phoneNumbers.slice(-4);
      setFormData((prev) => ({ ...prev, nickname: `${lastTwoChars}_${lastFourDigits}` }));
    }
  }, [formData.name, formData.phone]);

  // 이름 유효성 검증
  const isValidName = (name: string): boolean => {
    if (name.length < 2 || name.length > 6) return false;
    const completeKoreanRegex = /^[가-힣]+$/;
    return completeKoreanRegex.test(name);
  };

  // 휴대폰 번호 유효성 검증
  const isValidPhone = (phone: string): boolean => {
    const numbersOnly = phone.replace(/[^\d]/g, '');
    return numbersOnly.length === 11 && numbersOnly.startsWith('010');
  };

  // 폼 전체 유효성 체크
  const isFormValid = formData.name && formData.phone && isValidName(formData.name) && isValidPhone(formData.phone);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 추가 검증
    if (!isFormValid) {
      alert('모든 정보를 올바르게 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      // 현재 세션 가져오기
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/');
        return;
      }

      // profiles 테이블에 저장
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          email: session.user.email,
          name: formData.name,
          phone: formData.phone.replace(/[^\d]/g, ''), // DB에는 숫자만 저장
          nickname: formData.nickname,
          cohort: formData.cohort.toString().replace('기', ''),
          // profile_image: formData.profile_image,
          status: 'pending', // 상태를 pending으로 설정
        })
        .eq('id', session.user.id);

      if (error) {
        console.error('프로필 저장 실패:', error);
        alert('프로필 저장에 실패했습니다.');
        return;
      }

      // 성공시 승인 대기 페이지로 이동
      router.push('/auth/pending');
    } catch (error) {
      console.error('예상치 못한 오류:', error);
      alert('오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 
      flex items-center justify-center p-3 sm:p-4 md:p-6
      landscape:py-2 landscape:min-h-screen'
    >
      <div
        className='w-full max-w-sm sm:max-w-md bg-white/90 backdrop-blur-sm 
        py-6 px-4 sm:py-8 sm:px-6 md:px-8 
        shadow-2xl rounded-xl sm:rounded-2xl border border-white/20
        landscape:py-4 landscape:max-h-screen landscape:overflow-y-auto'
      >
        {/* 헤더 섹션 - 모바일 최적화 */}
        <div className='text-center mb-5 sm:mb-6 landscape:mb-4'>
          <h1 className='text-xl sm:text-2xl font-bold text-slate-800 mb-2 sm:mb-3 landscape:mb-2'>프로필 정보 입력</h1>
          <p className='text-sm sm:text-base text-slate-600 leading-relaxed px-2 landscape:text-sm'>
            서비스 이용을 위해
            <br className='sm:hidden' /> 추가 정보를 입력해주세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4 sm:space-y-5 landscape:space-y-3'>
          {/* 실명 입력 */}
          <div>
            <InputField
              label='실명'
              value={formData.name}
              onChange={(value: string) => setFormData({ ...formData, name: value })}
              placeholder='예: 홍길동'
              maxLength={6}
              koreanOnly={true}
              showValidationIcon={true}
              showCharacterCount={true}
              required
            />
            <div className='mt-2 space-y-1.5'>
              <p className='text-xs sm:text-sm text-slate-600'>
                <span className='inline-flex items-center'>
                  <span className='w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mr-2 flex-shrink-0'></span>
                  <span className='leading-relaxed'>가입 승인 과정에서 확인됩니다</span>
                </span>
              </p>
              <p className='text-xs sm:text-sm text-amber-600'>
                <span className='inline-flex items-start'>
                  <span className='w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-500 rounded-full mr-2 mt-0.5 flex-shrink-0'></span>
                  <span className='leading-relaxed'>실명을 정확히 입력하지 않을시 승인이 거부될 수 있습니다</span>
                </span>
              </p>
            </div>
          </div>

          {/* 휴대폰 번호 */}
          <div>
            <InputField
              label='휴대폰 번호'
              type='tel'
              value={formData.phone}
              onChange={(value: string) => {
                // phoneNumber prop이 있으면 포맷팅된 값을 그대로 사용
                // 내부적으로 DB 저장시에는 숫자만 추출
                setFormData({ ...formData, phone: value });
              }}
              placeholder='010-1234-5678'
              phoneNumber={true}
              showValidationIcon={true}
              maxLength={13} // 010-1234-5678 (13자)
              required
            />
            <div className='mt-2 space-y-1.5'>
              <p className='text-xs sm:text-sm text-slate-600'>
                <span className='inline-flex items-center'>
                  <span className='w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-2 flex-shrink-0'></span>
                  <span className='leading-relaxed'>숫자만 입력하면 자동으로 하이픈이 추가됩니다</span>
                </span>
              </p>
              <p className='text-xs sm:text-sm text-slate-600'>
                <span className='inline-flex items-center'>
                  <span className='w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mr-2 flex-shrink-0'></span>
                  <span className='leading-relaxed'>010으로 시작하는 11자리 번호를 입력해주세요</span>
                </span>
              </p>
            </div>
          </div>

          {/* 자동 생성된 별명 */}
          <div>
            <InputField
              label='별명 (자동 생성)'
              value={formData.nickname}
              disabled
              placeholder='실명과 전화번호 입력시 자동 생성'
            />
            {formData.nickname && (
              <p className='mt-2 text-xs sm:text-sm text-green-600'>
                <span className='inline-flex items-center'>
                  <span className='w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-2 flex-shrink-0'></span>
                  <span className='leading-relaxed'>별명이 자동 생성되었습니다</span>
                </span>
              </p>
            )}
          </div>

          {/* 기수 선택 */}
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>
              기수 선택 <span className='text-red-500'>*</span>
            </label>
            <Select
              value={formData.cohort}
              onChange={(value: string) =>
                setFormData({
                  ...formData,
                  cohort: value as string,
                })
              }
              options={[{ value: '1기', label: '1기' }]}
              className='w-full px-3 py-3 sm:px-4 border border-slate-300 rounded-xl 
                focus:outline-none focus:ring-2 focus:ring-blue-500 
                focus:border-transparent transition-all text-base'
            />
          </div>

          {/* 제출 버튼 */}
          <button
            type='submit'
            disabled={loading || !isFormValid}
            className='w-full py-3.5 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 
              text-white font-semibold rounded-xl text-base sm:text-lg
              hover:from-blue-700 hover:to-indigo-700 
              disabled:from-slate-400 disabled:to-slate-500
              disabled:cursor-not-allowed 
              shadow-lg hover:shadow-xl
              transition-all duration-300 transform active:scale-[0.98] hover:scale-[1.01]
              focus:outline-none focus:ring-4 focus:ring-blue-500/30
              touch-manipulation'
          >
            {loading ? (
              <span className='flex items-center justify-center'>
                <svg
                  className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                저장 중...
              </span>
            ) : (
              <span className='flex items-center justify-center'>
                <span className='mr-2'>🚀</span>
                가입 신청
              </span>
            )}
          </button>

          {/* 버튼 상태 안내 */}
          {!isFormValid && (
            <div className='text-center -mt-1 px-2'>
              {!formData.name || !formData.phone ? (
                <p className='text-xs sm:text-sm text-slate-500'>모든 필수 정보를 입력해주세요</p>
              ) : (
                <p className='text-xs sm:text-sm text-red-500'>
                  {!isValidName(formData.name) && '실명을 올바르게 입력해주세요'}
                  {!isValidName(formData.name) && !isValidPhone(formData.phone) && ' • '}
                  {!isValidPhone(formData.phone) && '휴대폰 번호를 올바르게 입력해주세요'}
                </p>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
