// 페이지 역할
// 1. 카카오 로그인 후 리다이렉트되는 페이지
//  1) supabase에서 세션 정보 확인
//  2) profiles테이블에서 사용자 정보 조회
//  3) 사용자 사용에 따라 리다이렉트
//      - 신규 사용자
//         profiles에 없음 -> /auth/onboarding 이동
// (카카오 로그인 후 추가 정보 입력)

//      - 기존 사용자
//      1) approved /student 이동
//      2) pending /auth/pending 이동
//      3) rejected /auth/rejected 이동

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function UserAuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      // 1. 세션 확인
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/');
        return;
      }

      // 2. profiles 테이블 조회
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();

      // 3. 분기 처리
      if (profile.status === 'setup') {
        // 온보딩 페이지에서
        router.push('/auth/onboarding');
      }
      // 신규 사용자 → 승인 대기
      else if (profile.status === 'pending') {
        router.push('/auth/pending');
      }
      // 기존 사용자 → 승인 완료
      else if (profile.status === 'approved') {
        router.push('/student');
      }

      // 신규 사용자 → 승인 완료
      else if (profile.status === 'rejected') {
        router.push('/auth/rejected');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div
      className='min-h-screen flex items-center 
  justify-center bg-gradient-to-br from-slate-50 
  via-blue-50 to-indigo-50'
    >
      <div className='text-center'>
        <div
          className='animate-spin rounded-full h-12 
  w-12 border-b-2 border-blue-600 mx-auto mb-4'
        ></div>
        <p className='text-slate-700'>사용자 정보 확인 중...</p>
      </div>
    </div>
  );
}
