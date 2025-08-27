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
      try {
        // 1. URL에 코드가 있는 경우에만 교환 처리
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('code')) {
          console.log('OAuth 코드 발견, 교환 처리 중...');
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href);
          if (exchangeError) {
            console.error('코드 교환 실패:', exchangeError);
            router.push('/');
            return;
          }
        }
        
        // 2. 세션 확인
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push('/');
          return;
        }

        // 3. profiles 테이블 조회 (에러 핸들링 포함)
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        // 4. 신규 사용자 처리 (프로필 데이터가 없거나 에러 발생시)
        if (error || !profile) {
          console.log('신규 사용자 감지:', session.user.email);
          
          // 신규 사용자를 위한 기본 프로필 생성 시도
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: session.user.id,
              email: session.user.email,
              status: 'setup',
              created_at: new Date().toISOString()
            })
            .select()
            .single();
          
          if (!insertError && newProfile) {
            console.log('프로필 생성 성공');
            router.push('/auth/onboarding');
          } else {
            console.error('프로필 생성 오류 상세:', {
              error: insertError,
              message: insertError?.message,
              details: insertError?.details,
              hint: insertError?.hint,
              code: insertError?.code
            });
            
            // RLS 정책 오류일 가능성이 높음
            if (insertError?.code === '42501') {
              alert('프로필 생성 권한이 없습니다. 관리자에게 문의해주세요.');
            }
            
            router.push('/'); // 오류 시 홈으로
          }
          return;
        }

        // 5. 기존 사용자 분기 처리
        if (profile.status === 'setup') {
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
        // 신규 사용자 → 승인 거부
        else if (profile.status === 'rejected') {
          router.push('/auth/rejected');
        }
      } catch (error) {
        console.error('콜백 처리 오류:', error);
        router.push('/');
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
