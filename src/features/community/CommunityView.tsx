'use client';

import { useState } from 'react';
import { MegaphoneIcon, ChatBubbleLeftRightIcon, PlusIcon } from '@heroicons/react/24/outline';
import AnnouncementCard from './AnnouncementCard';
import ColumnCard from './ColumnCard';

interface CommunityViewProps {
  userRole: 'student' | 'admin';
  currentUser?: string;
}

export default function CommunityView({ userRole, currentUser = '김학생' }: CommunityViewProps) {
  const [activeTab, setActiveTab] = useState<'announcements' | 'columns' | 'materials'>('announcements');

  // 더미 데이터
  const announcements = [
    {
      id: '1',
      title: '1기 수료식 일정 안내',
      content: '안녕하세요! 1기 수강생 여러분의 수료식 일정을 안내드립니다.\n\n📅 일시: 2024년 9월 15일 (일) 오후 2시\n📍 장소: 서울 강남구 테헤란로 역삼동 GS타워\n\n수료증 수여식과 함께 네트워킹 시간도 준비되어 있으니 많은 참석 부탁드립니다.',
      author: '관리자',
      createdAt: '2024-08-20 10:00',
      isPinned: true,
      cohort: 1
    },
    {
      id: '2', 
      title: '2기 새로운 미션 업데이트',
      content: '2기 수강생들을 위한 새로운 미션이 업데이트되었습니다.\n\n이번 미션은 "바이럴 쇼츠 제작"을 주제로 진행됩니다. 자세한 내용은 미션 페이지에서 확인해주세요.',
      author: '관리자',
      createdAt: '2024-08-19 16:30',
      isPinned: false,
      cohort: 2
    },
    {
      id: '3',
      title: '전체 공지: 시스템 점검 안내',
      content: '시스템 안정성 향상을 위한 점검이 예정되어 있습니다.\n\n📅 점검일시: 2024년 8월 25일 (일) 새벽 2시 ~ 6시\n⚠️ 점검 시간 동안 서비스 이용이 일시적으로 제한될 수 있습니다.\n\n불편을 끼쳐드려 죄송합니다.',
      author: '관리자',
      createdAt: '2024-08-18 14:00',
      isPinned: false
    }
  ];

  const columns = [
    {
      id: '1',
      title: '유튜브 쇼츠에서 성공하는 5가지 핵심 전략',
      content: `안녕하세요, 하대표입니다.

오늘은 유튜브 쇼츠에서 성공하기 위한 5가지 핵심 전략에 대해 말씀드리고자 합니다.

1. 첫 3초가 생명이다
쇼츠의 경우 첫 3초 내에 시청자의 관심을 끌지 못하면 바로 스와이프해버립니다. 강력한 훅(Hook)을 만들어야 합니다.

2. 트렌드를 빠르게 캐치하라
유튜브 쇼츠는 트렌드에 매우 민감합니다. 새로운 음악, 챌린지, 밈을 빠르게 활용하는 것이 중요합니다.

3. 세로형 콘텐츠에 최적화
9:16 비율로 제작하고, 텍스트나 중요한 요소들이 잘리지 않도록 안전 영역을 고려해야 합니다.

4. 강력한 CTA(Call to Action)
구독, 좋아요, 댓글을 유도하는 자연스러운 멘트를 포함시켜야 합니다.

5. 일관성 있는 업로드
꾸준한 업로드 스케줄을 유지하는 것이 알고리즘에 도움이 됩니다.

여러분도 이 전략들을 활용해서 멋진 쇼츠를 만들어보세요!`,
      author: '하대표',
      createdAt: '2024-08-20 12:00',
      likes: 24,
      commentCount: 8,
      isLiked: false
    },
    {
      id: '2',
      title: '실패를 성공으로 바꾸는 마인드셋',
      content: `창업을 하면서 수많은 실패를 경험했습니다.

처음에는 실패할 때마다 좌절하고 포기하고 싶었지만, 지금 돌이켜보면 그 실패들이 모두 성장의 밑거름이 되었습니다.

실패는 실패가 아니라 '아직 성공하지 않은 것'일 뿐입니다.

중요한 것은:
- 실패에서 교훈을 찾는 것
- 같은 실수를 반복하지 않는 것  
- 포기하지 않고 계속 도전하는 것

여러분도 미션을 수행하면서 어려움을 겪을 때가 있을 텐데, 그럴 때마다 이 글을 떠올려보세요.

실패는 성공으로 가는 과정일 뿐입니다. 💪`,
      author: '하대표',
      createdAt: '2024-08-19 09:30',
      likes: 31,
      commentCount: 12,
      isLiked: true
    }
  ];

  // 학습자료 데이터 추가
  const learningMaterials = [
    {
      id: '1',
      title: '유튜브 쇼츠 제작 완벽 가이드 📚',
      content: '유튜브 쇼츠 제작에 필요한 모든 것을 담은 완벽한 가이드입니다.\n\n포함 내용:\n• 기획부터 편집까지 전 과정\n• 필수 툴 및 앱 사용법\n• 트렌드 분석 방법\n• 썸네일 제작 팁\n\n첨부파일에서 PDF로 다운로드하실 수 있습니다.',
      author: '관리자',
      createdAt: '2024-08-20 09:00',
      fileUrl: '/materials/youtube-shorts-guide.pdf',
      fileSize: '15.2MB',
      isPinned: true
    },
    {
      id: '2',
      title: '쇼츠 편집 프로그램 추천 목록 🎬',
      content: '무료/유료 쇼츠 편집 프로그램들을 비교 분석했습니다.\n\n• CapCut (무료)\n• Adobe Premiere Pro (유료)\n• Final Cut Pro (유료)\n• InShot (무료+유료)\n\n각 프로그램의 장단점과 사용법 영상도 포함되어 있습니다.',
      author: '관리자',
      createdAt: '2024-08-18 14:00',
      fileUrl: '/materials/editing-software-comparison.pdf',
      fileSize: '8.7MB',
      isPinned: false
    },
    {
      id: '3',
      title: '바이럴 트렌드 분석 템플릿 📊',
      content: '매주 업데이트되는 트렌드 분석을 위한 템플릿입니다.\n\n사용 방법:\n1. 템플릿 다운로드\n2. 트렌딩 콘텐츠 분석\n3. 본인만의 콘텐츠 아이디어 도출\n\nExcel과 Google Sheets 버전 모두 제공합니다.',
      author: '관리자',
      createdAt: '2024-08-15 11:30',
      fileUrl: '/materials/trend-analysis-template.xlsx',
      fileSize: '2.1MB',
      isPinned: false
    }
  ];

  const tabs = [
    {
      key: 'announcements' as const,
      label: '공지사항',
      icon: <MegaphoneIcon className="w-5 h-5" />,
      count: announcements.length
    },
    {
      key: 'columns' as const,
      label: '하대표 칼럼',
      icon: <ChatBubbleLeftRightIcon className="w-5 h-5" />,
      count: columns.length
    },
    {
      key: 'materials' as const,
      label: '학습자료',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>,
      count: learningMaterials.length
    }
  ];

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 rounded-3xl p-8 text-white shadow-2xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-300"></div>
          <div className="absolute top-1/2 left-1/3 w-8 h-8 bg-white/10 rounded-full animate-bounce delay-500"></div>
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm animate-float">
              <span className="text-3xl">💬</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2 animate-slide-down">커뮤니티</h1>
              <p className="text-indigo-100 text-lg animate-slide-up">소통과 성장의 공간</p>
            </div>
          </div>
          {userRole === 'admin' && (
            <div className="animate-slide-left">
              <button className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-all transform hover:scale-105">
                <PlusIcon className="w-5 h-5" />
                <span>새 글 작성</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 세로 레이아웃으로 변경된 컨텐츠 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 공지사항 */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <div className="flex items-center space-x-3">
              <MegaphoneIcon className="w-6 h-6" />
              <h2 className="text-xl font-bold">공지사항</h2>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                {announcements.length}
              </span>
            </div>
            <p className="text-blue-100 mt-2">중요한 공지사항을 확인하세요</p>
          </div>
          <div className="p-6 max-h-[600px] overflow-y-auto space-y-4">
            {announcements.map((announcement, index) => (
              <div
                key={announcement.id}
                className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <AnnouncementCard announcement={announcement} />
              </div>
            ))}
          </div>
        </div>

        {/* 하대표 칼럼 */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
            <div className="flex items-center space-x-3">
              <ChatBubbleLeftRightIcon className="w-6 h-6" />
              <h2 className="text-xl font-bold">하대표 칼럼</h2>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                {columns.length}
              </span>
            </div>
            <p className="text-purple-100 mt-2">성공 노하우와 인사이트</p>
          </div>
          <div className="p-6 max-h-[600px] overflow-y-auto space-y-4">
            {columns.map((column, index) => (
              <div
                key={column.id}
                className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ColumnCard column={column} currentUser={currentUser} />
              </div>
            ))}
          </div>
        </div>

        {/* 학습자료 */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h2 className="text-xl font-bold">학습자료</h2>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                {learningMaterials.length}
              </span>
            </div>
            <p className="text-green-100 mt-2">유용한 학습자료와 템플릿</p>
          </div>
          <div className="p-6 max-h-[600px] overflow-y-auto space-y-4">
            {learningMaterials.map((material, index) => (
              <div
                key={material.id}
                className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-slate-900 text-lg">{material.title}</h3>
                        {material.isPinned && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            📌 고정
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 text-sm mb-3 whitespace-pre-line line-clamp-4">
                        {material.content}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <span>👤 {material.author}</span>
                        <span>📅 {material.createdAt}</span>
                        <span>📁 {material.fileSize}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        📎 첨부파일
                      </span>
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      </svg>
                      <span>다운로드</span>
                    </button>
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