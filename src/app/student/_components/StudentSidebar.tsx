'use client';

import { useState } from 'react';
import { useUserProfile } from '@/features/shared/hooks/useUserProfile';
import { useRouter, usePathname } from 'next/navigation';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  SpeakerWaveIcon,
  UsersIcon,
  BookOpenIcon,
  ChevronDownIcon,
  PlayIcon,
  UserCircleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

interface MenuItem {
  id: string;
  name: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  subItems?: { id: string; name: string; href: string }[];
}

interface StudentSidebarProps {
  className?: string;
}

export default function StudentSidebar({ className = '' }: StudentSidebarProps) {
  const { profile } = useUserProfile();

  const userProfile = {
    name: profile?.nickname || profile?.name || '학습자',
    avatarUrl: profile?.avatar_url || null,
  };

  const router = useRouter();
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['community']);

  const menuItems: MenuItem[] = [
    { id: 'dashboard', name: '대시보드', href: '/student', icon: HomeIcon },
    {
      id: 'community',
      name: '커뮤니티',
      icon: SpeakerWaveIcon,
      subItems: [
        { id: 'announcements', name: '공지사항', href: '/student/community/announcements' },
        { id: 'columns', name: '칼럼', href: '/student/community/columns' },
      ],
    },
    { id: 'missions', name: '나의 미션', href: '/student/mission', icon: ClipboardDocumentListIcon },
    {
      id: 'studentLounge',
      name: '수강생 라운지',
      icon: UsersIcon,
      subItems: [
        { id: 'review', name: '수강생 후기', href: '/student/studentLounge/review' },
        { id: 'qna', name: '[1기] QnA ', href: '/student/studentLounge/qna' },
        { id: 'growthDiary', name: '[1기] 성장 일기 ', href: '/student/studentLounge/growthDiary' },
      ],
    },
    {
      id: 'resourceShare',
      name: '학습 자료',
      icon: BookOpenIcon,
      subItems: [
        // { id: 'weeklyResource', name: '주차별 학습자료 ', href: '/student/resourceShare/weeklyResource' },
        { id: 'aiContentsStudio', name: 'AI 콘텐츠 스튜디오', href: '/student/resourceShare/aiContentsStudio' },
      ],
    },
  ];

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenus((prev) => (prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]));
  };

  // 활성 메뉴 확인 함수
  const isActiveRoute = (item: MenuItem) => {
    if (item.href === '/student' && pathname === '/student') return true;
    if (item.href && item.href !== '/student' && pathname.startsWith(item.href)) return true;
    if (item.subItems) {
      return item.subItems.some((sub) => pathname.startsWith(sub.href));
    }
    return false;
  };

  const handleMenuClick = (item: MenuItem) => {
    if (item.subItems) {
      toggleSubmenu(item.id);
    } else if (item.href) {
      router.push(item.href);
    }
  };

  const handleSubMenuClick = (href: string) => {
    router.push(href);
  };

  const renderMenuItem = (item: MenuItem) => {
    const Icon = item.icon;
    const isExpanded = expandedMenus.includes(item.id);
    const isActive = isActiveRoute(item);

    return (
      <li key={item.id}>
        <button
          onClick={() => handleMenuClick(item)}
          className={`group w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-all duration-200 ${
            isActive
              ? 'bg-slate-800 text-white shadow-sm'
              : 'hover:bg-slate-100 text-slate-600 hover:text-slate-800'
          }`}
        >
          <div className='flex items-center space-x-3'>
            {Icon && (
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
            )}
            <span
              className={`font-medium transition-colors ${
                isActive ? 'text-white' : 'text-slate-600 group-hover:text-slate-800'
              }`}
            >
              {item.name}
            </span>
          </div>
          {item.subItems && (
            <ChevronDownIcon
              className={`w-4 h-4 transition-all duration-200 ${isExpanded ? 'rotate-180' : ''} ${
                isActive ? 'text-white' : 'text-slate-300 group-hover:text-slate-500'
              }`}
            />
          )}
        </button>

        {/* 서브메뉴 */}
        {item.subItems && isExpanded && (
          <ul className='mt-2 ml-8 space-y-1'>
            {item.subItems.map((subItem) => (
              <li key={subItem.id}>
                <button
                  onClick={() => handleSubMenuClick(subItem.href)}
                  className={`group w-full text-left px-3 py-2 rounded-lg flex items-center space-x-3 transition-all duration-200 ${
                    pathname.startsWith(subItem.href)
                      ? 'bg-slate-100 text-slate-800 border-l-2 border-slate-400'
                      : 'hover:bg-slate-50 text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      pathname.startsWith(subItem.href) ? 'bg-slate-400' : 'bg-slate-300 group-hover:bg-slate-400'
                    }`}
                  ></div>
                  <span className='text-sm font-medium'>{subItem.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <aside className={`bg-white/98 backdrop-blur-sm border-r border-slate-200/50 flex flex-col shadow-lg ${className}`}>
      {/* 로고 */}
      <div className='px-6 py-3 border-b border-slate-200/40'>
        <div className='flex items-center space-x-4'>
          <div className='relative'>
            <div className='w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center shadow-md'>
              <PlayIcon className='w-5 h-5 text-white' />
            </div>
            <div className='absolute -top-1 -right-1 w-3 h-3 bg-slate-400 rounded-full border-2 border-white'></div>
          </div>
          <div>
            <h1 className='text-lg font-semibold text-slate-800 tracking-tight'>숏폼 수익화 부스트</h1>
            <p className='text-sm text-slate-500 font-medium'>수강생 포털</p>
          </div>
        </div>
      </div>

      {/* 네비게이션 */}
      <nav className='flex-1 px-4 py-6'>
        <ul className='space-y-1'>{menuItems.map(renderMenuItem)}</ul>
      </nav>

      {/* 유저 프로필 섹션 */}
      <div className='px-4 py-4 border-t border-slate-200/40'>
        <a
          href='/student/profile'
          className='flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group'
        >
          <div className='w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-500 rounded-lg flex items-center justify-center overflow-hidden'>
            {userProfile.avatarUrl ? (
              <img src={userProfile.avatarUrl} alt='Profile' className='w-full h-full object-cover' />
            ) : (
              <UserCircleIcon className='w-5 h-5 text-white' />
            )}
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium text-slate-700 truncate'>{userProfile.name}</p>
            <p className='text-xs text-slate-500'>1기 수강생</p>
          </div>
          <Cog6ToothIcon className='w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors' />
        </a>
      </div>
    </aside>
  );
}
