'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StudentSidebar from '../components/StudentSidebar';
import StudentHeader from '../components/StudentHeader';
import ProfileManagement from '../../components/shared/ProfileManagement';
import SkipToContent from '../../components/ui/SkipToContent';

export default function StudentProfilePage() {
  const [activeMenu, setActiveMenu] = useState('profile');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const router = useRouter();

  const handleMenuClick = (menuId: string) => {
    // 각 메뉴에 맞는 페이지로 라우팅
    const routes: { [key: string]: string } = {
      'dashboard': '/student',
      'missions': '/student', 
      'weekly-materials': '/student',
      'ai-tools': '/student',
      'columns': '/student',
      'announcements': '/student',
      'profile': '/student/profile'
    };

    const targetRoute = routes[menuId];
    if (targetRoute && targetRoute !== '/student/profile') {
      // 메인 페이지로 이동하면서 activeMenu를 URL 파라미터로 전달
      router.push(`${targetRoute}?menu=${menuId}`);
    }
    setActiveMenu(menuId);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <SkipToContent />
      
      {/* 데스크톱 사이드바 */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <StudentSidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} className="h-full" />
      </div>

      {/* 모바일 사이드바 */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowMobileMenu(false)} />
          <div className="relative w-64 flex-shrink-0">
            <StudentSidebar 
              activeMenu={activeMenu} 
              onMenuClick={(menu) => {
                handleMenuClick(menu);
                setShowMobileMenu(false);
              }}
              className="h-full"
            />
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <StudentHeader 
          showMobileMenu={showMobileMenu}
          onToggleMobileMenu={() => setShowMobileMenu(!showMobileMenu)}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6">
          <ProfileManagement userRole="student" />
        </main>
      </div>
    </div>
  );
}