'use client';

import { useState } from 'react';
import { EyeIcon, HeartIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { Button } from '@/features/shared/ui/Button';
import { Badge } from '@/features/shared/ui/Badge';
import { Column } from '@/types/domains/community';

interface ColumnCardProps {
  column: Column;
  onView: () => void;
  onToggleLike: (columnId: string) => Promise<boolean | undefined>;
}

export default function ColumnCard({ column, onView, onToggleLike }: ColumnCardProps) {
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      await onToggleLike(column.id);
    } finally {
      setIsLiking(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatReadingTime = (content: string) => {
    // 대략적인 읽기 시간 계산 (한국어 기준 분당 300자)
    const chars = content.replace(/\s/g, '').length;
    const minutes = Math.ceil(chars / 300);
    return `${minutes}분 읽기`;
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={onView}
    >
      {/* 썸네일 영역 (있을 경우) */}
      {column.thumbnail_url && (
        <div className="mb-4 rounded-xl overflow-hidden">
          <img 
            src={column.thumbnail_url} 
            alt={column.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* 헤더 - 작가 정보와 배지 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 group-hover:text-purple-600 transition-colors">
              {column.author}
            </h3>
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <CalendarIcon className="w-3 h-3" />
              <span>{formatDate(column.published_at || column.created_at)}</span>
              <span>•</span>
              <span>{formatReadingTime(column.content)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          {column.is_featured && (
            <Badge variant="warning" size="sm" className="flex items-center space-x-1">
              <StarSolidIcon className="w-3 h-3" />
              <span>추천</span>
            </Badge>
          )}
          <Badge variant="info" size="sm">
            {column.cohort}기
          </Badge>
        </div>
      </div>

      {/* 제목 */}
      <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
        {column.title}
      </h2>

      {/* 요약 또는 내용 미리보기 */}
      <div className="text-slate-600 mb-4 leading-relaxed">
        {column.summary ? (
          <p className="line-clamp-3">{column.summary}</p>
        ) : (
          <p className="line-clamp-3">
            {column.content.replace(/[#*`\[\]]/g, '').substring(0, 150)}...
          </p>
        )}
      </div>

      {/* 통계 및 액션 */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center space-x-4 text-sm text-slate-500">
          <div className="flex items-center space-x-1">
            <EyeIcon className="w-4 h-4" />
            <span>{column.view_count || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <HeartIcon className="w-4 h-4" />
            <span>{column.like_count || 0}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`p-2 rounded-lg transition-colors ${
              column.isLiked
                ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
            } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {column.isLiked ? (
              <HeartSolidIcon className="w-5 h-5" />
            ) : (
              <HeartIcon className="w-5 h-5" />
            )}
          </button>

          <Button 
            variant="ghost" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          >
            읽기
          </Button>
        </div>
      </div>
    </div>
  );
}