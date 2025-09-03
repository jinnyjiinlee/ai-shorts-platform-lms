/**
 * 리뷰 카드 뷰 컴포넌트
 * - 수강생 후기를 카드 형태로 표시
 * - 동기부여를 위한 시각적 레이아웃
 */

'use client';

import React from 'react';
import { Review } from '@/types/domains/review';
import CohortBadge from '@/features/shared/ui/Badge/CohortBadge';
import { ChatBubbleLeftRightIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface ReviewCardViewProps {
  items: Review[];
  onItemClick: (item: Review) => void;
}

export default function ReviewCardView({ items, onItemClick }: ReviewCardViewProps) {
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
   * 내용 미리보기 (150자 제한)
   */
  const getPreview = (content: string) => {
    const cleanContent = content.replace(/[#*`]/g, '').trim();
    return cleanContent.length > 150 
      ? cleanContent.substring(0, 150) + '...' 
      : cleanContent;
  };

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {items.map((review) => (
        <div
          key={review.id}
          onClick={() => onItemClick(review)}
          className="group relative bg-white rounded-2xl border border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
        >
          {/* 고정 배지 */}
          {review.isPinned && (
            <div className="absolute top-4 right-4 z-10">
              <div className="flex items-center space-x-1 bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-medium">
                <StarIconSolid className="w-3 h-3" />
                <span>우수후기</span>
              </div>
            </div>
          )}

          <div className="p-6">
            {/* 헤더 */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <CohortBadge cohort={review.cohort} size="sm" />
                <span className="text-sm text-slate-500">{formatDate(review.created_at)}</span>
              </div>
            </div>

            {/* 제목 */}
            <h3 className="text-lg font-bold text-slate-900 mb-3 leading-tight group-hover:text-purple-700 transition-colors">
              {review.title}
            </h3>

            {/* 내용 미리보기 */}
            <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-4 whitespace-pre-line">
              {getPreview(review.content)}
            </p>

            {/* 푸터 */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {review.student_nickname?.charAt(0) || '익'}
                  </span>
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {review.student_nickname || '익명'}
                </span>
              </div>

              <div className="flex items-center text-slate-400 group-hover:text-purple-500 transition-colors">
                <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1" />
                <span className="text-xs">자세히 보기</span>
              </div>
            </div>
          </div>

          {/* 호버 효과용 그라데이션 */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 to-pink-50/0 group-hover:from-purple-50/50 group-hover:to-pink-50/30 transition-all duration-300 pointer-events-none" />
        </div>
      ))}
    </div>
  );
}