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
    if (formData.name.length >= 2 && formData.phone.length >= 4) {
      const lastTwoChars = formData.name.slice(-2);
      const lastFourDigits = formData.phone.slice(-4);
      setFormData((prev) => ({ ...prev, nickname: `${lastTwoChars}_${lastFourDigits}` }));
    }
  }, [formData.name, formData.phone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          phone: formData.phone,
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
      className='min-h-screen bg-gradient-to-br 
  from-slate-50 via-blue-50 to-indigo-50 flex 
  items-center justify-center p-4'
    >
      <div
        className='max-w-md w-full bg-white/80 
  backdrop-blur-sm py-8 px-8 shadow-2xl rounded-2xl 
  border border-white/20'
      >
        <h1
          className='text-2xl font-bold text-center
   mb-6 text-slate-800'
        >
          프로필 정보 입력
        </h1>
        <p
          className='text-center text-slate-600 
  mb-8'
        >
          서비스 이용을 위해 추가 정보를 입력해주세요
        </p>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* 실명 입력 */}
          <InputField
            label='실명'
            value={formData.name}
            onChange={(value: string) => setFormData({ ...formData, name: value })}
            placeholder='실명을 입력하세요 (최대 6자)'
            required
          />

          {/* 휴대폰 번호 */}
          <InputField
            label='휴대폰 번호'
            type='tel'
            value={formData.phone}
            onChange={(value: string) => setFormData({ ...formData, phone: value.replace(/[^0-9]/g, '') })}
            placeholder='01012345678 (- 없이 입력)'
            required
          />

          {/* 자동 생성된 별명 */}
          <InputField
            label='별명 (자동 생성)'
            value={formData.nickname}
            disabled
            placeholder='실명과 전화번호 입력시 자동 생성'
          />

          {/* 기수 선택 */}
          <div>
            <label
              className='block text-sm 
  font-medium text-slate-700 mb-2'
            >
              기수 선택 <span className='text-red-500'>*</span>
            </label>
            <Select
              value={formData.cohort}
              onChange={(value: string) => setFormData({
                ...formData,
                cohort: value as string,
              })}
              options={[{ value: '1기', label: '1기' }]}
              className='w-full px-4 py-3 border
  border-slate-300 rounded-xl focus:outline-none
  focus:ring-2 focus:ring-blue-500'
            />
          </div>

          {/* 제출 버튼 */}
          <button
            type='submit'
            disabled={loading || !formData.name || !formData.phone || formData.phone.length < 10}
            className='w-full py-4 bg-gradient-to-r 
  from-blue-600 to-indigo-600 text-white font-medium 
  rounded-xl hover:from-blue-700 hover:to-indigo-700 
  disabled:opacity-50 disabled:cursor-not-allowed 
  transition-all duration-200'
          >
            {loading ? '저장 중...' : '가입 신청'}
          </button>
        </form>
      </div>
    </div>
  );
}
