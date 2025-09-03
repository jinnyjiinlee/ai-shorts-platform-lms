'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function PendingPage() {
  const router = useRouter();

  useEffect(() => {
    const checkApprovalStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('status, user_type')
        .eq('id', user.id)
        .single();

      if (profile?.status === 'approved') {
        // Redirect based on user type
        const redirectPath = profile.user_type === 'admin' ? '/admin' : '/student';
        router.push(redirectPath);
      }
    };

    checkApprovalStatus();

    // Set up real-time subscription to check for approval
    const subscription = supabase
      .channel('profile-changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${supabase.auth.getUser().then(({ data }) => data.user?.id)}`,
      }, (payload) => {
        if (payload.new.status === 'approved') {
          const redirectPath = payload.new.user_type === 'admin' ? '/admin' : '/student';
          router.push(redirectPath);
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 
      flex items-center justify-center p-3 sm:p-4 md:p-6
      landscape:py-2 landscape:min-h-screen">
      <div className="w-full max-w-sm sm:max-w-md bg-white/90 backdrop-blur-sm 
        rounded-xl sm:rounded-2xl shadow-2xl border border-white/20
        py-6 px-4 sm:py-8 sm:px-6 md:px-8 text-center
        landscape:py-4 landscape:max-h-screen landscape:overflow-y-auto">
        
        {/* 아이콘 섹션 - 모바일 최적화 */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-100 to-amber-100 
          rounded-full flex items-center justify-center mx-auto 
          mb-4 sm:mb-6 landscape:mb-3 shadow-lg">
          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        {/* 제목 섹션 - 모바일 최적화 */}
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 
          mb-3 sm:mb-4 landscape:mb-2">
          승인 대기 중
        </h1>
        
        {/* 내용 섹션 - 모바일 최적화 */}
        <div className="space-y-4 sm:space-y-6 landscape:space-y-3 mb-6 sm:mb-8 landscape:mb-4">
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed px-2">
            회원가입이 완료되었습니다!<br />
            관리자 승인 후 서비스를 이용하실 수 있습니다.<br />
            조금만 기다려 주세요.
          </p>
          
          {/* 알림 박스 - 모바일 최적화 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 
            border border-blue-200/50 rounded-xl p-3 sm:p-4 mx-2">
            <p className="text-xs sm:text-sm text-blue-800 font-medium">
              💡 승인이 완료되면 자동으로 페이지가 이동됩니다.
            </p>
          </div>
        </div>
        
        {/* 버튼 - 모바일 최적화 */}
        <button
          onClick={handleLogout}
          className="w-full bg-gradient-to-r from-slate-500 to-slate-600 
            hover:from-slate-600 hover:to-slate-700 
            text-white font-semibold rounded-xl
            py-3 sm:py-3.5 px-4 text-base sm:text-lg
            shadow-lg hover:shadow-xl
            transition-all duration-300 transform 
            active:scale-[0.98] hover:scale-[1.01]
            focus:outline-none focus:ring-4 focus:ring-slate-500/30
            touch-manipulation"
        >
          다른 계정으로 로그인
        </button>
      </div>
    </div>
  );
}