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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          승인 대기 중
        </h1>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          회원가입이 완료되었습니다!<br />
          관리자 승인 후 서비스를 이용하실 수 있습니다.<br />
          조금만 기다려 주세요.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            💡 승인이 완료되면 자동으로 페이지가 이동됩니다.
          </p>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          다른 계정으로 로그인
        </button>
      </div>
    </div>
  );
}