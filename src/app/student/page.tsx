'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../../lib/hooks/common/useAuth';
import StudentSidebar from './components/StudentSidebar';
import StudentHeader from './components/StudentHeader';
import StudentContent from './components/StudentContent';
import SkipToContent from '@/features/ui/SkipToContent';

function StudentPageContent() {
  const { user, loading } = useAuth('student');
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // URL 파라미터에서 메뉴 정보 가져오기
    const menuParam = searchParams?.get('menu');
    if (menuParam) {
      setActiveMenu(menuParam);
    }
  }, [searchParams]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // This will only render if user is authenticated and is a student
  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <SkipToContent />
      
      {/* 사이드바 - 데스크톱 */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <StudentSidebar 
          activeMenu={activeMenu} 
          onMenuClick={setActiveMenu}
          className="h-full"
        />
      </div>

      {/* 모바일 사이드바 오버레이 */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => setShowMobileMenu(false)}
          />
          <div className="relative w-64 flex-shrink-0">
            <StudentSidebar 
              activeMenu={activeMenu} 
              onMenuClick={(menu) => {
                setActiveMenu(menu);
                setShowMobileMenu(false);
              }}
              className="h-full"
            />
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col">
        <StudentHeader 
          showMobileMenu={showMobileMenu}
          onToggleMobileMenu={() => setShowMobileMenu(!showMobileMenu)}
        />
        <StudentContent activeMenu={activeMenu} />
      </div>
    </div>
  );
}

export default function StudentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    }>
      <StudentPageContent />
    </Suspense>
  );
}