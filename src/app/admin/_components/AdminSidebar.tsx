'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  HomeIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
  ChartBarIcon,
  AcademicCapIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface AdminSidebarProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ className, isOpen, onClose }: AdminSidebarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const pathname = usePathname();

  // 활성 메뉴 아이템 확인
  const isActiveRoute = (href: string, subItems?: Array<{ href: string }>) => {
    if (href === '/admin' && pathname === '/admin') return true;
    if (href !== '/admin' && pathname.startsWith(href)) return true;
    if (subItems) {
      return subItems.some((sub) => pathname.startsWith(sub.href));
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
    { href: '/admin/missionNotice', name: '미션 공지', icon: ClipboardDocumentListIcon },
    { href: '/admin/missionTracking', name: '미션 달성', icon: ChartBarIcon },
    {
      href: '/admin/studentLounge',
      name: '수강생 라운지',
      icon: ChatBubbleLeftRightIcon,
      subItems: [
        { href: '/admin/studentLounge/qna', name: '[1기] QnA' },
        { href: '/admin/studentLounge/growthDiary', name: '[1기] 성장 일기' },
      ],
    },
    { href: '/admin/studentManagement', name: '수강생 관리', icon: UsersIcon },
    {
      href: '/admin/resourceShare',
      name: '학습 자료',
      icon: AcademicCapIcon,
      subItems: [
        { href: '/admin/resourceShare/weeklyResource', name: '주차별 학습자료' },
        { href: '/admin/resourceShare/aiContentsStudio', name: 'AI 콘텐츠 스튜디오' },
      ],
    },
    { href: '/admin/settings', name: '설정', icon: Cog6ToothIcon },
  ];

  return (
    <div className={`bg-white/90 backdrop-blur-md border-r border-slate-200/50 shadow-xl ${className}`}>
      {/* 모바일 닫기 버튼 */}
      {isOpen && onClose && (
        <div className='flex items-center justify-between p-4 lg:hidden'>
          <div className='flex items-center space-x-3'>
            <div className='w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center'>
              <svg className='w-4 h-4 text-white' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z' />
              </svg>
            </div>
            <h1 className='font-bold text-sm text-slate-700'>하대표의 숏폼 수익화 부스트</h1>
          </div>
          <button
            onClick={onClose}
            className='p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors'
          >
            <XMarkIcon className='w-5 h-5' />
          </button>
        </div>
      )}

      {/* 데스크톱 헤더 */}
      <div className='hidden lg:block p-6 border-b border-slate-200/50'>
        <div className='flex items-center space-x-3'>
          <div className='w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg'>
            <svg className='w-6 h-6 text-white' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z' />
            </svg>
          </div>
          <div>
            <h1 className='font-bold text-lg bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent'>
              숏폼 수익화 부스트
            </h1>
            <p className='text-sm text-slate-500'>관리자 포털</p>
          </div>
        </div>
      </div>

      <nav className='mt-4 lg:mt-6 px-3'>
        {menuItems.map(({ href, name, icon: Icon, subItems }) => (
          <div key={href} className='mb-2'>
            {/* 메인 메뉴 */}
            <Link
              href={!subItems ? href : '#'}
              onClick={(e) => {
                if (subItems) {
                  e.preventDefault();
                  setOpenMenu(openMenu === href ? null : href);
                } else {
                  onClose?.(); // 모바일에서 메뉴 클릭 시 사이드바 닫기
                }
              }}
              className={`group w-full text-left px-4 py-3 flex items-center space-x-3 rounded-xl transition-all duration-200 ${
                isActiveRoute(href, subItems)
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-800'
              }`}
            >
              <div
                className={`p-1 rounded-lg ${
                  isActiveRoute(href, subItems)
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200/50 text-slate-500 group-hover:bg-emerald-500 group-hover:text-white'
                } transition-all duration-200`}
              >
                <Icon className='w-4 h-4' />
              </div>
              <span className='font-medium text-sm lg:text-base'>{name}</span>
              {subItems && (
                <ChevronDownIcon
                  className={`w-4 h-4 ml-auto transition-transform ${openMenu === href ? 'transform rotate-180' : ''}`}
                />
              )}
            </Link>

            {/* 서브 메뉴 */}
            {subItems && openMenu === href && (
              <div className='ml-8 mt-2 space-y-1'>
                {subItems.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    onClick={onClose}
                    className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                      pathname.startsWith(sub.href)
                        ? 'text-white bg-slate-800'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <div className='w-1.5 h-1.5 bg-slate-600 rounded-full'></div>
                    <span>{sub.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
