'use client';

import { useState, useEffect } from 'react';
import {
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { supabase } from '@/shared/services';
import { useRouter } from 'next/navigation';

interface StudentHeaderProps {
  showMobileMenu: boolean;
  onToggleMobileMenu: () => void;
}

export default function StudentHeader({ showMobileMenu, onToggleMobileMenu }: StudentHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userName, setUserName] = useState('사용자');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
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
            // 닉네임 우선, 없으면 이름 사용
            const displayName = profile.nickname || profile.name || '사용자';
            setUserName(displayName);
            setAvatarUrl(profile.avatar_url);
            // localStorage에도 저장
            localStorage.setItem('userName', displayName);
          }
        }
      } catch (error) {
        console.error('프로필 조회 오류:', error);
        // localStorage에서 가져오기 (백업)
        setUserName(localStorage.getItem('userName') || '사용자');
      }
    };

    getUserProfile();
  }, []);

  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      window.location.href = '/';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
      {/* 모바일 메뉴 토글 */}
      <button
        onClick={onToggleMobileMenu}
        className="lg:hidden p-2 hover:bg-gray-100 rounded transition-colors"
        aria-label="메뉴 토글"
      >
        {showMobileMenu ? (
          <XMarkIcon className="w-5 h-5 text-gray-600" />
        ) : (
          <Bars3Icon className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* 페이지 타이틀 */}
      <div className="flex-1 px-4">
        <h2 className="text-base font-medium text-gray-900">나의 미션</h2>
      </div>

      {/* 우측 메뉴 */}
      <div className="flex items-center space-x-4">
        {/* 사용자 메뉴 */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-500">{userName}</p>
            </div>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-medium text-white">{userName[0] || '사'}</span>
              )}
            </div>
          </button>
          
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  router.push('/student/profile');
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              >
                <UserCircleIcon className="w-4 h-4" />
                <span>프로필 수정</span>
              </button>
              <hr className="my-1 border-gray-200" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                <span>로그아웃</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
    </header>
  );
}