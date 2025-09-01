'use client';

import { useState } from 'react';
import { MegaphoneIcon, ChatBubbleLeftRightIcon, PlusIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { Button } from '@/features/shared/ui/Button';
import { Badge } from '@/features/shared/ui/Badge';
// AnnouncementCard는 더 이상 사용하지 않음 (shared 폴더로 이동)
import ColumnCard from './ColumnCard';

interface CommunityViewProps {
  userRole: 'student' | 'admin';
  currentUser?: string;
}

export default function CommunityView({ userRole, currentUser = '김학생' }: CommunityViewProps) {
  const [activeTab, setActiveTab] = useState<'announcements' | 'columns' | 'materials'>('announcements');

  // 임시로 빈 배열로 정의 (실제 구현 시 API에서 가져올 예정)
  const announcements: any[] = [];
  const columns: any[] = [];
  const learningMaterials: any[] = [];

  const tabs = [
    {
      key: 'announcements' as const,
      label: '공지사항',
      icon: <MegaphoneIcon className='w-5 h-5' />,
      count: announcements.length,
    },
    {
      key: 'columns' as const,
      label: '하대표 칼럼',
      icon: <ChatBubbleLeftRightIcon className='w-5 h-5' />,
      count: columns.length,
    },
    {
      key: 'materials' as const,
      label: '학습자료',
      icon: (
        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
          />
        </svg>
      ),
      count: learningMaterials.length,
    },
  ];

  return (
    <div className='space-y-6'>
      {/* 헤더 */}
      <div className='relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 rounded-3xl p-8 text-white shadow-2xl'>
        <div className='absolute inset-0 opacity-20'>
          <div className='absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full animate-pulse'></div>
          <div className='absolute bottom-4 left-4 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-300'></div>
          <div className='absolute top-1/2 left-1/3 w-8 h-8 bg-white/10 rounded-full animate-bounce delay-500'></div>
        </div>
        <div className='relative z-10 flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <div className='w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm animate-float'>
              <span className='text-3xl'>💬</span>
            </div>
            <div>
              <h1 className='text-3xl font-bold mb-2 animate-slide-down'>커뮤니티</h1>
              <p className='text-indigo-100 text-lg animate-slide-up'>소통과 성장의 공간</p>
            </div>
          </div>
          {userRole === 'admin' && (
            <div className='animate-slide-left'>
              <button className='flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-all transform hover:scale-105'>
                <PlusIcon className='w-5 h-5' />
                <span>새 글 작성</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 세로 레이아웃으로 변경된 컨텐츠 */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* 공지사항 */}
        <div className='bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden'>
          <div className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6'>
            <div className='flex items-center space-x-3'>
              <MegaphoneIcon className='w-6 h-6' />
              <h2 className='text-xl font-bold'>공지사항</h2>
              <span className='px-3 py-1 bg-white/20 rounded-full text-sm font-medium'>{announcements.length}</span>
            </div>
            <p className='text-blue-100 mt-2'>중요한 공지사항을 확인하세요</p>
          </div>
          <div className='p-6 max-h-[600px] overflow-y-auto space-y-4'>
            {announcements.map((announcement, index) => (
              <div
                key={announcement.id}
                className='border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow animate-slide-up'
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* 공지사항 카드는 별도 페이지에서 관리 */}
                <div className="p-4 text-center text-slate-500">
                  <p>공지사항은 별도 페이지에서 확인하세요</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 하대표 칼럼 */}
        <div className='bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden'>
          <div className='bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6'>
            <div className='flex items-center space-x-3'>
              <ChatBubbleLeftRightIcon className='w-6 h-6' />
              <h2 className='text-xl font-bold'>하대표 칼럼</h2>
              <span className='px-3 py-1 bg-white/20 rounded-full text-sm font-medium'>{columns.length}</span>
            </div>
            <p className='text-purple-100 mt-2'>성공 노하우와 인사이트</p>
          </div>
          <div className='p-6 max-h-[600px] overflow-y-auto space-y-4'>
            {columns.map((column, index) => (
              <div
                key={column.id}
                className='border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow animate-slide-up'
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ColumnCard column={column} currentUser={currentUser} />
              </div>
            ))}
          </div>
        </div>

        {/* 학습자료 */}
        <div className='bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden'>
          <div className='bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6'>
            <div className='flex items-center space-x-3'>
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                />
              </svg>
              <h2 className='text-xl font-bold'>학습자료</h2>
              <span className='px-3 py-1 bg-white/20 rounded-full text-sm font-medium'>{learningMaterials.length}</span>
            </div>
            <p className='text-green-100 mt-2'>유용한 학습자료와 템플릿</p>
          </div>
          <div className='p-6 max-h-[600px] overflow-y-auto space-y-4'>
            {learningMaterials.map((material, index) => (
              <div
                key={material.id}
                className='border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow animate-slide-up'
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className='space-y-3'>
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='flex items-center space-x-2 mb-2'>
                        <h3 className='font-semibold text-slate-900 text-lg'>{material.title}</h3>
                        {material.isPinned && (
                          <Badge variant='danger' size='sm'>
                            📌 고정
                          </Badge>
                        )}
                      </div>
                      <p className='text-slate-600 text-sm mb-3 whitespace-pre-line line-clamp-4'>{material.content}</p>
                      <div className='flex items-center space-x-4 text-xs text-slate-500'>
                        <span>👤 {material.author}</span>
                        <span>📅 {material.createdAt}</span>
                        <span>📁 {material.fileSize}</span>
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center justify-between pt-3 border-t border-slate-100'>
                    <div className='flex items-center space-x-2'>
                      <Badge variant='info' size='sm'>
                        📎 첨부파일
                      </Badge>
                    </div>
                    <Button variant='primary' size='sm' className='bg-green-600 hover:bg-green-700'>
                      <ArrowDownTrayIcon className='w-4 h-4 mr-2' />
                      다운로드
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
