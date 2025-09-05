/**
 * 범용 카드 뷰 컴포넌트
 * - 다양한 타입의 아이템을 카드 형태로 표시
 * - 커스터마이징 가능한 배지, 메타 정보, 액션
 * - 반응형 그리드 레이아웃
 * - 기존 ReviewCardView를 대체하여 모든 게시판에서 사용 가능
 */

'use client';

import React from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import UserAvatar from '@/features/shared/ui/UserAvatar/UserAvatar';

// 기본 카드 아이템 인터페이스
export interface UniversalCardItem {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author?: string;
  authorId?: string;
  avatarUrl?: string; // 아바타 URL 추가
  isPinned?: boolean;
  [key: string]: any; // 추가 필드들
}

// 배지 렌더러 함수 타입
export type BadgeRenderer = (item: UniversalCardItem) => React.ReactNode[];

// 메타 정보 렌더러 함수 타입  
export type MetaRenderer = (item: UniversalCardItem) => React.ReactNode;

// 작성자 아바타 렌더러 함수 타입
export type AvatarRenderer = (item: UniversalCardItem) => React.ReactNode;

// 카드 설정
export interface CardConfig {
  // 레이아웃
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
  
  // 내용 설정
  contentPreviewLength?: number;
  showMetaDate?: boolean;
  showAuthor?: boolean;
  
  // 스타일링
  accentColor?: string; // hover, focus 색상
  gradientColors?: {
    from: string;
    to: string;
  };
}

export interface UniversalCardViewProps {
  // 데이터
  items: UniversalCardItem[];
  
  // 이벤트
  onItemClick: (item: UniversalCardItem) => void;
  
  // 커스터마이징
  config?: CardConfig;
  renderBadges?: BadgeRenderer;
  renderMeta?: MetaRenderer;
  renderAvatar?: AvatarRenderer;
}

export default function UniversalCardView({
  items,
  onItemClick,
  config = {},
  renderBadges,
  renderMeta,
  renderAvatar,
}: UniversalCardViewProps) {
  
  // 기본 설정
  const defaultConfig: CardConfig = {
    columns: { sm: 1, md: 2, lg: 3 },
    contentPreviewLength: 150,
    showMetaDate: true,
    showAuthor: true,
    accentColor: 'blue',
    gradientColors: { from: 'blue-50', to: 'indigo-50' },
    ...config,
  };

  /**
   * 날짜 포맷팅 함수
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
    });
  };

  /**
   * 내용 미리보기 생성
   */
  const getPreview = (content: string) => {
    const cleanContent = content.replace(/[#*`]/g, '').trim();
    return cleanContent.length > (defaultConfig.contentPreviewLength || 150)
      ? cleanContent.substring(0, defaultConfig.contentPreviewLength || 150) + '...'
      : cleanContent;
  };

  /**
   * 기본 배지 렌더링 (고정글)
   */
  const renderDefaultBadges = (item: UniversalCardItem) => {
    const badges: React.ReactNode[] = [];
    
    if (item.isPinned) {
      badges.push(
        <div key="pinned" className="flex items-center space-x-1 bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-medium">
          <StarIconSolid className="w-3 h-3" />
          <span>우수글</span>
        </div>
      );
    }
    
    return badges;
  };

  /**
   * 기본 메타 정보 렌더링
   */
  const renderDefaultMeta = (item: UniversalCardItem) => {
    if (!defaultConfig.showMetaDate) return null;
    
    return (
      <span className="text-sm text-slate-500">
        {formatDate(item.created_at)}
      </span>
    );
  };

  /**
   * 기본 아바타 렌더링
   */
  const renderDefaultAvatar = (item: UniversalCardItem) => {
    if (!defaultConfig.showAuthor) return null;
    
    const author = item.author || '익명';
    
    return (
      <>
        <UserAvatar 
          user={{
            id: item.authorId || '',
            nickname: author,
            avatarUrl: item.avatarUrl
          }}
          size="md"
        />
        <span className="text-sm font-medium text-slate-700">
          {author}
        </span>
      </>
    );
  };

  // 그리드 클래스 생성
  const getGridClasses = () => {
    const { sm = 1, md = 2, lg = 3 } = defaultConfig.columns || {};
    return `grid gap-6 sm:grid-cols-${sm} md:grid-cols-${md} lg:grid-cols-${lg}`;
  };

  return (
    <div className={getGridClasses()}>
      {items.map((item) => {
        const badges = renderBadges ? renderBadges(item) : renderDefaultBadges(item);
        const metaInfo = renderMeta ? renderMeta(item) : renderDefaultMeta(item);
        const avatar = renderAvatar ? renderAvatar(item) : renderDefaultAvatar(item);
        
        
        return (
          <div
            key={item.id}
            onClick={() => onItemClick(item)}
            className={`group relative bg-white rounded-2xl border border-slate-200 hover:border-${defaultConfig.accentColor}-300 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden`}
          >
            {/* 고정 배지들 */}
            {badges.length > 0 && (
              <div className="absolute top-4 right-4 z-10 flex flex-wrap gap-1">
                {badges}
              </div>
            )}

            <div className="p-6">
              {/* 헤더 */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {metaInfo}
                </div>
              </div>

              {/* 제목 */}
              <h3 className={`text-lg font-bold text-slate-900 mb-3 leading-tight group-hover:text-${defaultConfig.accentColor}-700 transition-colors`}>
                {item.title}
              </h3>

              {/* 내용 미리보기 */}
              <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-4 whitespace-pre-line">
                {getPreview(item.content)}
              </p>

              {/* 푸터 */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center space-x-2">
                  {avatar}
                </div>

                <div className="flex items-center space-x-2">
                  <div className={`flex items-center text-slate-400 group-hover:text-${defaultConfig.accentColor}-500 transition-colors`}>
                    <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1" />
                    <span className="text-xs">자세히 보기</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 호버 효과용 그라데이션 */}
            <div className={`absolute inset-0 bg-gradient-to-br from-${defaultConfig.gradientColors?.from}/0 to-${defaultConfig.gradientColors?.to}/0 group-hover:from-${defaultConfig.gradientColors?.from}/50 group-hover:to-${defaultConfig.gradientColors?.to}/30 transition-all duration-300 pointer-events-none`} />
          </div>
        );
      })}
    </div>
  );
}