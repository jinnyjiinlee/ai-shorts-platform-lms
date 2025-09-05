'use client';

import { useState } from 'react';
import { UserCircleIcon, ArrowRightOnRectangleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

import { useUserProfile } from '@/features/shared/hooks/useUserProfile';

interface StudentHeaderProps {
  showMobileMenu: boolean;
  onToggleMobileMenu: () => void;
}

export default function StudentHeader({ showMobileMenu, onToggleMobileMenu }: StudentHeaderProps) {
  const { profile } = useUserProfile();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();

  const userName = profile?.nickname || profile?.name || '수강생';
  const avatarUrl = profile?.avatar_url;

  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      window.location.href = '/';
    }
  };

  return (
    <header className='bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40'>
      {/* 모바일 메뉴 토글 */}
      <button
        onClick={onToggleMobileMenu}
        className='lg:hidden p-2 hover:bg-gray-100 rounded transition-colors'
        aria-label='메뉴 토글'
      >
        {showMobileMenu ? (
          <XMarkIcon className='w-5 h-5 text-gray-600' />
        ) : (
          <Bars3Icon className='w-5 h-5 text-gray-600' />
        )}
      </button>

      {/* 페이지 타이틀 */}
      <div className='flex-1 px-4'>
        <h2 className='text-base font-medium text-gray-900'>수강생 사이트</h2>
      </div>

      {/* 우측 메뉴 */}
      <div className='flex items-center space-x-4'>
        {/* 사용자 메뉴 */}
        <div className='relative'>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className='flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors'
          >
            <div className='text-right hidden sm:block'>
              <p className='text-xs text-gray-500'>{userName}</p>
            </div>
            <div className='w-8 h-8 bg-green-500 rounded-full flex items-center justify-center overflow-hidden'>
              {avatarUrl ? (
                <img src={avatarUrl} alt='Profile' className='w-full h-full object-cover' />
              ) : (
                <span className='text-sm font-medium text-white'>{userName[0] || '사'}</span>
              )}
            </div>
          </button>

          {showUserMenu && (
            <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50'>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  router.push('/student/profile');
                }}
                className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2'
              >
                <UserCircleIcon className='w-4 h-4' />
                <span>프로필 수정</span>
              </button>
              <hr className='my-1 border-gray-200' />
              <button
                onClick={handleLogout}
                className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2'
              >
                <ArrowRightOnRectangleIcon className='w-4 h-4' />
                <span>로그아웃</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
