'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '../../lib/supabase/client';
import { useAuth } from '../../lib/hooks/common/useAuth';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon as LogoutIcon,
  ChartBarIcon,
  AcademicCapIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth('admin');
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('관리자');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // hydration 완료 표시
    setIsMounted(true);
    
    // 현재 로그인한 사용자 정보 가져오기
    const getUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('name, nickname, avatar_url')
            .eq('id', user.id)
            .single();
          
          if (profile) {
            setUserName(profile.name || profile.nickname || '관리자');
            setAvatarUrl(profile.avatar_url);
          }
        }
      } catch (error) {
        console.error('프로필 조회 오류:', error);
        // localStorage에서 가져오기 (백업)
        setUserName(localStorage.getItem('userName') || '관리자');
      }
    };

    getUserProfile();
  }, []);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // This will only render if user is authenticated and is an admin
  if (!user) {
    return null;
  }

  // 활성 메뉴 아이템 확인
  const isActiveRoute = (href: string, subItems?: Array<{href: string}>) => {
    if (href === '/admin' && pathname === '/admin') return true;
    if (href !== '/admin' && pathname.startsWith(href)) return true;
    if (subItems) {
      return subItems.some(sub => pathname.startsWith(sub.href));
    }
    return false;
  };

  const menuItems = [
    { href: '/admin', name: '대시보드', icon: HomeIcon },
    {
      href: '/admin/community',
      name: '커뮤니티',
      icon: ChatBubbleLeftRightIcon,
      subItems: [
        { href: '/admin/community/announcements', name: '공지사항' },
        { href: '/admin/community/columns', name: '하대표 칼럼' },
      ],
    },
    { href: '/admin/missions', name: '미션 공지', icon: ClipboardDocumentListIcon },
    { href: '/admin/missionTracking', name: '미션 달성', icon: ChartBarIcon },
    { href: '/admin/usersManagement', name: '수강생', icon: UsersIcon },
    { href: '/admin/resourceShare', name: '자료 공유', icon: AcademicCapIcon },
    { href: '/admin/settings', name: '설정', icon: Cog6ToothIcon }
  ];

  const logout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    localStorage.removeItem('rememberLogin');
    localStorage.removeItem('loginExpiration');
    window.location.href = '/';
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* 모바일 오버레이 */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 사이드바 */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-md border-r border-slate-200/50 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* 모바일 닫기 버튼 */}
        <div className="flex items-center justify-between p-4 lg:hidden">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
            </div>
            <h1 className="font-bold text-sm text-slate-700">하대표의 숏폼 수익화 부스트</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* 데스크톱 헤더 */}
        <div className="hidden lg:block p-6 border-b border-slate-200/50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-lg bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">숏폼 수익화 부스트</h1>
              <p className="text-sm text-slate-500">관리자 포털</p>
            </div>
          </div>
        </div>

        <nav className="mt-4 lg:mt-6 px-3">
          {menuItems.map(({ href, name, icon: Icon, subItems }) => (
            <div key={href} className="mb-2">
              {/* 메인 메뉴 */}
              <Link
                href={!subItems ? href : '#'}
                onClick={(e) => {
                  if (subItems) {
                    e.preventDefault();
                    setOpenMenu(openMenu === href ? null : href);
                  } else {
                    setSidebarOpen(false); // 모바일에서 메뉴 클릭 시 사이드바 닫기
                  }
                }}
                className={`group w-full text-left px-4 py-3 flex items-center space-x-3 rounded-xl transition-all duration-200 ${
                  isActiveRoute(href, subItems) ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-800'
                }`}
              >
                <div className={`p-1 rounded-lg ${
                  isActiveRoute(href, subItems) ? 'bg-white/20 text-white' : 'bg-slate-200/50 text-slate-500 group-hover:bg-emerald-500 group-hover:text-white'
                } transition-all duration-200`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-medium text-sm lg:text-base">{name}</span>
                {subItems && (
                  <ChevronDownIcon className={`w-4 h-4 ml-auto transition-transform ${
                    openMenu === href ? 'transform rotate-180' : ''
                  }`} />
                )}
              </Link>

              {/* 서브 메뉴 */}
              {subItems && openMenu === href && (
                <div className="ml-8 mt-2 space-y-1">
                  {subItems.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                        pathname.startsWith(sub.href) ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <div className="w-1.5 h-1.5 bg-slate-600 rounded-full"></div>
                      <span>{sub.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* 헤더 */}
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="px-4 lg:px-6 py-3 lg:py-4 flex justify-between items-center">
            {/* 모바일 메뉴 버튼 & 타이틀 */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden transition-colors"
              >
                <Bars3Icon className="w-5 h-5" />
              </button>
              <h1 className="text-lg lg:text-2xl font-bold text-slate-900">관리자 LMS</h1>
            </div>
            
            {/* 사용자 메뉴 */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 px-2 lg:px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md overflow-hidden">
                  {isMounted && avatarUrl ? (
                    <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs lg:text-sm font-medium text-white">{userName[0] || '관'}</span>
                  )}
                </div>
                <span className="hidden sm:block text-sm font-medium text-slate-700">{userName}</span>
                <ChevronDownIcon className="w-4 h-4 text-slate-400" />
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-40 lg:w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                  <Link
                    href="/admin/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                  >
                    <UserCircleIcon className="w-4 h-4" />
                    <span>정보 변경</span>
                  </Link>
                  <Link
                    href="/admin/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                  >
                    <Cog6ToothIcon className="w-4 h-4" />
                    <span>설정</span>
                  </Link>
                  <hr className="my-1 border-slate-200" />
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <LogoutIcon className="w-4 h-4" />
                    <span>로그아웃</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 콘텐츠 영역 */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
