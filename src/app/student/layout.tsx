'use client';

import { useAuth } from '@/lib/hooks/common/useAuth';
import StudentSidebar from './_components/StudentSidebar';
import StudentHeader from './_components/StudentHeader';
import { SkipToContent } from '@/features/shared/ui/SkipToContent';
import { useState } from 'react';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth('student');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className='min-h-screen bg-slate-50 flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  // This will only render if user is authenticated and is a student
  if (!user) {
    return null;
  }

  return (
    <div className='flex h-screen bg-slate-50'>
      <SkipToContent />

      {/* 사이드바 - 데스크톱 */}
      <div className='hidden lg:block w-64 flex-shrink-0'>
        <StudentSidebar className='h-full' />
      </div>

      {/* 모바일 사이드바 오버레이 */}
      {showMobileMenu && (
        <div className='lg:hidden fixed inset-0 z-50 flex'>
          <div className='fixed inset-0 bg-black/50' onClick={() => setShowMobileMenu(false)} />
          <div className='relative w-64 flex-shrink-0'>
            <StudentSidebar className='h-full' />
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 영역 */}
      <div className='flex-1 flex flex-col'>
        <StudentHeader showMobileMenu={showMobileMenu} onToggleMobileMenu={() => setShowMobileMenu(!showMobileMenu)} />
        <main className='flex-1 overflow-y-auto'>{children}</main>
      </div>
    </div>
  );
}
