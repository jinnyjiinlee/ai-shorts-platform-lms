'use client';

import { useState } from 'react';
import Link from 'next/link';

import {
  ChevronDownIcon,
  UserCircleIcon,
  ArrowRightStartOnRectangleIcon as LogoutIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';

import { useUserProfile } from '@/features/shared/hooks/useUserProfile';

interface AdminHeaderProps {
  showMobileMenu: boolean;
  onToggleMobileMenu: () => void;
}

export default function AdminHeader({ onToggleMobileMenu }: AdminHeaderProps) {
  const { profile } = useUserProfile();

  const [showUserMenu, setShowUserMenu] = useState(false);

  const logout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    localStorage.removeItem('rememberLogin');
    localStorage.removeItem('loginExpiration');
    window.location.href = '/';
  };

  const userName = profile?.nickname || profile?.name || '관리자';
  const avatarUrl = profile?.avatar_url;

  return (
    <header className='bg-white shadow-sm border-b border-slate-200'>
      <div className='px-4 lg:px-6 py-3 lg:py-4 flex justify-between items-center'>
        {/* 모바일 메뉴 버튼 & 타이틀 */}
        <div className='flex items-center space-x-3'>
          <button
            onClick={onToggleMobileMenu}
            className='p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden transition-colors'
          >
            <Bars3Icon className='w-5 h-5' />
          </button>
          {/* <h1 className='text-lg lg:text-2xl font-bold text-slate-900'>관리자 LMS</h1> */}
        </div>

        {/* 사용자 메뉴 */}
        <div className='relative'>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className='flex items-center space-x-2 px-2 lg:px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors'
          >
            <div className='w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md overflow-hidden'>
              {avatarUrl ? (
                <img src={avatarUrl} alt='Profile' className='w-full h-full object-cover' />
              ) : (
                <span className='text-xs lg:text-sm font-medium text-white'>{userName[0] || '관'}</span>
              )}
            </div>
            <span className='hidden sm:block text-sm font-medium text-slate-700'>{userName}</span>
            <ChevronDownIcon className='w-4 h-4 text-slate-400' />
          </button>

          {showUserMenu && (
            <div className='absolute right-0 mt-2 w-40 lg:w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50'>
              <Link
                href='/admin/profile'
                onClick={() => setShowUserMenu(false)}
                className='w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2'
              >
                <UserCircleIcon className='w-4 h-4' />
                <span>정보 변경</span>
              </Link>
              <hr className='my-1 border-slate-200' />
              <button
                onClick={logout}
                className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2'
              >
                <LogoutIcon className='w-4 h-4' />
                <span>로그아웃</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
